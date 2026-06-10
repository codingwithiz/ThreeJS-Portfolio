import { motion } from 'framer-motion';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Editorial section header: an oversized ghost numeral, an amber hairline label,
 * and a large display title. The connective tissue that gives every section identity.
 */
const SectionHeader = ({ number, label, title, intro, align = 'left' }) => (
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.4 }}
    variants={reveal}
    className={`relative ${align === 'center' ? 'text-center' : ''}`}>
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -top-10 select-none font-display text-[6rem] font-black leading-none text-ink/[0.05] sm:text-[9rem] lg:text-[12rem] ${
        align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'
      }`}>
      {number}
    </span>
    <div className={`relative flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
      <span className="h-px w-10 bg-amber" />
      <span className="text-xs uppercase tracking-[.3em] text-amber">{label}</span>
    </div>
    <h2 className={`section-title relative mt-4 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{title}</h2>
    {intro && <p className={`relative mt-4 max-w-xl text-ink-muted ${align === 'center' ? 'mx-auto' : ''}`}>{intro}</p>}
  </motion.div>
);

export default SectionHeader;
