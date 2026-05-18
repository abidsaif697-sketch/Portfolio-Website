import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';

function TimelineCard({ job, index, jobsCount }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [expanded, setExpanded] = useState(index === 0);
  const { isMobile } = useBreakpoint();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      style={{ display: 'flex', gap: '0', position: 'relative' }}
    >
      {/* Timeline stem */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: isMobile ? '40px' : '60px', flexShrink: 0 }}>
        <div style={{
          width: '14px', height: '14px', borderRadius: '50%',
          background: job.current ? job.accent : 'var(--bg-card)',
          border: `2px solid ${job.accent}`,
          zIndex: 2, flexShrink: 0, marginTop: '6px',
          boxShadow: job.current ? `0 0 16px ${job.accent}66` : 'none',
          transition: 'box-shadow 0.3s ease',
        }} />
        {index < jobsCount - 1 && (
          <div style={{ width: '2px', flex: 1, background: 'var(--border)', marginTop: '8px', marginBottom: '-8px' }} />
        )}
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ borderColor: job.accent + '55' }}
        style={{
          flex: 1, marginLeft: isMobile ? '12px' : '24px',
          border: '1px solid var(--border)', borderRadius: '12px',
          overflow: 'hidden', background: 'var(--bg-card)',
          marginBottom: '20px', transition: 'border-color 0.3s ease', cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ padding: isMobile ? '20px 20px' : '28px 32px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.15em', color: job.accent, textTransform: 'uppercase',
                background: job.accent + '18', border: `1px solid ${job.accent}44`,
                padding: '4px 12px', borderRadius: '100px',
              }}>{job.period}</span>
              {job.current && (
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700,
                  color: '#080808', background: job.accent,
                  padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.1em',
                }}>● CURRENT</span>
              )}
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: isMobile ? '16px' : 'clamp(18px, 2.5vw, 26px)',
              lineHeight: 1.1, color: 'var(--text-light)',
              letterSpacing: '-0.02em', marginBottom: '6px',
            }}>{job.role}</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
              {job.company} · <span style={{ color: 'rgba(var(--text-rgb),0.4)' }}>{job.sub}</span>
            </p>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: 'var(--text-muted)', fontSize: '20px', paddingTop: '4px', flexShrink: 0 }}
          >⌄</motion.div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ padding: isMobile ? '0 20px 24px' : '0 32px 32px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.8, color: 'var(--text-muted)', marginBottom: '24px' }}>{job.desc}</p>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: job.accent, textTransform: 'uppercase', marginBottom: '14px' }}>Key Highlights</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {job.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ color: job.accent, flexShrink: 0, marginTop: '2px' }}>✦</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.65, color: 'rgba(var(--text-rgb),0.75)' }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: job.accent, textTransform: 'uppercase', marginBottom: '12px' }}>Tools Used</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {job.tools.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function ExperienceSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const content = useLocale();
  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const jobs = content.experience;

  const pad = isMobile ? '100px 20px' : isTablet ? '120px 40px' : '160px 80px';

  return (
    <section id="experience" ref={ref} style={{
      background: 'var(--bg-dark)', padding: pad,
      position: 'relative', overflow: 'hidden',
    }}>
      <motion.div style={{
        position: 'absolute', top: '50%', right: '-5%', y: yParallax,
        fontFamily: 'var(--font-display)', fontSize: 'clamp(80px, 18vw, 320px)',
        fontWeight: 900, letterSpacing: '-0.06em',
        color: 'rgba(var(--text-rgb),0.016)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
        writingMode: 'vertical-rl',
      }}>EXPERIENCE</motion.div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '72px' }}
        >
          <p className="section-label">{lang === 'ar' ? '— الخبرات المهنية' : '— Work Experience'}</p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: isMobile ? 'clamp(36px, 10vw, 60px)' : 'clamp(42px, 6vw, 84px)',
            lineHeight: 1.0, letterSpacing: '-0.04em', color: 'var(--text-light)',
          }}>
            {lang === 'ar'
              ? (<>٨ سنوات من<br /><span style={{ color: 'var(--accent)' }}>قيادة التصميم.</span></>)
              : (<>8 years of<br /><span style={{ color: 'var(--accent)' }}>leading design.</span></>)}
          </h2>
        </motion.div>

        <div>
          {jobs.map((job, i) => (
            <TimelineCard key={job.id} job={job} index={i} jobsCount={jobs.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
