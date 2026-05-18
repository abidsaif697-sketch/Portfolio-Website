import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';
import ProjectModal from './ProjectModal';

/* ─── SLIDE CARD ─────────────────────────────────── */
function SlideCard({ slide, isActive, onClick, onViewProject }) {
  const { lang } = useLanguage();
  const { isMobile } = useBreakpoint();
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const activeW = isMobile ? '90vw' : '680px';
  const inactiveW = isMobile ? '72vw' : '380px';

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      whileHover={isMobile ? {} : { y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '0 0 auto',
        width: isActive ? activeW : inactiveW,
        height: isMobile ? '420px' : '520px',
        position: 'relative', borderRadius: '12px', overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${isActive ? slide.accent + '55' : 'rgba(var(--text-rgb),0.07)'}`,
        transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
        flexShrink: 0,
      }}
    >
      <motion.img src={slide.image} alt={slide.title} loading="lazy" decoding="async"
        style={{
          position: 'absolute', inset: -40,
          width: 'calc(100% + 80px)', height: 'calc(100% + 80px)',
          objectFit: 'cover', objectPosition: 'center',
          transition: 'transform 0.7s ease', y: yParallax,
          transform: isActive ? 'scale(1.03)' : 'scale(1)',
        }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: isActive
          ? 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.92) 0%, rgba(var(--bg-dark-rgb),0.4) 55%, rgba(var(--bg-dark-rgb),0.08) 100%)'
          : 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.82) 0%, rgba(var(--bg-dark-rgb),0.55) 100%)',
        transition: 'background 0.5s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 20% 90%, ${slide.accent}22 0%, transparent 60%)`,
        opacity: isActive ? 1 : 0, transition: 'opacity 0.5s ease',
      }} />

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: isMobile ? '20px 20px 24px' : '28px 32px 32px', zIndex: 2,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.2em', color: slide.accent, textTransform: 'uppercase',
            background: slide.accent + '18', border: `1px solid ${slide.accent}44`,
            padding: '5px 12px', borderRadius: '100px',
          }}>{slide.category}</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(var(--text-rgb),0.35)' }}>{slide.year}</span>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px', color: 'rgba(var(--text-rgb),0.35)', marginBottom: '10px' }}>{slide.id}</div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isActive ? (isMobile ? '22px' : 'clamp(28px, 3.5vw, 46px)') : '22px',
            fontWeight: 800, lineHeight: 1.1, color: 'var(--text-light)',
            marginBottom: '14px', letterSpacing: '-0.02em',
            transition: 'font-size 0.5s ease',
          }}>{slide.title}</h3>

          {isActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75,
                color: 'rgba(var(--text-rgb),0.6)', marginBottom: '20px',
                maxWidth: isMobile ? '100%' : '440px',
              }}>{slide.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {slide.tags.map(t => <span key={t} className="chip">{t}</span>)}
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); onViewProject(slide); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600,
                  color: slide.accent, letterSpacing: '0.02em', cursor: 'pointer',
                  borderBottom: `1px solid ${slide.accent}44`, paddingBottom: '2px',
                }}
              >{lang === 'ar' ? 'عرض المشروع' : 'View Project'} <span style={{ fontSize: '16px' }}>{lang === 'ar' ? '←' : '→'}</span></div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SLIDER ─────────────────────────────────────── */
function ProjectSlider({ slides, onViewProject }) {
  const { lang } = useLanguage();
  const { isMobile } = useBreakpoint();
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = (e) => {
    isDragging.current = false;
    startX.current = e.clientX - trackRef.current.getBoundingClientRect().left;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (e.buttons !== 1 && e.type === 'pointermove') return;
    isDragging.current = true;
    const x = e.clientX - trackRef.current.getBoundingClientRect().left;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onPointerUp = () => { /* no-op */ };

  const sidePad = isMobile ? '20px' : '40px';

  return (
    <div>
      <div
        ref={trackRef}
        className="slider-drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          display: 'flex', gap: isMobile ? '14px' : '20px',
          overflowX: 'auto', overflowY: 'visible',
          paddingBottom: '20px', scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          paddingLeft: sidePad, paddingRight: sidePad,
          touchAction: 'pan-x',
        }}
      >
        <style>{`.slider-drag::-webkit-scrollbar { display: none; }`}</style>
        {slides.map((slide, i) => (
          <SlideCard
            key={slide.id} slide={slide} isActive={active === i}
            onClick={() => { if (!isDragging.current) setActive(i); }}
            onViewProject={(s) => { if (!isDragging.current) onViewProject(s); }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: `32px ${sidePad} 0` }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: active === i ? '28px' : '8px', height: '8px', borderRadius: '100px',
              background: active === i ? 'var(--accent)' : 'rgba(var(--text-rgb),0.2)',
              border: 'none', cursor: 'pointer', transition: 'all 0.4s var(--ease-expo)', padding: 0,
            }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{String(active + 1).padStart(2, '0')}</span>
          /{String(slides.length).padStart(2, '0')}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          {[{ dir: -1, label: lang === 'ar' ? '→' : '←' }, { dir: 1, label: lang === 'ar' ? '←' : '→' }].map(({ dir, label }) => (
            <motion.button key={label}
              whileHover={{ scale: 1.1, borderColor: 'var(--accent)', color: 'var(--accent)' }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActive(Math.max(0, Math.min(slides.length - 1, active + dir)))}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-light)', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}
            >{label}</motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── GRID ────────────────────────────────────────── */
function ProjectGrid({ slides, onViewProject }) {
  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  const cols = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';

  return (
    <div ref={ref} style={{
      display: 'grid', gridTemplateColumns: cols,
      gap: '2px', background: 'var(--border)',
    }}>
      {slides.map((slide, i) => (
        <motion.div key={slide.id}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
          whileHover="hovered"
          onClick={() => onViewProject(slide)}
          style={{ position: 'relative', height: isMobile ? '260px' : '320px', overflow: 'hidden', cursor: 'pointer', background: 'var(--bg-dark)' }}
        >
          <motion.img src={slide.image} alt={slide.title} loading="lazy" decoding="async"
            variants={{ hovered: { scale: 1.07 } }} transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.88) 0%, rgba(var(--bg-dark-rgb),0.1) 60%)' }} />
          <motion.div variants={{ hovered: { scaleX: 1 } }} initial={{ scaleX: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: slide.accent, transformOrigin: 'left', transition: 'transform 0.5s var(--ease-expo)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px', zIndex: 2 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', color: slide.accent, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>{slide.category}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '16px' : '20px', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{slide.title}</h4>
              <motion.span variants={{ hovered: { x: 0, opacity: 1 } }} initial={{ x: lang === 'ar' ? 8 : -8, opacity: 0 }} style={{ color: slide.accent, fontSize: '18px' }}>{lang === 'ar' ? '↖' : '↗'}</motion.span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── MAIN SECTION ────────────────────────────────── */
export default function WorkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const content = useLocale();
  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();
  const slides = content.projects;
  const [modalProject, setModalProject] = useState(null);

  const sidePad = isMobile ? '20px' : isTablet ? '40px' : '80px';

  return (
    <section id="work" ref={ref} style={{ background: 'var(--bg-dark)', paddingTop: isMobile ? '100px' : '140px', paddingBottom: isMobile ? '100px' : '160px' }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: `0 ${sidePad}`, marginBottom: '52px',
          display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end',
          justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '24px' : '0',
        }}
      >
        <div>
          <p className="section-label">{lang === 'ar' ? '— أعمال مختارة' : '— Selected Work'}</p>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 6vw, 88px)',
            fontWeight: 900, lineHeight: 1.0, color: 'var(--text-light)', letterSpacing: '-0.03em',
          }}>
            {lang === 'ar' ? (
              <>مشاريع تحدد<br /><span style={{ color: 'var(--bg-dark)', textShadow: '-1px -1px 0 var(--text-light), 1px -1px 0 var(--text-light), -1px 1px 0 var(--text-light), 1px 1px 0 var(--text-light)' }}>معايير</span>{' '}العمل.</>
            ) : (
              <>Projects that<br /><span style={{ WebkitTextStroke: '1.5px var(--text-light)', color: 'transparent' }}>define</span>{' '}the work.</>
            )}
          </h2>
        </div>

        {!isMobile && (
          <div style={{ paddingBottom: '8px', textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '20px' }}>
              {lang === 'ar' ? 'مجموعة مختارة تشمل العلامات التجارية، الرقمية، التحرير، الموشن جرافيك، والتغليف.' : 'A curated selection spanning branding, digital, editorial, motion, and packaging.'}
            </p>
            <a href="#" style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.04em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              {lang === 'ar' ? 'جميع المشاريع ←' : 'All projects →'}
            </a>
          </div>
        )}
      </motion.div>

      {/* Slider */}
      <ProjectSlider slides={slides} onViewProject={setModalProject} />

      {/* Grid */}
      <div style={{ padding: `0 ${sidePad}` }}>
        <div style={{ marginTop: isMobile ? '60px' : '100px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '22px' : '28px', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '-0.02em' }}>
            {lang === 'ar' ? 'جميع المشاريع' : 'All Projects'}
          </h3>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {slides.length} {lang === 'ar' ? 'مشاريع' : 'projects'}
          </span>
        </div>
      </div>
      <ProjectGrid slides={slides} onViewProject={setModalProject} />

      {modalProject && <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />}
    </section>
  );
}
