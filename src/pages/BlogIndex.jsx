import { Link } from 'react-router-dom';

import { readingTime } from '../content/posts.js';
import { usePosts } from '../lib/useContent.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const BlogIndex = () => {
  const posts = usePosts();

  return (
    <section className="section-shell min-h-[80vh]">
      <p className="label">Writing</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">Field notes</h1>
      <p className="mt-4 max-w-xl text-lg text-ink-muted">
        Occasional notes on AI, automation, competitions and building things that ship.
      </p>

      <ul className="mt-10 border-t border-edge">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/blog/${p.slug}`}
              className="group grid gap-x-8 gap-y-2 border-b border-edge py-6 md:grid-cols-[11rem_minmax(0,1fr)]">
              <span className="label pt-1.5">
                {fmtDate(p.date)}
                <span className="md:block"> · {readingTime(p.content)} min</span>
              </span>
              <span>
                <span className="block font-display text-2xl font-bold text-ink group-hover:text-amber">{p.title}</span>
                <span className="mt-2 block max-w-2xl text-ink-muted">{p.excerpt}</span>
                <span className="label mt-3 block">{p.tags.join(' · ')}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BlogIndex;
