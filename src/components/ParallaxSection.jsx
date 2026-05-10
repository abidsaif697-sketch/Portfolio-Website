import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function ParallaxSection({ title, subtitle, content, image, reverse = false }) {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10% 0px' });

  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle section background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: reverse
            ? 'radial-gradient(ellipse at 80% 50%, rgba(11,76,76,0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 20% 50%, rgba(11,76,76,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: '1300px',
          width: '100%',
          display: 'flex',
          flexDirection: reverse ? 'row-reverse' : 'row',
          alignItems: 'center',
          gap: '80px',
          flexWrap: 'wrap',
          zIndex: 2,
        }}
      >
        {/* Text Side */}
        <motion.div
          style={{ flex: '1 1 340px', minWidth: 0 }}
          initial={{ x: reverse ? 60 : -60, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'var(--highlight-color)',
              letterSpacing: '4px',
              textTransform: 'uppercase',
              marginBottom: '16px',
              fontWeight: 700,
            }}
          >
            {subtitle}
          </p>
          <div
            style={{
              width: '40px',
              height: '2px',
              background: 'var(--accent-color)',
              marginBottom: '30px',
            }}
          />
          <h2
            style={{
              fontSize: 'clamp(42px, 5vw, 78px)',
              marginBottom: '28px',
              lineHeight: 1.05,
              fontFamily: 'var(--font-serif)',
              fontWeight: 700,
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: '17px',
              lineHeight: 1.75,
              color: 'rgba(var(--text-rgb),0.65)',
              marginBottom: '48px',
              maxWidth: '480px',
            }}
          >
            {content}
          </p>
          <motion.div
            whileHover={{ x: 8 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-brush)',
              fontSize: '22px',
              color: 'var(--accent-color)',
              cursor: 'pointer',
              borderBottom: '2px solid var(--accent-color)',
              paddingBottom: '4px',
            }}
          >
            MORE DETAILS +
          </motion.div>
        </motion.div>

        {/* Image Side */}
        <div ref={imgRef} style={{ flex: '1 1 380px', minWidth: 0, position: 'relative' }}>
          <motion.div
            style={{ y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '0 40px 100px rgba(var(--bg-dark-rgb),0.6)',
              }}
            >
              <img
                src={image}
                alt={title}
                style={{
                  width: '100%',
                  height: '520px',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.85) saturate(1.1)',
                }}
              />
              {/* Blue overlay tint */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11,28,46,0.35)',
                  mixBlendMode: 'multiply',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Faint watermark text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 'clamp(120px, 25vw, 320px)',
          fontFamily: 'var(--font-brush)',
          color: 'rgba(var(--text-rgb),0.025)',
          zIndex: 1,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 1,
        }}
      >
        {title.replace('.', '')}
      </div>
    </section>
  );
}
