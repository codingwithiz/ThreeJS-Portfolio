import { useEffect, useState } from 'react';

import { posts as fallbackPosts, getPost as getFallbackPost } from '../content/posts.js';

/**
 * Content read layer. Every hook renders the bundled `posts.js`
 * content immediately — so the page is never empty, the prerender has data, and
 * the site keeps working even if Sanity is unreachable — then swaps in live
 * Sanity content once it loads. A failed/empty fetch silently keeps the fallback.
 *
 * The Sanity client is imported lazily (dynamic import) so @sanity/client stays
 * out of the initial bundle; it only loads after first paint, and because the
 * fallback is the same content, the swap is invisible.
 */
function useSanityList(queryName, mapName, initFallback, enabled = true) {
  const [data, setData] = useState(initFallback);
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    import('./sanity.js')
      .then((m) => m.sanity.fetch(m[queryName]).then((rows) => ({ rows, map: m[mapName] })))
      .then(({ rows, map }) => {
        if (alive && Array.isArray(rows) && rows.length) setData(rows.map(map));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [queryName, mapName, enabled]);
  return data;
}

// `enabled` lets a below-the-fold caller hold the Sanity fetch until it is near the viewport.
export function usePosts(enabled = true) {
  return useSanityList('postsQuery', 'mapPost', () => fallbackPosts, enabled);
}

export function usePost(slug) {
  const [state, setState] = useState(() => ({ post: getFallbackPost(slug), loading: true }));
  useEffect(() => {
    let alive = true;
    setState({ post: getFallbackPost(slug), loading: true });
    import('./sanity.js')
      .then((m) => m.sanity.fetch(m.postBySlugQuery, { slug }).then((doc) => ({ doc, map: m.mapPost })))
      .then(({ doc, map }) => {
        if (alive) setState({ post: doc ? map(doc) : getFallbackPost(slug), loading: false });
      })
      .catch(() => {
        if (alive) setState({ post: getFallbackPost(slug), loading: false });
      });
    return () => {
      alive = false;
    };
  }, [slug]);
  return state;
}
