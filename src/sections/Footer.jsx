import { profile } from '../constants/index.js';

const socials = [
  { name: 'GitHub', href: profile.socials.github, icon: '/assets/github.svg' },
  { name: 'LinkedIn', href: profile.socials.linkedin, icon: '/assets/linkedin.svg' },
  { name: 'Instagram', href: profile.socials.instagram, icon: '/assets/instagram.svg' },
];

const Footer = () => {
  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <div>
          <a href="#home" className="font-display text-lg font-semibold text-ink">
            {profile.name}
            <span className="text-amber">.</span>
          </a>
          <p className="mt-1 text-sm text-ink-muted">{profile.tagline}</p>
        </div>

        <div className="flex items-center gap-3">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.name}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-edge bg-surface transition-colors hover:border-amber/60">
              <img
                src={s.icon}
                alt=""
                className="h-1/2 w-1/2 object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-edge/50">
        <p className="mx-auto max-w-7xl px-5 py-4 text-xs text-ink-muted sm:px-8 lg:px-12">
          © {new Date().getFullYear()} {profile.fullName}. Built with React, Three.js &amp; lots of ☕.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
