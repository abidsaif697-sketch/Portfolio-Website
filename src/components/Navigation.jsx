import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import Magnetic from './Magnetic';
import { toggleMute, getIsMuted } from '../utils/audio';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isMuted, setIsMuted] = useState(getIsMuted());
  const content = useLocale();
  const { lang, setLang } = useLanguage();

  const handleMuteToggle = () => {
    setIsMuted(toggleMute());
  };

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const links = lang === 'ar'
    ? [{ label: 'أعمالي', href: '#work' }, { label: 'خبراتي', href: '#experience' }, { label: 'عني', href: '#about' }, { label: 'تواصل', href: '#contact' }]
    : [{ label: 'Work', href: '#work' }, { label: 'Experience', href: '#experience' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }];

  const textColor   = scrolled ? 'var(--text-light)' : 'var(--text-light)';
  const navBg       = scrolled ? (theme === 'light' ? 'rgba(var(--text-rgb),0.96)' : 'rgba(var(--bg-dark-rgb),0.96)') : 'transparent';
  const borderColor = scrolled ? 'var(--border-h)' : 'transparent';

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '0 52px', zIndex: 100,
        background: navBg,
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: `1px solid ${borderColor}`,
        transition: 'background 0.5s ease, border-color 0.5s ease',
      }}
    >
      {/* Logo */}
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px', height: '38px', background: 'var(--accent)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 900,
          color: '#080808', flexShrink: 0,
        }}>A</div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: textColor, transition: 'color 0.4s ease' }}>{content.nav.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 400, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase' }}>{content.nav.subtitle}</div>
        </div>
      </a>

      {/* Available pill */}
      {content.nav.available && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.32)', padding: '8px 18px 8px 8px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 900, color: '#080808' }}>A</div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>{content.nav.availableText}</span>
        </motion.div>
      )}

      {/* Right: links + toggle + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px', justifyContent: 'flex-end' }}>
        {links.map(({ label, href }) => (
          <Magnetic key={label} scale={1.1}>
            <a href={href}
              style={{ display: 'block', padding: '10px', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: textColor, opacity: 0.72, transition: 'color 0.3s ease, opacity 0.3s ease' }}
              onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.target.style.opacity = 0.72; e.target.style.color = textColor; }}
            >{label}</a>
          </Magnetic>
        ))}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px' }}>
          {/* Sound toggle */}
          <Magnetic scale={1.15}>
            <motion.button onClick={handleMuteToggle}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', background: 'transparent', border: 'none', width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isMuted ? 0.4 : 1, transition: 'opacity 0.2s', fontSize: '15px' }}
            >
              {isMuted ? '🔇' : '🔉'}
            </motion.button>
          </Magnetic>

          {/* Theme toggle */}
          <Magnetic scale={1.15}>
            <motion.button onClick={toggleTheme}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '50%', width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>
          </Magnetic>

          {/* EN / AR pill toggle */}
          <Magnetic scale={1.05}>
            <motion.button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '100px', padding: 0, cursor: 'pointer', overflow: 'hidden' }}
            >
              {['en', 'ar'].map((l) => (
                <span key={l} style={{
                  padding: '6px 13px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
                  background: lang === l ? 'var(--accent)' : 'transparent',
                  color: lang === l ? '#080808' : 'rgba(201,169,110,0.6)',
                  transition: 'all 0.25s ease', letterSpacing: '0.04em',
                }}>{l.toUpperCase()}</span>
              ))}
            </motion.button>
          </Magnetic>
        </div>

        <Magnetic scale={1.05}>
          <motion.a href={`mailto:${content.contact?.email || 'abidsayf67@gmail.com'}`}
            whileHover={{ scale: 1.05, background: '#b8975a' }} whileTap={{ scale: 0.97 }}
            style={{ background: 'var(--accent)', color: '#080808', padding: '12px 28px', fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 800, cursor: 'pointer', borderRadius: '100px', transition: 'all 0.3s ease', display: 'inline-block', marginLeft: '8px', whiteSpace: 'nowrap', textDecoration: 'none' }}
          >{lang === 'ar' ? 'وظفني' : 'Hire Me'}</motion.a>
        </Magnetic>
      </div>
    </motion.nav>
  );
}

