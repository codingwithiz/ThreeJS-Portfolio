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
      document.title = 'Ing Zhen Lee — Software Engineer (AI & Automation)';
      if (meta && prev) meta.setAttribute('content', prev);
    };
  }, [post]);

  if (!post) {
    if (loading) {
      return (
        <section className="section-shell flex min-h-screen items-center justify-center">
          <span className="text-sm text-ink-muted">Loading…</span>
        </section>
      );
    }
    return <Navigate to="/blog" replace />;
  }

  return (
    <article className="section-shell min-h-screen">
      <Link to="/blog" className="label inline-flex min-h-11 items-center gap-1.5 hover:text-amber">
        <ArrowLeft className="h-4 w-4" /> All writing
      </Link>

      <div className="label mt-6 flex items-center gap-2">
        <span>{fmtDate(post.date)}</span>
        <span>·</span>
        <span>{readingTime(post.content)} min read</span>
      </div>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
        {post.title}
      </h1>
      <p className="label mt-5">{post.tags.join(' · ')}</p>

      {post.cover && (
        <img
          src={post.cover}
          alt=""
          className="mt-8 aspect-video w-full max-w-3xl rounded-sm border border-edge object-cover"
        />
      )}

      <div className="prose-terra mt-10 max-w-3xl">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Keep reading */}
      {(newer || older) && (
        <nav className="mt-16 grid border-t border-edge sm:grid-cols-2">
          {newer ? (
            <Link to={`/blog/${newer.slug}`} className="group border-b border-edge py-5 sm:border-b-0 sm:border-r sm:pr-6">
              <span className="label inline-flex items-center gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" /> Newer
              </span>
              <p className="mt-2 font-display text-lg font-bold text-ink group-hover:text-amber">
                {newer.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {older ? (
            <Link to={`/blog/${older.slug}`} className="group py-5 sm:pl-6 sm:text-right">
              <span className="label inline-flex items-center gap-1.5">
                Older <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <p className="mt-2 font-display text-lg font-bold text-ink group-hover:text-amber">
                {older.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}

      <div className="mt-10">
        <Link to="/blog" className="link">
          <ArrowLeft className="h-4 w-4" /> Back to all writing
        </Link>
      </div>
    </article>
  );
};

export default Post;
