// The top of a post page as static HTML, for the prerender. It mirrors src/pages/Post.jsx (same classes,
// same markdown plugins), so the first paint is the whole article and nothing moves when React takes over.
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft } from 'lucide-react';

import { readingTime } from '../../src/content/posts.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

// The blog index, mirroring src/pages/BlogIndex.jsx.
export const indexStatic = (posts) =>
  renderToStaticMarkup(
    h(
      'section',
      { className: 'section-shell min-h-[80vh]' },
      h('p', { className: 'label' }, 'Writing'),
      h('h1', { className: 'mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl' }, 'Field notes'),
      h('p', { className: 'mt-4 max-w-xl text-lg text-ink-muted' }, 'Occasional notes on AI, automation, competitions and building things that ship.'),
      h(
        'ul',
        { className: 'mt-10 border-t border-edge' },
        posts.map((p) =>
          h(
            'li',
            { key: p.slug },
            h(
              'a',
              { href: `/blog/${p.slug}`, className: 'group grid gap-x-8 gap-y-2 border-b border-edge py-6 md:grid-cols-[11rem_minmax(0,1fr)]' },
              h('span', { className: 'label pt-1.5' }, fmtDate(p.date), h('span', { className: 'md:block' }, ' · ', readingTime(p.content), ' min')),
              h(
                'span',
                null,
                h('span', { className: 'block font-display text-2xl font-bold text-ink group-hover:text-amber' }, p.title),
                h('span', { className: 'mt-2 block max-w-2xl text-ink-muted' }, p.excerpt),
                h('span', { className: 'label mt-3 block' }, (p.tags || []).join(' · ')),
              ),
            ),
          ),
        ),
      ),
    ),
  );

export const postStatic = (post) =>
  renderToStaticMarkup(
    h(
      'article',
      { className: 'section-shell min-h-screen' },
      h('a', { href: '/blog', className: 'label inline-flex min-h-11 items-center gap-1.5 hover:text-amber' }, h(ArrowLeft, { className: 'h-4 w-4' }), ' All writing'),
      h('div', { className: 'label mt-6 flex items-center gap-2' }, h('span', null, fmtDate(post.date)), h('span', null, '·'), h('span', null, readingTime(post.content), ' min read')),
      h('h1', { className: 'mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl' }, post.title),
      h('p', { className: 'label mt-5' }, (post.tags || []).join(' · ')),
      post.cover && h('img', { src: post.cover, alt: '', className: 'mt-8 aspect-video w-full max-w-3xl rounded-sm border border-edge object-cover' }),
      h('div', { className: 'prose-terra mt-10 max-w-3xl' }, h(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] }, post.content)),
    ),
  );
