import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useBreakpoint } from '../hooks/useBreakpoint';
import RevealText from './RevealText';
import Magnetic from './Magnetic';

export default function Hero() {
  const content = useLocale();
  const ref = useRef(null);
  const { isMobile, isTablet } = useBreakpoint();
  const isSmall = isMobile || isTablet;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const videoY     = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const overlayOp  = useTransform(scrollYProgress, [0, 0.6], [0.52, 0.80]);
  const textY      = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const opacity    = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroMedia = {
    type: 'video', src: '/gorilla_video.mp4',
    scale: 1, posX: 50, posY: 50,
    brightness: 100, contrast: 100, blur: 0, overlayStrength: 52,
    ...(content.hero.media || {}),
  };

  const padding = isMobile ? '0 20px' : isTablet ? '0 40px' : '0 80px';

  return (
    <section ref={ref} style={{
      height: '100vh', minHeight: '600px', position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center',
    }}>
      {/* ── Hero Background Media ── */}
      <motion.div style={{ position: 'absolute', inset: 0, y: videoY, scale: videoScale, originY: 0 }}>
        {heroMedia.type === 'video' ? (
          <>
            <video className={heroMedia.lightSrc ? 'dark-only' : ''} key={heroMedia.src} autoPlay muted loop playsInline preload="metadata"
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                objectPosition: `${heroMedia.posX}% ${heroMedia.posY}%`,
                transform: `scale(${heroMedia.scale})`,
                transformOrigin: `${heroMedia.posX}% ${heroMedia.posY}%`,
                filter: `brightness(${heroMedia.brightness}%) contrast(${heroMedia.contrast}%)${heroMedia.blur > 0 ? ` blur(${heroMedia.blur}px)` : ''}`,
              }}>
              <source src={heroMedia.src} type="video/mp4" />
            </video>
            {heroMedia.lightSrc && (
              <img className="light-only" src={heroMedia.lightSrc} alt="Hero light background"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  objectPosition: `${heroMedia.posX}% ${heroMedia.posY}%`,
                  transform: `scale(${heroMedia.scale})`,
                  filter: `brightness(${heroMedia.brightness}%) contrast(${heroMedia.contrast}%)${heroMedia.blur > 0 ? ` blur(${heroMedia.blur}px)` : ''}`,
                }} />
            )}
          </>
        ) : heroMedia.src ? (
          <img src={heroMedia.src} alt="Hero background"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: `${heroMedia.posX}% ${heroMedia.posY}%`,
              transform: `scale(${heroMedia.scale})`,
              filter: `brightness(${heroMedia.brightness}%) contrast(${heroMedia.contrast}%)${heroMedia.blur > 0 ? ` blur(${heroMedia.blur}px)` : ''}`,
            }} />
        ) : null}
      </motion.div>

      {/* ── Dark overlay ── */}
      <motion.div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        '--strength': heroMedia.overlayStrength / 100,
        background: `linear-gradient(120deg, 
          rgba(var(--bg-dark-rgb), calc(var(--strength) + 0.3 + var(--overlay-boost))) 0%, 
          rgba(var(--bg-dark-rgb), calc(var(--strength) - 0.24 + var(--overlay-boost))) 65%, 
          rgba(var(--bg-dark-rgb), calc(var(--strength) + 0.06 + var(--overlay-boost))) 100%)`,
        opacity: overlayOp,
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(var(--bg-dark-rgb), calc(0.65 + var(--overlay-boost))) 100%)',
      }} />

      {/* ── Content ── */}
      <motion.div style={{
        position: 'relative', zIndex: 2, padding,
        y: textY, opacity, width: '100%',
      }}>

        {/* Role pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.9 }}
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '8px',
            marginBottom: isMobile ? '24px' : '36px',
            maxWidth: isMobile ? '100%' : '700px',
          }}
        >
          {content.hero.roles.map((r, i) => (
            <span key={r} style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? '11px' : '13px',
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: i === 0 ? '#080808' : 'rgba(var(--text-rgb),0.85)',
              background: i === 0 ? 'var(--accent)' : 'rgba(var(--bg-dark-rgb),0.6)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(var(--text-rgb),0.15)',
              padding: isMobile ? '6px 14px' : '8px 18px',
              borderRadius: '100px',
            }}>{r}</span>
          ))}
        </motion.div>

        {/* Bio */}
        <RevealText
          text={content.hero.bio}
          delay={0.6}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: isMobile ? '14px' : '16px',
            lineHeight: 1.78,
            color: 'rgba(var(--text-rgb),0.58)',
            maxWidth: isMobile ? '100%' : '480px',
            marginBottom: isMobile ? '36px' : '52px',
          }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.8 }}
          style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Magnetic scale={isMobile ? 1 : 1.1}>
            <motion.a href="#work"
              whileHover={{ scale: 1.05, background: '#b8975a' }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: 'var(--accent)', color: '#080808',
                padding: isMobile ? '14px 28px' : '16px 38px',
                borderRadius: '100px',
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 700,
                letterSpacing: '0.02em', cursor: 'pointer',
                display: 'inline-block', transition: 'background 0.3s ease',
                whiteSpace: 'nowrap', textDecoration: 'none',
              }}
            >{content.hero.ctaPrimary}</motion.a>
          </Magnetic>

          <Magnetic scale={isMobile ? 1 : 1.1}>
            <motion.a href={content.hero.behanceUrl} target="_blank" rel="noopener noreferrer"
              whileHover={{ x: 6 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: 600,
                color: 'rgba(var(--text-rgb),0.65)',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              }}
            >{content.hero.ctaSecondary}</motion.a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '36px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}
      >
        <div style={{ width: '1px', height: '48px', background: 'rgba(var(--text-rgb),0.25)' }} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '9px',
          letterSpacing: '0.22em', color: 'rgba(var(--text-rgb),0.35)', textTransform: 'uppercase',
        }}>Scroll</span>
      </motion.div>

      {/* ── Experience badge (hidden on mobile) ── */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          style={{
            position: 'absolute', right: isTablet ? '24px' : '60px', bottom: '60px', zIndex: 3,
            width: isTablet ? '90px' : '112px', height: isTablet ? '90px' : '112px',
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.4)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: isTablet ? '30px' : '38px',
            fontWeight: 900,
            color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.04em',
          }}>{content.hero.yearsExp}</span>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 600,
            letterSpacing: '0.14em', color: 'rgba(var(--text-rgb),0.45)',
            textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.5,
          }}>Years<br />Exp.</span>
        </motion.div>
      )}

      {/* ── Location pill ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.7 }}
        style={{
          position: 'absolute',
          left: isMobile ? '20px' : isTablet ? '40px' : '80px',
          bottom: isMobile ? '28px' : '60px',
          zIndex: 3,
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(var(--bg-dark-rgb),0.6)', border: '1px solid rgba(var(--text-rgb),0.12)',
          padding: isMobile ? '7px 12px' : '10px 18px',
          borderRadius: '100px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span style={{ fontSize: '14px' }}>📍</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 500,
          color: 'rgba(var(--text-rgb),0.7)', letterSpacing: '0.02em',
        }}>{content.hero.location}</span>
      </motion.div>
    </section>
  );
}
