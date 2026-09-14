import { scrollToSection } from '../utils/scroll';
import { GithubIcon, LinkedinIcon, InstagramIcon, FacebookIcon } from './icons';

const brandName = 'Shivchandar';
const tagline   = 'Full-stack engineer crafting purposeful software from Kathmandu, Nepal.';
const year      = new Date().getFullYear();

const socialLinks = [
  { name: 'GitHub',    href: 'https://github.com/shivchandarsah',                      icon: <GithubIcon    size={17} /> },
  { name: 'LinkedIn',  href: 'https://www.linkedin.com/in/shivchandar-sah-394250296', icon: <LinkedinIcon  size={17} /> },
  { name: 'Instagram', href: 'https://instagram.com/shivchandar_sah33',                icon: <InstagramIcon size={17} /> },
  { name: 'Facebook',  href: 'https://facebook.com/Sahprince0',                        icon: <FacebookIcon  size={17} /> },
];

const navCols = [
  {
    heading: 'Navigate',
    links: [
      { label: 'About',     id: 'about',     external: false },
      { label: 'Education', id: 'education', external: false },
      { label: 'Work',      id: 'work',      external: false },
      { label: 'Skills',    id: 'stack',     external: false },
      { label: 'Contact',   id: 'contact',   external: false },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Web Development', id: 'work', external: false },
      { label: 'Business Automation', id: 'work', external: false },
      { label: 'Backend / APIs',  id: 'work', external: false },
    ],
  },
  {
    heading: 'Connect',
    links: [
      { label: 'GitHub',   href: 'https://github.com/shivchandarsah',                      external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shivchandar-sah-394250296', external: true },
      { label: 'Resume',   href: '/Shivchandar_Kumar_Sah_Resume_Updated.pdf',              external: true },
    ],
  },
];

export default function Footer() {
  const scrollTo = (id) => scrollToSection(id);

  return (
    <footer className="border-t border-border" style={{ backgroundColor: 'var(--color-bg-secondary)' }} role="contentinfo">
      <div className="max-w-6xl mx-auto px-5 md:px-10 lg:px-16 py-14">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2">
            <a href="/" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}
              className="inline-flex items-center gap-2.5 mb-4 group" aria-label="Go to top">
              <img
                src="/profile-512.webp"
                alt="Shivchandar Kumar Sah profile photo, full-stack software engineer"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-accent/40 group-hover:ring-accent transition-all duration-200"
                width="36" height="36" loading="lazy" decoding="async"
              />
              <span className="font-display font-bold text-xl text-text-primary group-hover:text-accent transition-colors duration-200 tracking-tight">
                {brandName}
              </span>
            </a>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-5">{tagline}</p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={`Shivchandar Kumar Sah on ${s.name}`}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/40 transition-all duration-200"
                  style={{ backgroundColor: 'rgba(94,234,212,0.08)' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {navCols.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4">{col.heading}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-text-secondary hover:text-accent transition-colors duration-200 link-underline">
                        {link.label}
                      </a>
                    ) : (
                      <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollTo(link.id); }}
                        className="text-sm text-text-secondary hover:text-accent transition-colors duration-200 link-underline">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="divider mb-6" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs text-text-muted">
            &copy; {year} {brandName} Kumar Sah. All rights reserved.
          </p>
          <p className="text-[11px] text-text-muted">
            Designed &amp; built from scratch, React 19 · GSAP · Tailwind v4 · no UI library
          </p>
          <span className="badge-available text-xs">Available for new projects</span>
        </div>
      </div>
    </footer>
  );
}
