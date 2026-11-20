import { $, $$, fast, esc, sleep, h, anim, popIn, fadeUp, stamp, ghost, gchip, tapOn } from './util.js';
import { L } from './logic.js';
import { D } from './data.js';
import { MACH, defMachine } from './core.js';

/* Bina · recipe to app. The YAML is a real screen; what shows, what a label says and what the button sends all come from the ported VariableStore. */
{
  const B = D.bina;
  const WHAT = ['a heading', 'a camera tile', 'a checklist bound to visit_step', 'a progress bar, total 6', 'a button that adds 1 to visit_step', 'a button that only shows at step 6', 'where the model’s answer streams in'];
  let ui, store, lang, offline, API;

  const setLang = l => { lang = l; for (const k in B.labels[l]) store.state['l10n.' + k] = B.labels[l][k]; };
  const t = k => store.interpolate('{{l10n.' + k + '}}');
  const code = s => esc(s).replace(/^(\s*(?:- )?)([a-z_]+)(:)/, '$1<b>$2</b>$3').replace(/(&quot;.*&quot;)/, '<i>$1</i>').replace(/(\{\{[\w.]+\}\})/g, '<u>$1</u>');

  function paintPrompt() {
    const full = store.interpolate(B.ask), at = B.ask.indexOf('{{gest_age}}'), n = store.state.gest_age.length;
    ui.prompt.replaceChildren(full.slice(0, at), h('mark', { text: full.slice(at, at + n) }), full.slice(at + n));
  }
  function paint() {   // every label, tick and visibility is read back from the store
    const n = +store.state.visit_step, vis = store.isTrue(B.visibleIf);
    ui.title.textContent = t('visit_title');
    ui.items.forEach((li, i) => { $('span', li).textContent = t('visit_step' + (i + 1)); li.classList.toggle('on', i < n); });
    ui.bar.style.setProperty('--f', Math.min(n / 6, 1)); ui.barN.textContent = Math.min(n, 6) + ' / 6';
    ui.next.textContent = t('visit_next'); ui.next.disabled = n >= 6;   // ponytail: the page stops at 6 to keep the demo tidy
    ui.sum.textContent = vis ? t('visit_summary') : 'hidden · visible_if is false';
    ui.sum.disabled = !vis; ui.sum.classList.toggle('off', !vis);
    ui.step.textContent = n; ui.vis.textContent = vis; ui.vis.className = vis ? 't' : 'f';
    ui.langB.forEach(b => b.setAttribute('aria-pressed', b.dataset.l === lang));
    ui.air.setAttribute('aria-pressed', offline); ui.pill.hidden = !offline;
    paintPrompt();
  }
  function asked(yes) {
    ui.out.textContent = yes ? 'The model writes the visit note here, on the phone. This page does not fake its words.' : 'ai_response is empty. Nothing has been asked yet.';
    ui.out.classList.toggle('on', yes); ui.gemma.classList.toggle('on', yes);
  }
  const show = line => ui.pre.scrollTo({ top: line.offsetTop - 30, behavior: fast() ? 'auto' : 'smooth' });
  function step() {
    const was = store.isTrue(B.visibleIf);
    store.increment('visit_step'); paint();
    const n = +store.state.visit_step; if (n <= 6) popIn($('i', ui.items[n - 1]));
    if (!was && store.isTrue(B.visibleIf)) {
      const l = ui.lines.find(x => x.classList.contains('vis')); l.classList.add('hl'); show(l);
      popIn(ui.sum); anim(ui.vis, [{ background: '#3DDC97', color: '#14110F' }, {}], { duration: 900 });
      API.say('visit_step reached 6, so visible_if turned true and the summary button appeared.');
    }
  }
  async function ask() {
    ui.prompt.classList.remove('pre'); await fadeUp(ui.prompt);
    anim($('mark', ui.prompt), [{ transform: 'scale(1.5)' }, { transform: 'none' }], { duration: 500 }); await sleep(500);
    await ghost(gchip('prompt', 'g-bina'), ui.prompt, ui.gemma, { size: false, scale: 1, duration: 620 });
    asked(true); anim(ui.gemma, [{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 420 }); popIn(ui.out);
    API.say('The prompt goes to Gemma 4 on the phone itself. No server, no signal.');
  }
  function fresh() {
    store = new L.VariableStore(B.defaults); store.state.gest_age = ui.age.value || B.defaults.gest_age;
    offline = false; setLang('ms'); asked(false); paint();
    ui.w.forEach(w => w.classList.remove('pre')); ui.prompt.classList.remove('pre'); ui.lines.forEach(l => l.classList.remove('hl')); ui.pre.scrollTop = 0;
  }

  defMachine('bina', {
    build(api) {
      API = api;
      api.board.innerHTML = `<div class="bn">
        <div class="bn-code"><p class="lab">The recipe <span>one real screen from bidan_pintar.yaml</span></p>
          <pre class="bn-yaml" tabindex="0" aria-label="YAML recipe">${B.yaml.map(([s, w, f]) => `<span class="l ${f || ''}" data-w="${w}">${code(s)}</span>`).join('')}</pre>
          <p class="bn-insp"><code>visit_step = <b class="bn-step">0</b></code><code>visible_if "visit_step &gt;= 6" → <b class="bn-vis f">false</b></code>
            <label><code>gest_age =</code><input class="bn-age" type="number" inputmode="numeric" min="1" max="45" value="${B.defaults.gest_age}" aria-label="Gestational age in weeks"></label></p></div>
        <div class="bn-phone">
          <div class="bn-bar"><button class="bn-air" type="button" aria-pressed="false" aria-label="Airplane mode"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></button>
            <span class="bn-pill" hidden>Offline</span>
            <span class="bn-lang" role="group" aria-label="Language"><button type="button" data-l="ms">BM</button><button type="button" data-l="en">EN</button></span></div>
          <div class="bn-screen">
            <h4 class="bn-w"></h4>
            <div class="bn-w bn-cam" role="img" aria-label="Camera input"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l2-2h6l2 2h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg></div>
            <ul class="bn-w bn-list">${'<li><i></i><span></span></li>'.repeat(6)}</ul>
            <div class="bn-w bn-prog"><div><i></i></div><span>0 / 6</span></div>
            <button class="bn-w bn-next" type="button"></button>
            <button class="bn-w bn-sum" type="button"></button>
            <p class="bn-w bn-out"></p>
          </div></div>
        <div class="bn-ai"><p class="lab">What the last button sends <span>filled in by the app’s own interpolate()</span></p>
          <p class="bn-prompt"></p>
          <div class="bn-gemma"><b>Gemma 4 E2B</b><span>runs on this phone · 2.6 GB · no internet</span></div>
          <p class="note">Change gest_age under the recipe and the prompt changes with it.</p></div>
      </div>`;
      const b = api.board;
      ui = { pre: $('.bn-yaml', b), lines: $$('.bn-yaml .l', b), step: $('.bn-step', b), vis: $('.bn-vis', b), age: $('.bn-age', b), air: $('.bn-air', b), pill: $('.bn-pill', b), langB: $$('.bn-lang button', b),
        w: $$('.bn-w', b), title: $('h4.bn-w', b), items: $$('.bn-list li', b), bar: $('.bn-prog', b), barN: $('.bn-prog span', b), next: $('.bn-next', b), sum: $('.bn-sum', b), out: $('.bn-out', b), prompt: $('.bn-prompt', b), gemma: $('.bn-gemma', b) };
      fresh();
      const idle = fn => () => { if (!MACH.bina.busy) fn(); };
      ui.next.addEventListener('click', idle(step));
      ui.air.addEventListener('click', idle(() => { offline = !offline; paint(); if (offline) stamp(ui.pill); }));
      ui.langB.forEach(x => x.addEventListener('click', idle(() => { setLang(x.dataset.l); paint(); })));
      ui.sum.addEventListener('click', idle(() => api.act(ask)));
      ui.age.addEventListener('input', () => { const v = parseInt(ui.age.value, 10); if (v >= 1 && v <= 45) { store.state.gest_age = String(v); paintPrompt(); } });
    },
    reset() { fresh(); },
    async run(api) {
      ui.w.forEach(w => w.classList.add('pre')); ui.prompt.classList.add('pre');
      api.say('One YAML file describes the whole app. The phone reads it top to bottom.'); await sleep(600);
      for (let i = 0; i < 7; i++) {
        const ls = ui.lines.filter(l => +l.dataset.w === i);
        ls.forEach(l => l.classList.add('hl')); show(ls[0]); await sleep(280);
        await ghost(gchip(B.widgets[i], 'g-bina'), ls[0], ui.w[i], { size: false, scale: 1, duration: 480 });
        ui.w[i].classList.remove('pre'); popIn(ui.w[i]); api.work(1, 'widgets built'); api.say(`${B.widgets[i]}: ${WHAT[i]}.`);
        await sleep(320); ls.forEach(l => l.classList.remove('hl'));
      }
      api.say(`Seven widgets from ${B.yaml.length} lines. Now switch the internet off.`); await sleep(500);
      await tapOn(ui.air); offline = true; paint(); await stamp(ui.pill); await sleep(450);
      api.say('Same recipe, another language. Only the label table changes.');
      await tapOn(ui.langB[1]); setLang('en'); paint(); ui.w.slice(0, 5).forEach(w => anim(w, [{ opacity: .2 }, { opacity: 1 }], { duration: 380 })); await sleep(650);
      api.say('Each tap adds 1 to visit_step.');
      for (let n = 1; n <= 6; n++) { await tapOn(ui.next); step(); await sleep(n < 3 ? 260 : 130); }
      await sleep(900); await tapOn(ui.sum); await ask();
    },
  });
}
