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
    <section className="section-shell flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="label">Error 404</p>
      <h1
        className="mt-4 font-display font-bold leading-none text-ink"
        style={{ fontSize: 'clamp(4rem,18vw,11rem)' }}>
        4<span className="text-amber">0</span>4
      </h1>
      <p className="mt-2 max-w-md text-ink-muted">
        Nothing runs at this address.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="btn">
          Back home
        </Link>
        <Link
          to="/blog"
          className="btn quiet">
          Read the blog
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
