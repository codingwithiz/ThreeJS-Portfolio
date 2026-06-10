import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { getPost, readingTime } from '../content/posts.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const Post = () => {
  const { slug } = useParams();
  const post = getPost(slug);

  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — Ing Zhen Lee`;
    const meta = document.querySelector('meta[name="description"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute('content', post.excerpt);
    return () => {
      document.title = 'Ing Zhen Lee — Software Engineer (AI & RPA)';
      if (meta && prev) meta.setAttribute('content', prev);
    };
  }, [post]);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <article className="grain section-shell min-h-screen pt-32">
      <Link to="/blog" className="text-sm text-ink-muted underline-offset-4 transition-colors hover:text-amber hover:underline">
        ← All writing
      </Link>

      <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-[.15em] text-ink-muted">
        <span>{fmtDate(post.date)}</span>
        <span>·</span>
        <span>{readingTime(post.content)} min read</span>
      </div>
      <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
        {post.title}
      </h1>
      <div className="mt-5 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full border border-edge px-2.5 py-1 text-xs text-ink-muted">
            {t}
          </span>
        ))}
      </div>

      <div className="prose-terra mt-10 max-w-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <div className="mt-16 border-t border-edge pt-8">
        <Link to="/blog" className="text-sm font-medium text-amber">
          ← Back to all writing
        </Link>
      </div>
    </article>
  );
};

export default Post;
