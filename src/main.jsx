import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';

import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import './index.css';

// Blog pages (and the markdown renderer) load only when visited
const BlogIndex = lazy(() => import('./pages/BlogIndex.jsx'));
const Post = lazy(() => import('./pages/Post.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-sm text-ink-muted/60">Loading…</div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
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
    </MotionConfig>
  </StrictMode>,
);
