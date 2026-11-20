import { $, $$, lerp, sleep, h, sv, anim, popIn, fadeUp, shake, ghost, gchip, countTo, typeInto, rng } from './util.js';
import { L } from './logic.js';
import { D } from './data.js';
import { MACH, defMachine } from './core.js';

/* NiagaMap · one sentence in. The hexagon grid, the weight rebalancing and the final score are the app's own functions;
   the five values inside each hexagon are seeded sample fields. In the app every indicator is a score where higher is better
   (few rivals = high Competition, no flood or landslide = high Risk). */
{
  const N = D.niaga, KEYS = Object.keys(N.labels);
  const LOCK = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';
  let ui, API, cur = 0, W, locked = {}, mode = 'score', G = null;

  const hex2 = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex2(a), B = hex2(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };
  const ramp = t => t < .5 ? mix('#2A2550', '#B9A5FF', t * 2) : mix('#B9A5FF', '#FFD23F', t * 2 - 1);

  /* sample fields: each indicator is a few smooth bumps, so neighbours look related the way real places do */
  function fields(seed, R, hexes) {
    const r = rng(seed), bumps = {};
    KEYS.forEach(k => { bumps[k] = [0, 1, 2].map(() => ({ x: (r() * 2 - 1) * R * .8, y: (r() * 2 - 1) * R * .8, s: R * (.28 + r() * .3), a: .5 + r() * .5 })); });
    return hexes.map(hx => { const o = {}; KEYS.forEach(k => { o[k] = +(0.12 + bumps[k].reduce((s, b) => s + b.a * Math.exp(-((hx.x - b.x) ** 2 + (hx.y - b.y) ** 2) / (2 * b.s * b.s)), 0)).toFixed(3); }); return o; });
  }
  function grid(i) {
    const a = N.asks[i], R = a.radius === '5 km' ? 5000 : 1000, side = R * .12, V = R * 1.1, r = rng(a.seed + 99);
    const hexes = L.generateHexagons(R, side).sort((p, q) => Math.hypot(p.x, p.y) - Math.hypot(q.x, q.y));
    G = { R, side, V, hexes, rows: fields(a.seed, R, hexes) };
    ui.svg.setAttribute('viewBox', `${-V} ${-V} ${2 * V} ${2 * V}`);
    const roads = [0, 1, 2, 3].map(j => { const v = j % 2, p = (r() * 1.4 - .7) * V, q = (r() * 1.4 - .7) * V, m = (r() * .8 - .4) * V; return sv('path', { class: 'ng-road', d: v ? `M${p} ${-V}Q${m} 0 ${q} ${V}` : `M${-V} ${p}Q0 ${m} ${V} ${q}` }); });
    G.polys = hexes.map((hx, j) => sv('polygon', { points: hx.pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' '), 'data-i': j }));
    G.ring = sv('circle', { class: 'ng-ring', r: R });
    ui.svg.replaceChildren(sv('g', {}, G.polys), ...roads, G.ring);
  }
  const pos = hx => `left:${((hx.x + G.V) / (2 * G.V) * 100).toFixed(2)}%;top:${((hx.y + G.V) / (2 * G.V) * 100).toFixed(2)}%`;

  function paintMap(count) {
    const sc = G.sc = L.scoreHexagons(G.rows, W), lo = Math.min(...sc), hi = Math.max(...sc);
    const mx = mode === 'score' ? 1 : Math.max(...G.rows.map(r => r[mode]));
    G.polys.forEach((p, i) => {
      p.style.fill = mode === 'score' ? ramp((sc[i] - lo) / (hi - lo || 1)) : N.colors[mode];
      p.style.fillOpacity = mode === 'score' ? 1 : (.1 + .9 * G.rows[i][mode] / mx).toFixed(2);
      p.classList.remove('top');
    });
    ui.cap.textContent = mode === 'score' ? 'Final score: all five, weighted' : `${N.labels[mode]} score · ${N.hints[mode].toLowerCase()}`;
    ui.cap.style.setProperty('--c', mode === 'score' ? '#FFD23F' : N.colors[mode]);
    ui.rows.forEach(r => r.classList.toggle('on', r.dataset.k === mode));
    const top = mode === 'score' ? sc.map((s, i) => i).sort((a, b) => sc[b] - sc[a]).slice(0, 3) : [];
    const max = {}; KEYS.forEach(k => { max[k] = Math.max(...G.rows.map(r => r[k])) || 1; });
    ui.ranks.forEach((b, j) => { b.hidden = top[j] == null; if (top[j] != null) b.style.cssText = pos(G.hexes[top[j]]); });
    ui.top.forEach((li, j) => {
      const i = top[j]; li.classList.toggle('pre', i == null); if (i == null) return;
      const best = KEYS.slice().sort((a, b) => G.rows[i][b] / max[b] * W[b] - G.rows[i][a] / max[a] * W[a])[0];
      G.polys[i].classList.add('top'); G.polys[i].parentNode.append(G.polys[i]);
      const v = $('.v', li); count ? countTo(v, sc[i], { fmt: x => x.toFixed(1), from: 0, duration: 800 }) : (v.textContent = sc[i].toFixed(1), v.dataset.v = sc[i]);
      $('i', li).style.setProperty('--f', sc[i] / 100); $('small', li).textContent = 'helped most by ' + N.labels[best];
    });
  }
  function paintWeights() {
    ui.rows.forEach(r => { const k = r.dataset.k; $('input', r).value = W[k]; $('output', r).textContent = W[k]; $('.ng-lock', r).setAttribute('aria-pressed', !!locked[k]); r.classList.toggle('locked', !!locked[k]); });
    ui.sum.textContent = KEYS.reduce((s, k) => s + W[k], 0);
  }
  function setPreset(cat) { W = { ...L.CATEGORY_PRESETS[cat] }; locked = {}; ui.presets.forEach(b => b.setAttribute('aria-pressed', b.dataset.c === cat)); paintWeights(); }
  function sentence(a) {
    const at = a.chips.map(([p], j) => [a.text.indexOf(p), p.length, j]).filter(x => x[0] >= 0).sort((x, y) => x[0] - y[0]);
    const out = []; let c = 0;
    for (const [s, n, j] of at) { out.push(a.text.slice(c, s), h('mark', { class: 'c' + j, text: a.text.slice(s, s + n) })); c = s + n; }
    out.push(a.text.slice(c)); ui.sent.replaceChildren(...out);
  }
  const chip = (a, j) => h('span', { class: 'ng-chip c' + j, text: a.chips[j][1] });
  function settle(i) {   // the finished picture, no motion
    const a = N.asks[i]; cur = i; mode = 'score';
    ui.askB.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    sentence(a); ui.chips.replaceChildren(...a.chips.map((c, j) => chip(a, j)));
    setPreset(a.category); grid(i); ui.pin.classList.remove('pre'); paintMap(); ui.info.textContent = 'Tap a hexagon to see its five scores.';
  }

  async function play(i) {
    const a = N.asks[i]; cur = i; mode = 'score';
    ui.askB.forEach((b, j) => b.setAttribute('aria-pressed', j === i));
    ui.chips.replaceChildren(); grid(i); G.polys.forEach(p => p.classList.add('pre')); G.ring.classList.add('pre'); ui.pin.classList.add('pre');
    ui.ranks.forEach(b => { b.hidden = true; }); ui.top.forEach(li => li.classList.add('pre')); ui.cap.textContent = ''; ui.info.textContent = '';
    API.say('One sentence, typed the way people talk.');
    await typeInto(ui.sent, a.text, 70); sentence(a); await sleep(250);
    for (let j = 0; j < a.chips.length; j++) {
      const c = chip(a, j); c.classList.add('pre'); ui.chips.append(c);
      await ghost(gchip(a.chips[j][0], 'g-niaga'), $('mark.c' + j, ui.sent), c, { size: false, scale: 1, duration: 460 });
      c.classList.remove('pre'); popIn(c); await sleep(140);
    }
    API.say(`“${N.catNames[a.category]}” sets the starting weights.`);
    setPreset(a.category); ui.rows.forEach((r, j) => fadeUp(r, { delay: j * 60 })); await sleep(650);
    ui.pin.classList.remove('pre'); await anim(ui.pin, [{ opacity: 0, transform: 'translate(-50%,-260%)' }, { opacity: 1, transform: 'translate(-50%,-100%)' }], { duration: 420, easing: 'cubic-bezier(.3,1.5,.5,1)' });
    G.ring.classList.remove('pre'); await anim(G.ring, [{ transform: 'scale(0)', opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: 650 });
    const step = G.side * 1.74;
    G.polys.forEach((p, j) => { p.classList.remove('pre'); p.style.fill = '#1A2150'; p.style.fillOpacity = 1; anim(p, [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: Math.round(Math.hypot(G.hexes[j].x, G.hexes[j].y) / step) * 110 }); });
    API.say(`${G.hexes.length} hexagons, ${Math.round(G.side)} m a side, inside ${a.radius}.`);
    await sleep(Math.round(G.R / step) * 110 + 450);
    for (const k of KEYS) { mode = k; paintMap(); API.say(`${N.labels[k]}: ${N.hints[k].toLowerCase()}.`); await sleep(620); }
    mode = 'score'; paintMap(true); ui.top.forEach((li, j) => fadeUp(li, { delay: j * 120 })); ui.ranks.forEach((b, j) => popIn(b, { delay: j * 120 }));
    API.work(G.hexes.length, 'hexagons scored');
    ui.info.textContent = 'Tap a hexagon to see its five scores.';
    API.say(`${G.hexes.length} hexagons scored and ranked. Drag a weight: the map re-ranks while you move.`);
    await sleep(700);
  }

  defMachine('niaga', {
    build(api) {
      API = api;
      api.board.innerHTML = `<div class="ng">
        <div class="ng-ask"><p class="lab">Ask in one sentence <span>real example questions from the app</span></p>
          <p class="ng-sent"></p>
          <div class="ng-asks">${N.asks.map((a, i) => `<button class="btn sm quiet" type="button" aria-pressed="false">${['Coffee · 1 km', 'Restoran · 5 km', 'Workshop · 1 km'][i]}</button>`).join('')}</div>
          <div class="ng-chips"></div>
          <p class="note">In the real app GPT-4o pulls these out of the sentence. Here they are preset.</p></div>
        <div class="ng-mapbox"><div class="ng-map"><svg role="img" aria-label="Hexagon map of the search area"></svg><i class="ng-pin"></i>${[1, 2, 3].map(n => `<b class="ng-rank" hidden>${n}</b>`).join('')}</div>
          <p class="ng-cap"></p><p class="ng-legend"><span>lower</span><i></i><span>higher score</span><em>Sample fields, not a real place</em></p><p class="ng-info" role="status"></p></div>
        <div class="ng-side"><p class="lab">Weights <span>always add up to <b class="ng-sum">100</b></span></p>
          <div class="ng-presets">${Object.keys(L.CATEGORY_PRESETS).map(c => `<button type="button" data-c="${c}" aria-pressed="false">${N.catNames[c]}</button>`).join('')}</div>
          ${KEYS.map(k => `<div class="ng-row" data-k="${k}" style="--c:${N.colors[k]}"><label for="ngw-${k}"><i></i>${N.labels[k]}</label><input id="ngw-${k}" type="range" min="0" max="100" step="1"><output for="ngw-${k}"></output><button class="ng-lock" type="button" aria-pressed="false" aria-label="Lock ${N.labels[k]}">${LOCK}</button></div>`).join('')}
          <p class="note">Lock one and the rest share what is left. Brighter is better for every indicator: fewer rivals, safer ground.</p>
          <p class="lab">Top 3 hexagons</p>
          <ol class="ng-top">${[1, 2, 3].map(n => `<li><b>${n}</b><span class="v">0</span><i></i><small></small></li>`).join('')}</ol></div>
      </div>`;
      const b = api.board;
      ui = { sent: $('.ng-sent', b), askB: $$('.ng-asks button', b), chips: $('.ng-chips', b), svg: $('.ng-map svg', b), pin: $('.ng-pin', b), ranks: $$('.ng-rank', b), cap: $('.ng-cap', b), info: $('.ng-info', b),
        rows: $$('.ng-row', b), presets: $$('.ng-presets button', b), sum: $('.ng-sum', b), top: $$('.ng-top li', b) };
      settle(0);
      const idle = () => !MACH.niaga.busy;
      ui.askB.forEach((x, i) => x.addEventListener('click', () => api.act(() => play(i))));
      ui.presets.forEach(x => x.addEventListener('click', () => { if (idle()) { setPreset(x.dataset.c); paintMap(); } }));
      ui.rows.forEach(r => {
        const k = r.dataset.k, inp = $('input', r);
        inp.addEventListener('input', () => {
          const next = idle() ? L.handleWeightChange(W, locked, k, +inp.value) : W;
          if (next === W && +inp.value !== W[k]) { paintWeights(); if (idle()) { shake(r); ui.info.textContent = 'No room: the locked weights already take the rest.'; } return; }
          W = next; ui.presets.forEach(p => p.setAttribute('aria-pressed', false)); paintWeights(); paintMap();
        });
        $('.ng-lock', r).addEventListener('click', () => { locked[k] = !locked[k]; paintWeights(); });
      });
      ui.svg.addEventListener('click', e => {
        const i = e.target.dataset && e.target.dataset.i; if (i == null || !idle()) return;
        const max = {}; KEYS.forEach(k => { max[k] = Math.max(...G.rows.map(r => r[k])); });
        ui.info.textContent = `This hexagon: ${G.sc[i].toFixed(1)} · ` + KEYS.map(k => `${N.labels[k]} ${(G.rows[i][k] / max[k]).toFixed(2)}`).join(' · ');
      });
    },
    reset() { settle(cur); },
    run() { return play(cur); },
  });
}
