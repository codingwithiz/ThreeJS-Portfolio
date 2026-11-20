import { Suspense, lazy, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

import Pipeline from '../components/Pipeline.jsx';
import { systems } from '../content/systems.js';

const Markdown = lazy(() => import('../components/Markdown.jsx'));

const shot = (name, alt, w, h) => ({ src: `/assets/work/${name}.webp`, alt, w, h });

// Real captures, by slug. The Maxis page has none on purpose: it shows the shape of the system only.
const visuals = {
  'iz-finance': {
    note: 'Real screens. The first two are the home screen before and after one RM 12.90 payment.',
    shots: [
      shot('iz-home', 'IZ Finance home screen: RM 602.60 left to spend in October', 320, 440),
      shot('iz-after', 'The same screen after a payment: RM 589.70 left to spend', 320, 440),
      shot('iz-split', 'Split by receipt: each item of a nasi kandar bill assigned to a person', 320, 638),
    ],
  },
  crux: {
    note: 'The ledger: saved takes, scored later against what happened.',
    shots: [shot('crux-ledger', 'Crux ledger screen with an accuracy score of 97 out of 100 and a confidence chart', 1000, 600)],
  },
  bina: {
    note: 'Captured from the phone build: two recipes, running offline.',
    shots: [
      shot('bina-home', 'Triage Ibu Hamil recipe home screen with four large red buttons', 320, 712),
      shot('bina-check', 'An eight-step danger-sign checklist in Malay', 320, 712),
      shot('bina-farm', 'Farm Buddy recipe answering a question about a rice crop', 320, 712),
    ],
  },
  niagamap: {
    note: 'From the viva slides: a recommended location and why it scored 68.03.',
    shots: [shot('niaga-map', 'NiagaMap hexagon map with a recommended location scored 68.03 and its score breakdown', 664, 637)],
  },
};

// Kaggle scores along the way (lower is better), from the paper and the leaderboard.
const floodScores = [0.3275, 0.2689, 0.083, 0.0157];

const Work = () => {
  const { slug } = useParams();
  const i = systems.findIndex((s) => s.slug === slug);
  const system = systems[i];

  useEffect(() => {
    if (!system) return undefined;
    document.title = `${system.title} — Ing Zhen Lee`;
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute('content', system.summary);
    return () => {
      document.title = 'Ing Zhen Lee — Software Engineer (AI & Automation)';
      if (meta && prev) meta.setAttribute('content', prev);
    };
  }, [system]);

  if (!system) return <Navigate to="/#hand" replace />;

  const { card } = system;
  const next = systems[(i + 1) % systems.length];
  const media = visuals[slug];

  return (
    <article className="section-shell min-h-screen" style={{ '--c': card.color }}>
      {/* The opened card. The first paint of this header is mirrored in scripts/prerender.mjs. */}
      <header className="case-card">
        <Link to="/#hand" className="label inline-flex min-h-11 items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to the hand
        </Link>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="min-w-0 max-w-3xl">
            <p className="label">{system.kicker}</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">{system.title}</h1>
            <p className="mt-5 max-w-2xl text-lg font-medium">{system.summary}</p>
            {system.links.length > 0 && (
              <p className="mt-2 flex flex-wrap gap-x-6">
                {system.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-semibold underline underline-offset-4">
                    {l.name} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ))}
              </p>
            )}
          </div>
          <p className="shrink-0">
            <span className="block font-display text-6xl font-bold leading-[0.9] tracking-tight sm:text-8xl">{card.big}</span>
            <span className="mt-2 block max-w-[14rem] font-medium">{card.cap}</span>
          </p>
        </div>
      </header>

      <dl className="mt-10 grid grid-cols-2 border-l border-edge pt-px lg:grid-cols-4">
        {system.numbers.map((n) => (
          <div key={n.label} className="-mt-px flex flex-col-reverse justify-end gap-1 border-y border-r border-edge px-4 py-4">
            <dt className="text-sm text-ink-muted">{n.label}</dt>
            <dd className="font-mono text-lg font-medium text-ink sm:text-xl">{n.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <Pipeline key={system.slug} pipeline={system.pipeline} name={system.slug} />
      </div>

      {slug === 'urbanfloodbench' && (
        <figure className="mt-10">
          <ol className="flood-bars">
            {floodScores.map((v, n) => (
              <li key={v} style={{ '--v': v }}>
                <span className="font-mono text-sm text-ink">{v.toFixed(4)}</span>
                <i aria-hidden="true" />
                <span className="label">{n === 0 ? 'First try' : n === floodScores.length - 1 ? 'Final' : `Step ${n + 1}`}</span>
              </li>
            ))}
          </ol>
          <figcaption className="label mt-3">Our score on the way to 2nd place. Lower is better.</figcaption>
        </figure>
      )}

      {media && (
        <figure className="mt-10">
          <div className="flex flex-wrap items-start gap-4">
            {media.shots.map((s) => (
              <img
                key={s.src}
                src={s.src}
                alt={s.alt}
                width={s.w}
                height={s.h}
                loading="lazy"
                className={`h-auto rounded-[14px] border-2 border-night shadow-[5px_5px_0_#14110f] ${
                  s.w > s.h * 0.9 ? 'w-full max-w-2xl' : 'w-[calc(50%-0.5rem)] max-w-[220px]'
                }`}
              />
            ))}
          </div>
          <figcaption className="label mt-4">{media.note}</figcaption>
        </figure>
      )}

      <div className="mt-12 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="prose-terra max-w-3xl">
          <Suspense fallback={<p>Loading…</p>}>
            <Markdown>{system.body}</Markdown>
          </Suspense>
        </div>
        <aside className="lg:order-last">
          <h2 className="label border-b border-edge pb-2">Built with</h2>
          <ul className="mt-3 space-y-1.5 font-mono text-sm text-ink-muted">
            {system.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </aside>
      </div>

      <nav aria-label="More cards" className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-edge pt-6">
        <Link to="/#hand" className="label inline-flex min-h-11 items-center gap-1.5 hover:text-ink">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to the hand
        </Link>
        <Link to={`/work/${next.slug}`} className="next-card" style={{ '--c': next.card.color }}>
          <span className="label">Next card</span>
          <span className="font-display text-xl font-bold">{next.card.name}</span>
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </nav>
    </article>
  );
};

export default Work;
