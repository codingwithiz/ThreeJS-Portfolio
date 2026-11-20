
/* Logic ported from the project repos. No DOM in this file: scripts/check-live.mjs runs it in Node against the real samples. */
/* eslint-disable no-useless-escape -- the regexes are copied as they are in the repos */
export const L = (() => {
  /* ---------- IZ Finance: mobile/.../capture/PaymentFilter.java ---------- */
  const SMS_APPS = ['com.google.android.apps.messaging', 'com.samsung.android.messaging', 'com.android.mms'];
  const DEFAULT_PACKAGES = ['my.com.tngdigital.ewallet', 'com.maybank2u.life', ...SMS_APPS];
  const NEVER = ['app.izfinance', 'com.whatsapp', 'com.whatsapp.w4b', 'org.telegram.messenger', 'org.thunderdog.challegram',
    'com.facebook.orca', 'com.facebook.katana', 'com.instagram.android', 'com.discord', 'com.google.android.gm', 'com.microsoft.office.outlook'];
  const MARKER = /^\s*(rm|myr)\s?0(\.00)?(?![\d.])[\s:.\-]*/i;
  const AMOUNT = /\b(rm|myr)\s?\d/;
  const TX = /\b(paid|pay|payment|spent|debited|deducted|purchase|charged|transferred|transfer|sent|received|successful|success|reload(ed)?|top.?up|usage|using|transaction|trxn|txn|tranx|autobill|autopay|withdrawal|berjaya|dibayar|bayaran|pembayaran|diterima|dipindahkan)\b/;
  const PROMO = /\b(cashback|promo|promotion|voucher|offer|reward|rewards|deal|deals|discount|win|claim|limited|exclusive|eligible|chance|lucky|giveaway|free|percuma|tawaran|diskaun|ganjaran)\b|% ?off/;
  const OTP = /\b(otp|tac|code|kod|verification|pengesahan|pin)\b/;
  const PHONE_SENDER = /^\+?[\d\s\-()]{8,}$/;
  const LONG_NUMBER = /\b\d(?:[ \-]?\d){9,}\b/g;

  const stripMarker = t => t == null ? '' : t.replace(MARKER, '');
  const hasMarker = t => t != null && MARKER.test(t);
  const looksLikePayment = t => {
    if (t == null) return false;
    const s = stripMarker(t).toLowerCase();
    return AMOUNT.test(s) && TX.test(s) && !PROMO.test(s) && !OTP.test(s);
  };
  const smsIsPayment = (sender, body) =>
    hasMarker(body) && !(sender != null && PHONE_SENDER.test(sender.trim())) && looksLikePayment(body);
  const maskNumbers = t => t == null ? '' : t.replace(LONG_NUMBER, m => '••••' + m.replace(/\D/g, '').slice(-4));

  /* The four lamps are how the page shows the predicates above; the verdict is the real functions. */
  function gate(pkg, sender, text) {
    const sms = SMS_APPS.includes(pkg);
    const s = stripMarker(text).toLowerCase();
    const off = text.length - stripMarker(text).length;   // marker length, to map matches back onto the original text
    const span = re => { const m = s.match(re); return m ? [m.index + off, m.index + off + m[0].length] : null; };
    const amt = s.match(/\b(rm|myr)\s?\d[\d,]*(\.\d{1,2})?/);
    let src = true, why = '';
    if (NEVER.includes(pkg)) { src = false; why = 'Chat and mail apps are never read'; }
    else if (!DEFAULT_PACKAGES.includes(pkg)) { src = false; why = 'Not on the list of payment apps'; }
    else if (sms && sender != null && PHONE_SENDER.test(sender.trim())) { src = false; why = 'A phone number is a person, not a bank'; }
    else if (sms && !hasMarker(text)) { src = false; why = 'No RM0 business marker'; }
    const bad = []; let m; const reBad = new RegExp(PROMO.source + '|' + OTP.source, 'g');
    while ((m = reBad.exec(s))) bad.push([m.index + off, m.index + off + m[0].length]);
    return {
      src, why, sms, marker: off,
      amt: AMOUNT.test(s), amtSpan: amt ? [amt.index + off, amt.index + off + amt[0].length] : null,
      tx: TX.test(s), txSpan: span(TX),
      clean: !PROMO.test(s) && !OTP.test(s), bad,
      pass: src && (sms ? smsIsPayment(sender, text) : looksLikePayment(text)),
    };
  }

  /* ---------- IZ Finance: shared/transactionText.ts ---------- */
  const toNumber = s => { const n = Number(String(s).replace(/,/g, '')); return Number.isFinite(n) ? n : null; };
  function extractTransactionAmount(raw) {
    if (!raw) return null;
    const afterFor = raw.match(/\bfor\s*(?:rm|myr)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/i);
    if (afterFor && afterFor[1]) { const n = toNumber(afterFor[1]); if (n != null && n > 0) return n; }
    const all = [...raw.matchAll(/(?:rm|myr)\s*([0-9][0-9,]*(?:\.[0-9]{1,2})?)/gi)].map(m => toNumber(m[1])).filter(n => n != null && n > 0);
    if (all.length === 0) return null;
    return Math.max(...all);
  }
  const SOURCES = [[/\bbank ?rakyat|\bb\.rakyat/i, 'Bank Rakyat'], [/\bmaybank|\bmbb\b|\bmae\b|maybank2u/i, 'Maybank'], [/\bcimb\b/i, 'CIMB'],
    [/\bhlb\b|hong ?leong/i, 'Hong Leong Bank'], [/\bpbb\b|public ?bank/i, 'Public Bank'], [/\brhb/i, 'RHB'], [/\bambank|\bamb\b/i, 'AmBank'],
    [/\baffin/i, 'Affin Bank'], [/\balliance ?bank/i, 'Alliance Bank'], [/\bhsbc/i, 'HSBC'], [/\buob\b/i, 'UOB'], [/\bocbc/i, 'OCBC'],
    [/stanchart|standard chartered/i, 'Standard Chartered'], [/\bciti(bank)?\b/i, 'Citibank'], [/\bbsn\b/i, 'BSN'], [/bank ?islam|\bbimb\b/i, 'Bank Islam'],
    [/muamalat/i, 'Bank Muamalat'], [/agrobank/i, 'Agrobank'], [/\bgx ?bank/i, 'GXBank'], [/aeon ?bank/i, 'AEON Bank'], [/boost ?bank/i, 'Boost Bank'],
    [/\bmaxis|hotlink/i, 'Maxis'], [/celcom|\bdigi\b|celcomdigi/i, 'CelcomDigi'], [/u ?mobile/i, 'U Mobile'], [/\bunifi\b|\btm\b/i, 'Unifi'], [/\btnb\b|tenaga/i, 'TNB']];
  const sourceFromText = t => { for (const [re, name] of SOURCES) if (re.test(t)) return name; return null; };

  /* ---------- IZ Finance: shared/merchantRules.ts ---------- */
  const NOISE = new Set(['sdn', 'bhd', 'berhad', 'plt', 'enterprise', 'trading', 'store', 'outlet', 'branch', 'my', 'mys', 'malaysia', 'kl', 'kuala', 'lumpur',
    'selangor', 'pj', 'petaling', 'jaya', 'shah', 'alam', 'subang', 'penang', 'johor', 'bahru', 'jb', 'ecom', 'pos']);
  function merchantKey(raw) {
    if (!raw) return null;
    const tokens = raw.toLowerCase().split('*')[0].replace(/\(.*?\)/g, ' ').replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(t => t.length > 1 && !NOISE.has(t)).slice(0, 3);
    const key = tokens.join(' ');
    return key.length >= 3 ? key : null;
  }

  /* Page-only helpers (NOT from the repo). In the real app a language model reads the merchant and picks the category,
     guided by the cue list in shared/merchantCues.ts. Here the same cue list is matched by keyword. */
  // ponytail: two regexes cover the sample formats; the real app leaves merchant extraction to the model.
  function pageMerchant(text) {
    const t = stripMarker(text);
    const m = t.match(/\bat\s+([A-Za-z0-9'&\- ]+?)(?=\s+\d{4,}|\s+on\b|\s*[.;,]|\s*$)/i) || t.match(/\bto\s+([A-Z0-9][A-Za-z0-9'&\- ]+?)\s+(?:was|is)\b/);
    return m ? m[1].trim() : null;
  }
  const CUES = [
    ['Needs', 'Meals', ['mamak', 'restoran', 'kopitiam', 'food court', 'mcdonald', 'kfc', 'texas', 'marrybrown', 'yong kee', 'nasi', 'grabfood', 'foodpanda', 'shopeefood']],
    ['Wants', 'Coffee/Snacks', ['cafe', 'starbucks', 'zus', 'gigi', 'coffee', 'kopi', 'bubble tea', 'tealive', 'chagee', 'coco', 'bakery', 'dessert', 'ice cream']],
    ['Needs', 'Transport', ['petronas', 'shell', 'bhp', 'petron', 'caltex', 'touch n go', "touch 'n go", 'smarttag', 'toll', 'parking', 'mrt', 'ktm']],
    ['Needs', 'Groceries', ['aeon', 'tesco', 'lotus', 'mydin', '99 speedmart', 'speedmart', 'jaya grocer', 'village grocer', 'nsk', 'econsave', 'supermarket']],
    ['Needs', 'Healthcare', ['watsons', 'guardian', 'caring', 'pharmacy', 'klinik', 'clinic', 'hospital', 'dental']],
    ['Wants', 'Shopping', ['shopee', 'lazada', 'uniqlo', 'padini']],
    ['Wants', 'Subscriptions', ['netflix', 'spotify', 'youtube', 'icloud', 'google', 'app store']],
    ['Invest', 'Invest', ['stashaway', 'wahed', 'versa', 'akru', 'asnb', 'moomoo', 'rakuten trade']],
  ];
  function pageCue(merchant) {
    if (!merchant) return null;
    const m = merchant.toLowerCase();
    for (const [bucket, category, words] of CUES) for (const w of words) if (new RegExp('(^|[^a-z])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(m)) return { bucket, category, cue: w };
    return null;
  }

  /* ---------- Crux: web/lib/citations.ts ---------- */
  const normalizeQuote = s => s.toLowerCase().replace(/[‘’“”'"]/g, '').replace(/[–—]/g, '-').replace(/…/g, '').replace(/\s+/g, ' ').trim();
  function verifyCitations(quotes, sourceText, source) {
    const haystack = normalizeQuote(sourceText);
    return quotes.map(q => q.trim()).filter(Boolean).map(quote => ({
      quote, url: source && source.url, sourceTitle: source && source.title,
      verified: haystack.length > 0 && haystack.includes(normalizeQuote(quote)),
    }));
  }
  function citationFaithfulness(citations) {
    if (!citations || !citations.length) return null;
    const hits = citations.filter(c => c.verified).length;
    return +(hits / citations.length).toFixed(2);
  }
  /* Page-only: the same normalisation, one character at a time, remembering where each character came from,
     so the page can underline the matching words in the original text. check.cjs proves it equals normalizeQuote. */
  // ponytail: assumes toLowerCase keeps length (true for the Latin text used here).
  function normMap(s) {
    let text = ''; const map = [];
    for (let i = 0; i < s.length; i++) {
      let c = s[i].toLowerCase();
      if (/[‘’“”'"…]/.test(c)) continue;
      if (/[–—]/.test(c)) c = '-';
      if (/\s/.test(c)) { if (text === '' || text[text.length - 1] === ' ') continue; c = ' '; }
      text += c; map.push(i);
    }
    if (text.endsWith(' ')) { text = text.slice(0, -1); map.pop(); }
    return { text, map };
  }
  function locateQuote(quote, sourceText) {
    const q = normalizeQuote(quote); if (!q) return null;
    const { text, map } = normMap(sourceText);
    const at = text.indexOf(q);
    return at < 0 ? null : [map[at], map[at + q.length - 1] + 1];
  }

  /* ---------- Bina: VariableStore.kt ---------- */
  // ponytail: Kotlin toDoubleOrNull also takes exponents; recipes only use plain numbers.
  const num = s => /^\s*-?\d+(\.\d+)?\s*$/.test(s) ? Number(s) : null;
  class VariableStore {
    constructor(defaults) { this.state = { ...defaults, ai_response: '', is_loading: 'false' }; }
    resolve(token) {
      const t = token.trim();
      if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) return t.slice(1, -1);
      return this.state[t] ?? t;
    }
    isTrue(key) {
      const m = key.trim().match(/^(.+?)\s*(>=|<=|!=|==|>|<)\s*(.+)$/);
      if (m) {
        const left = this.resolve(m[1]), right = this.resolve(m[3]), a = num(left), b = num(right);
        if (a != null && b != null) return { '>=': a >= b, '<=': a <= b, '!=': a !== b, '==': a === b, '>': a > b, '<': a < b }[m[2]];
        return m[2] === '==' ? left === right : m[2] === '!=' ? left !== right : false;
      }
      const v = this.state[key];
      if (v == null) return false;
      return v !== '' && v !== '0' && v !== 'false';
    }
    interpolate(template) { return template.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (all, name) => this.state[name] ?? all); }
    increment(key) { this.state[key] = String((num(this.state[key] ?? '0') ?? 0) + 1); }
  }

  /* ---------- NiagaMap: backend/utils/defineHexagons.js (worked in metres around 0,0) ---------- */
  function generateHexagons(radiusMeters, sideLength) {
    const hexWidth = 2 * sideLength, hexHeight = Math.sqrt(3) * sideLength;
    const horizSpacing = hexWidth * 0.75, vertSpacing = hexHeight;
    const maxCols = Math.ceil(radiusMeters / horizSpacing) + 1, maxRows = Math.ceil(radiusMeters / vertSpacing) + 1;
    const out = [];
    for (let col = -maxCols; col <= maxCols; col++) for (let row = -maxRows; row <= maxRows; row++) {
      const x = col * horizSpacing, yOffset = (col % 2 === 0) ? 0 : vertSpacing / 2, y = row * vertSpacing + yOffset;
      if (Math.hypot(x, y) <= radiusMeters) {
        const pts = [];
        for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * 60 * i; pts.push([x + sideLength * Math.cos(a), y + sideLength * Math.sin(a)]); }
        out.push({ x, y, pts });
      }
    }
    return out;
  }
  /* ---------- NiagaMap: frontend/src/hooks/useWeightManager.js ---------- */
  const CATEGORY_PRESETS = {
    retail: { demand: 30, competition: 20, accessibility: 25, zoning: 15, risk: 10 },
    fnb: { demand: 25, competition: 25, accessibility: 25, zoning: 15, risk: 10 },
    health: { demand: 30, competition: 15, accessibility: 20, zoning: 25, risk: 10 },
    automotive: { demand: 20, competition: 25, accessibility: 30, zoning: 15, risk: 10 },
    sports: { demand: 30, competition: 20, accessibility: 25, zoning: 15, risk: 10 },
  };
  function handleWeightChange(weights, locked, indicator, newValue) {
    const delta = newValue - weights[indicator];
    if (delta === 0) return weights;
    const others = Object.keys(weights).filter(k => k !== indicator);
    const unlocked = others.filter(k => !locked[k]);
    if (unlocked.length === 0) return weights;
    const lockedTotal = others.filter(k => locked[k]).reduce((s, k) => s + weights[k], 0);
    const target = 100 - newValue - lockedTotal;
    if (target < 0) return weights;
    const current = unlocked.reduce((s, k) => s + weights[k], 0);
    const next = { ...weights, [indicator]: newValue };
    if (current === 0) {
      const per = Math.floor(target / unlocked.length);
      unlocked.forEach((k, i) => { next[k] = i === unlocked.length - 1 ? target - per * (unlocked.length - 1) : per; });
    } else {
      const scale = target / current; let adjusted = 0;
      unlocked.forEach((k, i) => {
        if (i === unlocked.length - 1) next[k] = target - adjusted;
        else { next[k] = Math.round(weights[k] * scale); adjusted += next[k]; }
      });
    }
    return next;
  }
  /* ---------- NiagaMap: backend/controllers/workflowController.js (final score) ---------- */
  function scoreHexagons(rows, weights) {   // rows: [{demand, competition, accessibility, zoning, risk}] raw metric values
    const keys = ['demand', 'competition', 'risk', 'zoning', 'accessibility'];
    const max = {}; keys.forEach(k => { max[k] = Math.max(...rows.map(r => r[k])) || 1; });
    const sum = keys.reduce((s, k) => s + weights[k], 0);
    const wf = {}; keys.forEach(k => { wf[k] = sum === 0 ? 1 / keys.length : weights[k] / sum; });
    return rows.map(r => +(keys.reduce((s, k) => s + (r[k] / max[k]) * wf[k], 0) * 100).toFixed(2));
  }

  /* ---------- AkarSwarm: backend/src/services/velocity.service.ts + the agent's hard rules ---------- */
  function velocityScore({ txCount, daysWithTx, vaultContributions, loanRepayments, flagged }) {
    const transactionBase = Math.min(txCount * 5, 200);
    const consistencyBonus = Math.min(Math.round(daysWithTx / 30 * 300), 300);
    const savingsBonus = Math.min(vaultContributions * 20, 200);
    const repaymentBonus = Math.min(loanRepayments * 50, 200);
    const amlPenalty = flagged * 100;
    const raw = transactionBase + consistencyBonus + savingsBonus + repaymentBonus - amlPenalty;
    return { score: Math.max(0, Math.min(raw, 1000)), transactionBase, consistencyBonus, savingsBonus, repaymentBonus, amlPenalty };
  }
  const scoreTier = s => s >= 700 ? 3 : s >= 500 ? 2 : s >= 300 ? 1 : 0;
  const WALLET_CAP = 200, CONFIRM_ABOVE = 50, SMURF_COUNT = 5, SMURF_WINDOW_MIN = 10;
  const isSmurfing = (timesMin, nowMin) => timesMin.filter(t => nowMin - t <= SMURF_WINDOW_MIN && t <= nowMin).length >= SMURF_COUNT;
  /* Page-only: a sample split. In the real app the agent decides the split; the cap and the excess-to-vault rule are real. */
  function pagePlan(amount, holdNow, loanActive) {
    const loan = loanActive ? Math.round(amount * 0.2) : 0;
    const rest = amount - loan, room = Math.max(0, WALLET_CAP - holdNow);
    const hold = Math.min(rest, room);
    return { hold, vault: rest - hold, loan };
  }

  return {
    SMS_APPS, DEFAULT_PACKAGES, NEVER, stripMarker, hasMarker, looksLikePayment, smsIsPayment, maskNumbers, gate, LONG_NUMBER,
    extractTransactionAmount, sourceFromText, merchantKey, pageMerchant, pageCue,
    normalizeQuote, verifyCitations, citationFaithfulness, normMap, locateQuote,
    VariableStore, generateHexagons, CATEGORY_PRESETS, handleWeightChange, scoreHexagons,
    velocityScore, scoreTier, WALLET_CAP, CONFIRM_ABOVE, SMURF_COUNT, SMURF_WINDOW_MIN, isSmurfing, pagePlan,
  };
})();
