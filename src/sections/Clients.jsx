import { motion } from 'framer-motion';

import SectionHeader from '../components/SectionHeader.jsx';
import { clientReviews } from '../constants/index.js';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Star = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
  </svg>
);

const Clients = () => {
  return (
    <section id="references" className="grain section-shell">
      <SectionHeader
        number="07"
        label="References"
        title={
          <>
            Words from people I&apos;ve <span className="font-display italic text-amber">worked with</span>.
          </>
        }
      />

      <motion.div
        className="mt-12 grid gap-5 md:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={container}>
        {clientReviews.map((r) => (
          <motion.figure key={`review-${r.id}`} variants={item} className="card flex flex-col">
            <div className="flex gap-1 text-amber">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-ink-muted">“{r.review}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-edge/60 pt-5">
              <img src={r.img} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
              <div>
                <p className="font-semibold text-ink">{r.name}</p>
                <p className="text-xs text-ink-muted">{r.position}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
};

export default Clients;
