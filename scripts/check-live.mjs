// The one runnable check for src/live: the ported logic against the real samples from the project repos.
// Runs in postbuild, and vite.config.js imports it so the receipt on the home page shows the real count.
import assert from 'node:assert';
import { L } from '../src/live/logic.js';
import { D } from '../src/live/data.js';
import { PROJECTS, cardFor } from '../src/live/projects.js';

let n = 0; const ok = (c, msg) => { assert.ok(c, msg); n++; }, eq = (a, b, msg) => { assert.deepStrictEqual(a, b, msg); n++; };
const SMS = 'com.google.android.apps.messaging';

// IZ Finance: RealSamplesTest.java / PaymentFilterTest.java
const accept = [
  'RM0.00 CIMB MYR80.85 was charged to your card num ***1234 at paypal YYY on 08/01,',
  'RM0.00 HLB - Your prin account ending 1234 has been debited with RM 120.50 at MERCHANT NAME.',
  'Rm0.00 MBB CARD 1234:TQ FOR YOUR USAGE AT DIGI -RPS SHAH ALAM ; FOR MYR33.00',
  'RM0.00 Alliance Bank: There was a credit card transaction at JAYA GROCER KL for RM120.00.',
  'RM0 BANKRAKYAT:A TXN WAS MADE USING YOUR DEBIT CARD 2266 ON 24/06/2026 FOR RM 18.00 AT  McDonalds 1010004     Petaling Jaya MYS . CALL B.RAKYAT CARD CENTRE FOR INQ .',
];
accept.forEach(t => ok(L.smsIsPayment('62003', t), 'sms accepted: ' + t));
ok(L.looksLikePayment("MAE — you've been charged RM10 at KFC SUNWAY PYRAMID"), 'MAE');
ok(L.looksLikePayment("Touch 'n Go eWallet — Payment of RM0.01 to SOMEONE was successful"), 'TNG');
ok(!L.gate('com.whatsapp', 'Ali', 'I transferred RM50 to you just now').pass, 'whatsapp');
ok(!L.smsIsPayment('+60123456789', 'Paid RM20 for the movie tickets'), 'phone sender');
ok(!L.smsIsPayment('66300', 'RM0 Maybank: Your TAC for transfer of RM500.00 to ALI is 123456'), 'TAC');
ok(!L.smsIsPayment('66300', 'RM0.00 RHBCards : Tranx amounting 650 dated 25/01/2012 for RHB Card'), 'no amount');
ok(!L.hasMarker('RM0.50 paid to KEDAI'), 'RM0.50 is not the marker');
eq(L.maskNumbers('card 4111 1111 1111 1111 charged RM12.00'), 'card ••••1111 charged RM12.00');
eq(accept.map(L.extractTransactionAmount), [80.85, 120.5, 33, 120, 18]);
eq(accept.map(L.sourceFromText), ['CIMB', 'Hong Leong Bank', 'Maybank', 'Alliance Bank', 'Bank Rakyat']);
eq(L.merchantKey('JAYA GROCER KL'), 'grocer'); eq(L.merchantKey('McDonalds 1010004'), 'mcdonalds'); eq(L.merchantKey('KL'), null);

// the page's own queue behaves as the board will show it
const want = [['Needs', 18, 'McDonalds'], null, ['Needs', 10, 'KFC SUNWAY PYRAMID'], null, ['Wants', 6.5, 'ZUS COFFEE'], null, ['Needs', 12, '99 SPEEDMART'], null, ['Invest', 80, 'STASHAWAY MALAYSIA'], ['?', 80.85, 'paypal YYY']];
D.iz.queue.forEach((m, i) => {
  const g = L.gate(m.pkg, m.sender, m.text);
  eq(g.pass, want[i] != null, 'queue verdict ' + i);
  eq(g.pass, g.src && g.amt && g.tx && g.clean, 'lamps agree with the real verdict ' + i);
  if (!want[i]) return;
  const merchant = L.pageMerchant(m.text), cue = L.pageCue(merchant);
  eq([cue ? cue.bucket : '?', L.extractTransactionAmount(L.stripMarker(m.text)), merchant], want[i], 'queue parse ' + i);
});
ok(!L.gate(SMS, '66300', D.iz.queue[3].text).clean && L.gate(SMS, '62226', D.iz.queue[7].text).bad.length >= 2, 'bad words are located');

// Crux: citations.ts
eq(L.normalizeQuote('  “Hello —  World…” '), 'hello - world');
const cites = L.verifyCitations(D.crux.quotes, D.crux.source);
eq(cites.map(c => c.verified), [true, true, false]); eq(L.citationFaithfulness(cites), 0.67); eq(L.citationFaithfulness([]), null);
eq(L.normMap(D.crux.source).text, L.normalizeQuote(D.crux.source), 'normMap equals normalizeQuote');
eq(L.normMap('  “A — b…”  c ').text, L.normalizeQuote('  “A — b…”  c '));
const at = L.locateQuote(D.crux.quotes[1], D.crux.source);
eq(D.crux.source.slice(at[0], at[1]), 'Each step does one small job'); eq(L.locateQuote(D.crux.quotes[2], D.crux.source), null);

// Bina: VariableStore.kt
const st = new L.VariableStore(D.bina.defaults);
for (let i = 0; i < 5; i++) st.increment('visit_step');
ok(!st.isTrue(D.bina.visibleIf)); st.increment('visit_step'); ok(st.isTrue(D.bina.visibleIf));
ok(!st.isTrue('photo_path')); ok(st.isTrue('gest_age')); ok(!st.isTrue('is_loading')); ok(st.isTrue('gest_age == "20"')); ok(!st.isTrue('missing'));
eq(st.interpolate('Gestational age: {{gest_age}} weeks {{nope}}'), 'Gestational age: 20 weeks {{nope}}');
st.state['l10n.visit_next'] = D.bina.labels.ms.visit_next; eq(st.interpolate('{{l10n.visit_next}}'), 'Langkah Seterusnya');

// NiagaMap
const hexes = L.generateHexagons(1000, 120);
ok(hexes.length > 60 && hexes.length < 110 && hexes.every(h => Math.hypot(h.x, h.y) <= 1000 && h.pts.length === 6), 'hex count ' + hexes.length);
Object.values(L.CATEGORY_PRESETS).forEach(p => eq(Object.values(p).reduce((a, b) => a + b), 100));
const sum = w => Object.values(w).reduce((a, b) => a + b);
let w = L.handleWeightChange(L.CATEGORY_PRESETS.fnb, {}, 'demand', 60); eq(sum(w), 100); eq(w.demand, 60);
w = L.handleWeightChange(w, { risk: true }, 'competition', 5); eq(sum(w), 100); eq(w.risk, L.handleWeightChange(L.CATEGORY_PRESETS.fnb, {}, 'demand', 60).risk);
eq(L.handleWeightChange(w, { demand: true, competition: true, zoning: true, risk: true }, 'accessibility', 99), w, 'no room: unchanged');
eq(L.scoreHexagons([{ demand: 2, competition: 1, accessibility: 4, zoning: 1, risk: 1 }, { demand: 1, competition: 1, accessibility: 2, zoning: 1, risk: 1 }], L.CATEGORY_PRESETS.fnb), [100, 75]);

// AkarSwarm: velocity.service.ts + rules
eq(L.velocityScore({ txCount: 999, daysWithTx: 30, vaultContributions: 99, loanRepayments: 99, flagged: 0 }).score, 900);
eq(L.velocityScore(D.akar.month).score, 610); eq(L.scoreTier(610), 2); eq(L.scoreTier(299), 0); eq(L.scoreTier(700), 3);
eq(L.velocityScore({ ...D.akar.month, flagged: 1 }).score, 510);
ok(!L.isSmurfing([0, 1, 2, 3], 4)); ok(L.isSmurfing([0, 1, 2, 3, 4], 4)); ok(!L.isSmurfing([0, 1, 2, 3, 20], 20));
eq(L.pagePlan(350, 40, true), { hold: 160, vault: 120, loan: 70 }); eq(L.pagePlan(40, 0, true), { hold: 32, vault: 0, loan: 8 });


// the dealer: which card an answer points at
eq(cardFor('It scored 2nd of 264. Case study: /work/urbanfloodbench'), 'flood'); eq(cardFor('Bina runs offline; IZ Finance does not.'), 'bina');
eq(cardFor('He works at Maxis.'), 'maxis'); eq(cardFor('You can email him.'), null);
eq(PROJECTS.length, 7);

export { n };
console.log(n + ' live checks pass');
