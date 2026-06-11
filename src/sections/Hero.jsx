import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';

import CanvasLoader from '../components/Loading.jsx';
import Developer from '../components/Developer.jsx';
import RobotAvatar from '../components/RobotAvatar.jsx';
import { profile } from '../constants/index.js';

const heroStats = [
  { value: '2nd', label: 'Globally · Kaggle ML (250+ teams)' },
  { value: 'RM12k', label: 'EY YTPC 2025 — National Champion' },
  { value: 'First-Class', label: 'Honours · Computer Science, UM' },
];

// Staggered entrance for the hero copy
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

// Gives the 3D avatar a gentle idle float and a subtle lean toward the cursor
const AvatarRig = ({ isMobile, children }) => {
  const ref = useRef();
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 1.2) * 0.06;
    const targetY = isMobile ? 0 : state.pointer.x * 0.5;
    const targetX = isMobile ? 0 : -state.pointer.y * 0.15;
    g.rotation.y += (targetY - g.rotation.y) * 0.05;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;
  });
  return <group ref={ref}>{children}</group>;
};

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  // Defer mounting the WebGL canvas until the browser is idle, so the hero copy
  // (the LCP element) paints first instead of competing with three.js startup.
  const [show3D, setShow3D] = useState(false);
  useEffect(() => {
    if (window.requestIdleCallback) {
      const id = window.requestIdleCallback(() => setShow3D(true), { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(() => setShow3D(true), 250);
    return () => clearTimeout(id);
  }, []);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/assets/iz_resume.pdf';
    link.download = 'Lee Ing Zhen Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="home" className="grain relative min-h-screen w-full overflow-hidden">
      {/* Warm atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 85% 8%, rgba(227,168,87,.10), transparent 55%), radial-gradient(90% 70% at 0% 100%, rgba(143,166,126,.08), transparent 55%)',
          }}
        />
        {/* Topographic contour rings */}
        <div
          className="absolute right-[-15%] top-[6%] hidden lg:block"
          style={{
            width: '46vw',
            height: '46vw',
            opacity: 0.1,
            background:
              'repeating-radial-gradient(circle at center, transparent 0 27px, #E3A857 27px 28px)',
            borderRadius: '50%',
            WebkitMaskImage: 'radial-gradient(circle at center,#000 58%,transparent 72%)',
            maskImage: 'radial-gradient(circle at center,#000 58%,transparent 72%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-2 lg:gap-4 lg:px-12 lg:pb-0 lg:pt-0">
        {/* LEFT — copy */}
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col justify-center lg:py-24">
          <motion.p variants={item} className="font-display text-lg italic text-ink-muted sm:text-xl">
            Hi, I am
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display font-black leading-[.92] tracking-tight text-ink"
            style={{ fontSize: 'clamp(3rem,11vw,7rem)' }}>
            Ing Zhen<span className="text-amber">.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 font-semibold uppercase tracking-[.12em] text-ink"
            style={{ fontSize: 'clamp(1.1rem,3vw,1.9rem)' }}>
            Software{' '}
            <span className="font-display font-normal normal-case italic tracking-normal text-amber">
              Engineer
            </span>
          </motion.p>

          <motion.div variants={item} className="mt-4 flex flex-wrap gap-2">
            {profile.expertise.map((x) => (
              <span
                key={x}
                className="rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs font-semibold uppercase tracking-[.1em] text-amber">
                {x}
              </span>
            ))}
          </motion.div>

          <motion.p variants={item} className="mt-6 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
            I build intelligent automation systems at Maxis — UiPath RPA, Java/OSGi services and agentic
            AI that turn enterprise complexity into software that ships.
          </motion.p>

          <motion.p variants={item} className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-sage" />
            Open to <span className="text-ink">Software Engineering</span> &amp;{' '}
            <span className="text-ink">AI Engineering</span> roles
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#work"
              className="rounded-2xl bg-amber px-6 py-3.5 font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(227,168,87,.3)]">
              View Work
            </a>
            <button
              onClick={downloadResume}
              className="rounded-2xl border border-edge px-6 py-3.5 font-semibold text-ink transition-colors duration-200 hover:border-amber/60 hover:text-amber">
              Download Résumé
            </button>
            <a
              href="#contact"
              className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
              or say hello →
            </a>
          </motion.div>

          {/* Impact stats */}
          <motion.div
            variants={item}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-9">
            {heroStats.map((s) => (
              <div key={s.label}>
                <div className="whitespace-nowrap font-display text-2xl font-semibold leading-none text-amber sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1.5 max-w-[16ch] text-[.72rem] leading-snug text-ink-muted sm:text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — 3D avatar */}
        <div className="touch-orbit relative h-[44vh] min-h-[300px] w-full lg:h-screen">
          {show3D && (
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={isMobile ? 46 : 42} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[4, 6, 6]} intensity={1.6} color="#ffe6c0" />
            <directionalLight position={[-6, 2, 2]} intensity={0.5} color="#cfe0c0" />
            <spotLight position={[0, 8, -6]} angle={0.5} penumbra={1} intensity={0.8} color="#e3a857" />
            <Suspense fallback={<CanvasLoader />}>
              <AvatarRig isMobile={isMobile}>
                <Developer animationName="idle" position={[0, -3, 0]} scale={2.6} />
              </AvatarRig>
            </Suspense>
            {/* On touch devices a horizontal swipe spins the avatar a full 360°
                while vertical swipes still scroll the page (see .touch-orbit). */}
            {isMobile && (
              <OrbitControls
                makeDefault
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            )}
          </Canvas>
          )}

          {/* Grounds the floating avatar by fading its base into the page */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />

          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-wide text-ink-muted/70">
            {isMobile ? 'swipe to spin me 360°' : "move your mouse — I'll follow"}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#about"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-muted/70 transition-colors hover:text-amber lg:flex">
        <span className="text-[.7rem] uppercase tracking-[.3em]">Scroll</span>
        <span className="h-9 w-[1.5px] bg-gradient-to-b from-amber to-transparent" />
      </a>

      {/* AI chat trigger (restyled in a later phase) */}
      <RobotAvatar />
    </section>
  );
};

export default Hero;
