import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16,1,0.3,1] } } };

const statsEn = [
  { value: '8+',  label: 'Years of Experience' },
  { value: '5',   label: 'Companies Led' },
  { value: '100+', label: 'Projects Delivered' },
  { value: '4',   label: 'Certifications' },
];
const statsAr = [
  { value: '8+',  label: 'سنوات الخبرة' },
  { value: '5',   label: 'شركات قادها' },
  { value: '100+', label: 'مشروع مُنجز' },
  { value: '4',   label: 'شهادات مهنية' },
];

const disciplinesEn = [
  'UI/UX Design', 'Product Design', 'Creative Direction',
  'Branding & Identity', 'UX Research', 'Motion Graphics',
  'Social Media Marketing', 'Product Management', 'Design Systems',
];
const disciplinesAr = [
  'تصميم UI/UX', 'تصميم المنتجات', 'الإدارة الإبداعية',
  'هوية العلامة التجارية', 'بحث تجربة المستخدم', 'موشن جرافيك',
  'التسويق الرقمي', 'إدارة المنتج', 'أنظمة التصميم',
];

const tools = [
  { name: 'Figma', icon: '🎨' }, { name: 'Adobe XD', icon: '🖌️' },
  { name: 'Photoshop', icon: '🖼️' }, { name: 'Illustrator', icon: '✏️' },
  { name: 'InDesign', icon: '📰' }, { name: 'After Effects', icon: '🎬' },
  { name: 'Adobe Firefly', icon: '🔥' },
];

const certsEn = [
  { title: 'Specialization in UI/UX Designing', org: 'California Institute of Arts, USA', year: '2023' },
  { title: 'Principles of UX/UI Design', org: 'Meta', year: '2023' },
  { title: 'Agile with Atlassian Jira', org: 'Atlassian', year: '2023' },
  { title: 'Software Processes & Agile Practices', org: 'Atlassian', year: '2023' },
];
const certsAr = [
  { title: 'تخصص في تصميم UI/UX', org: 'معهد كاليفورنيا للفنون، الولايات المتحدة', year: '2023' },
  { title: 'مبادئ تصميم UX/UI', org: 'ميتا', year: '2023' },
  { title: 'أجايل مع Atlassian Jira', org: 'أتلاسيان', year: '2023' },
  { title: 'عمليات البرمجيات وممارسات أجايل', org: 'أتلاسيان', year: '2023' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const stats = lang === 'ar' ? statsAr : statsEn;
  const disciplines = lang === 'ar' ? disciplinesAr : disciplinesEn;
  const certs = lang === 'ar' ? certsAr : certsEn;

  const pad = isMobile ? '100px 20px' : isTablet ? '120px 40px' : '160px 80px';

  return (
    <section id="about" ref={ref} style={{
      background: 'var(--bg-mid)', padding: pad,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ghost watermark */}
      <motion.div style={{
        position: 'absolute', top: '20%', left: '-2%', y: yParallax,
        fontFamily: 'var(--font-display)', fontSize: 'clamp(100px, 22vw, 400px)',
        fontWeight: 900, letterSpacing: '-0.06em',
        color: 'rgba(var(--text-rgb),0.015)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', lineHeight: 1, zIndex: 0,
      }}>ABOUT</motion.div>

      {/* Vertical rule — hidden on mobile */}
      {!isMobile && (
        <div style={{
          position: 'absolute', left: isTablet ? '40px' : '80px', top: 0, bottom: 0,
          width: '1px', background: 'var(--border)', pointerEvents: 'none',
        }} />
      )}

      <motion.div
        variants={stagger} initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}
      >
        <motion.p variants={fadeUp} className="section-label">{lang === 'ar' ? '— عني' : '— About Me'}</motion.p>

        {/* Two-column top → single column on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '40px' : '80px',
          alignItems: 'start', marginBottom: isMobile ? '52px' : '80px',
        }}>
          <motion.h2 variants={fadeUp} style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: isMobile ? 'clamp(32px, 9vw, 52px)' : 'clamp(36px, 4.5vw, 68px)',
            lineHeight: 1.05, letterSpacing: '-0.035em', color: 'var(--text-light)',
          }}>
            {lang === 'ar'
              ? (<>تحويل الأفكار إلى<br /><span style={{ color: 'var(--bg-mid)', textShadow: '-1px -1px 0 var(--text-light), 1px -1px 0 var(--text-light), -1px 1px 0 var(--text-light), 1px 1px 0 var(--text-light)' }}>تجارب</span><br />تترك أثراً.</>)
              : (<>Turning ideas into<br /><span style={{ WebkitTextStroke: '1.5px var(--text-light)', color: 'transparent' }}>experiences</span><br />that connect.</>)}
          </motion.h2>

          <motion.div variants={fadeUp} style={{ paddingTop: '6px' }}>
            {lang === 'ar' ? (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '15px' : '17px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '24px' }}>أنا <strong style={{ color: 'var(--text-light)', fontWeight: 600 }}>عابد سيف</strong>، مصمم UI/UX معتمد من <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>معهد كاليفورنيا للفنون، الولايات المتحدة</strong>. بخبرة تتجاوز 8 سنوات في تصميم واجهات مستخدم بديهية تقدم تجارب سلسة.</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '15px' : '17px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '36px' }}>من تطبيقات الجوال إلى استراتيجيات العلامة التجارية الكاملة، أبقى على اطلاع بأحدث اتجاهات التصميم — ومقيم حالياً في <strong style={{ color: 'var(--text-light)', fontWeight: 500 }}>الدوحة، قطر</strong>.</p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '15px' : '17px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '24px' }}>I'm <strong style={{ color: 'var(--text-light)', fontWeight: 600 }}>Abid Saif</strong>, a certified UI/UX designer with a specialization from the <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>California Institute of Arts, USA</strong>. With 8+ years of experience, I create intuitive interfaces that deliver seamless user experiences.</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '15px' : '17px', lineHeight: 1.85, color: 'var(--text-muted)', marginBottom: '36px' }}>From mobile apps to full brand strategies, I stay updated with the latest design trends — currently based in <strong style={{ color: 'var(--text-light)', fontWeight: 500 }}>Doha, Qatar</strong>.</p>
              </>
            )}

            <div style={{ padding: '20px 24px', borderRadius: '10px', border: '1px solid var(--border)', background: 'rgba(201,169,110,0.06)', marginBottom: '28px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '8px' }}>🎓 {lang === 'ar' ? 'التعليم' : 'Education'}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--text-light)', marginBottom: '4px' }}>{lang === 'ar' ? 'بكالوريوس في علوم الحاسب' : "Bachelor's in Computer Science"}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'جامعة هزارة مانسهرا · يوليو 2014 – يناير 2018' : 'Hazara University Mansehra · July 2014 – January 2018'}</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {disciplines.map(d => <span key={d} className="chip" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '11px' }}>{d}</span>)}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div variants={fadeUp} style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          marginBottom: isMobile ? '52px' : '80px',
        }}>
          {stats.map(({ value, label }, i) => (
            <div key={label} style={{
              padding: isMobile ? '32px 20px' : '48px 32px',
              borderRight: isMobile
                ? (i % 2 === 0 ? '1px solid var(--border)' : 'none')
                : (i < 3 ? '1px solid var(--border)' : 'none'),
              borderBottom: isMobile && i < 2 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? 'clamp(36px, 10vw, 56px)' : 'clamp(44px, 5.5vw, 76px)', fontWeight: 900, color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.04em', marginBottom: '10px' }}>{value}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tools */}
        <motion.div variants={fadeUp}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '28px' }}>🛠 {lang === 'ar' ? 'الأدوات والبرامج' : 'Tools & Software'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '72px' }}>
            {tools.map(({ name, icon }) => (
              <motion.div key={name} whileHover={{ y: -4, borderColor: 'var(--accent)' }}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 22px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'default', transition: 'border-color 0.3s ease' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '-0.01em' }}>{name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div variants={fadeUp}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '28px' }}>📜 {lang === 'ar' ? 'الشهادات المهنية' : 'Certifications'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
            {certs.map((c, i) => (
              <motion.div key={i} whileHover={{ borderColor: 'rgba(201,169,110,0.4)' }}
                style={{ padding: '24px 28px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-card)', transition: 'border-color 0.3s ease' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: '10px' }}>{c.year}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-light)', marginBottom: '6px', lineHeight: 1.3 }}>{c.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>{c.org}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
