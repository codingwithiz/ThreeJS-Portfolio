import { useEffect, useState } from 'react';

import { myProjects, honors } from '../constants/index.js';
import { posts as fallbackPosts, getPost as getFallbackPost } from '../content/posts.js';

const byOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);

/**
 * Content read layer. Every hook renders the bundled `constants` / `posts.js`
 * content immediately — so the page is never empty, the prerender has data, and
 * the site keeps working even if Sanity is unreachable — then swaps in live
 * Sanity content once it loads. A failed/empty fetch silently keeps the fallback.
 *
 * The Sanity client is imported lazily (dynamic import) so @sanity/client stays
 * out of the initial bundle; it only loads after first paint, and because the
 * fallback is the same content, the swap is invisible.
 */
function useSanityList(queryName, mapName, initFallback) {
  const [data, setData] = useState(initFallback);
  useEffect(() => {
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
  }, [queryName, mapName]);
  return data;
}

export function useProjects() {
  return useSanityList('projectsQuery', 'mapProject', () => [...myProjects].sort(byOrder));
}

export function useAwards() {
  return useSanityList('awardsQuery', 'mapAward', () => honors);
}

export function usePosts() {
  return useSanityList('postsQuery', 'mapPost', () => fallbackPosts);
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
