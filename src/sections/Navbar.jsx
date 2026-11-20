import { Link, useLocation } from 'react-router-dom';

import { navLinks, profile } from '../constants/index.js';

/* One bar on every page. On the home page its right side belongs to the table:
   the step count, the command menu and Play are wired up by live/site.js, which finds them by id. */
const Navbar = () => {
  const onHome = useLocation().pathname === '/';

  return (
    <nav className="pnav" aria-label="Site">
      <div className="pnav-in">
        {onHome ? (
          <a className="pnav-m" href="#hand" aria-label={`IZ, ${profile.fullName}, top of the page`}>
            {profile.initials}
          </a>
        ) : (
          <Link className="pnav-m" to="/" aria-label={`IZ, ${profile.fullName}, home`}>
            {profile.initials}
          </Link>
        )}

        <div className="pnav-l">
          {navLinks.map((l) =>
            onHome ? (
              <a key={l.href} href={l.href}>
                {l.name}
              </a>
            ) : (
              <Link key={l.href} to={`/${l.href}`}>
                {l.name}
              </Link>
            ),
          )}
          {onHome && (
            <>
              <Link className="x" to="/blog">
                Blog
              </Link>
            </>
          )}
        </div>

        {/* keyed so React swaps the node: the engine has had its hands on the home one */}
        {onHome ? (
          <div className="pnav-r" key="home">
            <button className="pbtn" id="work-btn" type="button" aria-expanded="false" aria-controls="work-pop">
              <b id="work-n">0</b>
              <span>steps</span>
            </button>
            <a className="pbtn" href={profile.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
            <button className="pbtn" id="k-btn" type="button" aria-label="Menu ⌘K">
              <span className="k-d">⌘K</span>
              <span className="k-m">Menu</span>
            </button>
            <button className="btn sm js-play" id="play-btn" type="button">
              ▶ Play<span className="w"> the table</span>
            </button>
          </div>
        ) : (
          <div className="pnav-r" key="away">
            <Link className="pbtn" to="/blog">
              Blog
            </Link>
            <a className="btn sm" href={profile.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
        )}
      </div>

      {onHome && (
        <div className="work-pop" id="work-pop" hidden>
          <p className="lb">Work done on this page, for you</p>
          <ul id="work-list" />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
