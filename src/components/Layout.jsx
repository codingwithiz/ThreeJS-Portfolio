import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import Navbar from '../sections/Navbar.jsx';
import Footer from '../sections/Footer.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
};

const Layout = () => {
  const { pathname, hash } = useLocation();

  // Scroll to the target section on hash navigation (retrying while it mounts),
  // otherwise scroll to top on route change.
  useEffect(() => {
    if (hash) {
      const scrollToEl = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:font-semibold focus:text-bg">
        Skip to content
      </a>

      <Navbar />

      <main id="main" className="relative mx-auto max-w-7xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={pathname} variants={pageVariants} initial="initial" animate="enter" exit="exit">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
};

export default Layout;
