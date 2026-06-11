import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';

import Developer from '../components/Developer.jsx';
import CanvasLoader from '../components/Loading.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import InView from '../components/InView.jsx';
import { technicalExperience } from '../constants/index.js';

const TechnicalExperience = () => {
  const [animationName, setAnimationName] = useState('idle');
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <section id="experience" className="grain section-shell">
      <SectionHeader
        number="02"
        label="Experience · Technical"
        title={
          <>
            Where I&apos;ve <span className="font-display italic text-amber">shipped</span>.
          </>
        }
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {/* Animated avatar */}
        <div className="card !p-0 h-[380px] overflow-hidden lg:h-auto lg:min-h-[480px]">
          <InView
            className="touch-orbit relative h-full w-full"
            fallback={<div className="flex h-full items-center justify-center text-sm text-ink-muted/50">Loading 3D…</div>}>
          <Canvas>
            <ambientLight intensity={5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <OrbitControls makeDefault enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} />
            <Suspense fallback={<CanvasLoader />}>
              <Developer position-y={-3} scale={isMobile ? 2.6 : 3} animationName={animationName} />
            </Suspense>
          </Canvas>
          <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-bg/70 px-3 py-1 text-[.65rem] uppercase tracking-[.15em] text-ink-muted/80 backdrop-blur lg:hidden">
            Drag to rotate
          </span>
          </InView>
        </div>

        {/* Timeline */}
        <div className="flex flex-col lg:col-span-2">
          {technicalExperience.map((it, i) => (
            <div
              key={`${it.company}-${i}`}
              onPointerOver={() => setAnimationName(it.animation)}
              onPointerOut={() => setAnimationName('idle')}
              onClick={() => setAnimationName(it.animation)}
              className="group grid cursor-pointer grid-cols-[auto_1fr] gap-5 rounded-2xl p-4 transition-colors hover:bg-surface sm:p-5">
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-edge bg-white/95 p-2">
                  <img src={it.icon} alt={it.company} className="h-full w-full object-contain" />
                </div>
                {i < technicalExperience.length - 1 && <span className="mt-3 w-px flex-1 bg-edge" />}
              </div>
              <div className="pb-6">
                <p className="font-display text-lg font-semibold text-ink">{it.role}</p>
                <p className="text-sm text-ink-muted">
                  {it.company} · {it.duration} · {it.location}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {it.points.map((p, idx) => (
                    <li key={idx} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnicalExperience;
