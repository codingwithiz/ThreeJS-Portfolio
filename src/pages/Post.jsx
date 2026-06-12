import { useEffect, useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { readingTime } from '../content/posts.js';
import { usePost, usePosts } from '../lib/useContent.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const Post = () => {
  const { slug } = useParams();
  const { post, loading } = usePost(slug);
  const allPosts = usePosts();

  const { newer, older } = useMemo(() => {
    const ordered = [...allPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const i = ordered.findIndex((p) => p.slug === slug);
    return {
      newer: i > 0 ? ordered[i - 1] : null,
      older: i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null,
    };
  }, [allPosts, slug]);

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

  if (!post) {
    if (loading) {
      return (
        <section className="grain section-shell flex min-h-screen items-center justify-center pt-32">
          <span className="text-sm text-ink-muted">Loading…</span>
        </section>
      );
    }
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="grain section-shell min-h-screen pt-32">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-ink-muted underline-offset-4 transition-colors hover:text-amber hover:underline">
        <ArrowLeft className="h-4 w-4" /> All writing
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

      {post.cover && (
        <img
          src={post.cover}
          alt=""
          className="mt-8 aspect-video w-full max-w-3xl rounded-2xl border border-edge object-cover"
        />
      )}

      <div className="prose-terra mt-10 max-w-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Keep reading */}
      {(newer || older) && (
        <nav className="mt-16 grid gap-4 border-t border-edge pt-8 sm:grid-cols-2">
          {newer ? (
            <Link to={`/blog/${newer.slug}`} className="card group">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[.15em] text-ink-muted/70">
                <ArrowLeft className="h-3.5 w-3.5" /> Newer
              </span>
              <p className="mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-amber">
                {newer.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {older ? (
            <Link to={`/blog/${older.slug}`} className="card group sm:text-right">
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[.15em] text-ink-muted/70">
                Older <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 font-display text-lg font-semibold text-ink transition-colors group-hover:text-amber">
                {older.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <div className="mt-10">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-amber">
          <ArrowLeft className="h-4 w-4" /> Back to all writing
        </Link>
      </div>
    </article>
  );
};

export default Post;
