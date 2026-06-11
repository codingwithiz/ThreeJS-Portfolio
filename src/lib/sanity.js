import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID || '2tg2gccb';
export const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET || 'production';

export const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanity);
export const urlFor = (src) => builder.image(src);

// ── GROQ queries ─────────────────────────────────────────────────────
export const projectsQuery = `*[_type=="project"]|order(order asc){
  _id,title,order,description,detail,impact,award,liveUrl,codeUrl,tags,accentColor,videoPath,"logo":logo.asset->url
}`;
export const awardsQuery = `*[_type=="award"]|order(order asc){
  _id,title,order,issuer,date,prize,featured,blurb,"image":image.asset->url
}`;
export const postsQuery = `*[_type=="post"]|order(date desc){
  _id,title,"slug":slug.current,date,excerpt,tags,body,"cover":coverImage.asset->url
}`;
export const postBySlugQuery = `*[_type=="post" && slug.current==$slug][0]{
  _id,title,"slug":slug.current,date,excerpt,tags,"cover":coverImage.asset->url,body
}`;

// Tag name -> local brand icon (undefined => text-only chip, handled by the UI)
const TAG_ICONS = {
  'React.js': '/assets/tech/react.svg',
  React: '/assets/tech/react.svg',
  'React Native': '/assets/tech/react.svg',
  TypeScript: '/assets/tech/typescript.svg',
  JavaScript: '/assets/tech/javascript.svg',
  Python: '/assets/tech/python.svg',
  Java: '/assets/tech/java.svg',
  Solidity: '/assets/tech/solidity.svg',
  'Tailwind CSS': '/assets/tech/tailwindcss.svg',
  TailwindCSS: '/assets/tech/tailwindcss.svg',
  'Node.js': '/assets/tech/nodejs.svg',
  Firebase: '/assets/tech/firebase.svg',
  MongoDB: '/assets/tech/mongodb.svg',
  PostgreSQL: '/assets/tech/postgresql.svg',
  OpenAI: '/assets/openai.png',
  Gemma: '/assets/tech/gemma.svg',
  Kotlin: '/assets/tech/kotlin.svg',
  'scikit-learn': '/assets/tech/scikitlearn.svg',
  Streamlit: '/assets/tech/streamlit.svg',
  Plotly: '/assets/tech/plotly.svg',
  ArcGIS: '/assets/tech/arcgis.svg',
  'MS SQL': '/assets/ms-sql.png',
  Azure: '/assets/azure-logo.png',
  IoT: '/assets/IoT-logo.jpg',
};
export const tagIcon = (name) => TAG_ICONS[name];

// ── Map Sanity docs -> the shape the existing components expect ──────
export const mapProject = (d) => ({
  title: d.title,
  order: d.order ?? 99,
  desc: d.description || '',
  subdesc: d.detail || '',
  impact: d.impact || '',
  award: d.award || undefined,
  github: d.codeUrl || '',
  demo: d.liveUrl || '',
  texture: d.videoPath || '',
  logo: d.logo || undefined,
  logoStyle: {
    backgroundColor: d.accentColor || '#211B14',
    border: '0.2px solid #33291E',
    boxShadow: `0px 0px 60px 0px ${d.accentColor || '#E3A857'}33`,
  },
  tags: (d.tags || []).map((name, i) => ({ id: i + 1, name, path: tagIcon(name) })),
});

export const mapAward = (d) => ({
  title: d.title,
  order: d.order ?? 99,
  issuer: d.issuer || '',
  date: d.date || '',
  prize: d.prize || undefined,
  featured: !!d.featured,
  blurb: d.blurb || '',
  image: d.image || undefined,
});

export const mapPost = (d) => ({
  title: d.title,
  slug: d.slug,
  date: d.date,
  excerpt: d.excerpt || '',
  tags: d.tags || [],
  cover: d.cover || undefined,
  content: d.body || '',
});
