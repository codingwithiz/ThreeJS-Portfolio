/**
 * One-time migration: pushes current projects, awards and blog posts into Sanity,
 * uploading project logos + award photos as image assets.
 *
 * Usage (PowerShell):
 *   $env:SANITY_WRITE_TOKEN="<token with write access>"; node scripts/seed-sanity.mjs
 * Create a token at: sanity.io → your project → API → Tokens (Editor/Write).
 *
 * Idempotent: documents use stable _ids via createOrReplace, so re-running after a
 * transient failure (e.g. a 502 from the asset CDN) simply overwrites and continues.
 */
import { createClient } from '@sanity/client';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import process from 'node:process';

import { myProjects, honors } from '../src/constants/index.js';
import { posts } from '../src/content/posts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const token = process.env.SANITY_WRITE_TOKEN;
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Create one at sanity.io → project → API → Tokens (write).');
  process.exit(1);
}

const client = createClient({
  projectId: '2tg2gccb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Retries on 5xx / 429 / network errors with exponential backoff. Sanity's asset
// endpoint occasionally returns a transient 502; without this a single hiccup
// would abort the whole seed.
async function withRetry(fn, label, attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      const status = e?.statusCode || e?.response?.statusCode;
      const retriable = !status || status >= 500 || status === 429;
      if (i === attempts || !retriable) throw e;
      const wait = 800 * 2 ** (i - 1); // 0.8s → 1.6s → 3.2s → 6.4s
      console.warn(`   · ${label} failed (${status || 'network'}); retry ${i}/${attempts - 1} in ${wait}ms`);
      await sleep(wait);
    }
  }
}

const slugify = (s) =>
  s
    .split(' - ')[0]
    .split(' — ')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);

const imageCache = new Map();
async function uploadImage(publicPath) {
  if (!publicPath) return undefined;
  if (imageCache.has(publicPath)) return imageCache.get(publicPath);
  const file = join(PUBLIC, publicPath.replace(/^\//, ''));
  if (!existsSync(file)) {
    console.warn('   · image not found, skipping:', publicPath);
    return undefined;
  }
  const bytes = readFileSync(file);
  const asset = await withRetry(
    () => client.assets.upload('image', bytes, { filename: publicPath.split('/').pop() }),
    'upload ' + publicPath,
  );
  const ref = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  imageCache.set(publicPath, ref);
  return ref;
}

async function run() {
  for (const p of myProjects) {
    const logo = await uploadImage(p.logo);
    const doc = {
      _id: 'project-' + slugify(p.title),
      _type: 'project',
      title: p.title,
      order: p.order ?? 99,
      description: p.desc,
      detail: p.subdesc,
      impact: p.impact || '',
      award: p.award,
      liveUrl: p.demo || undefined,
      codeUrl: p.github || undefined,
      tags: (p.tags || []).map((t) => t.name),
      accentColor: p.logoStyle?.backgroundColor,
      videoPath: p.texture,
      ...(logo ? { logo } : {}),
    };
    await withRetry(() => client.createOrReplace(doc), 'project ' + p.title);
    console.log('project ✓', p.title);
  }

  for (let i = 0; i < honors.length; i++) {
    const a = honors[i];
    const image = await uploadImage(a.image);
    const doc = {
      _id: 'award-' + slugify(a.title),
      _type: 'award',
      title: a.title,
      order: i + 1,
      issuer: a.issuer || '',
      date: a.date || '',
      prize: a.prize,
      featured: !!a.featured,
      blurb: a.blurb || '',
      ...(image ? { image } : {}),
    };
    await withRetry(() => client.createOrReplace(doc), 'award ' + a.title);
    console.log('award ✓', a.title);
  }

  for (const post of posts) {
    const doc = {
      _id: 'post-' + post.slug,
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      date: new Date(post.date).toISOString(),
      excerpt: post.excerpt || '',
      tags: post.tags || [],
      body: post.content || '',
    };
    await withRetry(() => client.createOrReplace(doc), 'post ' + post.title);
    console.log('post ✓', post.title);
  }

  console.log('\n✅ Seed complete — open the Studio to review/edit.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
