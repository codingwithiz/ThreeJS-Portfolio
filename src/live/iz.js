import { $, $$, esc, rm, sleep, h, anim, popIn, fadeUp, shake, stamp, flip, ghost, gchip, countTo } from './util.js';
import { L } from './logic.js';
import { SMS, MAE, TNG, WA, D } from './data.js';
import { defMachine } from './core.js';

/* IZ Finance · the sorter. Verdicts come from L.gate (the real predicates); the motion only shows them. */
{
  const APP = { [SMS]: 'sms', [MAE]: 'mae', [TNG]: 'tng', [WA]: 'wa' };
  const BK = ['Needs', 'Wants', 'Invest'];
  let S, ui, API;

  function paint(text, g) {
    const spans = [];
    if (g.marker) spans.push([0, g.marker, 'mk']);
    if (g.amtSpan) spans.push([...g.amtSpan, 'am']);
    if (g.txSpan) spans.push([...g.txSpan, 'tx']);
    g.bad.forEach(s => spans.push([...s, 'bad']));
    spans.sort((a, b) => a[0] - b[0]);
    const p = h('p', { class: 'iz-text' }); let at = 0;
    for (const [s, e, c] of spans) { if (s < at) continue; p.append(text.slice(at, s), h('span', { class: 's-' + c, text: text.slice(s, e) })); at = e; }
    p.append(text.slice(at)); return p;
  }
  const paintMasked = t => h('p', { class: 'iz-text' }, t.split(/(••••\d{4})/).map((s, i) => i % 2 ? h('span', { class: 's-mask', text: s }) : s));

  function bucket(name) {
    const b = ui.bk[name], v = S.totals[name], cap = D.iz.budget[name];
    b.style.setProperty('--f', Math.min(v / cap, 1));
    b.classList.toggle('full', v >= cap);
    return countTo($('.v', b), v, { fmt: x => 'RM' + x.toFixed(2), duration: 500 });
  }
  function toast(text, undo) {
    S.last = undo; ui.toast.hidden = false;
    ui.toast.replaceChildren(h('span', { text }), undo ? h('button', { class: 'lnk', type: 'button', text: 'Undo', onclick: () => { if (!S.last) return; S.totals[S.last.bucket] -= S.last.amount; bucket(S.last.bucket); S.last = null; ui.toast.replaceChildren(h('span', { text: 'Undone.' })); } }) : null);
    fadeUp(ui.toast, { duration: 240 });
  }

  async function process(msg, k, chip) {
    const z = ms => sleep(ms * k), g = L.gate(msg.pkg, msg.sender, msg.text), app = D.iz.apps[msg.pkg] || msg.pkg;
    const card = h('div', { class: 'iz-card' },
      h('p', { class: 'iz-from' }, h('b', { class: 'app a-' + (APP[msg.pkg] || 'sms'), text: app }), h('span', { text: msg.sender })),
      paint(msg.text, g), h('span', { class: 'iz-stamp', hidden: true, text: 'Stays on the phone' }));
    const from = chip && chip.getBoundingClientRect();
    ui.slot.replaceChildren(card); ui.lamps.forEach(l => { l.className = ''; }); ui.why.textContent = '';
    if (chip) { chip.classList.add('gone'); ui.left.textContent = $$('.iz-chip:not(.gone)', ui.chips).length + ' waiting'; await flip(card, from, { duration: 440 * k }); } else await fadeUp(card);
    API.say(`${app}, from ${msg.sender}: checking.`);
    const checks = [[g.src, g.why], [g.amt, 'No amount in ringgit'], [g.tx, 'No word that says money moved'], [g.clean, 'Looks like a promo or a one-time code']];
    const marks = [g.sms && g.marker && g.src ? '.s-mk' : null, '.s-am', '.s-tx', '.s-bad'];
    let fail = null;
    for (let i = 0; i < 4; i++) {
      ui.lamps[i].className = 'chk'; await z(240);
      if (marks[i]) $$(marks[i], card).forEach(s => s.classList.add('on'));
      if (i === 0 && marks[0]) ui.why.textContent = '“RM0” at the start marks a business SMS. It is not an amount.';
      ui.lamps[i].className = checks[i][0] ? 'ok' : 'no'; await z(checks[i][0] ? 230 : 120);
      if (!checks[i][0]) { fail = checks[i][1]; break; }
    }
    API.work(1, 'notifications sorted');
    if (fail) {
      ui.why.textContent = fail + '.'; S.bin++;
      shake(card); await stamp($('.iz-stamp', card)); await z(420);
      const fly = ghost(card.cloneNode(true), card, ui.bin, { duration: 520 * k, scale: .2, fade: 0 });
      card.classList.add('sent'); await fly;
      $('b', ui.bin).textContent = S.bin;
      const li = h('li', {}, h('b', { text: app }), ' ' + fail.toLowerCase()); ui.binList.prepend(li); popIn(li);
      API.say(`Stays on the phone: ${fail.toLowerCase()}.`);
      return false;
    }
    const masked = L.maskNumbers(msg.text);
    if (masked !== msg.text) {
      $('.iz-text', card).replaceWith(paintMasked(masked));
      ui.why.textContent = 'Long numbers are masked before anything leaves the phone.';
      await anim($('.s-mask', card), [{ background: '#FFD23F', color: '#14110F' }, {}], { duration: 700 * k }); await z(200);
    }
    const amount = L.extractTransactionAmount(L.stripMarker(msg.text)), merchant = L.pageMerchant(msg.text), source = L.sourceFromText(msg.text) || app, cue = L.pageCue(merchant);
    const fact = (k2, v) => h('span', { class: 'iz-fact f-' + k2 }, h('i', { text: k2 }), v);
    const facts = h('div', { class: 'iz-facts' }, fact('amount', amount == null ? 'not found' : rm(amount)), fact('merchant', merchant || 'not found'), fact('source', source));
    card.append(facts); [...facts.children].forEach((f, i) => popIn(f, { delay: i * 90 * k }));
    ui.why.textContent = 'Passed all four. Only now does it leave the phone.';
    await z(620);
    if (cue && amount != null) {
      const key = L.merchantKey(merchant);
      await ghost(gchip(rm(amount), 'g-' + cue.bucket), $('.f-amount', card), $('.jar', ui.bk[cue.bucket]), { size: false, duration: 640 * k, scale: 1, fade: .9 });
      S.totals[cue.bucket] += amount; bucket(cue.bucket);
      anim(ui.bk[cue.bucket], [{ transform: 'translateY(4px)' }, { transform: 'none' }], { duration: 320 });
      toast(`Logged ${rm(amount)} to ${cue.category}`, { bucket: cue.bucket, amount });
      ui.why.textContent = `“${cue.cue}” is on the cue list, so it goes to ${cue.bucket} · ${cue.category}.` + (key ? ` Remembered as “${key}”.` : '');
      API.say(`Logged ${rm(amount)} at ${merchant} to ${cue.bucket}.`);
    } else {
      const chipEl = h('span', { class: 'iz-m', text: (merchant || 'unknown merchant') + (amount == null ? '' : ' · ' + rm(amount)) });
      ui.mlist.append(chipEl); ui.model.hidden = false;
      await ghost(gchip(amount == null ? '?' : rm(amount), 'g-model'), $('.f-amount', card), chipEl, { size: false, duration: 600 * k, scale: 1 });
      popIn(chipEl);
      ui.why.textContent = 'No cue matched this merchant.';
      API.say('Passed the filter, but no cue matched: a model picks the category on the real app.');
    }
    await z(380);
    return true;
  }

  function setup() {
    S = { totals: { Needs: 0, Wants: 0, Invest: 0 }, bin: 0, last: null };
    ui.chips.replaceChildren(...D.iz.queue.map(m => h('span', { class: 'iz-chip a-' + APP[m.pkg] }, h('b', { text: D.iz.apps[m.pkg].split(' ')[0] }), m.sender.length > 12 ? '' : ' ' + m.sender)));
    ui.left.textContent = D.iz.queue.length + ' waiting';
    ui.slot.replaceChildren(h('p', { class: 'iz-empty', text: 'A notification lands here.' }));
    ui.lamps.forEach(l => { l.className = ''; }); ui.why.textContent = '';
    BK.forEach(n => { $('.v', ui.bk[n]).dataset.v = 0; $('.v', ui.bk[n]).textContent = 'RM0.00'; ui.bk[n].style.setProperty('--f', 0); ui.bk[n].classList.remove('full'); });
    $('b', ui.bin).textContent = '0'; ui.binList.replaceChildren(); ui.mlist.replaceChildren(); ui.model.hidden = true; ui.toast.hidden = true;
  }

  defMachine('iz', {
    build(api) {
      API = api;
      api.board.innerHTML = `<div class="iz">
        <div class="iz-tray"><p class="lab">Phone notifications <span class="iz-left"></span></p><div class="iz-chips"></div></div>
        <div class="iz-gate"><p class="lab">The filter <span>runs on the phone</span></p>
          <div class="iz-slot"></div>
          <ol class="iz-lamps"><li><i></i>From a payment app</li><li><i></i>Has an amount</li><li><i></i>Says money moved</li><li><i></i>Not a promo or a code</li></ol>
          <p class="iz-why"></p></div>
        <div class="iz-out"><p class="lab">The budget <span>sample week, RM250 split 40 / 20 / 40</span></p>
          <div class="iz-buckets">${BK.map(n => `<div class="iz-bk k-${n}"><div class="jar"><i></i></div><b>${n}</b><span><span class="v" data-v="0">RM0.00</span> of RM${D.iz.budget[n]}</span></div>`).join('')}</div>
          <p class="iz-toast" hidden></p>
          <div class="iz-model" hidden><p class="lab">No cue matched</p><div class="iz-mlist"></div><p class="note">On the real app a language model reads the merchant and picks the category.</p></div>
          <div class="iz-bin"><p class="lab">Stays on the phone <b>0</b></p><ul></ul></div></div>
        <form class="iz-try"><p class="lab">Try your own <span>the same code decides</span></p>
          <div class="iz-row"><select aria-label="Where the notification comes from">${D.iz.senders.map((s, i) => `<option value="${i}">${esc(s.label)}</option>`).join('')}</select>
          <input type="text" maxlength="200" required aria-label="Notification text" placeholder="RM0 Maybank: You paid RM25.50 at KFC" value="RM0 Maybank: You paid RM25.50 at KFC">
          <button class="btn sm" type="submit">Send it through</button></div></form>
      </div>`;
      const b = api.board;
      ui = { chips: $('.iz-chips', b), left: $('.iz-left', b), slot: $('.iz-slot', b), lamps: $$('.iz-lamps li', b), why: $('.iz-why', b), toast: $('.iz-toast', b),
        bin: $('.iz-bin', b), binList: $('.iz-bin ul', b), model: $('.iz-model', b), mlist: $('.iz-mlist', b), bk: {} };
      BK.forEach(n => { ui.bk[n] = $('.k-' + n, b); });
      setup();
      $('.iz-try', b).addEventListener('submit', e => {
        e.preventDefault();
        const s = D.iz.senders[+$('select', e.target).value], text = $('input', e.target).value.trim();
        if (text) api.act(() => process({ pkg: s.pkg, sender: s.sender, text }, 1, null));
      });
    },
    reset() { setup(); },
    async run(api) {
      const chips = $$('.iz-chip', ui.chips); let ok = 0;
      for (let i = 0; i < D.iz.queue.length; i++) { if (await process(D.iz.queue[i], i < 2 ? 1 : i < 4 ? .7 : .5, chips[i])) ok++; await sleep(i < 2 ? 300 : 120); }
      api.say(`${D.iz.queue.length} notifications: ${ok} logged, ${D.iz.queue.length - ok} never left the phone. Now try your own.`);
    },
  });
}
