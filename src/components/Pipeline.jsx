import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const STEP_MS = 650;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A sample input walks through a system's stages.
 * `step` is -1 while idle, the index of the running stage, or stages.length once finished.
 * Every word is in the DOM from the first paint; running only changes lamps and opacity.
 */
const Pipeline = ({ pipeline, name, autoRun = true }) => {
  const { input, stages, output, metric } = pipeline;
  const done = stages.length;
  const [step, setStep] = useState(() => (prefersReducedMotion() ? done : -1));
  const ref = useRef(null);

  useEffect(() => {
    if (step < 0 || step >= done) return undefined;
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [step, done]);

  // Run once, the first time it scrolls into view.
  useEffect(() => {
    if (!autoRun || prefersReducedMotion()) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setStep((s) => (s === -1 ? 0 : s));
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [autoRun]);

  const running = step >= 0 && step < done;
  const finished = step >= done;
  const status = finished ? 'Done' : running ? `${step + 1}/${done} ${stages[step].name}` : 'Ready';

  return (
    <figure ref={ref} className="overflow-hidden rounded-[14px] border-2 border-night bg-night">
      <figcaption className="flex items-center justify-between gap-4 border-b border-ink/15 px-4 py-2.5">
        <span className="label min-w-0 truncate">pipeline / {name}</span>
        <span className="label flex shrink-0 items-center gap-2 whitespace-nowrap" aria-live="polite">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${finished ? 'bg-sage' : running ? 'bg-[var(--c)]' : 'bg-ink/30'}`}
          />
          {status}
        </span>
      </figcaption>

      <p className="flex flex-col gap-1 border-b border-ink/15 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4">
        <span className="label w-16 shrink-0">Input</span>
        <span className="text-ink">{input}</span>
      </p>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] origin-left bg-[var(--c)] transition-transform duration-500 ease-out"
          style={{ transform: `scaleX(${Math.max(0, Math.min(step + 1, done)) / done})` }}
        />
        <ol
          className="lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
          style={{ '--n': done }}>
          {stages.map((stage, i) => {
            const active = step === i;
            const passed = step > i;
            return (
              <li
                key={stage.name}
                className={`border-b border-ink/15 px-4 py-3.5 transition-opacity duration-300 last:border-b-0 lg:border-b-0 lg:border-r lg:py-5 lg:last:border-r-0 ${
                  active || passed ? 'opacity-100' : 'opacity-75'
                }`}>
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 shrink-0 rounded-full transition-colors duration-300 ${
                      active ? 'bg-[var(--c)]' : passed ? 'bg-sage' : 'bg-ink/30'
                    }`}
                  />
                  <span className="label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-sm font-medium text-ink">{stage.name}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{stage.detail}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink/15 px-4 py-3">
        <p
          className={`flex flex-col gap-1 transition-opacity duration-300 sm:flex-row sm:items-baseline sm:gap-4 ${
            finished ? 'opacity-100' : 'opacity-75'
          }`}>
          <span className="label w-16 shrink-0">Output</span>
          <span className="text-ink">
            {output} <span className="font-mono text-sm text-amber">· {metric}</span>
          </span>
        </p>
        <button type="button" onClick={() => setStep(0)} disabled={running} className="btn-ghost !border-ink/40 !bg-night">
          {finished ? <RotateCcw className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {finished ? 'Replay' : running ? 'Running' : 'Run'}
        </button>
      </div>
    </figure>
  );
};

export default Pipeline;
