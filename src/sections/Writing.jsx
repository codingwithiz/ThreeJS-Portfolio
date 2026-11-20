import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { usePosts } from '../lib/useContent.js';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

const Writing = () => {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  const posts = usePosts(near).slice(0, 3);

  // The Sanity client loads only once this section is close, so it stays off the first load.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), {
      rootMargin: '800px',
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id="writing" className="sec">
      <div className="sec-h">
        <h2>Writing</h2>
      </div>

      <ul className="wr">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to={`/blog/${p.slug}`}>
              <time dateTime={p.date}>{fmtDate(p.date)}</time>
              <b>{p.title}</b>
              <span>{p.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/blog" className="wr-more">
        All posts →
      </Link>
    </section>
  );
};

export default Writing;
