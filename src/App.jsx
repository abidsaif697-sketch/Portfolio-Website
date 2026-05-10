import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import { useLanguage } from './hooks/useLanguage';
import { useLocale } from './hooks/useLocale';
import AdminLogin from './components/admin/AdminLogin';
import AdminPanel from './components/admin/AdminPanel';
import SmoothScroll from './components/SmoothScroll';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import WorkSection from './components/WorkSection';
import ExperienceSection from './components/ExperienceSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';

/* ── Footer ─────────────────────────────────────────── */
function Footer() {
  const content = useLocale();
  const { lang } = useLanguage();
  const pages = lang === 'ar'
    ? [{ l: 'أعمالي', h: '#work' }, { l: 'خبراتي', h: '#experience' }, { l: 'عني', h: '#about' }, { l: 'خدماتي', h: '#services' }, { l: 'تواصل', h: '#contact' }]
    : [{ l: 'Work', h: '#work' }, { l: 'Experience', h: '#experience' }, { l: 'About', h: '#about' }, { l: 'Services', h: '#services' }, { l: 'Contact', h: '#contact' }];
  const socials = [
    { label: 'Behance',  href: content.contact.behance },
    { label: 'LinkedIn', href: '#' },
    { label: 'Email',    href: `mailto:${content.contact.email}` },
  ];
  return (
    <footer style={{ background: 'var(--bg-card)', padding: '80px 80px 52px', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '80px', alignItems: 'start', marginBottom: '60px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', letterSpacing: '-0.04em', color: 'var(--text-light)', marginBottom: '6px' }}>{content.nav.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '18px' }}>{content.nav.subtitle}</div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: '280px', marginBottom: '20px' }}>
            Certified UI/UX designer based in {content.contact.location}. {content.contact.availability}.
          </p>
          <a href={`mailto:${content.contact.email}`} style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.02em' }}>{content.contact.email}</a>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '20px' }}>{lang === 'ar' ? 'روابط' : 'Navigation'}</p>
          {pages.map(({ l, h }) => (<a key={l} href={h} style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-light)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l}</a>))}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '20px' }}>Connect</p>
          {socials.map(({ label, href }) => (<a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--text-light)'} onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{label} ↗</a>))}
          <div style={{ marginTop: '28px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px' }}>Location</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{content.contact.location}<br />{content.contact.availability}</p>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '28px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>© 2026 {content.nav.name} · All rights reserved.</p>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>Designed & built with care ✦</p>
      </div>
    </footer>
  );
}

/* ── Inner App (needs AdminProvider context) ─────────── */
function PortfolioApp() {
  const { lang } = useLanguage();
  const content = useLocale();

  return (
    <>
      <Helmet>
        <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} />
        <title>{content.nav.name} | {content.nav.subtitle}</title>
        <meta name="description" content={content.hero.bio} />
        <meta name="theme-color" content="#080808" />
      </Helmet>
      <SmoothScroll>
        <Cursor />
        <Navigation />
        <main style={{ position: 'relative', zIndex: 1 }}>
          <Hero />
          <WorkSection />
          <ExperienceSection />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
          <Footer />
        </main>
        {/* Admin UI */}
        <AdminLogin />
        <AdminPanel />
      </SmoothScroll>
    </>
  );
}

/* ── Root ─────────────────────────────────────────────── */
export default function App() {
  const [loading, setLoading] = useState(false); // Disabled preloader to fix slow load time

  return (
    <LanguageProvider>
      <AdminProvider>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
        <PortfolioApp />
      </AdminProvider>
    </LanguageProvider>
  );
}
