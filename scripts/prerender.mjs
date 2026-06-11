/**
 * Post-build step (runs via `postbuild`). For each blog post it:
 *   1. generates a designed 1200×630 OG card  → dist/og/<slug>.png
 *   2. writes a per-post HTML file with correct <title> + canonical + Open Graph
 *      + Twitter + JSON-LD BlogPosting        → dist/blog/<slug>/index.html
 * It also designs the default site card + a /blog index card.
 *
 * Posts are read from Sanity at build time (so a publish + rebuild refreshes the
 * cards/meta), falling back to src/content/posts.js if Sanity is unreachable.
 * The per-post HTML is a clone of the built dist/index.html with a patched <head>,
 * so it boots the exact same SPA — crawlers read the meta, users get the app.
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import process from 'node:process';

import { renderOgCard } from './lib/og.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://ingzhenlee-portfolio.vercel.app').replace(/\/$/, '');
const PROJECT = '2tg2gccb';
const DATASET = 'production';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function fetchPosts() {
  try {
    const q = `*[_type=="post"]|order(date desc){title,"slug":slug.current,date,excerpt,tags}`;
    const url = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (Array.isArray(json.result) && json.result.length) return json.result;
    throw new Error('empty result');
  } catch (e) {
    console.warn('  · Sanity fetch failed, using local posts.js:', e.message);
    const { posts } = await import('../src/content/posts.js');
    return posts.map((p) => ({ title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt, tags: p.tags }));
  }
}

function upsertMeta(html, attr, key, content) {
  // Matches both single-line and multi-line <meta …> tags (attributes may sit on
  // separate lines in the source index.html).
  const re = new RegExp(`<meta\\b[^>]*?${attr}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function patchHead(html, { title, description, url, image, type = 'website', extraLd }) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = out.replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${esc(url)}" />`);
  if (description) out = upsertMeta(out, 'name', 'description', description);
  out = upsertMeta(out, 'property', 'og:type', type);
  out = upsertMeta(out, 'property', 'og:url', url);
  out = upsertMeta(out, 'property', 'og:title', title);
  if (description) out = upsertMeta(out, 'property', 'og:description', description);
  out = upsertMeta(out, 'property', 'og:image', image);
  out = upsertMeta(out, 'name', 'twitter:title', title);
  if (description) out = upsertMeta(out, 'name', 'twitter:description', description);
  out = upsertMeta(out, 'name', 'twitter:image', image);
  if (extraLd) {
    out = out.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(extraLd)}</script>\n  </head>`);
  }
  return out;
}

async function run() {
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');
  const ogDir = join(DIST, 'og');
  mkdirSync(ogDir, { recursive: true });

  // 1. Default site card + patch the homepage's OG image to it.
  writeFileSync(
    join(ogDir, 'default.png'),
    await renderOgCard({
      eyebrow: 'Portfolio',
      title: 'Software Engineer building AI & automation that ships.',
      footer: 'Ing Zhen Lee — AI + RPA at Maxis',
    }),
  );
  let home = upsertMeta(template, 'property', 'og:image', `${SITE}/og/default.png`);
  home = upsertMeta(home, 'name', 'twitter:image', `${SITE}/og/default.png`);
  writeFileSync(join(DIST, 'index.html'), home);

  // 2. /blog index card + meta.
  writeFileSync(
    join(ogDir, 'blog.png'),
    await renderOgCard({ eyebrow: 'Writing', title: 'Thoughts & field notes.', footer: 'Ing Zhen Lee — Software Engineer (AI & RPA)' }),
  );
  mkdirSync(join(DIST, 'blog'), { recursive: true });
  writeFileSync(
    join(DIST, 'blog', 'index.html'),
    patchHead(template, {
      title: 'Writing — Ing Zhen Lee',
      description: 'Notes on AI, automation, competitions, and building things that actually ship.',
      url: `${SITE}/blog`,
      image: `${SITE}/og/blog.png`,
    }),
  );
  console.log('  ✓ /blog');

  // 3. Per-post cards + HTML.
  const posts = await fetchPosts();
  for (const post of posts) {
    const image = `${SITE}/og/${post.slug}.png`;
    const url = `${SITE}/blog/${post.slug}`;
    writeFileSync(
      join(ogDir, `${post.slug}.png`),
      await renderOgCard({
        eyebrow: `Field notes · ${(post.tags && post.tags[0]) || 'Writing'}`,
        title: post.title,
        footer: 'Ing Zhen Lee — Software Engineer (AI & RPA)',
      }),
    );

    const html = patchHead(template, {
      title: `${post.title} — Ing Zhen Lee`,
      description: post.excerpt || '',
      url,
      image,
      type: 'article',
      extraLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt || '',
        datePublished: new Date(post.date).toISOString(),
        image,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: 'Lee Ing Zhen', url: SITE },
        publisher: { '@type': 'Person', name: 'Lee Ing Zhen' },
        keywords: (post.tags || []).join(', '),
      },
    }).replace('</head>', `    <meta property="article:published_time" content="${new Date(post.date).toISOString()}" />\n  </head>`);

    const dir = join(DIST, 'blog', post.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    console.log('  ✓ /blog/' + post.slug);
  }

  console.log(`\n✅ Prerendered ${posts.length} post page(s) + ${posts.length + 2} OG cards → dist/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
