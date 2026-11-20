import { RO, $, $$, clamp, rm, sleep, clicked, h, sv, anim, popIn, fadeUp, shake, stamp, tapOn, along, draw, countTo, typeInto, tween } from './util.js';
import { L } from './logic.js';
import { D } from './data.js';
import { defMachine } from './core.js';

/* AkarSwarm · money arrives. The score, the RM200 cap, the RM50 confirm rule and the 5-in-10-minutes freeze are the repo's rules (L.*).
   The balances, the split (L.pagePlan) and the tool replies are a sample. */
{
  const A = D.akar, ZERO = { txCount: 0, daysWithTx: 0, vaultContributions: 0, loanRepayments: 0, flagged: 0 };
  const SL = [['txCount', 'Transactions', 60], ['daysWithTx', 'Days with a transaction', 30], ['vaultContributions', 'Vault top-ups', 15], ['loanRepayments', 'Loan repayments', 6], ['flagged', 'AML flags', 3]];
  const PARTS = [['transactionBase', 'transactions'], ['consistencyBonus', 'consistency'], ['savingsBonus', 'savings'], ['repaymentBonus', 'repayments']];
  let ui, API, S, lw = 0;

  function score(count) {
    const v = L.velocityScore(S.m), t = L.scoreTier(v.score);
    ui.dial.style.setProperty('--v', v.score / 1000);
    count ? countTo(ui.n, v.score, { duration: 500 }) : (ui.n.textContent = v.score, ui.n.dataset.v = v.score);
    ui.sum.replaceChildren(...PARTS.flatMap(([k, name], i) => [i ? ' + ' : '', h('span', {}, name + ' ', h('b', { text: v[k] }))]), ' − ', h('span', { class: v.amlPenalty ? 'bad' : '' }, 'AML ', h('b', { text: v.amlPenalty })), ' = ', h('b', { text: v.score }));
    ui.tiers.forEach((el, i) => el.classList.toggle('on', t >= i + 1));
    ui.tier.textContent = t ? `${A.tiers[t - 1][1]} · ${A.tiers[t - 1][2]}` : 'No tier yet';
    ui.rows.forEach(r => { const k = r.dataset.k; $('input', r).value = S.m[k]; $('output', r).textContent = S.m[k]; });
    return { v, t };
  }
  function pots(count) {
    // ponytail: only the wallet has a real cap (RM200). Vault and loan fill on a soft scale so the level still rises.
    [['hold', S.hold / L.WALLET_CAP], ['vault', S.vault / (S.vault + 300)], ['loan', S.loan / (S.loan + 300)]].forEach(([k, f]) => {
      const p = ui.pot[k], out = $('.v', p); p.style.setProperty('--f', Math.min(f, 1).toFixed(3)); p.classList.toggle('full', k === 'hold' && S.hold >= L.WALLET_CAP);
      count ? countTo(out, S[k], { fmt: x => rm(Math.round(x)) }) : (out.textContent = rm(S[k]), out.dataset.v = S[k]);
    });
  }
  function roots() {
    const w = ui.svg.clientWidth; if (!w || w === lw) return; lw = w;
    const H = 92;
    ui.svg.setAttribute('viewBox', `0 0 ${w} ${H}`);
    ui.paths = [w / 6, w / 2, w * 5 / 6].map((x, i) => sv('path', { class: 'ak-root r' + i, d: `M${w / 2} 0C${w / 2} ${H * .6} ${x} ${H * .35} ${x} ${H}` }));
    ui.svg.replaceChildren(...ui.paths);
  }
  async function pour(amount, plan) {
    const n = clamp(Math.round(amount / 20), 1, 14), runs = [];
    [plan.hold, plan.vault, plan.loan].forEach((v, k) => {
      if (v <= 0) return;
      draw(ui.paths[k], { duration: 500 });
      for (let j = 0, m = Math.max(1, Math.round(n * v / amount)); j < m; j++) {
        const c = sv('circle', { class: 'ak-coin r' + k, r: 6 }); c.style.opacity = 0; ui.svg.append(c);
        runs.push(along(ui.paths[k], c, { duration: 760, delay: j * 120 }).then(() => c.remove()));
      }
    });
    await sleep(760);
    S.hold += plan.hold; S.vault += plan.vault; S.loan += plan.loan; pots(true);
    ['hold', 'vault', 'loan'].forEach((k, i) => { if ([plan.hold, plan.vault, plan.loan][i] > 0) anim(ui.pot[k], [{ transform: 'translateY(5px)' }, { transform: 'none' }], { duration: 320 }); });
    await Promise.all(runs);
  }
  const list = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1] : a[0];

  async function income(amount, auto) {
    if (S.frozen) { shake(ui.freeze); API.say('The wallet is frozen. Clear the flag first.'); return; }
    roots();
    const plan = L.pagePlan(amount, S.hold, true);
    ui.tools.forEach(li => { li.className = ''; $('em', li).textContent = ''; }); ui.msg.hidden = true; ui.ask.hidden = true;
    ui.seed.textContent = rm(amount); ui.seed.classList.remove('pre'); popIn(ui.seed);
    API.say(`${rm(amount)} lands in the wallet. One agent decides what happens to it.`); await sleep(650);
    const reply = [`wallet ${rm(S.hold)} · vault ${rm(S.vault)}`, 'clear', 'vault allowed', 'loan open', `wallet +${plan.hold} · vault +${plan.vault} · loan +${plan.loan}`, 'sent'];
    for (let i = 0; i < 6; i++) {
      const li = ui.tools[i], em = $('em', li); li.className = 'chk'; await sleep(320);
      if (i === 4) {
        if (amount > L.CONFIRM_ABOVE) {
          ui.ok.textContent = 'Confirm ' + rm(amount); ui.ask.hidden = false; fadeUp(ui.ask);
          API.say(`Above ${rm(L.CONFIRM_ABOVE)} the agent may not move money until a person confirms.`);
          if (auto) { await sleep(900); await tapOn(ui.ok); } else await clicked(ui.ok);
          ui.ask.hidden = true;
        }
        API.say(plan.hold < amount - plan.loan ? `The wallet may hold ${rm(L.WALLET_CAP)} at most. The rest goes down to the vault.` : 'It all fits in the wallet.');
        await pour(amount, plan);
      }
      em.textContent = reply[i]; li.className = 'ok'; popIn(em, { duration: 220 }); API.work(1, 'tool calls'); await sleep(200);
    }
    const bits = [plan.hold && `${rm(plan.hold)} stays in your wallet`, plan.vault && `${rm(plan.vault)} goes to your vault`, plan.loan && `${rm(plan.loan)} repays your loan`].filter(Boolean);
    ui.msg.hidden = false; fadeUp(ui.msg);
    await typeInto(ui.msgT, `${rm(amount)} received. ${list(bits)[0].toUpperCase() + list(bits).slice(1)}.`, 90);
    API.say('Six tool calls, one short message to the user.');
  }

  async function smurf() {
    if (S.frozen) return;
    ui.win.hidden = false; ui.dots.replaceChildren(); const times = [];
    API.say('Five small transfers, two minutes apart.');
    for (let i = 0; i < L.SMURF_COUNT; i++) {
      const t = i * 2; times.push(t);
      const d = h('i', { style: `left:${t / L.SMURF_WINDOW_MIN * 100}%` }); ui.dots.append(d); popIn(d);
      ui.winT.textContent = `${times.length} in ${t} min`;
      await sleep(430);
      if (L.isSmurfing(times, t)) {
        S.frozen = true; S.m.flagged = Math.min(S.m.flagged + 1, 3);
        ui.freeze.hidden = false; stamp($('b', ui.freeze)); shake(ui.grow); score(true);
        ui.inB.forEach(b => { b.disabled = true; });
        API.say(`Smurfing detected: ${L.SMURF_COUNT} transfers in ${L.SMURF_WINDOW_MIN} minutes. The wallet freezes and the score loses 100.`);
      }
    }
  }
  function fresh() {
    S = { hold: 40, vault: 120, loan: 0, frozen: false, m: { ...A.month } };
    ui.tools.forEach(li => { li.className = ''; $('em', li).textContent = ''; });
    ui.msg.hidden = ui.ask.hidden = ui.win.hidden = ui.freeze.hidden = true; ui.seed.classList.add('pre');
    ui.inB.forEach(b => { b.disabled = false; });
    pots(); score();
  }

  defMachine('akar', {
    build(api) {
      API = api;
      const tick = s => { const a = Math.PI * s / 1000, c = Math.cos(a), n = Math.sin(a); return `<line class="tk" x1="${(50 - 37 * c).toFixed(1)}" y1="${(52 - 37 * n).toFixed(1)}" x2="${(50 - 50 * c).toFixed(1)}" y2="${(52 - 50 * n).toFixed(1)}"/>`; };
      api.board.innerHTML = `<div class="ak">
        <div class="ak-in"><p class="lab">Money arrives <span>pick an amount</span></p>
          <div class="ak-btns">${[40, 350, 900].map(a => `<button class="btn sm ak-amt" type="button" data-a="${a}">${rm(a)}</button>`).join('')}<button class="btn sm quiet ak-smurf" type="button">Send 5 quick transfers</button></div></div>
        <div class="ak-agent"><p class="lab">Akar, the agent <span>six tools, in this order</span></p>
          <ol class="ak-tools">${A.tools.map(([n, d]) => `<li><i></i><code>${n}</code><span>${d}</span><em></em></li>`).join('')}</ol>
          <div class="ak-ask" hidden><p>Waiting for you.</p><button class="btn sm ak-ok" type="button">Confirm</button></div></div>
        <div class="ak-grow"><p class="lab">Where it goes <span>sample balances</span></p>
          <div class="ak-tree"><b class="ak-seed pre"></b><svg class="ak-roots" aria-hidden="true"></svg>
            <div class="ak-pots">${[['hold', 'Wallet'], ['vault', 'Vault'], ['loan', 'Loan repaid']].map(([k, n]) => `<div class="ak-pot p-${k}"><div class="jar"><i></i>${k === 'hold' ? `<u>cap ${rm(L.WALLET_CAP)}</u>` : ''}</div><b>${n}</b><span class="v"></span></div>`).join('')}</div></div>
          <div class="ak-msg" hidden><p class="lab">Notification <span>sample wording</span></p><p class="ak-msgt"></p></div>
          <div class="ak-win" hidden><p class="lab">The last ${L.SMURF_WINDOW_MIN} minutes <span class="ak-wint"></span></p><div class="ak-dots"></div></div>
          <div class="ak-freeze" hidden><b>Frozen</b><p>${L.SMURF_COUNT} transfers inside ${L.SMURF_WINDOW_MIN} minutes.</p><button class="btn sm ak-clear" type="button">Clear the flag</button></div></div>
        <div class="ak-score"><p class="lab">Velocity score <span>the repo’s formula, live</span></p>
          <div class="ak-dial"><svg viewBox="0 0 100 60" aria-hidden="true"><path class="tr" d="M6 52A44 44 0 0 1 94 52"/><path class="va" pathLength="1" d="M6 52A44 44 0 0 1 94 52"/>${A.tiers.map(t => tick(t[0])).join('')}<line class="nd" x1="50" y1="52" x2="50" y2="16"/><circle cx="50" cy="52" r="4"/></svg>
            <div><b class="ak-n">0</b><span>of 1,000</span><span class="ak-tier"></span></div></div>
          <div class="ak-tiers">${A.tiers.map(([s, t, n, r]) => `<span><b>${s}</b>${t} · ${n}<small>${r}</small></span>`).join('')}</div>
          <div class="ak-sl">${SL.map(([k, n, mx]) => `<div class="ak-row" data-k="${k}"><label for="aks-${k}">${n}</label><output for="aks-${k}"></output><input id="aks-${k}" type="range" min="0" max="${mx}" step="1"></div>`).join('')}</div>
          <p class="ak-sum" role="status"></p></div>
      </div>`;
      const b = api.board;
      ui = { inB: $$('.ak-amt, .ak-smurf', b), tools: $$('.ak-tools li', b), ask: $('.ak-ask', b), ok: $('.ak-ok', b), grow: $('.ak-grow', b), seed: $('.ak-seed', b), svg: $('.ak-roots', b), pot: {},
        msg: $('.ak-msg', b), msgT: $('.ak-msgt', b), win: $('.ak-win', b), winT: $('.ak-wint', b), dots: $('.ak-dots', b), freeze: $('.ak-freeze', b),
        dial: $('.ak-dial', b), n: $('.ak-n', b), tier: $('.ak-tier', b), tiers: $$('.ak-tiers span', b), rows: $$('.ak-row', b), sum: $('.ak-sum', b) };
      ['hold', 'vault', 'loan'].forEach(k => { ui.pot[k] = $('.p-' + k, b); });
      fresh(); roots();
      RO(roots).observe(ui.svg);
      $$('.ak-amt', b).forEach(x => x.addEventListener('click', () => api.act(() => income(+x.dataset.a, false))));
      $('.ak-smurf', b).addEventListener('click', () => api.act(smurf));
      $('.ak-clear', b).addEventListener('click', () => { S.frozen = false; S.m.flagged = Math.max(0, S.m.flagged - 1); ui.freeze.hidden = ui.win.hidden = true; ui.inB.forEach(x => { x.disabled = false; }); score(true); api.say('Flag cleared. The wallet works again.'); });
      ui.rows.forEach(r => $('input', r).addEventListener('input', e => { S.m[r.dataset.k] = +e.target.value; score(); }));
    },
    reset() { fresh(); },
    async run(api) {
      S.m = { ...ZERO }; score();
      await income(350, true); await sleep(700);
      api.say('Now a month of steady habits, fast-forwarded.');
      await tween(2400, t => { for (const k in A.month) S.m[k] = Math.round(A.month[k] * t); score(); });
      const { v, t } = score();
      if (t) anim(ui.tiers[t - 1], [{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.3,1.5,.5,1)' });
      api.say(`${v.score} points${t ? `: ${A.tiers[t - 1][1]} opens` : ''}. Drag a slider, or send five quick transfers and watch the freeze.`);
    },
  });
}
