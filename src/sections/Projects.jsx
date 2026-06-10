import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';

import { myProjects } from '../constants/index.js';
import CanvasLoader from '../components/Loading.jsx';
import DemoComputer from '../components/DemoComputer.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import InView from '../components/InView.jsx';

const projects = [...myProjects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
const allTags = Array.from(new Set(projects.flatMap((p) => p.tags.map((t) => t.name))));
const shortTitle = (t) => t.split(' - ')[0].split(' — ')[0];
const monogram = (t) => shortTitle(t).replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
const PAGE_SIZE = 6;

// Plays the demo clip on hover; shows a still first frame otherwise (light on mobile)
const VideoThumb = ({ src }) => {
  const ref = useRef();
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={() => ref.current?.play()}
      onMouseLeave={() => {
        if (ref.current) ref.current.pause();
      }}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
};

const Projects = () => {
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState('All');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const current = projects[selected];

  const filtered = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.tags.some((t) => t.name === filter))),
    [filter],
  );

  const navigate = (dir) =>
    setSelected((i) => (dir === 'prev' ? (i === 0 ? projects.length - 1 : i - 1) : (i + 1) % projects.length));

  const selectProject = (idx) => {
    setSelected(idx);
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const applyFilter = (t) => {
    setFilter(t);
    setVisible(PAGE_SIZE);
    const match = t === 'All' ? projects[0] : projects.find((p) => p.tags.some((tag) => tag.name === t));
    if (match) setSelected(projects.indexOf(match));
  };

  return (
    <section id="work" className="grain section-shell">
      <SectionHeader
        number="04"
        label="Selected Work"
        title={
          <>
            Things I&apos;ve <span className="font-display italic text-amber">built</span>.
          </>
        }
      />

      {/* Featured showcase */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="card flex flex-col">
          <div className="flex items-center gap-3">
            {current.logo ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl p-2.5" style={current.logoStyle}>
                <img src={current.logo} alt="" className="h-full w-full object-contain" />
              </div>
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl font-display text-lg font-bold text-amber"
                style={current.logoStyle}>
                {monogram(current.title)}
              </div>
            )}
            {current.award && (
              <span className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                🏆 {current.award}
              </span>
            )}
          </div>

          <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{current.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{current.desc}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{current.subdesc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {current.tags.map((t) => (
              <span key={t.id} className="chip">
                {t.path && <img src={t.path} alt="" className="h-4 w-4 object-contain" />}
                {t.name}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            {current.demo && (
              <a
                href={current.demo}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-bg transition-transform hover:-translate-y-0.5">
                Live demo ↗
              </a>
            )}
            {current.github && (
              <a
                href={current.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-edge px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-amber/60 hover:text-amber">
                View code ↗
              </a>
            )}
            <div className="ml-auto flex gap-2">
              <button onClick={() => navigate('prev')} aria-label="Previous project" className="flex h-10 w-10 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:border-amber/60 hover:text-amber">
                ←
              </button>
              <button onClick={() => navigate('next')} aria-label="Next project" className="flex h-10 w-10 items-center justify-center rounded-full border border-edge text-ink-muted transition-colors hover:border-amber/60 hover:text-amber">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Media: 3D showcase for projects with a demo clip, branded panel otherwise */}
        <div className="card !p-0 h-[340px] overflow-hidden lg:h-auto">
          {current.texture ? (
            <InView
              className="h-full w-full"
              fallback={<div className="flex h-full items-center justify-center text-sm text-ink-muted/50">Loading 3D…</div>}>
              <Canvas>
                <ambientLight intensity={Math.PI} />
                <directionalLight position={[10, 10, 5]} />
                <Center>
                  <Suspense fallback={<CanvasLoader />}>
                    <group scale={2} position={[0, -3, 0]} rotation={[0, -0.1, 0]}>
                      <DemoComputer texture={current.texture} />
                    </group>
                  </Suspense>
                </Center>
                <OrbitControls maxPolarAngle={Math.PI / 2} enableZoom={false} />
              </Canvas>
            </InView>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-light to-bg p-8 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold text-amber"
                style={current.logoStyle}>
                {monogram(current.title)}
              </div>
              <span className="font-display text-2xl font-semibold text-ink">{shortTitle(current.title)}</span>
              <span className="text-sm text-ink-muted">{current.impact}</span>
            </div>
          )}
        </div>
      </div>

      {/* Filter by skill */}
      <div className="mt-14">
        <p className="mb-3 text-xs uppercase tracking-[.2em] text-ink-muted/70">Filter by skill</p>
        <div className="flex flex-wrap gap-2">
          {['All', ...allTags].map((t) => (
            <button
              key={t}
              onClick={() => applyFilter(t)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                filter === t
                  ? 'border-amber/50 bg-amber/10 text-amber'
                  : 'border-edge text-ink-muted hover:border-amber/40 hover:text-ink'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Scannable grid */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, visible).map((p) => {
          const idx = projects.indexOf(p);
          return (
            <button
              key={p.title}
              onClick={() => selectProject(idx)}
              className={`card group flex flex-col overflow-hidden !p-0 text-left ${
                idx === selected ? 'border-amber/40' : ''
              }`}>
              <div className="relative aspect-video overflow-hidden">
                {p.texture ? (
                  <>
                    <VideoThumb src={p.texture} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-light to-bg px-4 text-center">
                    <span className="font-display text-lg font-semibold text-ink/85">{shortTitle(p.title)}</span>
                  </div>
                )}
                {p.award && (
                  <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-xs font-semibold text-amber backdrop-blur">
                    🏆 {p.award}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  {p.logo ? (
                    <img src={p.logo} alt="" className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-amber/15 text-[.6rem] font-bold text-amber">
                      {monogram(p.title)}
                    </span>
                  )}
                  <h3 className="font-display font-semibold text-ink">{shortTitle(p.title)}</h3>
                </div>
                <p className="mt-2 text-sm text-ink-muted">{p.impact || p.desc.slice(0, 88)}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t.id} className="rounded-full border border-edge px-2 py-0.5 text-xs text-ink-muted">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {visible < filtered.length && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-xl border border-edge px-6 py-3 text-sm font-semibold text-ink-muted transition-colors hover:border-amber/60 hover:text-amber">
            Load more · {filtered.length - visible} more
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
