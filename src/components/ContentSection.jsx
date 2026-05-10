import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ContentSection({ subtitle, title, body, image, reverse = false }) {
  const ref = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' });

  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} style={{
      background: '#0a1929',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '130px 80px 100px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: reverse
          ? 'radial-gradient(ellipse 60% 50% at 80% 50%, rgba(42,122,110,0.12) 0%, transparent 70%)'
          : 'radial-gradient(ellipse 60% 50% at 20% 50%, rgba(42,122,110,0.12) 0%, transparent 70%)',
      }} />

      <div style={{
        maxWidth: '1280px', width: '100%',
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: '100px',
        position: 'relative', zIndex: 1,
      }}>

        {/* ── Text ───────────────────────────────────── */}
        <motion.div
          style={{ flex: '1 1 380px', minWidth: 0 }}
          initial={{ x: reverse ? 50 : -50, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p style={{
            fontSize: '11px', fontWeight: 800, letterSpacing: '4px',
            color: '#86c5bd', textTransform: 'uppercase',
            fontFamily: 'var(--font-sans)', marginBottom: '16px',
          }}>{subtitle}</p>

          {/* Accent line */}
          <div style={{ width: '36px', height: '2px', background: '#f39b7f', marginBottom: '28px' }} />

          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(42px, 5vw, 76px)',
            color: 'var(--text-light)', lineHeight: 1.05,
            marginBottom: '28px', fontWeight: 700,
          }}>{title}</h2>

          <p style={{
            fontSize: '17px', lineHeight: 1.8,
            color: 'rgba(var(--text-rgb),0.6)',
            marginBottom: '48px', maxWidth: '460px',
            fontFamily: 'var(--font-sans)',
          }}>{body}</p>

          <motion.button
            whileHover={{ x: 6 }}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font-brush)', fontSize: '22px',
              color: '#f39b7f', borderBottom: '2px solid #f39b7f',
              paddingBottom: '4px', display: 'inline-block',
            }}
          >MORE DETAILS +</motion.button>
        </motion.div>

        {/* ── Image ──────────────────────────────────── */}
        <div ref={imgRef} style={{ flex: '1 1 400px', minWidth: 0, position: 'relative' }}>
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          >
            <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 60px 120px rgba(var(--bg-dark-rgb),0.7)' }}>
              <img src={image} alt={title} style={{
                width: '100%', height: '560px',
                objectFit: 'cover', display: 'block',
              }} />
              {/* Teal colour-grade overlay – matches original blue tint */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(10,30,50,0.35)',
                mixBlendMode: 'multiply',
              }} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(100px, 22vw, 300px)',
        fontFamily: 'var(--font-brush)',
        color: 'rgba(var(--text-rgb),0.018)',
        whiteSpace: 'nowrap', pointerEvents: 'none',
        userSelect: 'none', lineHeight: 1, zIndex: 0,
      }}>
        {title.replace(/\./g, '')}
      </div>
    </section>
  );
}
