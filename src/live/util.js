
/* Small helpers. Rule for every animation on this page: it animates INTO the element's resting style,
   so skipping it (reduced motion, Skip button) leaves the right final picture with no extra code. */
export const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const RMQ = matchMedia('(prefers-reduced-motion: reduce)');
export const T = { speed: 1, turbo: false };
export const fast = () => T.turbo || RMQ.matches;
export const EASE = 'cubic-bezier(.2,.8,.2,1)';
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const rm = n => 'RM' + (Number.isInteger(n) ? n.toLocaleString('en-MY') : n.toFixed(2));
export const raf = () => new Promise(r => requestAnimationFrame(r));

export const pend = new Set();   // sleepers and click-waiters, so Skip can release them at once
export const sleep = ms => fast() ? Promise.resolve() : new Promise(res => {
  const done = () => { clearTimeout(t); pend.delete(done); res(); };
  const t = setTimeout(done, ms / T.speed); pend.add(done);
});
export function flush() {
  [...pend].forEach(f => f());
  document.getAnimations().forEach(a => { try { if (a.effect.getComputedTiming().iterations !== Infinity) a.finish(); } catch { /* not finishable */ } });
}
/* resolves on a click, or when the run is skipped */
export const clicked = btn => new Promise(res => {
  const done = () => { btn.removeEventListener('click', done); pend.delete(done); res(); };
  btn.addEventListener('click', done); pend.add(done);
});

/* observers register here, so leaving the page can disconnect them all */
const seen = new Set(), keep = o => { seen.add(o); return o; };
export const RO = fn => keep('ResizeObserver' in window ? new ResizeObserver(fn) : { observe() {}, disconnect() {} });
export const IO = (fn, o) => keep(new IntersectionObserver(fn, o));
export function dispose() { seen.forEach(o => o.disconnect()); seen.clear(); }

export function add(el, kids) { for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(k)); return el; }
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const k in props || {}) {
    const v = props[k];
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'text') el.textContent = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  return add(el, kids);
}
export function sv(tag, attrs, ...kids) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs || {}) if (attrs[k] != null) k === 'text' ? el.textContent = attrs[k] : el.setAttribute(k, attrs[k]);
  return add(el, kids);
}

export function anim(el, frames, o = {}) {
  if (!el || fast()) return Promise.resolve();
  const a = el.animate(frames, { duration: (o.duration ?? 420) / T.speed, delay: (o.delay ?? 0) / T.speed, easing: o.easing ?? EASE, fill: o.fill ?? 'backwards', iterations: o.iterations ?? 1 });
  return a.finished.catch(() => {});
}
export const popIn = (el, o) => anim(el, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 320, ...o });
export const fadeUp = (el, o) => anim(el, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 360, ...o });
export const shake = el => anim(el, [0, -7, 7, -5, 5, -2, 0].map(x => ({ transform: `translateX(${x}px)` })), { duration: 380, easing: 'linear' });
export function stamp(el) { el.hidden = false; return anim(el, [{ opacity: 0, transform: 'scale(2.6) rotate(-22deg)' }, { opacity: 1, transform: 'scale(.92) rotate(-7deg)', offset: .7 }, {}], { duration: 380, easing: 'cubic-bezier(.3,1.4,.5,1)' }); }
/* an element already sitting in its new place slides there from where it used to be */
export function flip(el, from, o = {}) {
  const to = el.getBoundingClientRect(); if (!to.width || !from.width) return Promise.resolve();
  return anim(el, [{ transformOrigin: '0 0', transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})` }, { transformOrigin: '0 0', transform: 'none' }], { duration: 460, ...o });
}
export const rectOf = x => x.getBoundingClientRect ? x.getBoundingClientRect() : x;
/* a copy of something flies from A to B on a small arc. It lives on <body>: .proto is a container, which would trap position:fixed. */
export function ghost(node, from, to, o = {}) {
  if (fast()) return Promise.resolve();
  const a = rectOf(from), b = rectOf(to);
  if (!a.width || !b.width) return Promise.resolve();
  node.classList.add('ghost');
  node.style.left = a.left + 'px'; node.style.top = a.top + 'px';
  if (o.size !== false) { node.style.width = a.width + 'px'; node.style.height = a.height + 'px'; }
  document.body.append(node);
  const n = node.getBoundingClientRect();
  const dx = b.left + b.width / 2 - (n.left + n.width / 2), dy = b.top + b.height / 2 - (n.top + n.height / 2);
  const s = o.scale ?? clamp(Math.min(b.width / n.width, b.height / n.height), .3, 1), lift = o.lift ?? Math.min(80, 24 + Math.hypot(dx, dy) * .16);
  return anim(node, [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx / 2}px,${dy / 2 - lift}px) scale(${(1 + s) / 2})`, opacity: 1, offset: .5 }, { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: o.fade ?? .25 }],
    { duration: o.duration ?? 620, delay: o.delay, easing: 'cubic-bezier(.45,0,.3,1)', fill: 'both' }).then(() => node.remove());
}
export const gchip = (text, cls) => h('div', { class: 'gchip ' + (cls || ''), text });
/* a fingertip lands on a control, so a press the page makes for you is still seen */
export function tapOn(el) {
  if (fast() || !el) return Promise.resolve();
  const r = el.getBoundingClientRect(), d = h('i', { class: 'ghost tapdot', style: `left:${r.left + r.width / 2 - 17}px;top:${r.top + r.height / 2 - 17}px` });
  document.body.append(d);
  anim(el, [{ transform: 'none' }, { transform: 'scale(.93)', offset: .5 }, { transform: 'none' }], { duration: 300, delay: 170 });
  return anim(d, [{ opacity: 0, transform: 'translate(16px,26px) scale(1.3)' }, { opacity: 1, transform: 'none', offset: .45 }, { opacity: 1, transform: 'scale(.78)', offset: .62 }, { opacity: 0, transform: 'scale(1.6)' }], { duration: 560, fill: 'both' }).then(() => d.remove());
}
/* a dot rides an SVG path */
export function along(path, dot, o = {}) {
  if (fast()) return Promise.resolve();
  const len = path.getTotalLength(), dur = (o.duration ?? 800) / T.speed, t0 = performance.now() + (o.delay ?? 0) / T.speed;
  return new Promise(res => (function tick(now) {
    if (T.turbo) return res();
    const t = clamp((now - t0) / dur, 0, 1), p = path.getPointAtLength(len * (o.linear ? t : t * t * (3 - 2 * t)));
    dot.setAttribute('transform', `translate(${p.x} ${p.y})`); dot.style.opacity = now < t0 ? 0 : 1;
    t < 1 ? requestAnimationFrame(tick) : res();
  })(performance.now()));
}
export function draw(path, o = {}) {
  const len = path.getTotalLength ? path.getTotalLength() : 0; if (!len) return Promise.resolve();
  return anim(path, [{ strokeDasharray: len, strokeDashoffset: len }, { strokeDasharray: len, strokeDashoffset: 0 }], { duration: 700, easing: 'cubic-bezier(.4,0,.2,1)', ...o });
}
export function countTo(el, to, o = {}) {
  const fmt = o.fmt || (v => Math.round(v).toLocaleString('en-MY')), from = o.from ?? (parseFloat(el.dataset.v) || 0);
  el.dataset.v = to;
  if (fast() || from === to) { el.textContent = fmt(to); return Promise.resolve(); }
  const dur = (o.duration ?? 700) / T.speed, t0 = performance.now();
  return new Promise(res => (function tick(now) {
    const t = T.turbo ? 1 : clamp((now - t0) / dur, 0, 1);
    el.textContent = fmt(lerp(from, to, 1 - Math.pow(1 - t, 3)));
    t < 1 ? requestAnimationFrame(tick) : res();
  })(t0));
}
export async function typeInto(el, text, cps = 45) {
  if (fast()) { el.textContent = text; return; }
  el.textContent = '';
  for (let i = 0; i < text.length; i += 2) { el.textContent = text.slice(0, i + 2); await sleep(2000 / cps); if (T.turbo) break; }
  el.textContent = text;
}
/* calls fn(0..1) every frame; lands on fn(1) at once when skipped */
export async function tween(ms, fn) {
  if (fast()) return fn(1);
  const t0 = performance.now();
  for (;;) { await raf(); const t = fast() ? 1 : Math.min((performance.now() - t0) / ms * T.speed, 1); fn(t); if (t >= 1) return; }
}
/* seeded random, for the sample fields */
export function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
