import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import Navbar from '../sections/Navbar.jsx';
import Footer from '../sections/Footer.jsx';

// Loaded on first open, so the chat costs nothing until someone asks.
const ChatPanel = lazy(() => import('./ChatPanel.jsx'));

// The first page is already on screen as static HTML, so only later route changes fade in.
const LANDING = window.location.pathname;

const Layout = () => {
  const { pathname, hash } = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const opener = useRef(null);

  // Scroll to the target section on hash navigation (retrying while it mounts),
  // otherwise scroll to top on route change.
  useEffect(() => {
    if (hash) {
      const scrollToEl = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ block: 'start' });
          return true;
        }
        return false;
      };
      if (!scrollToEl()) {
        const t = setTimeout(scrollToEl, 140);
        return () => clearTimeout(t);
      }
      return undefined;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  // The chat opens from the floating button or the dealer; focus goes back to whichever it was.
  const openChat = () => {
    opener.current = document.activeElement;
    setChatOpen(true);
  };
  const closeChat = () => {
    setChatOpen(false);
    opener.current?.focus();
  };

  return (
    <>
      <a href="#main" className="skip">
        Skip to content
      </a>

      {/* .proto is a CSS container, so anything position:fixed has to sit outside it */}
      <div className="proto">
        <Navbar />
        <main id="main">
          <div key={pathname} className={pathname === LANDING ? undefined : 'page-fade'}>
            <Outlet context={{ openChat }} />
          </div>
        </main>
        <Footer />
      </div>

      {/* the home page has the dealer instead */}
      {pathname !== '/' && !chatOpen && (
        <button type="button" onClick={openChat} aria-haspopup="dialog" className="btn sm fixed bottom-4 right-4 z-40">
          <MessageSquare className="h-4 w-4" aria-hidden="true" /> Ask
        </button>
      )}
      {chatOpen && (
        <Suspense fallback={null}>
          <ChatPanel onClose={closeChat} />
        </Suspense>
      )}
    </>
  );
};

export default Layout;
