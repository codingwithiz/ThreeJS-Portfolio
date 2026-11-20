/* The cards and nothing else, so the first paint does not carry the machines' sample data. */
/* The seven cards. The hand (React) and the machine frames (engine) both read this. */
export const PROJECTS = [
  { id: 'maxis', slug: 'maxis-agents', no: '01', name: 'Maxis agents', title: 'The relay', color: 'clay', front: '30→5', unit: 'minutes a case', badges: ['sample'], stack: ['Amazon Bedrock', 'Step Functions', 'Lambda', 'Salesforce'],
    usp: 'Five specialised agents and a master agent take a case from about 30 minutes to about 5.',
    port: 'The architecture of my production system. The documents, prompts and field names are not shown; this form is made up.', links: [] },
  { id: 'iz', slug: 'iz-finance', no: '02', name: 'IZ Finance', title: 'The sorter', color: 'amber', front: '0 taps', unit: 'to log a payment', badges: ['real'], stack: ['Next.js', 'TypeScript', 'Supabase', 'Capacitor', 'Kotlin'],
    usp: 'Malaysia’s anti-pokai money app. Your payments log themselves.',
    port: 'Ported from PaymentFilter.java, transactionText.ts and merchantRules.ts. Formats from real alerts and the app’s own tests; names and amounts changed.',
    links: [['Live app', 'https://iz-finance.app'], ['Code', 'https://github.com/codingwithiz/IZ-Finance-App']] },
  { id: 'crux', slug: 'crux', no: '03', name: 'Crux', title: 'The quote check', color: 'ink', front: '100%', unit: 'of quotes checked', badges: ['real'], stack: ['Next.js', 'TypeScript', 'AI SDK', 'pgvector'],
    usp: 'It doesn’t write your posts. It makes you someone worth reading.',
    port: 'Ported from web/lib/citations.ts. The passage is a sample written for this page.',
    links: [['Live app', 'https://crux-content-engine.vercel.app'], ['Code', 'https://github.com/codingwithiz/crux']] },
  { id: 'bina', slug: 'bina', no: '04', name: 'Bina', title: 'Recipe to app', color: 'sage', front: '1 file', unit: 'becomes an offline app', badges: ['real'], stack: ['Kotlin Multiplatform', 'Compose', 'Gemma 4 on device'],
    usp: 'Offline AI for the communities that need it most.',
    port: 'The recipe is a real screen from bidan_pintar.yaml; the rules are ported from VariableStore.kt. The language model itself does not run on this page.',
    links: [['Demo video', 'https://youtu.be/OqAnPUDUv-E'], ['Code', 'https://github.com/jing-yen/bina-v2']] },
  { id: 'flood', slug: 'urbanfloodbench', no: '05', name: 'UrbanFloodBench', title: 'The storm replay', color: 'pink', front: '2nd', unit: 'of 264 teams', badges: ['replay'], stack: ['Python', 'PyTorch', 'Graph neural networks'],
    usp: 'A graph network that forecasts which manholes flood, and when.',
    port: 'A replay of one storm from the competition data (17 manholes, 16 pipes, 5-minute steps). The trained model does not run in the browser.',
    links: [['Paper', 'https://doi.org/10.1016/j.envsoft.2026.107154']] },
  { id: 'niaga', slug: 'niagamap', no: '06', name: 'NiagaMap', title: 'One sentence in', color: 'lilac', front: '1', unit: 'sentence in, a ranked map out', badges: ['real', 'sample'], stack: ['React', 'Node.js', 'GPT-4o', 'ArcGIS'],
    usp: 'One sentence in, a ranked map of business locations out.',
    port: 'Hexagon grid, weight sliders and scoring ported from defineHexagons.js, useWeightManager.js and workflowController.js. The values inside each hexagon are sample fields, not a real place.',
    links: [['Live app', 'https://niagamap.vercel.app'], ['Code', 'https://github.com/codingwithiz/NiagaMap']] },
  { id: 'akar', no: '07', name: 'AkarSwarm', title: 'Money arrives', color: 'aqua', front: '6 tools', unit: 'one agent', badges: ['real', 'sample'], stack: ['Amazon Bedrock', 'Fastify', 'Prisma', 'Expo'],
    usp: 'Your Money. Growing Roots.',
    port: 'The score formula, the RM200 cap, the RM50 confirm rule and the 5-in-10-minutes freeze are ported from the repo. The split and the tool replies are a sample plan.',
    links: [['Code', 'https://github.com/AsynchronousNotAvailable/TngHack']] },
];
export const BADGE = { real: 'Runs the real logic', replay: 'Replay of real data', sample: 'Sample data' };

/* the little loop on each card face */
export const MINI = {
  maxis: '<i></i><i></i><i></i><i></i><i></i><b></b>', iz: '<b></b><i></i>', crux: '<i></i><i></i><i></i><b></b>', bina: '<i></i><i></i><i></i>',
  flood: '<i></i><i></i><i></i><i></i>', niaga: '<i></i>'.repeat(7),
  akar: '<svg viewBox="0 0 96 44"><path pathLength="1" d="M48 0C48 26 14 16 12 44"/><path pathLength="1" d="M48 0V44"/><path pathLength="1" d="M48 0C48 26 82 16 84 44"/></svg>',
};

/* Which card does a chat answer point at? A case-study path wins (the chat is told to give one), then the project named first.
   ponytail: plain substring match; "Maxis" alone is the last resort because it is also the employer. */
const NAMES = { iz: ['iz finance'], crux: ['crux'], bina: ['bina'], flood: ['urbanfloodbench', 'flood'], niaga: ['niagamap'], akar: ['akarswarm'], maxis: ['multi-agent', 'bedrock'] };
export function cardFor(text) {
  const slug = (text.match(/\/work\/([a-z0-9-]+)/) || [])[1], bySlug = slug && PROJECTS.find(p => p.slug === slug);
  if (bySlug) return bySlug.id;
  const t = text.toLowerCase(); let best = null, at = Infinity;
  for (const id in NAMES) for (const w of NAMES[id]) { const i = t.indexOf(w); if (i >= 0 && i < at) { at = i; best = id; } }
  return best || (t.includes('maxis') ? 'maxis' : null);
}
