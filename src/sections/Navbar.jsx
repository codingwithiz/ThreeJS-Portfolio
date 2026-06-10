import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { navLinks, profile } from '../constants/index.js';

const sectionIds = ['home', ...navLinks.map((l) => l.href.replace('#', ''))];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const onBlog = pathname.startsWith('/blog');

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const onScroll = () => {
      const top = window.scrollY;
      setScrolled(top > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? (top / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || !onHome ? 'border-b border-edge/60 bg-bg/85 backdrop-blur-md' : 'bg-transparent'
      }`}>
      <div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-amber"
        style={{ transform: `scaleX(${progress / 100})` }}
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link to="/" onClick={closeMenu} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-edge bg-surface font-display text-sm font-bold text-amber transition-colors group-hover:border-amber/60">
            {profile.initials}
          </span>
          <span className="font-display text-lg font-semibold text-ink">
            {profile.name}
            <span className="text-amber">.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const id = l.href.replace('#', '');
            const on = onHome && active === id;
            return (
              <Link
                key={l.id}
                to={`/${l.href}`}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  on ? 'text-ink' : 'text-ink-muted hover:text-ink'
                }`}>
                {l.name}
                {on && <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-amber" />}
              </Link>
            );
          })}
          <Link
            to="/blog"
            className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
              onBlog ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}>
            Blog
            {onBlog && <span className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-amber" />}
          </Link>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-xl bg-amber px-4 py-2 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5">
            Résumé
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="text-ink md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}>
          {isOpen ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`overflow-hidden border-edge/60 bg-bg/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          isOpen ? 'max-h-[32rem] border-t' : 'max-h-0'
        }`}>
        <div className="flex flex-col gap-1 px-5 py-4">
          {navLinks.map((l) => {
            const id = l.href.replace('#', '');
            const on = onHome && active === id;
            return (
              <Link
                key={l.id}
                to={`/${l.href}`}
                onClick={closeMenu}
                className={`rounded-lg px-3 py-3 text-base transition-colors ${
                  on ? 'bg-surface text-amber' : 'text-ink-muted hover:text-ink'
                }`}>
                {l.name}
              </Link>
            );
          })}
          <Link
            to="/blog"
            onClick={closeMenu}
            className={`rounded-lg px-3 py-3 text-base transition-colors ${
              onBlog ? 'bg-surface text-amber' : 'text-ink-muted hover:text-ink'
            }`}>
            Blog
          </Link>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
            className="mt-2 rounded-xl bg-amber px-4 py-3 text-center text-base font-semibold text-bg">
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
