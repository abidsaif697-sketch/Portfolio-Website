import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';

const companies = [
  'Kulud Pharmacy', 'Atlantis Tech', 'Khuld Builders', 'RAMC Events', 'Halfur Tech',
  'Capital Smart City', 'IMC Qatar', 'Tri Link Wireless', 'Bfare Australia',
];

export default function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' });
  const [sent, setSent] = useState(false);
  const content = useLocale();
  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const c = content.contact;

  const pad = isMobile ? '100px 20px' : isTablet ? '120px 40px' : '160px 80px';

  const inputStyle = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: '1px solid var(--border)',
    padding: '18px 0',
    fontFamily: 'var(--font-body)', fontSize: '15px',
    color: 'var(--text-light)', outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  return (
    <section id="contact" ref={ref} style={{
      background: 'var(--bg-mid)', padding: pad,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Company ticker */}
      <div style={{
        overflow: 'hidden', marginBottom: isMobile ? '60px' : '120px',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '18px 0',
      }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: '60px', width: 'max-content' }}
        >
          {[...companies, ...companies].map((comp, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: isMobile ? '14px' : '16px',
              letterSpacing: '0.01em', color: 'var(--text-muted)', whiteSpace: 'nowrap',
            }}>
              {comp}
              <span style={{ color: 'var(--accent)', fontSize: '12px', marginLeft: '14px' }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">{lang === 'ar' ? '— تواصل معي' : '— Get In Touch'}</p>

          {/* 2-col on desktop, 1-col on mobile/tablet */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1fr 1fr',
            gap: isMobile ? '56px' : isTablet ? '56px' : '100px',
            alignItems: 'start',
          }}>

            {/* Left */}
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: isMobile ? 'clamp(40px, 12vw, 72px)' : 'clamp(44px, 6vw, 86px)',
                lineHeight: 0.95, letterSpacing: '-0.04em', color: 'var(--text-light)',
                marginBottom: '36px',
              }}>
                {lang === 'ar'
                  ? (<>هل لديك<br /><span style={{ color: 'var(--accent)' }}>مشروع</span><br />في الذهن؟</>)
                  : (<>Have a<br /><span style={{ color: 'var(--accent)' }}>project</span><br />in mind?</>)}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '380px' }}>
                {c.subtext}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {[
                  { label: lang === 'ar' ? 'بريد إلكتروني' : 'Email',     value: c.email,            href: `mailto:${c.email}` },
                  { label: lang === 'ar' ? 'هاتف'     : 'Phone',           value: c.phone,            href: `tel:${c.phone?.replace(/\s/g, '')}` },
                  { label: lang === 'ar' ? 'معرض الأعمال' : 'Portfolio',   value: 'behance.net/asaif', href: c.behance },
                  { label: lang === 'ar' ? 'الموقع'   : 'Based in',        value: c.location,         href: null },
                ].map(({ label, value, href }) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase',
                      minWidth: '72px',
                    }}>{label}</span>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-light)', textDecoration: 'none', borderBottom: '1px solid var(--border)', transition: 'border-color 0.3s ease, color 0.3s ease' }}
                        onMouseEnter={e => { e.target.style.borderBottomColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
                        onMouseLeave={e => { e.target.style.borderBottomColor = 'var(--border)'; e.target.style.color = 'var(--text-light)'; }}
                      >{value}</a>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-light)' }}>{value}</span>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Behance', href: 'https://www.behance.net/asaif' },
                  { label: 'LinkedIn', href: '#' },
                  { label: 'Email', href: 'mailto:abidsayf67@gmail.com' },
                ].map(({ label, href }) => (
                  <motion.a key={label} href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, borderColor: 'var(--accent)', color: 'var(--accent)' }}
                    style={{
                      fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 700,
                      letterSpacing: '0.06em', color: 'var(--text-muted)',
                      border: '1px solid var(--border)', padding: '10px 20px', borderRadius: '100px',
                      transition: 'all 0.3s ease', display: 'inline-block',
                    }}
                  >{label} ↗</motion.a>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  style={{ border: '1px solid var(--accent)', borderRadius: '12px', padding: isMobile ? '48px 28px' : '64px 48px', textAlign: 'center' }}
                >
                  <div style={{ fontSize: '40px', marginBottom: '20px' }}>✦</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', letterSpacing: '-0.03em', color: 'var(--text-light)', marginBottom: '12px' }}>Message sent!</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-muted)' }}>Abid will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSent(true); }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  {[
                    { key: 'name',    label: lang === 'ar' ? 'الاسم' : 'Your Name',    type: 'text',  placeholder: lang === 'ar' ? 'الاسم الكامل' : 'Full name' },
                    { key: 'email',   label: lang === 'ar' ? 'بريد إلكتروني' : 'Email', type: 'email', placeholder: 'your@email.com' },
                    { key: 'project', label: lang === 'ar' ? 'نوع المشروع' : 'Project Type', type: 'text', placeholder: lang === 'ar' ? 'مثال: UI/UX، هوية بصرية...' : 'e.g. UI/UX Design, Branding, Campaign…' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key} style={{ marginBottom: '8px' }}>
                      <label style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
                      <input type={type} required placeholder={placeholder}
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                      />
                    </div>
                  ))}

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      {lang === 'ar' ? 'رسالتك' : 'Message'}
                    </label>
                    <textarea required
                      placeholder={lang === 'ar' ? 'أخبرني عن مشروعك والجدول الزمني…' : 'Tell me about your project, timeline, and budget…'}
                      rows={4} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }}
                      onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                      onBlur={e => e.target.style.borderBottomColor = 'var(--border)'}
                    />
                  </div>

                  <motion.button type="submit"
                    whileHover={{ scale: 1.03, background: '#b8975a' }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      marginTop: '36px',
                      alignSelf: isMobile ? 'stretch' : 'flex-start',
                      background: 'var(--accent)', color: '#080808',
                      border: 'none', padding: '18px 44px',
                      fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700,
                      letterSpacing: '0.02em', cursor: 'pointer', borderRadius: '100px',
                      transition: 'background 0.3s ease',
                      textAlign: 'center',
                    }}
                  >{lang === 'ar' ? 'إرسال الرسالة ←' : 'Send Message →'}</motion.button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
