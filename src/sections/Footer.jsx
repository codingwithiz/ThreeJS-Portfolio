import { Link } from 'react-router-dom';

import { profile } from '../constants/index.js';

const socials = [
  ['GitHub', profile.socials.github],
  ['LinkedIn', profile.socials.linkedin],
  ['Instagram', profile.socials.instagram],
];

const Footer = () => (
  <footer className="pfoot">
    <p className="pfoot-n">Ing Zhen Lee</p>
    <p className="pfoot-h">That’s my hand. Deal me in on what you’re building.</p>
    <p className="pfoot-l">
      {socials.map(([name, href]) => (
        <a key={name} href={href} target="_blank" rel="noopener noreferrer">
          {name} ↗
        </a>
      ))}
      <Link to="/blog">Blog</Link>
      <a href={profile.resume} target="_blank" rel="noreferrer">
        Résumé
      </a>
      <a href={`mailto:${profile.email}`}>Email</a>
    </p>
  </footer>
);

export default Footer;
