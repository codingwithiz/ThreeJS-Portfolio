import { RO, $, $$, esc, sleep, h, sv, anim, shake, stamp, draw } from './util.js';
import { L } from './logic.js';
import { D } from './data.js';
import { MACH, defMachine } from './core.js';

/* Crux · the quote check. L.verifyCitations / L.citationFaithfulness are the app's own functions; L.locateQuote finds where to underline. */
{
  const SRC = D.crux.source;
  let ui, shown = [false, false, false], flowAt = 0;
  const quotes = () => ui.ta.map(t => t.value);

  function paintSrc() {
    const ls = quotes().map((q, i) => { const l = shown[i] && L.locateQuote(q, SRC); return l ? [l[0], l[1], i] : null; }).filter(Boolean).sort((a, b) => a[0] - b[0]);
    const out = []; let at = 0;
    for (const [s, e, i] of ls) { if (s < at) continue; out.push(SRC.slice(at, s), h('mark', { class: 'm' + i, text: SRC.slice(s, e) })); at = e; }
    out.push(SRC.slice(at)); ui.text.replaceChildren(...out);
  }
  /* a thread from each found quote to its card: across the gap when side by side, down a lane on the left when stacked */
  function wires(drawIdx) {
    const w = ui.wrap.getBoundingClientRect(), panel = ui.src.getBoundingClientRect();
    ui.svg.replaceChildren(); if (!w.width) return;
    const side = ui.cards[0].getBoundingClientRect().left > panel.right - 4;
    ui.cards.forEach((card, i) => {
      const mk = $('mark.m' + i, ui.text); if (!mk) return;
      const rs = mk.getClientRects(), r = rs[side ? rs.length - 1 : 0], c = card.getBoundingClientRect();
      const y0 = r.bottom - w.top, y1 = c.top + 22 - w.top, x1 = c.left - w.left; let d;
      if (side) { const x0 = panel.right - w.left, mx = (x0 + x1) / 2; d = `M${r.right - w.left} ${y0}H${x0}C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`; }
      else { const lane = 5 + i * 6, k = 7; d = `M${r.left - w.left} ${y0}H${lane + k}Q${lane} ${y0} ${lane} ${y0 + k}V${y1 - k}Q${lane} ${y1} ${lane + k} ${y1}H${x1}`; }
      const p = sv('path', { d, class: 'w' + i });
      ui.svg.append(p, sv('circle', { cx: x1, cy: y1, r: 4, class: 'w' + i }));
      if (i === drawIdx) draw(p, { duration: 650 });
    });
  }
  function status(i, how) {
    const q = ui.ta[i].value.trim(), st = $('.cx-st', ui.cards[i]), ok = q && L.locateQuote(q, SRC);
    ui.cards[i].className = 'cx-q q' + i + (!shown[i] || !q ? '' : ok ? ' ok' : ' no');
    st.textContent = !q ? 'Empty' : !shown[i] ? 'Not checked yet' : ok ? 'Verified' : 'Not in source';
    $('.cx-norm', ui.cards[i]).textContent = shown[i] && q ? 'compared as: ' + L.normalizeQuote(q) : '';
    if (how === 'stamp' && shown[i]) { stamp(st); if (!ok) shake(ui.cards[i]); }
  }
  function dial() {
    const live = quotes().filter((q, i) => shown[i] && q.trim());
    const cites = L.verifyCitations(live, SRC), f = L.citationFaithfulness(cites);
    ui.dial.style.setProperty('--v', f ?? 0);
    ui.dialN.textContent = f == null ? '–' : f.toFixed(2);
    ui.dialT.textContent = f == null ? 'no quotes checked yet' : `${cites.filter(c => c.verified).length} of ${cites.length} quotes found in the source`;
  }
  function setFlow(i) {
    flowAt = i; ui.st.forEach((s, j) => { s.className = j < i ? 'done' : j === i ? 'on' : ''; });
    ui.next.textContent = i >= ui.st.length - 1 ? 'Start again' : 'Your click →';
  }
  const beam = dur => anim(ui.beam, [{ opacity: 1, top: '0%' }, { opacity: 1, top: '100%' }], { duration: dur, easing: 'linear', fill: 'none' });
  async function press() { await anim(ui.next, [{ transform: 'none' }, { transform: 'translate(3px,3px)', boxShadow: '0 0 0 #14110F', offset: .5 }, { transform: 'none' }], { duration: 260 }); setFlow(flowAt >= ui.st.length - 1 ? 0 : flowAt + 1); }

  defMachine('crux', {
    build(api) {
      api.board.innerHTML = `<div class="cx">
        <div class="cx-wrap">
          <div class="cx-src"><p class="lab">The source <span>a sample passage written for this page</span></p><p class="cx-text"></p><i class="cx-beam"></i></div>
          <div class="cx-quotes">${D.crux.quotes.map((q, i) => `<div class="cx-q q${i}"><label for="cxq${i}">Quote ${i + 1} <span>edit it</span></label><textarea id="cxq${i}" rows="2" spellcheck="false">${esc(q)}</textarea><p class="cx-norm"></p><span class="cx-st">Not checked yet</span></div>`).join('')}</div>
          <svg class="cx-wires" aria-hidden="true"></svg>
        </div>
        <div class="cx-low">
          <div class="cx-dial"><svg viewBox="0 0 100 58" aria-hidden="true"><path class="tr" pathLength="1" d="M6 52A44 44 0 0 1 94 52"/><path class="va" pathLength="1" d="M6 52A44 44 0 0 1 94 52"/><line class="nd" x1="50" y1="52" x2="50" y2="16"/><circle cx="50" cy="52" r="4"/></svg>
            <div><b class="cx-n">–</b><span>citation faithfulness</span><span class="cx-dt">no quotes checked yet</span></div></div>
          <div class="cx-flowbox"><p class="lab">The whole flow <span>every arrow is a human click</span></p>
            <ol class="cx-flow">${D.crux.flow.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
            <button class="btn sm cx-next" type="button">Your click →</button></div>
          <p class="cx-eval"><b>10 / 10</b> golden items · citation faithfulness <b>1.00</b><span>eval run 2026-08-10 · judge gpt-5.5</span></p>
        </div></div>`;
      const b = api.board;
      ui = { wrap: $('.cx-wrap', b), src: $('.cx-src', b), text: $('.cx-text', b), beam: $('.cx-beam', b), cards: $$('.cx-q', b), ta: $$('textarea', b), svg: $('.cx-wires', b),
        dial: $('.cx-dial', b), dialN: $('.cx-n', b), dialT: $('.cx-dt', b), st: $$('.cx-flow li', b), next: $('.cx-next', b) };
      paintSrc(); setFlow(0);
      let t; ui.ta.forEach((ta, i) => ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { if (MACH.crux.busy) return; shown[i] = true; paintSrc(); wires(); ui.cards.forEach((c, j) => status(j)); dial(); api.work(1, 'quotes checked'); }, 220); }));
      ui.next.addEventListener('click', () => { if (!MACH.crux.busy) press(); });
      RO(() => wires()).observe(ui.wrap);
    },
    reset() { shown = [false, false, false]; paintSrc(); wires(); ui.cards.forEach((c, i) => status(i)); dial(); setFlow(0); },
    async run(api) {
      api.say('Step 1 is yours: you give it a source.'); await sleep(500);
      await press(); api.say('Synthesize: before a quote is kept, it must be found in the source.');
      await beam(900);
      for (let i = 0; i < 3; i++) {
        const q = ui.ta[i].value.trim(); if (!q) continue;
        ui.cards[i].classList.add('chk'); $('.cx-norm', ui.cards[i]).textContent = 'compared as: ' + L.normalizeQuote(q); await sleep(520);
        shown[i] = true; paintSrc();
        const mk = $('mark.m' + i, ui.text);
        if (mk) { anim(mk, [{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }], { duration: 520, easing: 'ease-out' }); await sleep(380); wires(i); await sleep(600); }
        else { wires(); await beam(420); }
        status(i, 'stamp'); dial(); api.work(1, 'quotes checked');
        api.say(mk ? `Quote ${i + 1}: found in the source, word for word.` : `Quote ${i + 1}: not in the source. It is dropped before it reaches the page.`);
        await sleep(620);
      }
      wires();
      for (let i = flowAt; i < ui.st.length - 1; i++) { await sleep(300); await press(); }
      api.say('Checked. Edit any quote and it is checked again as you type.');
    },
  });
}
