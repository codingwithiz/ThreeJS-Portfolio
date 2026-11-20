import { $, $$, fast, sleep, flush, h, anim, popIn, fadeUp, ghost, draw, countTo, IO, dispose } from './util.js';
import { PROJECTS, cardFor } from './projects.js';
import { MACH, initMachines, skip, runMachine, AUTO, watchMachines, paintWork, show } from './core.js';
import './maxis.js';
import './iz.js';
import './crux.js';
import './bina.js';
import './flood.js';
import './niaga.js';
import './akar.js';
import './mach.css';

/* The page around the machines: the dealer, the score sheet, Play, and the command menu.
   React renders the markup (pages/Home.jsx); this file wires it up in boot() and lets go of it in destroy(). */
const SECTIONS = [['hand', 'the top'], ['machines', 'the work · seven machines'], ['dealer', 'ask about my work'], ['sheet', 'experience'], ['wins', 'awards'], ['refs', 'references'], ['writing', 'writing'], ['contact', 'contact'], ['receipt', 'the build receipt']];
let go = () => {}, resume = '';   // the router's navigate and the résumé link, handed in by boot()
export function goTo(t) {
  const el = typeof t === 'string' ? document.getElementById(t) : t; if (!el) return;
  if (el.classList.contains('mach')) show(el.id.slice(2));   // on a phone the machine may be behind another tab
  el.scrollIntoView({ behavior: fast() ? 'auto' : 'smooth', block: 'start' });
  if (typeof t === 'string') history.replaceState(history.state, '', '#' + t);
}
function onSeen(el, fn) {
  const io = IO(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn(); } }, { rootMargin: '0px 0px -6% 0px' });
  io.observe(el);
}

const miniCard = p => h('button', { class: 'card sm c-' + p.color, type: 'button', onclick: () => { goTo('m-' + p.id); runMachine(p.id); } },
  h('span', { class: 'card-no', text: p.no }), h('b', { class: 'card-f', text: p.front }), h('span', { class: 'card-u', text: p.unit }), h('span', { class: 'card-n', text: p.name + ' →' }));

/* ---------- the dealer: the site's real chat, with each step lit when it happens ---------- */
/* saved answers for the three set questions, shown only when the chat does not answer */
const DEAL = [
  { card: 'maxis', a: 'Two multi-agent systems on Amazon Bedrock, run by Step Functions. Five specialised agents and a master agent take a case from about 30 minutes to about 5, at 30–40 cases a day per agent.' },
  { card: 'bina', a: 'Bina. Experts write a small recipe; the app runs it on the phone with Gemma 4, fully offline (2.6 GB model on the device).' },
  { card: 'flood', a: 'UrbanFloodBench: 2nd of 264 teams, score 0.0157 against the winner’s 0.0120. The work is in a published paper.' },
];
const TN = 'What happens when you ask';
let dlTok = 0, dlStop = null;
async function ask(q, i = -1) {
  q = q.trim(); if (!q) return;
  const my = ++dlTok, steps = $$('.dl-trace li'), out = $('.dl-a'), slot = $('.dl-card'), tn = $('.dl-tn');
  const stale = () => my !== dlTok, lit = (k, c) => { steps[k].className = c; };
  if (dlStop) dlStop.abort();
  const stop = dlStop = new AbortController();
  $$('.dl-qs button').forEach((b, k) => b.setAttribute('aria-pressed', k === i));
  steps.forEach(s => { s.className = ''; }); slot.replaceChildren(); out.textContent = ''; out.setAttribute('aria-busy', 'true'); tn.textContent = TN;

  let text = '', live = true;
  try {
    lit(0, 'on');
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: q }] }), signal: stop.signal });
    if (!res.ok || !res.body) throw new Error('chat ' + res.status);
    lit(0, 'ok'); lit(1, 'on');
    const reader = res.body.getReader(), dec = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      if (!text) { lit(1, 'ok'); lit(2, 'on'); }
      text += dec.decode(value, { stream: true }); out.textContent = text;
    }
    if (!text.trim()) throw new Error('empty answer');
  } catch {
    if (stale()) return;   // a newer question took over
    live = false; steps.forEach(s => { s.className = ''; });
    if (i < 0) { out.textContent = 'The chat did not answer just now. Try one of the three questions above, or use the contact form further down.'; out.removeAttribute('aria-busy'); tn.textContent = 'The chat did not answer'; return; }
    tn.textContent = 'The chat did not answer, so this is a saved reply'; text = DEAL[i].a;
    for (let n = 2; n < text.length && !fast(); n += 2) { out.textContent = text.slice(0, n); await sleep(22); if (stale()) return; }
  }
  if (stale()) return;
  const id = i >= 0 ? DEAL[i].card : cardFor(text);
  out.textContent = text.replace(/^\s*Case study:.*$/gim, '').replace(/\n{3,}/g, '\n\n').trim(); out.removeAttribute('aria-busy');
  if (live) { lit(2, 'ok'); lit(3, 'on'); }
  const p = PROJECTS.find(x => x.id === id);
  if (!p) { if (live) lit(3, ''); return; }   // no single project in the answer: no card, and the last lamp stays off
  const c = miniCard(p);
  c.classList.add('pre'); slot.append(c);
  await ghost(miniCard(p), $('#dl-jk'), c, { size: false, scale: 1, fade: 1 });
  if (stale()) return;
  c.classList.remove('pre'); popIn(c, { duration: 220 }); if (live) lit(3, 'ok');
}

/* ---------- the score sheet: React drew it, this makes it count ---------- */
function initSheet() {
  $$('.tile').forEach((t, i) => onSeen(t, () => {
    fadeUp(t, { delay: (i % 4) * 50 });
    $$('.num[data-to]', t).forEach(n => {
      const d = n.dataset, dp = +d.dp || 0, pre = d.pre || '', suf = d.suf || '';
      countTo(n, +d.to, { from: +d.from || 0, duration: 1200, fmt: v => pre + (dp ? v.toFixed(dp) : Math.round(v).toLocaleString('en-MY')) + suf });
    });
    $$('.tly path', t).forEach((p, k) => draw(p, { duration: 240, delay: 250 + k * 90 }));
    $$('.ba i', t).forEach((b, k) => anim(b, [{ transform: 'scaleX(0)' }, {}], { duration: 900, delay: 250 + k * 250 }));
  }));
  $$('.win, .rc-l li').forEach((el, i) => onSeen(el, () => fadeUp(el, { delay: (i % 4) * 60 })));
}

/* ---------- Play: the table runs itself ---------- */
function setWork(open) { const pop = $('#work-pop'); if (!pop) return; pop.hidden = !open; $('#work-btn').setAttribute('aria-expanded', open); }
function setPlay(n) { $$('.js-play').forEach(b => { b.innerHTML = n ? `■ Stop<span class="w"> · ${n} of ${PROJECTS.length}</span>` : '▶ Play<span class="w"> the table</span>'; }); }
let playTok = 0;
async function stopTable() { if (!AUTO.on) return; AUTO.on = false; playTok++; setPlay(0); flush(); await skip(); }
async function playTable() {
  if (AUTO.on) return stopTable();
  const my = ++playTok, live = () => AUTO.on && my === playTok;
  AUTO.on = true; setWork(false);
  for (let i = 0; i < PROJECTS.length && live(); i++) {
    const id = PROJECTS[i].id; setPlay(i + 1);
    goTo(MACH[id].el); await sleep(900); if (!live()) break;
    await runMachine(id); if (!live()) break;
    await sleep(1200);
  }
  if (my === playTok) { AUTO.on = false; setPlay(0); }
}

/* ---------- ⌘K: also the phone menu ---------- */
const PAL = { wrap: null, input: null, list: null, items: [], sel: 0, from: null };
function palCommands() {
  return [
    { t: AUTO.on ? 'Stop the table' : 'Play the whole table', k: 'play', fn: playTable },
    ...PROJECTS.map(p => ({ t: `Run ${p.name} · ${p.title.toLowerCase()}`, k: 'machine ' + p.no, fn: async () => { await stopTable(); goTo('m-' + p.id); runMachine(p.id); } })),
    ...SECTIONS.map(([id, n]) => ({ t: 'Go to ' + n, k: 'go', fn: () => goTo(id) })),
    { t: 'Read the blog', k: 'page', fn: () => go('/blog') },
    { t: 'Open my résumé', k: 'pdf', fn: () => window.open(resume, '_blank', 'noopener') },
  ];
}
function palMark() {
  $$('li[role=option]', PAL.list).forEach((li, i) => { li.setAttribute('aria-selected', i === PAL.sel); if (i === PAL.sel) li.scrollIntoView({ block: 'nearest' }); });
  if (PAL.items.length) PAL.input.setAttribute('aria-activedescendant', 'pal-o' + PAL.sel); else PAL.input.removeAttribute('aria-activedescendant');
}
function palFilter() {
  const q = PAL.input.value.trim().toLowerCase();
  PAL.items = palCommands().filter(c => !q || (c.t + ' ' + c.k).toLowerCase().includes(q)); PAL.sel = 0;
  PAL.list.replaceChildren(...(PAL.items.length
    ? PAL.items.map((c, i) => h('li', { role: 'option', id: 'pal-o' + i, 'data-i': i }, c.t, h('span', { text: c.k })))
    : [h('li', { class: 'none', text: 'Nothing matches. Try “run”, “go” or a project name.' })]));
  palMark();
}
function palClose() { if (!PAL.wrap || PAL.wrap.hidden) return; PAL.wrap.hidden = true; if (PAL.from && PAL.from.focus) PAL.from.focus({ preventScroll: true }); }
function palRun(i) { const c = PAL.items[i]; if (!c) return; palClose(); c.fn(); }
function palKey(e) {
  const n = PAL.items.length;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (n) { PAL.sel = (PAL.sel + (e.key === 'ArrowDown' ? 1 : n - 1)) % n; palMark(); } }
  else if (e.key === 'Enter') { e.preventDefault(); palRun(PAL.sel); }
  else if (e.key === 'Escape') { e.preventDefault(); palClose(); }
  else if (e.key === 'Tab') e.preventDefault();   // one focusable thing inside, so focus stays in the dialog
}
function palOpen() {
  if (!PAL.wrap) {
    PAL.input = h('input', { class: 'pal-in', type: 'text', placeholder: 'Type a command or a project…', 'aria-label': 'Command', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': 'pal-list', 'aria-autocomplete': 'list', autocomplete: 'off', spellcheck: 'false' });
    PAL.list = h('ul', { class: 'pal-list', id: 'pal-list', role: 'listbox', 'aria-label': 'Commands' });
    PAL.wrap = h('div', { class: 'pal-wrap', hidden: true }, h('div', { class: 'pal', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Command menu' }, PAL.input, PAL.list, h('p', { class: 'pal-hint', text: '↑ ↓ to move · Enter to run · Esc to close' })));
    document.body.append(PAL.wrap);   // .proto is a container, which would trap position:fixed
    PAL.wrap.addEventListener('mousedown', e => { if (e.target === PAL.wrap) palClose(); });
    PAL.input.addEventListener('input', palFilter);
    PAL.wrap.addEventListener('keydown', palKey);
    PAL.list.addEventListener('click', e => { const li = e.target.closest('li[role=option]'); if (li) palRun(+li.dataset.i); });
  }
  PAL.from = document.activeElement; PAL.wrap.hidden = false; PAL.input.value = ''; palFilter();
  /* on a touch screen this is a menu: do not raise the keyboard until the visitor taps the field */
  if (matchMedia('(pointer: coarse)').matches) { PAL.list.tabIndex = -1; PAL.list.focus({ preventScroll: true }); } else PAL.input.focus({ preventScroll: true });
}

/* Opening a case study: the machine's numbered chip grows into the case page's card, which is the same colour
   (index.css gives .case-card the same view-transition-name). Without View Transitions, or with reduced motion, it is a plain route change. */
function openPage(a) {
  const to = a.getAttribute('href'), chip = a.closest('.mach')?.querySelector('.mach-no');
  if (!document.startViewTransition || fast() || !chip) return go(to);
  chip.style.viewTransitionName = 'card';
  /* React draws the new page on its own schedule; frames are paused during the capture, so watch the DOM, not rAF */
  const vt = document.startViewTransition(() => new Promise(done => {
    const mo = new MutationObserver(() => { if (document.querySelector('.case-card')) { mo.disconnect(); clearTimeout(t); done(); } });
    const t = setTimeout(() => { mo.disconnect(); done(); }, 800);
    mo.observe(document.body, { childList: true, subtree: true });
    go(to);
  }));
  vt.ready.catch(() => {});   // a skipped transition is fine: the route change still happened
}

/* ---------- mount and unmount (the home page comes and goes with the route) ---------- */
let ac = null, down = Promise.resolve();
export async function boot(o = {}) {
  const mine = ac = new AbortController(), { signal } = mine, on = (el, ev, fn) => el && el.addEventListener(ev, fn, { signal });
  await down;   // a previous visit may still be letting go of a running machine
  if (signal.aborted) return;
  go = o.navigate; resume = o.resume;
  initSheet(); initMachines($('#mach-host')); paintWork();
  await Promise.all(Object.values(MACH).map(m => m.ready));   // the Maxis board paints its resting picture under turbo; wait before anything animates
  if (signal.aborted) return;

  $$('.js-play').forEach(b => on(b, 'click', playTable));
  $$('.dl-qs button').forEach(b => on(b, 'click', () => ask(b.textContent, +b.dataset.q)));
  on($('#dl-f'), 'submit', e => { e.preventDefault(); const f = $('#dl-in'); ask(f.value); f.value = ''; });
  on($('#work-btn'), 'click', () => setWork($('#work-pop').hidden));
  on($('#k-btn'), 'click', palOpen);
  on(document, 'click', e => {
    const a = e.target.closest('a[href^="#"]:not(.skip)'), r = e.target.closest('a[data-route]');
    if (a) { e.preventDefault(); goTo(a.getAttribute('href').slice(1)); }
    else if (r && !e.ctrlKey && !e.metaKey && !e.shiftKey) { e.preventDefault(); openPage(r); }
    if (!e.target.closest('#work-pop,#work-btn')) setWork(false);
  });
  on(document, 'keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); PAL.wrap && !PAL.wrap.hidden ? palClose() : palOpen(); }
    else if (e.key === 'Escape') setWork(false);
  });
  const io = IO(es => es.forEach(e => e.target.classList.toggle('is-off', !e.isIntersecting)));   // loops only run while they are on screen
  $$('[data-live]').forEach(el => io.observe(el));
  watchMachines();
  if (location.hash.length > 1) goTo(location.hash.slice(1));   // a link straight to a machine: it did not exist when the page first scrolled
}
export function destroy() {
  if (!ac) return;
  ac.abort(); ac = null; dlTok++; if (dlStop) dlStop.abort();
  down = (async () => {
    Object.values(MACH).forEach(m => { m.seen = false; });   // so a queued auto-run does not start on a page that is gone
    await stopTable(); await skip(); dispose();
    if (PAL.wrap) { PAL.wrap.remove(); PAL.wrap = null; }
    $$('body > .ghost').forEach(g => g.remove());
  })();
}
