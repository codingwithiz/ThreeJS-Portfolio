import { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import Writing from '../sections/Writing.jsx';
import Contact from '../sections/Contact.jsx';
import { profile, clientReviews } from '../constants/index.js';
import { PROJECTS, MINI } from '../live/projects.js';

/* The table. React draws the page; live/site.js (loaded after first paint) builds the seven machines
   and wires the dealer, the counters, Play and the command menu to the ids and classes below. */

const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: still() ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(history.state, '', '#' + id);
  return true;
};
// where a card sits in the fan on a wide screen
const pose = (i) => ({ '--i': i, '--y': ((i - 3.5) ** 2 * 2.2).toFixed(1) + 'px' });

/* A number the score sheet counts up to. The text is the finished value, so it reads right before the engine arrives. */
const Num = ({ to, from, pre = '', suf = '', dp = 0 }) => (
  <b className="num" data-to={to} data-from={from} data-pre={pre || undefined} data-suf={suf || undefined} data-dp={dp || undefined}>
    {pre + (dp ? to.toFixed(dp) : to.toLocaleString('en-MY')) + suf}
  </b>
);

/* Tally marks: four strokes and a slash for every five. */
const Tally = ({ n }) => {
  const w = Math.ceil(n / 5) * 42 - 6;
  return (
    <svg className="tly" viewBox={`0 0 ${w} 34`} width={w} height="34" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const x0 = Math.floor(i / 5) * 42;
        const k = i % 5;
        return <path key={i} d={k < 4 ? `M${x0 + 5 + k * 8.5} 4q${k % 2 ? 2 : -2} 13 0 26` : `M${x0} 25L${x0 + 36} 9`} />;
      })}
    </svg>
  );
};

/* What a recruiter should get from the first screen, before any card is picked. */
const GLANCE = [
  ['30 → 5 min', 'a case, with the agents I built at Maxis'],
  ['AI First Innovation Award', 'Maxis, Q2 2026'],
  ['2nd of 264 teams', 'UrbanFloodBench, with a published paper'],
];
const STACK = ['Amazon Bedrock', 'Step Functions', 'Lambda', 'Python', 'TypeScript', 'React', 'Kotlin'];
// the three references closest to the work: a manager, a lecturer, a leadership role
const REFS = clientReviews.filter((r) => r.id !== 2);

const QUESTIONS = ['What did you automate at Maxis?', 'Which project runs with no internet?', 'Show me a result with a ranking.'];

const TRACE = [
  ['Send', 'your question goes to the chat server'],
  ['Read', 'the model reads it with my project notes'],
  ['Write', 'the answer comes back word by word'],
  ['Deal', 'the page finds the card the answer names'],
];

const WINS = [
  { img: 'ey', h: 315, alt: 'A team of four on stage behind a large EY sign, holding a winner board for RM12,000.', title: 'National Champion', note: 'EY Young Technology Professional Challenge 2025 · RM 12,000 · 139 teams' },
  { img: 'apac', h: 242, alt: 'A gold medal graphic for the APAC 2026 grand winner.', title: 'Grand Winner', note: 'APAC 2026 · Top 15 final-year projects' },
  { img: 'umhackathon', h: 315, alt: 'Holding a cheque that reads UMHackathon 2025, 1st Runner Up.', title: '1st Runner-Up', note: 'UMHackathon 2025' },
  { img: 'urbanfloodbench', h: 173, alt: 'The competition write-up titled 2nd Place Solution: Edge-Aware Spatiotemporal GNN.', title: '2nd of 264 teams', note: 'UrbanFloodBench · SGD 2,500' },
];

const HONOURS = [
  'AI First Innovation Award · Q2 2026',
  'UG iFEST 2025 · Silver',
  'Maxis Tech Scholar 2023',
  'VHack 2024 · Top 10',
  'Huawei Sales Elite Challenge 2024 · Finalist',
  'TalentCorp “Walk with Me”',
  'MPPC 2023 · Semi-Finalist',
];

const RECEIPT = [
  ['Machines on this page', '7'],
  ['Repos the logic was ported from', '5'],
  ['Checks against the repos’ own samples', `${__LIVE_CHECKS__} pass`],
  ['Storm steps replayed', '36 of 97'],
  ['Animation libraries used', '0'],
  ['Crux eval', '10/10 golden · faithfulness 1.00'],
];

const Home = () => {
  const { openChat } = useOutletContext();
  const navigate = useNavigate();
  const nav = useRef(navigate);
  nav.current = navigate;
  const eng = useRef(null);

  useEffect(() => {
    let dead = false;
    let engine;
    import('../live/site.js').then((m) => {
      if (dead) return;
      engine = eng.current = m;
      m.boot({ navigate: (to) => nav.current(to), resume: profile.resume });
    });
    return () => {
      dead = true;
      engine?.destroy();
      eng.current = null;
    };
  }, []);

  return (
    <div className="home">
      <header className="hero" id="hand">
        <p className="hero-k">Software Engineer · AI &amp; Automation · Maxis, Malaysia</p>
        <h1 className="hero-n">Ing Zhen Lee</h1>
        <p className="hero-t">{profile.tagline}</p>
        <ul className="hero-g">
          {GLANCE.map(([b, t]) => (
            <li key={b}>
              <b>{b}</b> {t}
            </li>
          ))}
        </ul>
        <div className="hero-cta">
          <a className="btn" href={profile.resume} target="_blank" rel="noreferrer">
            Résumé (PDF)
          </a>
          <a className="btn quiet" href={`mailto:${profile.email}`}>
            Email me
          </a>
        </div>
        <p className="hero-s">{STACK.join(' · ')}</p>
        <p className="hero-h">pick a card, it runs ↓</p>
        <div className="deckbox">
          <div className="deck" id="deck" data-live>
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={`card c-${p.color}`}
                style={pose(i)}
                onClick={() => (eng.current ? eng.current.goTo('m-' + p.id) : scrollToId('machines'))}>
                <span className="card-no">{p.no}</span>
                <span className={`mini mini-${p.id}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: MINI[p.id] }} />
                <b className="card-f">{p.front}</b>
                <span className="card-u">{p.unit}</span>
                <span className="card-n">{p.name}</span>
              </button>
            ))}
            <button type="button" className="card c-joker" style={pose(PROJECTS.length)} onClick={() => scrollToId('dealer')}>
              <span className="card-no">★</span>
              <span className="jk-q" aria-hidden="true">
                ?
              </span>
              <img src="/assets/iz-portrait.webp" width="60" height="60" alt="" />
              <b className="card-f">Joker</b>
              <span className="card-u">ask the dealer</span>
              <span className="card-n">{profile.name}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="sec" id="machines">
        <div className="sec-h">
          <p className="hk">the machines</p>
          <h2>Seven things I built, running.</h2>
          <p className="sec-l">Pick one. It runs by itself, then it is yours: change the input.</p>
        </div>
        <div id="mach-host" />
      </section>

      <section className="sec dealer" id="dealer">
        <div className="dl">
          <div className="card c-joker dl-jk" id="dl-jk" aria-hidden="true">
            <span className="card-no">★</span>
            <span className="jk-q">?</span>
            <img src="/assets/iz-portrait.webp" width="60" height="60" alt="" loading="lazy" />
            <b className="card-f">Joker</b>
            <span className="card-u">the dealer</span>
            <span className="card-n">{profile.name}</span>
          </div>
          <div className="dl-main">
            <p className="hk">the dealer</p>
            <h2>Ask about my work</h2>
            <p className="dl-note">
              A language model answers from my project notes, then deals the card so you can check it yourself.
            </p>
            <div className="dl-qs">
              {QUESTIONS.map((q, i) => (
                <button key={q} className="btn sm quiet" type="button" data-q={i} aria-pressed="false">
                  {q}
                </button>
              ))}
            </div>
            <form className="dl-f" id="dl-f">
              <input className="fld" id="dl-in" type="text" maxLength={300} placeholder="Or ask your own question" aria-label="Ask your own question" autoComplete="off" />
              <button className="btn sm" type="submit">
                Ask
              </button>
            </form>
            <div className="dl-box">
              <p className="dl-tn">What happens when you ask</p>
              <ol className="dl-trace">
                {TRACE.map(([step, what]) => (
                  <li key={step}>
                    <i />
                    <b>{step}</b>
                    <span>{what}</span>
                  </li>
                ))}
              </ol>
              <p className="dl-a" aria-live="polite">
                Pick a question and the dealer deals the card that answers it.
              </p>
              <div className="dl-card" />
            </div>
            <button className="lnk" type="button" onClick={openChat}>
              Or have a longer conversation
            </button>
          </div>
        </div>
      </section>

      <section className="sec sheet" id="sheet">
        <div className="sec-h">
          <p className="hk">the score sheet</p>
          <h2>Experience</h2>
          <p className="sec-l">Where I have worked and what came out of it. Every number counts up when you reach it.</p>
        </div>
        <ol className="roles">
          <li className="role c-clay">
            <p className="role-d">May 2026 — Present</p>
            <h3>Maxis</h3>
            <p className="role-r">Software Engineer · AI &amp; Automation</p>
            <div className="tiles">
              <div className="tile big">
                <Num to={5} from={30} pre="30→" />
                <span className="tl">minutes a case, with two multi-agent systems on Amazon Bedrock</span>
                <div className="ba" aria-hidden="true">
                  <div>
                    <span>By hand</span>
                    <i style={{ '--f': 1 }} />
                    <em>30 min</em>
                  </div>
                  <div>
                    <span>Agents</span>
                    <i style={{ '--f': 0.1667 }} />
                    <em>5 min</em>
                  </div>
                </div>
              </div>
              <div className="tile">
                <b className="num">30–40</b>
                <span className="tl">cases a day per agent</span>
              </div>
              <div className="tile">
                <Num to={90} suf="+" />
                <span className="tl">production issues resolved in 2 months</span>
              </div>
              <div className="tile">
                <Num to={200} suf="+" />
                <span className="tl">transactions a day through the webform-to-Salesforce pipeline</span>
              </div>
              <div className="tile">
                <Num to={30} suf="+" />
                <span className="tl">UiPath automations</span>
              </div>
              <div className="tile wide">
                <Num to={20} suf="+" />
                <span className="tl">attended bots watched by the Control Tower</span>
                <div className="fleet" data-live aria-hidden="true">
                  {Array.from({ length: 20 }, (_, i) => (
                    <i key={i} style={{ '--d': (-((i * 37) % 20) / 8).toFixed(2) + 's' }} />
                  ))}
                </div>
                <small>Illustration, not live data</small>
              </div>
              <div className="tile wide">
                <b className="num">$120K–180K</b>
                <span className="tl">estimated saving a year from the Control Tower</span>
              </div>
              <div className="tile wide half">
                <b className="num">
                  <Tally n={5} />
                  <span className="plus">+</span>
                  <Tally n={2} />
                </b>
                <span className="tl">5 vendor engineers and 2 interns led</span>
              </div>
              <div className="tile wide half">
                <b className="num sm">AI First Innovation Award</b>
                <span className="tl">Q2 2026</span>
              </div>
            </div>
          </li>

          <li className="role c-amber">
            <p className="role-d">Aug 2024 — Jan 2025</p>
            <h3>Maxis</h3>
            <p className="role-r">Innovation Software Intern</p>
            <div className="tiles">
              <div className="tile lead">
                <Num to={1300} pre="~" />
                <span className="tl">workers on the Joget HR platform</span>
              </div>
              <div className="tile">
                <Num to={370} pre="~RM" suf="k" />
                <span className="tl">saved a year</span>
              </div>
              <div className="tile">
                <Num to={2000} suf="+" />
                <span className="tl">routers on the IoT dashboard</span>
              </div>
            </div>
          </li>

          <li className="role c-sage">
            <p className="role-d">Feb 2024 — Feb 2025</p>
            <h3>AIESEC in Universiti Malaya</h3>
            <p className="role-r">Local Committee President</p>
            <div className="tiles">
              <div className="tile lead">
                <b className="num">
                  <Tally n={7} />
                </b>
                <span className="tl">7 national awards</span>
              </div>
              <div className="tile">
                <Num to={70} />
                <span className="tl">members</span>
              </div>
              <div className="tile">
                <Num to={170} suf="+" />
                <span className="tl">delegates at MyLDS</span>
              </div>
              <div className="tile fill">
                <b>Best Local Entity</b>
                <span>1 of 12</span>
              </div>
            </div>
          </li>

          <li className="role c-lilac">
            <p className="role-d">Universiti Malaya</p>
            <h3>B.CS (Hons) Software Engineering</h3>
            <p className="role-r">First-Class Honours</p>
            <div className="tiles">
              <div className="tile lead">
                <Num to={3.81} dp={2} />
                <span className="tl">CGPA</span>
              </div>
              <div className="tile">
                <b className="num sm">First-Class</b>
                <span className="tl">degree</span>
              </div>
              <div className="tile">
                <b className="num">
                  <Tally n={5} />
                </b>
                <span className="tl">Dean’s List ×5</span>
              </div>
            </div>
          </li>
        </ol>
      </section>

      <section className="sec wins" id="wins">
        <div className="sec-h">
          <p className="hk">the wins</p>
          <h2>Awards</h2>
        </div>
        <div className="win-grid">
          {WINS.map((w) => (
            <figure className="win" key={w.img}>
              <img src={`/assets/awards/${w.img}.jpg`} width="420" height={w.h} loading="lazy" alt={w.alt} />
              <figcaption>
                <b>{w.title}</b>
                <span>{w.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <ul className="hon">
          {HONOURS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <section className="sec refs" id="refs">
        <div className="sec-h">
          <p className="hk">from people I worked with</p>
          <h2>References</h2>
        </div>
        <div className="ref-row">
          {REFS.map((r) => (
            <figure className="ref" key={r.id}>
              <blockquote>{r.review}</blockquote>
              <figcaption>
                <img src={encodeURI('/' + r.img)} width="48" height="48" alt="" loading="lazy" />
                <span>
                  <b>{r.name}</b>
                  {r.position}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Writing />
      <Contact />

      <section className="sec" id="receipt">
        <div className="rc-w">
          <div className="rc">
            <p className="rc-h">Build receipt</p>
            <ul className="rc-l">
              {RECEIPT.map(([what, n]) => (
                <li key={what}>
                  <span>{what}</span>
                  <b>{n}</b>
                </li>
              ))}
              <li className="live">
                <span>Steps run for you so far</span>
                <b id="rc-work">0</b>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
