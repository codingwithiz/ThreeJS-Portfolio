import { motion } from 'framer-motion';

import SectionHeader from '../components/SectionHeader.jsx';
import { education, certifications } from '../constants/index.js';

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Education = () => {
  return (
    <section id="education" className="grain section-shell">
      <SectionHeader
        number="06"
        label="Education & Certifications"
        title={
          <>
            Foundations &amp; <span className="font-display italic text-amber">credentials</span>.
          </>
        }
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        {/* Education */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={item}
          className="card">
          <span className="section-label">Education</span>
          <ul className="mt-3 space-y-6">
            {education.map((e) => (
              <li key={e.school} className="relative border-l border-edge pl-5">
                <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-amber" />
                <p className="font-display text-lg font-semibold text-ink">{e.school}</p>
                <p className="text-sm text-ink-muted">
                  {e.credential}
                  {e.detail && <span className="text-amber"> · {e.detail}</span>}
                </p>
                <p className="mt-0.5 text-xs text-ink-muted/70">{e.duration}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={item}
          className="card">
          <span className="section-label">Certifications</span>
          <ul className="mt-1 divide-y divide-edge/60">
            {certifications.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-sm text-ink-muted">{c.issuer}</p>
                </div>
                <span className="shrink-0 text-xs text-ink-muted/70">{c.date}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
