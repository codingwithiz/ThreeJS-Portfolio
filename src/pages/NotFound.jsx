import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  useEffect(() => {
    const prev = document.title;
    document.title = '404 — Page not found · Ing Zhen Lee';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <section className="grain section-shell flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-xs uppercase tracking-[.3em] text-amber">Error 404</p>
      <h1
        className="mt-4 font-display font-black leading-none text-ink"
        style={{ fontSize: 'clamp(4rem,18vw,11rem)' }}>
        4<span className="text-amber">0</span>4
      </h1>
      <p className="mt-2 max-w-md text-ink-muted">
        This page wandered off the map. Let&apos;s get you back to solid ground.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="rounded-2xl bg-amber px-6 py-3.5 font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(227,168,87,.3)]">
          Back home
        </Link>
        <Link
          to="/blog"
          className="rounded-2xl border border-edge px-6 py-3.5 font-semibold text-ink transition-colors duration-200 hover:border-amber/60 hover:text-amber">
          Read the blog
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
