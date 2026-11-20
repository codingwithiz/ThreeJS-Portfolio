import { RO, $, $$, T, fast, clamp, lerp, raf, sleep, sv, anim, fadeUp } from './util.js';
import { D } from './data.js';
import { MACH, defMachine } from './core.js';
import FLOOD from './flood.json';

/* UrbanFloodBench · the storm replay. Every level, flow and rain value is from one event in the competition data.
   Fill = (water level − invert) / depth, so 100% means the water has reached ground level. Positions are the real coordinates, nudged apart so manholes do not overlap. */
{
  const F = FLOOD, NN = F.nodes.length, STEPS = D.flood.steps, CH = 36, CW = 16;
  const OUT = F.nodes.findIndex((n, i) => !F.edges.some(e => e[0] === i));   // the one node nothing flows out of
  const R = F.wl.map(row => row.map((w, i) => (w - F.nodes[i].inv) / F.nodes[i].depth));
  const adj = F.nodes.map((n, i) => F.edges.flatMap(([a, b]) => a === i ? [b] : b === i ? [a] : []));
  const rainMax = Math.max(...F.rain.slice(0, STEPS));
  const overAt = t => F.nodes.map((n, i) => i).filter(i => i !== OUT && R[t][i] >= 1);
  const PEAK = Array.from({ length: STEPS }, (x, t) => t).reduce((best, t) => overAt(t).length > overAt(best).length ? t : best, 0) + 2;
  const names = a => 'Manhole' + (a.length > 1 ? 's ' : ' ') + a.join(', ').replace(/, (\d+)$/, ' and $1');
  /* what to say, and when: all worked out from the data */
  const NOTE = {}; const note = (t, s) => { NOTE[t] = (NOTE[t] ? NOTE[t] + ' ' : '') + s; };
  note(F.rain.findIndex(r => r > .04), 'Rain starts.');
  note(F.rain.indexOf(rainMax), 'Heaviest rain.');
  for (let t = 1; t < STEPS; t++) { const fresh = overAt(t).filter(i => R[t - 1][i] < 1); if (fresh.length) note(t, `${names(fresh)} ${fresh.length > 1 ? 'are' : 'is'} above ground level.`); }
  note(F.rain.findIndex((r, t) => t > 3 && r === 0), 'The rain has stopped. The pipes are still draining.');

  let ui, API, P = [], NE = [], PE = [], off = [], lw = 0, pos = PEAK, sel = 2, token = 0, lastI = -1, narrate = false, tw = 0;
  const tx = s => 8 + s / (STEPS - 1) * (tw - 16);

  function layout() {
    const w = ui.net.clientWidth; if (!w || w === lw) return; lw = w;
    const land = w >= 560, pad = 36, xs = F.nodes.map(n => n.x), ys = F.nodes.map(n => n.y);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const gw = land ? y1 - y0 : x1 - x0, gh = land ? x1 - x0 : y1 - y0;
    const s = Math.min((w - pad * 2) / gw, ((land ? 420 : 540) - pad * 2) / gh), H = Math.round(gh * s + pad * 2), ox = (w - gw * s) / 2;
    P = F.nodes.map(n => land ? [ox + (y1 - n.y) * s, pad + (n.x - x0) * s] : [ox + (n.x - x0) * s, pad + (y1 - n.y) * s]);
    for (let k = 0; k < 120; k++) for (let a = 0; a < NN; a++) for (let b = a + 1; b < NN; b++) {   // push overlapping manholes apart
      const dx = P[b][0] - P[a][0] || .5, dy = P[b][1] - P[a][1] || .5, d = Math.hypot(dx / 30, dy / 54);
      if (d < 1) { const m = (1 - d) / 2 / d; P[a][0] -= dx * m; P[a][1] -= dy * m; P[b][0] += dx * m; P[b][1] += dy * m; }
    }
    P.forEach(p => { p[0] = clamp(p[0], 18, w - 18); p[1] = clamp(p[1], 24, H - 30); });
    ui.svg.setAttribute('viewBox', `0 0 ${w} ${H}`); ui.svg.style.height = H + 'px';
    const dpr = Math.min(devicePixelRatio || 1, 2); ui.cv.width = w * dpr; ui.cv.height = H * dpr; ui.cv.style.height = H + 'px'; ui.cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    PE = F.edges.map(([a, b]) => { const d = `M${P[a][0]} ${P[a][1]}L${P[b][0]} ${P[b][1]}`; return { base: sv('path', { class: 'fl-pipe', d }), flow: sv('path', { class: 'fl-flow', d }) }; });
    off = F.edges.map(() => 0);
    NE = F.nodes.map((n, i) => {
      const g = sv('g', { class: 'fl-n', transform: `translate(${P[i][0]} ${P[i][1]})`, 'data-i': i });
      const o = { g, cls: null, rp: sv('circle', { class: 'fl-rp', r: 24 }) };
      if (i === OUT) g.append(o.rp, sv('circle', { class: 'fl-out', r: 11 }), sv('text', { y: 28, text: 'outlet' }));
      else { o.lvl = sv('rect', { class: 'fl-lvl', x: -CW / 2, width: CW, 'clip-path': 'url(#fl-clip)' }); g.append(o.rp, sv('rect', { class: 'fl-hit', x: -22, y: -24, width: 44, height: 56 }), sv('circle', { class: 'fl-ov', r: 20 }), sv('rect', { class: 'fl-cap', x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: CW / 2 }), o.lvl, sv('rect', { class: 'fl-rim', x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: CW / 2 }), sv('text', { y: CH / 2 + 13, text: i })); }
      return o;
    });
    ui.svg.replaceChildren(sv('defs', {}, sv('clipPath', { id: 'fl-clip' }, sv('rect', { x: -CW / 2, y: -CH / 2, width: CW, height: CH, rx: CW / 2 }))), ...PE.map(p => p.base), ...PE.map(p => p.flow), ...NE.map(o => o.g));
    timeline(); render(0);
  }
  function timeline() {
    tw = ui.track.clientWidth; if (!tw) return;
    const Hh = 112, top = 34, y = r => Hh - 8 - clamp(r, 0, 1.3) / 1.3 * (Hh - 8 - top), bw = (tw - 16) / (STEPS - 1);
    ui.time.setAttribute('viewBox', `0 0 ${tw} ${Hh}`);
    ui.head = sv('g', { class: 'fl-head' }, sv('line', { y1: 0, y2: Hh }), sv('circle', { cy: y(1), r: 6 }));
    ui.time.replaceChildren(
      sv('rect', { class: 'fl-warm', x: 0, y: 0, width: tx(D.flood.warm - .5), height: Hh }),
      ...F.rain.slice(0, STEPS).map((r, t) => sv('rect', { class: 'fl-hy', x: tx(t) - bw * .4, y: 0, width: bw * .8, height: r / rainMax * 28 })),
      sv('line', { class: 'fl-rimline', x1: 0, x2: tw, y1: y(1), y2: y(1) }),
      sv('path', { class: 'fl-line', d: R.slice(0, STEPS).map((row, t) => (t ? 'L' : 'M') + tx(t).toFixed(1) + ' ' + y(row[sel]).toFixed(1)).join('') }),
      ui.head);
  }
  function rain(v) {
    const c = ui.cv.getContext('2d'), w = lw, hh = ui.cv.height / Math.min(devicePixelRatio || 1, 2);
    c.clearRect(0, 0, w, hh); if (v <= 0) return;
    c.strokeStyle = 'rgba(205,211,255,.5)'; c.lineWidth = 1.2; c.beginPath();
    for (let i = Math.round(v / rainMax * w / 6); i-- > 0;) { const x = Math.random() * (w + 40), y = Math.random() * hh, l = 9 + Math.random() * 12; c.moveTo(x, y); c.lineTo(x - l * .32, y + l); }
    c.stroke();
  }
  function render(dt) {
    if (!NE.length) return;
    const a = Math.min(Math.floor(pos), STEPS - 1), f = pos - a, b = Math.min(a + 1, R.length - 1); let over = 0;
    NE.forEach((o, i) => {
      const r = lerp(R[a][i], R[b][i], f), cls = (i !== OUT && r >= 1 ? 'over' : r >= .6 ? 'high' : '') + (i === sel ? ' sel' : '');
      if (o.lvl) { const hgt = clamp(r, 0, 1) * CH; o.lvl.setAttribute('y', CH / 2 - hgt); o.lvl.setAttribute('height', hgt); if (r >= 1) over++; }
      if (o.cls !== cls) { o.cls = cls; o.g.setAttribute('class', 'fl-n ' + cls); }
    });
    PE.forEach((p, e) => { const q = lerp(F.fl[a][e], F.fl[b][e], f), m = Math.abs(q); p.flow.style.strokeWidth = m < .05 ? 0 : 1.5 + Math.sqrt(m) * .6; off[e] -= q * dt * .012; p.flow.style.strokeDashoffset = off[e].toFixed(1); });
    const rv = lerp(F.rain[a], F.rain[b], f), min = Math.round(pos * 5), r = lerp(R[a][sel], R[b][sel], f);
    rain(rv);
    ui.clock.textContent = `t + ${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;
    ui.rainv.textContent = `rain ${rv.toFixed(2)}`;
    ui.over.textContent = `${over} of ${NN - 1} above ground level`; ui.over.classList.toggle('hot', over > 0);
    ui.sel.textContent = `Manhole ${sel} · ${Math.round(Math.max(r, 0) * 100)}% full`;
    if (ui.head) ui.head.setAttribute('transform', `translate(${tx(pos).toFixed(1)} 0)`);
    ui.scrub.value = pos;
    if (a !== lastI) { lastI = a; if (narrate && NOTE[a]) API.say(NOTE[a]); }
  }
  /* returns false if the visitor took over (scrubbed or pressed pause) */
  async function playback(from, to, ms) {
    const my = ++token, t0 = performance.now(); let last = t0; ui.play.textContent = 'Pause';
    for (;;) {
      await raf(); const now = performance.now();
      if (my !== token) return false;
      if (fast()) break;
      const t = Math.min((now - t0) / ms * T.speed, 1); pos = lerp(from, to, t); render(now - last); last = now;
      if (t >= 1) break;
    }
    pos = to; render(0); ui.play.textContent = 'Play'; return true;
  }
  const pause = () => { token++; ui.play.textContent = 'Play'; };
  function pick(i, quiet) {
    sel = (i + NN) % NN; if (sel === OUT) sel = (sel + (i < sel ? -1 : 1) + NN) % NN;
    timeline(); render(0);
    const h1 = adj[sel], h2 = [...new Set(h1.flatMap(n => adj[n]))].filter(n => n !== sel && !h1.includes(n));
    ui.gt.textContent = `Manhole ${sel} hears from ${h1.length} neighbour${h1.length > 1 ? 's' : ''} through its pipes, then from ${h2.length} more through them. Two rounds of message passing: the model has 2 layers.`;
    if (quiet) return;
    [[sel], h1, h2].forEach((hop, k) => hop.forEach(n => anim(NE[n].rp, [{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, offset: .35 }, { opacity: 0, transform: 'scale(1.5)' }], { duration: 900, delay: k * 380, easing: 'ease-out' })));
    F.edges.forEach(([a2, b2], e) => { const k = (a2 === sel || b2 === sel) ? 0 : (h1.includes(a2) || h1.includes(b2)) ? 1 : -1; if (k >= 0) anim(PE[e].base, [{ stroke: '#FFD23F', strokeWidth: 5 }, {}], { duration: 800, delay: 200 + k * 380 }); });
  }
  function scores(play) {
    ui.sc.forEach((li, j) => { if (!play) return; anim($('i', li), [{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 600, delay: j * 260 }); fadeUp(li, { delay: j * 260 }); });
  }

  defMachine('flood', {
    build(api) {
      API = api; const sc = D.flood.scores, mx = sc[0][0];
      api.board.innerHTML = `<div class="fl">
        <div class="fl-read"><b class="fl-clock"></b><span class="fl-rainv"></span><span class="fl-over"></span><em>rain in dataset units · 5 minutes a step</em></div>
        <div class="fl-net"><svg class="fl-svg" role="img" aria-label="A drainage network of ${NN - 1} manholes and ${F.edges.length} pipes"></svg><canvas class="fl-rain" aria-hidden="true"></canvas></div>
        <div class="fl-tl"><div class="fl-ctl"><button class="btn sm fl-play" type="button">Play</button><span class="fl-pick"><button type="button" aria-label="Previous manhole">‹</button><b class="fl-sel"></b><button type="button" aria-label="Next manhole">›</button></span></div>
          <div class="fl-track"><input class="fl-scrub" type="range" min="0" max="${STEPS - 1}" step="0.1" aria-label="Time in the storm"><svg class="fl-time" aria-hidden="true"></svg></div>
          <p class="fl-key"><span class="k-rain">rain</span><span class="k-lvl">the selected manhole</span><span class="k-rim">ground level</span><span class="k-warm">the model is given these ${D.flood.warm} steps, then forecasts the rest on its own</span></p></div>
        <div class="fl-low">
          <div class="fl-gnn"><p class="lab">How the model reads the network <span>tap a manhole</span></p><p class="fl-gt"></p></div>
          <div class="fl-score"><p class="lab">My score, run by run <span>lower is better</span></p>
            <ol>${sc.map(([v, a, b2]) => `<li style="--f:${(v / mx).toFixed(4)}"><i></i><b>${v.toFixed(4)}</b><span>${[a, b2].filter(Boolean).join(' · ')}</span></li>`).join('')}<li class="first" style="--f:${(D.flood.first / mx).toFixed(4)}"><i></i><b>${D.flood.first.toFixed(4)}</b><span>1st place</span></li></ol></div>
        </div></div>`;
      const b = api.board;
      ui = { net: $('.fl-net', b), svg: $('.fl-svg', b), cv: $('.fl-rain', b), clock: $('.fl-clock', b), rainv: $('.fl-rainv', b), over: $('.fl-over', b), play: $('.fl-play', b), sel: $('.fl-sel', b),
        track: $('.fl-track', b), scrub: $('.fl-scrub', b), time: $('.fl-time', b), gt: $('.fl-gt', b), sc: $$('.fl-score li', b) };
      layout(); pick(sel, true);
      RO(() => { const had = lw; layout(); if (had && tw !== ui.track.clientWidth) { timeline(); render(0); } }).observe(ui.net);
      ui.scrub.addEventListener('input', () => { pause(); pos = +ui.scrub.value; render(0); });
      ui.play.addEventListener('click', () => { if (MACH.flood.busy) return; if (ui.play.textContent === 'Pause') return pause(); playback(pos >= STEPS - 1.05 ? 0 : pos, STEPS - 1, (STEPS - 1 - (pos >= STEPS - 1.05 ? 0 : pos)) * 280); });
      $$('.fl-pick button', b).forEach((x, j) => x.addEventListener('click', () => pick(sel + (j ? 1 : -1))));
      ui.svg.addEventListener('click', e => { const g = e.target.closest('.fl-n'); if (g && +g.dataset.i !== OUT) pick(+g.dataset.i); });
    },
    reset() { pause(); pos = PEAK; lastI = -1; render(0); },
    async run(api) {
      layout(); narrate = true; lastI = -1; pos = 0; render(0);
      api.say('One real storm from the competition data. Three hours, replayed in ten seconds.'); await sleep(900);
      const whole = await playback(0, STEPS - 1, 10000); narrate = false;
      api.work(STEPS, 'time steps replayed');
      if (whole) { await sleep(500); api.say(`Back to the worst moment: ${overAt(PEAK).length} manholes above ground level.`); await playback(STEPS - 1, PEAK, 900); }
      await sleep(500); pick(sel); api.say('The model is a graph network: each manhole learns from the ones its pipes reach.'); await sleep(1700);
      scores(true); api.say('Four scored runs. The first was wrecked by a rainfall column bug; the last finished 2nd of 264 teams.'); await sleep(1500);
      api.say('Drag the timeline, or tap any manhole.');
    },
  });
}
