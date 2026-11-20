import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

import Layout from './components/Layout.jsx';
import Work from './pages/Work.jsx';
import Home from './pages/Home.jsx';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/caveat/latin-600.css';
import './index.css';
import './live/table.css';

// Blog pages (and the markdown renderer) load only when visited
const BlogIndex = lazy(() => import('./pages/BlogIndex.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// While a lazy page loads on the first visit, keep showing the prerendered copy of that page (index.html's
// static block) rather than "Loading…": the reader is already looking at it.
const FIRST = { path: window.location.pathname, html: document.querySelector('#root main')?.innerHTML || '' };
const PageFallback = () =>
  FIRST.html && window.location.pathname === FIRST.path ? (
    <div dangerouslySetInnerHTML={{ __html: FIRST.html }} />
  ) : (
    <div className="flex min-h-screen items-center justify-center text-sm text-ink-muted/60">Loading…</div>
  );

// The static block in index.html is the first paint (and the LCP). React replaces it, so wait until the browser
// has reported that paint: replacing the nodes any earlier drops them from LCP. Without paint timing, the next frame.
if (PerformanceObserver.supportedEntryTypes?.includes('paint')) {
  new PerformanceObserver((list, obs) => {
    if (list.getEntriesByName('first-contentful-paint').length) {
      obs.disconnect();
      setTimeout(mount);
    }
  }).observe({ type: 'paint', buffered: true });
} else {
  requestAnimationFrame(() => setTimeout(mount));
}

function mount() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route
              path="/blog"
              element={
                <Suspense fallback={<PageFallback />}>
                  <BlogIndex />
                </Suspense>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Post />
                </Suspense>
              }
            />
            <Route path="/work/:slug" element={<Work />} />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageFallback />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        <Analytics />
      </BrowserRouter>
    </StrictMode>,
  );
}
