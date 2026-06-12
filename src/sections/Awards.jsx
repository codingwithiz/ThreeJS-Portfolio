import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

import SectionHeader from '../components/SectionHeader.jsx';
import { useAwards } from '../lib/useContent.js';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const AwardImage = ({ image, title }) => {
  const [ok, setOk] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-edge bg-surface">
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-surface-light to-bg transition-opacity duration-500 ${
          ok ? 'opacity-0' : 'opacity-100'
        }`}>
        <span className="text-amber/60">
          <Trophy className="h-9 w-9" strokeWidth={1.5} />
        </span>
        <span className="text-xs tracking-wide text-ink-muted/60">winning photo coming soon</span>
      </div>
      {image && (
        <img
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setOk(true)}
          onError={() => setOk(false)}
          className={`relative h-full w-full object-contain transition-opacity duration-500 ${ok ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

const Awards = () => {
  const awards = useAwards();
  const featured = awards.filter((h) => h.featured);
  const others = awards.filter((h) => !h.featured);

  return (
    <section id="awards" className="grain section-shell">
      <SectionHeader
        number="05"
        label="Honors & Awards"
        title={
          <>
            Wins worth <span className="font-display italic text-amber">mentioning</span>.
          </>
        }
        intro="From global ML competitions to national tech championships — a habit of shipping under pressure and coming out on top."
      />

      <div className="mt-16 space-y-16 sm:space-y-24">
        {featured.map((a, i) => (
          <motion.article
            key={a.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
            <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
              <AwardImage image={a.image} title={a.title} />
            </div>
            <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
              <div className="flex flex-wrap items-center gap-3">
                {a.prize && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber/10 px-3 py-1 text-xs font-semibold text-amber">
                    <Trophy className="h-3.5 w-3.5" /> {a.prize}
                  </span>
                )}
                <span className="text-xs uppercase tracking-[.2em] text-ink-muted/70">{a.date}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-amber">{a.issuer}</p>
              <p className="mt-4 leading-relaxed text-ink-muted">{a.blurb}</p>
            </div>
          </motion.article>
        ))}
      </div>

      {others.length > 0 && (
        <p className="mt-16 border-t border-edge pt-8 text-sm leading-relaxed text-ink-muted">
          <span className="text-ink-muted/70">Also recognised — </span>
          {others.map((h) => h.title.split(' — ')[0]).join(' · ')}.
        </p>
      )}
    </section>
  );
};

export default Awards;
