/**
 * Post-build step (runs via `postbuild`). For each blog post it:
 *   1. generates a designed 1200×630 OG card  → dist/og/<slug>.png
 *   (case studies in src/content/systems.js get the same treatment under /work/<slug>)
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
import { postStatic, indexStatic } from './lib/post-static.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://ingzhenlee-portfolio.vercel.app').replace(/\/$/, '');
const PROJECT = '2tg2gccb';
const DATASET = 'production';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function fetchPosts() {
  try {
    const q = `*[_type=="post"]|order(date desc){title,"slug":slug.current,date,excerpt,tags,"content":body,"cover":coverImage.asset->url}`;
    const url = `https://${PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${DATASET}?query=${encodeURIComponent(q)}`;
    const res = await fetch(url);
    const json = await res.json();
    if (Array.isArray(json.result) && json.result.length) return json.result;
    throw new Error('empty result');
  } catch (e) {
    console.warn('  · Sanity fetch failed, using local posts.js:', e.message);
    const { posts } = await import('../src/content/posts.js');
    return posts.map((p) => ({ title: p.title, slug: p.slug, date: p.date, excerpt: p.excerpt, tags: p.tags, content: p.content, cover: p.cover }));
  }
}

function upsertMeta(html, attr, key, content) {
  // Matches both single-line and multi-line <meta …> tags (attributes may sit on
  // separate lines in the source index.html).
  const re = new RegExp(`<meta\\b[^>]*?${attr}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${esc(content)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

const STATIC_NAV = `<nav class="pnav" aria-label="Site"><div class="pnav-in"><a class="pnav-m" href="/" aria-label="IZ, Lee Ing Zhen, home">IZ</a></div></nav>`;

// Swap the home page's static hero for this page's own heading, so the first paint
// (and what a crawler reads) matches the URL.
function patchStatic(html, { label, heading, text, card, post, posts }) {
  // A post opens as the whole article, the blog as its full list (scripts/lib/post-static.mjs mirrors the pages).
  const page = post ? postStatic(post) : posts ? indexStatic(posts) : '';
  if (page) return html.replace(/<!--static-->[\s\S]*?<!--\/static-->/, () => `<!--static--><div class="proto">${STATIC_NAV}<main>${page}</main></div><!--/static-->`);
  // A case page opens as its card. This mirrors the header in src/pages/Work.jsx so nothing moves when React mounts.
  const block = card
    ? `<!--static-->
      <div class="proto">
        ${STATIC_NAV}
      <main>
        <article class="section-shell" style="--c:${esc(card.color)}">
          <header class="case-card">
            <a href="/#hand" class="label inline-flex min-h-11 items-center gap-1.5">← Back to the hand</a>
            <div class="mt-2 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
              <div class="min-w-0 max-w-3xl">
                <p class="label">${esc(label)}</p>
                <h1 class="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-6xl">${esc(heading)}</h1>
                <p class="mt-5 max-w-2xl text-lg font-medium">${esc(text)}</p>
              </div>
              <p class="shrink-0">
                <span class="block font-display text-6xl font-bold leading-[0.9] tracking-tight sm:text-8xl">${esc(card.big)}</span>
                <span class="mt-2 block max-w-[14rem] font-medium">${esc(card.cap)}</span>
              </p>
            </div>
          </header>
        </article>
      </main>
      </div>
    <!--/static-->`
    : `<!--static-->
      <div class="proto">
        ${STATIC_NAV}
      <main>
        <section class="section-shell">
          <p class="label">${esc(label)}</p>
          <h1 class="mt-3 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl">${esc(heading)}</h1>
          <p class="mt-5 max-w-2xl text-lg text-ink-muted">${esc(text)}</p>
        </section>
      </main>
      </div>
    <!--/static-->`;
  return html.replace(/<!--static-->[\s\S]*?<!--\/static-->/, () => block);
}

function patchHead(html, { title, description, url, image, type = 'website', extraLd, page }) {
  let out = page ? patchStatic(html, page) : html;
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
      title: 'I build systems that take the manual work out.',
      footer: 'Ing Zhen Lee — AI & Automation at Maxis',
    }),
  );
  let home = upsertMeta(template, 'property', 'og:image', `${SITE}/og/default.png`);
  home = upsertMeta(home, 'name', 'twitter:image', `${SITE}/og/default.png`);
  writeFileSync(join(DIST, 'index.html'), home);

  const posts = await fetchPosts();

  // 2. /blog index card + meta.
  writeFileSync(
    join(ogDir, 'blog.png'),
    await renderOgCard({ eyebrow: 'Writing', title: 'Field notes.', footer: 'Ing Zhen Lee — Software Engineer (AI & Automation)' }),
  );
  mkdirSync(join(DIST, 'blog'), { recursive: true });
  writeFileSync(
    join(DIST, 'blog', 'index.html'),
    patchHead(template, {
      title: 'Writing — Ing Zhen Lee',
      description: 'Notes on AI, automation, competitions, and building things that actually ship.',
      url: `${SITE}/blog`,
      image: `${SITE}/og/blog.png`,
      page: { posts },
    }),
  );
  console.log('  ✓ /blog');

  // 3. Per-post cards + HTML.
  for (const post of posts) {
    const image = `${SITE}/og/${post.slug}.png`;
    const url = `${SITE}/blog/${post.slug}`;
    writeFileSync(
      join(ogDir, `${post.slug}.png`),
      await renderOgCard({
        eyebrow: `Field notes · ${(post.tags && post.tags[0]) || 'Writing'}`,
        title: post.title,
        footer: 'Ing Zhen Lee — Software Engineer (AI & Automation)',
      }),
    );

    const html = patchHead(template, {
      title: `${post.title} — Ing Zhen Lee`,
      description: post.excerpt || '',
      url,
      image,
      type: 'article',
      page: { post },
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

  // 4. Case studies: /work/<slug>.
  const { systems } = await import('../src/content/systems.js');
  for (const s of systems) {
    const image = `${SITE}/og/work-${s.slug}.png`;
    writeFileSync(
      join(ogDir, `work-${s.slug}.png`),
      await renderOgCard({ eyebrow: `Case study · ${s.metric}`, title: s.title, footer: 'Ing Zhen Lee — Software Engineer (AI & Automation)', color: s.card.color }),
    );
    const dir = join(DIST, 'work', s.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      join(dir, 'index.html'),
      patchHead(template, {
        title: `${s.title} — Ing Zhen Lee`,
        description: s.summary,
        url: `${SITE}/work/${s.slug}`,
        image,
        type: 'article',
        page: { label: s.kicker, heading: s.title, text: s.summary, card: s.card },
      }),
    );
    console.log('  ✓ /work/' + s.slug);
  }

  console.log(`\n✅ Prerendered ${posts.length} post + ${systems.length} work page(s) → dist/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
