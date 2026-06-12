import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { readingTime } from '../content/posts.js';
import { usePosts } from '../lib/useContent.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const BlogIndex = () => {
  const posts = usePosts();

  return (
    <section className="grain section-shell min-h-[80vh] pt-32">
      <div className="flex items-center gap-3">
        <span className="h-px w-10 bg-amber" />
        <span className="text-xs uppercase tracking-[.3em] text-amber">Writing</span>
      </div>
      <h1 className="section-title mt-4 max-w-2xl">
        Thoughts &amp; <span className="font-display italic text-amber">field notes</span>.
      </h1>
      <p className="mt-4 max-w-xl text-ink-muted">
        Occasional notes on AI, automation, competitions, and building things that actually ship.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <motion.div key={p.slug} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={reveal}>
            <Link to={`/blog/${p.slug}`} className="card group flex h-full flex-col">
              {p.cover && (
                <img
                  src={p.cover}
                  alt=""
                  className="mb-4 aspect-video w-full rounded-xl border border-edge object-cover"
                />
              )}
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span>{fmtDate(p.date)}</span>
                <span>·</span>
                <span>{readingTime(p.content)} min read</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink transition-colors group-hover:text-amber">
                {p.title}
              </h2>
              <p className="mt-3 text-ink-muted">{p.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-edge px-2.5 py-1 text-xs text-ink-muted">
                    {t}
                  </span>
                ))}
              </div>
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-amber">
                Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogIndex;
