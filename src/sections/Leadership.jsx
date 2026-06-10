import { motion } from 'framer-motion';

import SectionHeader from '../components/SectionHeader.jsx';
import { leadershipExperience } from '../constants/index.js';

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Leadership = () => {
  return (
    <section id="leadership" className="grain section-shell">
      <SectionHeader
        number="03"
        label="Experience · Leadership"
        title={
          <>
            Leading <span className="font-display italic text-amber">people</span>, not just code.
          </>
        }
      />

      <div className="mt-14 border-l border-edge pl-6 sm:pl-8">
        {leadershipExperience.slice(0, 3).map((it, i) => (
          <motion.div
            key={`${it.org}-${i}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={item}
            className="relative pb-10 last:pb-0">
            <span
              className={`absolute top-1 h-3.5 w-3.5 rounded-full -left-[31px] sm:-left-[39px] ${
                it.featured ? 'bg-amber' : 'bg-surface-light ring-1 ring-edge'
              }`}
            />
            <p className="font-display text-lg font-semibold text-ink">{it.role}</p>
            <p className="text-sm text-amber">{it.org}</p>
            <p className="text-xs text-ink-muted/70">{it.duration}</p>
            <ul className="mt-2 space-y-1.5">
              {it.points.map((p, idx) => (
                <li key={idx} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted/50" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Leadership;
