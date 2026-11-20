// Smallest check that the data the case pages and the Pipeline component rely on is well-formed:
//   node scripts/check-systems.mjs
import { systems } from '../src/content/systems.js';

const slugs = new Set();
for (const s of systems) {
  const p = s.pipeline;
  const ok =
    /^[a-z0-9-]+$/.test(s.slug) &&
    !slugs.has(s.slug) &&
    s.title && s.summary && s.body && s.metric && s.kicker &&
    Array.isArray(s.stack) && Array.isArray(s.links) && Array.isArray(s.numbers) &&
    // the card back holds about 190 characters before it overflows on a phone
    s.card?.name && s.card.big && s.card.cap && s.card.usp?.length <= 190 && /^#[0-9a-f]{6}$/.test(s.card.color) &&
    p?.input && p.output && p.metric &&
    Array.isArray(p.stages) && p.stages.length >= 2 && p.stages.length <= 6 &&
    p.stages.every((st) => st.name && st.detail);
  if (!ok) throw new Error(`systems.js: bad entry "${s.slug}"`);
  slugs.add(s.slug);
}
console.log(`systems.js ok: ${systems.length} systems`);
