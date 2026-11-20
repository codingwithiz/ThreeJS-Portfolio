import { $, $$, T, flush, h, anim, fast, IO } from './util.js';
import { PROJECTS, BADGE } from './projects.js';

/* The machine registry: every project demo is { build, run, reset } inside the same frame. */
export const MACH = {};
export let CUR = null;
export const WORK = { total: 0, by: {} };

export function defMachine(id, def) { MACH[id] = { id, runs: 0, busy: false, ok: false, ...def }; }

export function frame(p) {
  const el = h('section', { class: 'mach c-' + p.color, id: 'm-' + p.id, 'aria-labelledby': 'mt-' + p.id },
    h('header', { class: 'mach-h' },
      h('div', { class: 'mach-no', text: p.no }),
      h('div', { class: 'mach-t' }, h('p', { class: 'mach-k', text: p.name }), h('h3', { id: 'mt-' + p.id, text: p.title }), h('p', { class: 'mach-u', text: p.usp }), p.stack && h('ul', { class: 'mach-s', 'aria-label': 'Built with' }, p.stack.map(t => h('li', { text: t })))),
      h('div', { class: 'mach-f' }, h('b', { text: p.front }), h('span', { text: p.unit }))),
    h('div', { class: 'mach-bar' },
      p.badges.map(b => h('span', { class: 'badge b-' + b, text: BADGE[b] })),
      h('span', { class: 'mach-links' },
        p.slug && h('a', { href: '/work/' + p.slug, 'data-route': true, text: 'Case study →' }),
        (p.slug ? p.links.filter(([t]) => t === 'Code') : p.links).map(([t, u]) => h('a', { href: u, target: '_blank', rel: 'noopener', text: t + ' ↗' })))),
    h('div', { class: 'board' }),
    h('footer', { class: 'mach-ft' },
      h('div', { class: 'mach-ctl' },
        h('button', { class: 'btn run', type: 'button', text: 'Run it' }),
        h('button', { class: 'btn quiet skip', type: 'button', text: 'Skip to the end', hidden: true })),
      h('p', { class: 'say', role: 'status', 'aria-live': 'polite', text: 'Ready.' }),
      h('p', { class: 'port', text: p.port }),
      next(p)));
  return el;
}
/* the way on to the next machine, since the page shows one at a time */
function next(p) {
  const n = PROJECTS[PROJECTS.indexOf(p) + 1];
  return n
    ? h('a', { class: 'mach-next c-' + n.color, href: '#m-' + n.id }, h('span', { text: 'Next machine' }), h('b', { text: `${n.no} ${n.name} →` }))
    : h('a', { class: 'mach-next c-amber', href: '#dealer' }, h('span', { text: 'That was all seven' }), h('b', { text: 'On to the dealer ↓' }));
}

/* One machine shows at a time (`is-on`); the tabs, the cards, the menu and Play all come through here. */
export function show(id) {
  const el = $('#m-' + id); if (!el || el.classList.contains('is-on')) return;
  $$('.mach.is-on').forEach(m => m.classList.remove('is-on'));
  el.classList.add('is-on'); build(MACH[id]);
  $$('.mach-tabs button').forEach(b => {
    const on = b.dataset.id === id; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
    if (on && b.parentElement.scrollWidth > b.parentElement.clientWidth) b.parentElement.scrollTo({ left: b.offsetLeft - (b.parentElement.clientWidth - b.offsetWidth) / 2, behavior: fast() ? 'auto' : 'smooth' });
  });
  anim(el, [{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });
}
/* A board is built the first time it is shown or run, so the page starts with one machine's work, not seven. */
function build(m) {
  if (!m || m.built || !m.api) return; m.built = true;
  try { m.build(m.api); m.ok = true; }
  catch (e) { console.error(e); m.api.board.append(h('p', { class: 'broke', text: 'This demo failed to load: ' + e.message })); }
}
function tabs() {
  return h('div', { class: 'mach-tabs', role: 'tablist', 'aria-label': 'Machines' },
    PROJECTS.map((p, i) => h('button', { class: 'c-' + p.color, type: 'button', role: 'tab', id: 'mtab-' + p.id, 'data-id': p.id, 'aria-controls': 'm-' + p.id, 'aria-selected': String(i === 0), tabindex: i ? '-1' : '0' },
      h('i', { text: p.no }), h('span', { class: 't-n', text: p.name }), h('small', { text: p.title }))));
}

export function initMachines(host) {
  host.replaceChildren(tabs());   // the home page can mount more than once (route changes, StrictMode)
  for (const p of PROJECTS) {
    const m = MACH[p.id], el = frame(p); host.append(el);
    el.setAttribute('aria-labelledby', 'mtab-' + p.id + ' mt-' + p.id);
    if (p === PROJECTS[0]) el.classList.add('is-on');
    if (!m) { $('.board', el).textContent = 'This demo is missing.'; continue; }
    m.p = p; m.el = el; m.runs = 0; m.busy = false; m.ok = false; m.seen = false; m.built = false; m.ready = undefined;
    const say = $('.say', el);
    m.api = {
      el, board: $('.board', el),
      say: t => { say.textContent = t; },
      work: (n, label) => addWork(p, n, label),
      /* a visitor-triggered action: ends any run in progress first, then owns the machine until it finishes */
      act: async fn => { if (CUR) await skip(); await own(m, fn); },
    };
    if (p === PROJECTS[0]) build(m);
    $(`#mtab-${p.id}`, host).addEventListener('click', () => { show(p.id); if (host.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: fast() ? 'auto' : 'smooth' }); history.replaceState(history.state, '', '#m-' + p.id); });
    $('.run', el).addEventListener('click', () => runMachine(p.id));
    $('.skip', el).addEventListener('click', skip);
  }
  $('.mach-tabs', host).addEventListener('keydown', e => {   // arrow keys move along the tabs, as a tab list should
    const bs = $$('button', e.currentTarget), d = { ArrowRight: 1, ArrowLeft: -1, Home: -99, End: 99 }[e.key];
    if (!d) return; e.preventDefault();
    const b = bs[Math.max(0, Math.min(bs.length - 1, bs.indexOf(document.activeElement) + d))]; b.focus(); b.click();
  });
}
export async function own(m, fn) {
  const tab = $('#mtab-' + m.id);
  m.busy = true; CUR = m; m.el.classList.add('is-running'); tab?.classList.add('is-running'); $('.skip', m.el).hidden = false; $('.run', m.el).disabled = true;
  m.promise = (async () => {
    try { await fn(); }
    catch (e) { console.error(e); m.api.say('This demo hit an error: ' + e.message); }
    finally { m.busy = false; T.turbo = false; CUR = null; m.el.classList.remove('is-running'); tab?.classList.remove('is-running'); if (m.runs) tab?.classList.add('has-run'); $('.skip', m.el).hidden = true; const b = $('.run', m.el); b.disabled = false; b.textContent = m.runs ? 'Replay' : 'Run it'; }
  })();
  return m.promise;
}
export function skip() { const m = CUR; if (!m) return Promise.resolve(); T.turbo = true; flush(); return m.promise; }
export async function runMachine(id) {
  const m = MACH[id]; build(m); if (!m || !m.ok) return;
  if (m.busy) return m.promise;
  if (CUR) await skip();
  return own(m, async () => { m.runs++; m.el.classList.add('has-run'); if (m.reset) await m.reset(m.api); await m.run(m.api); });
}

export function addWork(p, n, label) {
  WORK.total += n; const w = WORK.by[p.id] || (WORK.by[p.id] = { name: p.name, n: 0, label }); w.n += n; w.label = label;
  if (paintWork()) anim($('#work-n'), [{ transform: 'translateY(-5px)', color: '#FFD23F' }, { transform: 'none' }], { duration: 300 });
}
/* the count outlives the page, so coming back to the table shows what already ran */
export function paintWork() {
  const out = $('#work-n'); if (!out) return false;
  out.textContent = WORK.total.toLocaleString('en-MY');
  const rc = $('#rc-work'); if (rc) rc.textContent = out.textContent;
  $('#work-list').replaceChildren(...Object.values(WORK.by).map(w => h('li', {}, h('b', { text: w.n.toLocaleString('en-MY') }), ' ' + w.label, h('span', { text: w.name }))));
  return true;
}

/* first time a machine scrolls into view it runs once, one machine at a time */
export let autoChain = Promise.resolve();
export const AUTO = { on: false };
export function watchMachines() {
  if (!('IntersectionObserver' in window)) return;
  const io = IO(es => es.forEach(e => {
    const id = e.target.closest('.mach').id.slice(2), m = MACH[id];
    const seen = e.isIntersecting && (e.intersectionRatio >= .45 || e.intersectionRect.height >= innerHeight * .55);
    m.seen = seen;
    if (!seen || m.runs || AUTO.on) return;
    setTimeout(() => { if (m.seen && !m.runs && !AUTO.on) autoChain = autoChain.then(() => (m.seen && !m.runs && !AUTO.on && !CUR) ? runMachine(id) : null); }, 400);
  }), { threshold: [0, .2, .45, .7] });
  $$('.mach .board').forEach(b => io.observe(b));
}
