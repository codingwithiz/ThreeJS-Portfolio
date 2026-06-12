import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';

import SectionHeader from '../components/SectionHeader.jsx';
import InView from '../components/InView.jsx';
import { profile } from '../constants/index.js';

const Globe = lazy(() => import('react-globe.gl'));

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const Fact = ({ label, value }) => (
  <div>
    <dt className="text-[.7rem] uppercase tracking-[.2em] text-ink-muted/70">{label}</dt>
    <dd className="mt-1 font-medium text-ink">{value}</dd>
  </div>
);

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(profile.email);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = profile.resume;
    link.download = 'Lee Ing Zhen Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="about" className="grain section-shell">
      <SectionHeader
        number="01"
        label="About"
        title={
          <>
            Engineer by craft, <span className="font-display italic text-amber">builder</span> by instinct.
          </>
        }
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Portrait + globe */}
        <motion.div
          className="lg:col-span-5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}>
          <div className="relative mx-auto max-w-sm">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <img
                src="/assets/iz-portrait.png"
                alt="Portrait of Ing Zhen"
                className="aspect-[4/5] w-full object-cover"
                style={{ filter: 'saturate(.92) contrast(1.02)' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber/25 via-transparent to-sage/15 mix-blend-overlay" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
            </div>
            <span className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 border-l-2 border-t-2 border-amber/70" />
            <span className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-b-2 border-r-2 border-amber/70" />
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-[120px] w-[120px] shrink-0">
              <InView className="h-full w-full" fallback={<div className="h-full w-full rounded-full bg-surface-light" />}>
                <Suspense fallback={<div className="h-full w-full rounded-full bg-surface-light" />}>
                  <Globe
                    height={120}
                    width={120}
                    backgroundColor="rgba(0,0,0,0)"
                    showAtmosphere
                    atmosphereColor="#E3A857"
                    atmosphereAltitude={0.18}
                    globeImageUrl="/textures/earth-night.jpg"
                    labelsData={[{ lat: 3.139, lng: 101.6869, text: 'KL', color: '#F4EDE2', size: 14 }]}
                  />
                </Suspense>
              </InView>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              Based in <span className="text-ink">Kuala Lumpur</span> — open to remote work worldwide and flexible
              across time zones.
            </p>
          </div>
        </motion.div>

        {/* Narrative */}
        <motion.div
          className="flex flex-col justify-center lg:col-span-7"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reveal}>
          <p className="font-display text-2xl leading-snug text-ink sm:text-[2rem]">
            “I build <span className="italic text-amber">intelligent automation</span> systems.”
          </p>
          <p className="mt-5 leading-relaxed text-ink-muted">{profile.summary}</p>

          <div className="my-8 h-px w-full bg-edge" />

          <dl className="grid grid-cols-2 gap-y-6 sm:grid-cols-3">
            <Fact
              label="Based in"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-amber" /> Kuala Lumpur
                </span>
              }
            />
            <Fact label="Focus" value="RPA · Java Dev · Agentic AI" />
            <Fact
              label="Status"
              value={
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sage" />
                  Open to SE &amp; AI roles
                </span>
              }
            />
          </dl>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              onClick={downloadResume}
              className="rounded-xl bg-amber px-5 py-2.5 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5">
              Download Résumé
            </button>
            <a
              href="#contact"
              className="rounded-xl border border-edge px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-amber/60 hover:text-amber">
              Get in touch
            </a>
            <button
              onClick={handleCopy}
              className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-amber hover:underline">
              {hasCopied ? (
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Copied
                </span>
              ) : (
                profile.email
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
