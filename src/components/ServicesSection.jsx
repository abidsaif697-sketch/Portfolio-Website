import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';

function ServiceRow({ service, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
      whileHover="hovered"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 0',
        display: 'grid',
        gridTemplateColumns: '72px 1fr auto',
        gap: '40px', alignItems: 'start', position: 'relative',
        cursor: 'default',
      }}
    >
      {/* Hover indicator line bottom */}
      <motion.div
        variants={{ hovered: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: service.accent, transformOrigin: 'left',
          transition: 'transform 0.5s var(--ease-expo)',
        }}
      />

      {/* Number */}
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13px',
        color: service.accent, paddingTop: '6px', letterSpacing: '0.04em',
      }}>{service.number}</span>

      {/* Text block */}
      <div>
        <motion.h3
          variants={{ hovered: { x: 14 } }}
          style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: 'clamp(26px, 3.5vw, 48px)',
            lineHeight: 1.05, letterSpacing: '-0.03em',
            color: 'var(--text-light)', marginBottom: '20px',
            transition: 'transform 0.4s var(--ease-out)',
          }}
        >{service.title}</motion.h3>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8,
          color: 'var(--text-muted)', maxWidth: '520px', marginBottom: '28px',
        }}>{service.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {service.tags.map(t => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <motion.span
        variants={{ hovered: { x: 6, opacity: 1 } }}
        initial={{ x: 0, opacity: 0.25 }}
        style={{
          fontSize: '22px', color: service.accent, paddingTop: '6px',
          transition: 'all 0.4s var(--ease-out)',
        }}
      >↗</motion.span>
    </motion.div>
  );
}

export default function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  
  const content = useLocale();
  const { lang } = useLanguage();
  const services = content.services;

  return (
    <section id="services" ref={ref} style={{
      background: 'var(--bg-dark)', padding: '160px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Ghost watermark */}
      <motion.div style={{
        position: 'absolute', top: '50%', left: '50%',
        x: '-50%', y: yParallax,
        fontFamily: 'var(--font-display)', fontSize: 'clamp(140px, 26vw, 380px)',
        fontWeight: 900, letterSpacing: '-0.06em',
        color: 'rgba(var(--text-rgb),0.018)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
      }}>SERVICES</motion.div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">{lang === 'ar' ? '— ما أقدمه' : '— What I Do'}</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(42px, 6vw, 86px)', lineHeight: 1.0, letterSpacing: '-0.04em', color: 'var(--text-light)', marginBottom: '80px' }}>
            {lang === 'ar' ? (<>حيث تلتقي الاستراتيجية<br />بـ<span style={{ color: 'var(--accent)' }}>الحرفية.</span></>) : (<>Where strategy<br />meets <span style={{ color: 'var(--accent)' }}>craft.</span></>)}
          </h2>
        </motion.div>

        {services.map((s, i) => (
          <ServiceRow key={s.number} service={s} index={i} />
        ))}
        <div style={{ borderTop: '1px solid var(--border)' }} />
      </div>
    </section>
  );
}
