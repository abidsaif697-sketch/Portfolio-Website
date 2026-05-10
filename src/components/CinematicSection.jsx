import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

/** Full-bleed cinematic section — replicates the giant gorilla "WHAT'S NEW" panel */
export default function CinematicSection({ image, label, title, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} style={{
      position: 'relative',
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'flex-end',
    }}>
      {/* Parallax image */}
      <motion.div style={{
        position: 'absolute', inset: '-10%',
        y,
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }} />

      {/* Gradient from bottom for text legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(7,16,24,0.92) 0%, rgba(7,16,24,0.4) 40%, transparent 70%)',
        zIndex: 1,
      }} />

      {/* Text content – bottom-left */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ position: 'relative', zIndex: 2, padding: '0 60px 70px 60px', maxWidth: '700px' }}
      >
        <p style={{
          fontSize: '11px', fontWeight: 800, letterSpacing: '4px',
          color: '#86c5bd', textTransform: 'uppercase',
          fontFamily: 'var(--font-sans)', marginBottom: '12px',
        }}>{label}</p>
        <h2 style={{
          fontFamily: 'var(--font-brush)',
          fontSize: 'clamp(52px, 7vw, 96px)',
          color: 'var(--text-light)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          marginBottom: '28px',
        }}>{title}</h2>
        {children}
      </motion.div>
    </section>
  );
}
