import { RO, $, $$, T, sleep, anim, popIn, fadeUp, shake, stamp, ghost, gchip, tween } from './util.js';
import { D } from './data.js';
import { defMachine } from './core.js';

/* Maxis agents · the relay. The shape is the real one: a master step decides who runs next, five agents do one job each, then the record is updated.
   Everything shown on the form is made up. No real document, prompt or field name is on this page. */
{
  const M = D.maxis, KINDS = [['clean', 'Clean form'], ['smudge', 'Smudged scan'], ['mismatch', 'Details don’t match']];
  let ui, API, at = -1;

  const spot = i => { const a = (i < 0 ? ui.hub : $('i', ui.st[i])).getBoundingClientRect(), r = ui.rail.getBoundingClientRect(); const k = i < 0 ? 0 : 15; return [a.left + a.width / 2 - r.left + k, a.top + a.height / 2 - r.top - k]; };
  function place(i) { at = i; const [x, y] = spot(i); ui.tok.style.left = x + 'px'; ui.tok.style.top = y + 'px'; }
  async function hop(i) {   // the case travels: it sits at its new place and animates in from the old one
    const [x0, y0] = spot(at); place(i); const [x1, y1] = spot(i), dx = x0 - x1, dy = y0 - y1;
    await anim(ui.tok, [{ transform: `translate(${dx}px,${dy}px)` }, { transform: `translate(${dx / 2}px,${dy / 2 - 16}px) scale(1.35)`, offset: .5 }, { transform: 'none' }], { duration: 300, easing: 'cubic-bezier(.45,0,.3,1)' });
  }
  function setRace(min) {
    ui.ai.style.setProperty('--f', (Math.min(min, 5) / 30).toFixed(4)); ui.me.style.setProperty('--f', (min / 30).toFixed(4));
    ui.ai.classList.toggle('done', min >= 5); ui.me.classList.toggle('done', min >= 30);
    ui.clock.textContent = Math.round(min);
  }
  function clear(kind) {
    ui.pick.forEach(b => b.setAttribute('aria-pressed', b.dataset.k === kind));
    ui.st.forEach(s => { s.className = ''; }); ui.checks.forEach(c => { c.className = ''; });
    ui.doc.className = 'mx-doc scan'; ui.stamp.hidden = ui.done.hidden = ui.rej.hidden = ui.chute.hidden = true;
    ui.dd[2].classList.toggle('smudge', kind === 'smudge');
    ui.type.textContent = '—';
    ui.rows.forEach(r => { r.className = 'mx-r'; $('.d', r).textContent = $('.c', r).textContent = ''; });
    place(-1);
  }

  /* one case through the relay. quiet = paint the finished picture without talking or counting */
  async function play(kind, quiet) {
    const say = t => { if (!quiet) API.say(t); }, work = () => { if (!quiet) API.work(1, 'agent steps'); };
    const go = async (i, t) => { await hop(i); ui.st[i].className = 'on'; say(t); };
    const pass = async i => { ui.st[i].className = 'ok'; work(); await hop(-1); };
    const fail = async (i, why) => {
      ui.st[i].className = 'no'; shake(ui.st[i]); await hop(-1);
      ui.st.slice(i + 1).forEach(s => { s.className = 'skip'; });
      ui.why.textContent = why; ui.chute.hidden = false;
      await ghost(gchip('the form', 'g-mx'), ui.doc, ui.chute, { size: false, scale: 1 });
      fadeUp(ui.chute); stamp(ui.rej);
      say('The master step stops the relay and hands the case to a person. ' + why);
    };
    clear(kind);
    say('A form arrives. The master step decides who works on it next.'); await sleep(600);

    await go(0, 'Convert: the scan becomes text the other agents can read.');
    ui.doc.classList.remove('scan');
    await anim(ui.beam, [{ top: '0%', opacity: 1 }, { top: '100%', opacity: 1 }], { duration: 760, easing: 'linear' });
    await pass(0);

    await go(1, 'Classify: which kind of document is this?');
    ui.stamp.hidden = false;
    for (let k = 1; k < 9; k++) { ui.stamp.textContent = M.types[k % 3]; await sleep(80); }
    ui.stamp.textContent = ui.type.textContent = M.types[0]; await stamp(ui.stamp);
    await pass(1);

    await go(2, 'Validate: is it complete, readable and signed?');
    for (let k = 0; k < 3; k++) {
      const bad = kind === 'smudge' && k === 1;
      ui.checks[k].className = 'chk'; await sleep(280);
      ui.checks[k].className = bad ? 'no' : 'ok'; popIn($('i', ui.checks[k]), { duration: 220 });
      if (bad) return fail(2, 'The address is smudged and cannot be read.');
    }
    await pass(2);

    await go(3, 'Extract: pull the fields out of the form.');
    await Promise.all(M.fields.map(([, v], k) => {
      const cell = $('.d', ui.rows[k]);
      return ghost(gchip(v, 'g-mx'), ui.dd[k], cell, { size: false, scale: 1, duration: 460, delay: k * 150 }).then(() => { cell.textContent = v; popIn(cell, { duration: 200 }); });
    }));
    await pass(3);

    await go(4, 'Compare: does the form match what the record already says?');
    for (let k = 0; k < M.fields.length; k++) {
      const [f, v] = M.fields[k], rec = M.crm[kind][f] ?? v, r = ui.rows[k];
      r.className = 'mx-r chk'; $('.c', r).textContent = rec; await sleep(300);
      r.className = 'mx-r ' + (rec === v ? 'ok' : 'no');
      if (rec !== v) return fail(4, 'The address on the form is not the address in the record.');
    }
    await pass(4);

    await go(5, 'Every agent agrees, so the record is updated.');
    await stamp(ui.done); ui.st[5].className = 'ok'; work(); await hop(-1);
    say('Done: the record is updated.');
    return true;
  }
  /* the resting picture is a finished clean case. Under turbo every wait in play() is a microtask, so this settles before anything paints. */
  async function rest() { T.turbo = true; await play('clean', true); setRace(30); T.turbo = false; }

  defMachine('maxis', {
    build(api) {
      API = api;
      api.board.innerHTML = `<div class="mx">
        <div class="mx-pick"><p class="lab">Send a form <span>three made-up samples</span></p>
          <div>${KINDS.map(([k, n]) => `<button class="btn sm quiet" type="button" data-k="${k}" aria-pressed="false">${n}</button>`).join('')}</div></div>
        <div class="mx-rail">
          <div class="mx-master"><i class="mx-hub"></i><b>Master step</b><span>Step Functions decides who runs next</span></div>
          <ol class="mx-stations">${M.stations.map(([n, d], i) => `<li><i>${i < 5 ? i + 1 : '✓'}</i><b>${n}</b><span>${d}</span></li>`).join('')}</ol>
          <b class="mx-token" aria-hidden="true"></b>
        </div>
        <div class="mx-desk">
          <div class="mx-doc scan">
            <p class="mx-dh">Service request form <span>made-up sample</span></p>
            <dl>${M.fields.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
            <div class="mx-sig"><svg viewBox="0 0 120 30" aria-hidden="true"><path d="M4 22c8-14 14-16 18-6s6 10 12-2 10-10 14 0 8 8 14-4 12-6 18 4 10 4 22-6"/></svg><span>Signature</span></div>
            <i class="mx-beam"></i>
            <span class="mx-stamp" hidden></span><span class="mx-done" hidden>Record updated</span><span class="mx-rej" hidden>Needs a person</span>
          </div>
          <div class="mx-side"><p class="lab">What the agents wrote down <span>sample values</span></p>
            <p class="mx-type">Document type <b>—</b></p>
            <ul class="mx-checks">${M.checks.map(c => `<li><i></i>${c}</li>`).join('')}</ul>
            <div class="mx-rows"><div class="mx-rh"><span>From the form</span><span>In the record</span></div>
              ${M.fields.map(([k]) => `<div class="mx-r"><b>${k}</b><span class="d"></span><span class="c"></span><i></i></div>`).join('')}</div>
            <div class="mx-chute" hidden><b>A person takes it from here</b><p class="mx-why"></p></div>
          </div>
        </div>
        <div class="mx-race"><p class="lab">The same case, two ways <span>minute <b class="mx-clock">30</b> of 30</span></p>
          <div class="mx-lane l-ai"><b>Agents</b><div class="trk"><i></i><u></u></div><span>about 5 min</span></div>
          <div class="mx-lane l-me"><b>By hand</b><div class="trk"><i></i></div><span>about 30 min</span></div>
          <div class="mx-axis" aria-hidden="true">${[0, 5, 10, 15, 20, 25, 30].map(n => `<span>${n}</span>`).join('')}</div>
        </div>
      </div>`;
      const b = api.board;
      ui = { pick: $$('.mx-pick button', b), rail: $('.mx-rail', b), hub: $('.mx-hub', b), st: $$('.mx-stations li', b), tok: $('.mx-token', b),
        doc: $('.mx-doc', b), dd: $$('.mx-doc dd', b), beam: $('.mx-beam', b), stamp: $('.mx-stamp', b), done: $('.mx-done', b), rej: $('.mx-rej', b),
        type: $('.mx-type b', b), checks: $$('.mx-checks li', b), rows: $$('.mx-r', b), chute: $('.mx-chute', b), why: $('.mx-why', b),
        ai: $('.l-ai', b), me: $('.l-me', b), clock: $('.mx-clock', b) };
      this.ready = rest();
      RO(() => place(at)).observe(ui.rail);
      if (document.fonts) document.fonts.ready.then(() => place(at));
      ui.pick.forEach(x => x.addEventListener('click', () => api.act(() => play(x.dataset.k))));
    },
    reset() { return rest(); },
    async run(api) {
      setRace(0);
      await play('clean'); await sleep(600);
      api.say('By hand the same case takes about 30 minutes. With the agents, about 5.');
      await tween(3400, t => setRace(t * 30));
      api.say('Now break it: send the smudged scan or the mismatch, and the relay hands the case to a person.');
    },
  });
}
