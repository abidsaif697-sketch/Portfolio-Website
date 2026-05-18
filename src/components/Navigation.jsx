import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';
import Magnetic from './Magnetic';
import { toggleMute, getIsMuted } from '../utils/audio';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [isMuted, setIsMuted] = useState(getIsMuted());
  const content = useLocale();
  const { lang, setLang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    if (!isSmall) setMenuOpen(false);
  }, [isSmall]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const links = lang === 'ar'
    ? [{ label: 'أعمالي', href: '#work' }, { label: 'خبراتي', href: '#experience' }, { label: 'عني', href: '#about' }, { label: 'تواصل', href: '#contact' }]
    : [{ label: 'Work', href: '#work' }, { label: 'Experience', href: '#experience' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }];

  const navBg       = scrolled ? (theme === 'light' ? 'rgba(var(--text-rgb),0.96)' : 'rgba(var(--bg-dark-rgb),0.96)') : 'transparent';
  const borderColor = scrolled ? 'var(--border-h)' : 'transparent';
  const textColor   = 'var(--text-light)';

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '70px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '0 20px' : isTablet ? '0 32px' : '0 52px',
          zIndex: 100,
          background: menuOpen ? 'var(--bg-dark)' : navBg,
          backdropFilter: (scrolled && !menuOpen) ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: `1px solid ${menuOpen ? 'var(--border)' : borderColor}`,
          transition: 'background 0.5s ease, border-color 0.5s ease',
        }}
      >
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 101 }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--accent)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 900,
            color: '#080808', flexShrink: 0,
          }}>A</div>
          {!isMobile && (
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 800, color: textColor }}>{content.nav.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 400, letterSpacing: '0.08em', color: 'var(--accent)', textTransform: 'uppercase' }}>{content.nav.subtitle}</div>
            </div>
          )}
        </a>

        {/* Desktop: Available pill (center) */}
        {!isSmall && content.nav.available && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.32)', padding: '8px 18px 8px 8px', borderRadius: '100px', whiteSpace: 'nowrap' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 900, color: '#080808' }}>A</div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase' }}>{content.nav.availableText}</span>
          </motion.div>
        )}

        {/* Desktop: Right nav */}
        {!isSmall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
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
              <Magnetic scale={1.15}>
                <motion.button onClick={handleMuteToggle}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', background: 'transparent', border: 'none', width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: isMuted ? 0.4 : 1, transition: 'opacity 0.2s', fontSize: '15px' }}
                >
                  {isMuted ? '🔇' : '🔉'}
                </motion.button>
              </Magnetic>

              <Magnetic scale={1.15}>
                <motion.button onClick={toggleTheme}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '50%', width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  {theme === 'dark' ? '☀️' : '🌙'}
                </motion.button>
              </Magnetic>

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
        )}

        {/* Mobile/Tablet: right controls + hamburger */}
        {isSmall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 101 }}>
            {/* Theme toggle */}
            <motion.button onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '50%', width: '34px', height: '34px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </motion.button>

            {/* Lang toggle */}
            <motion.button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)', borderRadius: '100px', padding: 0, cursor: 'pointer', overflow: 'hidden' }}
            >
              {['en', 'ar'].map((l) => (
                <span key={l} style={{
                  padding: '6px 11px', fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
                  background: lang === l ? 'var(--accent)' : 'transparent',
                  color: lang === l ? '#080808' : 'rgba(201,169,110,0.6)',
                  transition: 'all 0.25s ease',
                }}>{l.toUpperCase()}</span>
              ))}
            </motion.button>

            {/* Hamburger */}
            <motion.button
              onClick={() => setMenuOpen(o => !o)}
              whileTap={{ scale: 0.9 }}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', gap: '5px',
                background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: '10px', width: '40px', height: '40px',
                cursor: 'pointer', padding: '10px',
              }}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={menuOpen
                    ? i === 0 ? { rotate: 45, y: 7 }
                    : i === 1 ? { opacity: 0, scaleX: 0 }
                    : { rotate: -45, y: -7 }
                    : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.25 }}
                  style={{
                    display: 'block', width: '18px', height: '2px',
                    background: 'var(--accent)', borderRadius: '2px',
                    transformOrigin: 'center',
                  }}
                />
              ))}
            </motion.button>
          </div>
        )}
      </motion.nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              background: 'var(--bg-dark)',
              display: 'flex', flexDirection: 'column',
              paddingTop: '90px', paddingBottom: '40px',
              paddingLeft: '32px', paddingRight: '32px',
              overflowY: 'auto',
            }}
          >
            {/* Nav links */}
            <nav style={{ flex: 1 }}>
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.4 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: 'clamp(36px, 10vw, 52px)',
                    lineHeight: 1.15, letterSpacing: '-0.03em',
                    color: 'var(--text-light)',
                    borderBottom: '1px solid var(--border)',
                    padding: '20px 0',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-light)'}
                >
                  <span style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', marginRight: '16px', verticalAlign: 'middle', fontFamily: 'var(--font-body)' }}>0{i + 1}</span>
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <a
                href={`mailto:${content.contact?.email || 'abidsayf67@gmail.com'}`}
                style={{
                  background: 'var(--accent)', color: '#080808',
                  padding: '18px', borderRadius: '12px',
                  fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800,
                  textAlign: 'center', textDecoration: 'none',
                  display: 'block',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {lang === 'ar' ? 'وظفني ✦' : 'Hire Me ✦'}
              </a>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleMuteToggle}
                  style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px', fontSize: '18px', cursor: 'pointer' }}
                >
                  {isMuted ? '🔇' : '🔉'}
                </button>
                <a
                  href="https://www.behance.net/asaif" target="_blank" rel="noopener noreferrer"
                  style={{
                    flex: 2, background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: '10px', padding: '14px',
                    fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700,
                    color: 'var(--accent)', textAlign: 'center', textDecoration: 'none',
                    display: 'block',
                  }}
                >Behance ↗</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
