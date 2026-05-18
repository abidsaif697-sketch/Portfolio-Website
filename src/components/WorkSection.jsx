import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { useLocale } from '../hooks/useLocale';
import { useLanguage } from '../hooks/useLanguage';
import ProjectModal from './ProjectModal';

/* ─── Project data ─────────────────────────────────────── */

/* ─── SLIDE CARD ────────────────────────────────────────── */
function SlideCard({ slide, isActive, onClick, onViewProject }) {
  const { lang } = useLanguage();
  const cardRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start']
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: '0 0 auto',
        width: isActive ? '680px' : '380px',
        height: '520px',
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${isActive ? slide.accent + '55' : 'rgba(var(--text-rgb),0.07)'}`,
        transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
        flexShrink: 0,
      }}
    >
      {/* Image */}
      <motion.img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute', inset: -40,
          width: 'calc(100% + 80px)', height: 'calc(100% + 80px)',
          objectFit: 'cover', objectPosition: 'center',
          transition: 'transform 0.7s ease',
          y: yParallax,
          transform: isActive ? 'scale(1.03)' : 'scale(1)',
        }}
        className={isActive ? 'view-cursor' : ''}
      />

      {/* Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isActive
          ? 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.92) 0%, rgba(var(--bg-dark-rgb),0.4) 55%, rgba(var(--bg-dark-rgb),0.08) 100%)'
          : 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.82) 0%, rgba(var(--bg-dark-rgb),0.55) 100%)',
        transition: 'background 0.5s ease',
      }} />

      {/* Accent tint on hover */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 20% 90%, ${slide.accent}22 0%, transparent 60%)`,
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 32px 32px',
        zIndex: 2,
      }}>
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
            letterSpacing: '0.2em', color: slide.accent, textTransform: 'uppercase',
            background: slide.accent + '18', border: `1px solid ${slide.accent}44`,
            padding: '5px 12px', borderRadius: '100px',
          }}>{slide.category}</span>
          <span style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px',
            color: 'rgba(var(--text-rgb),0.35)',
          }}>{slide.year}</span>
        </div>

        {/* Bottom content */}
        <div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px',
            color: 'rgba(var(--text-rgb),0.35)', marginBottom: '10px',
          }}>{slide.id}</div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: isActive ? 'clamp(28px, 3.5vw, 46px)' : '22px',
            fontWeight: 800, lineHeight: 1.1,
            color: 'var(--text-light)',
            marginBottom: '14px',
            letterSpacing: '-0.02em',
            transition: 'font-size 0.5s ease',
          }}>{slide.title}</h3>

          {isActive && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.75,
                color: 'rgba(var(--text-rgb),0.6)', marginBottom: '20px', maxWidth: '440px',
              }}>{slide.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {slide.tags.map(t => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); onViewProject(slide); }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600,
                  color: slide.accent, letterSpacing: '0.02em', cursor: 'pointer',
                  borderBottom: `1px solid ${slide.accent}44`, paddingBottom: '2px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {lang === 'ar' ? 'عرض المشروع' : 'View Project'} <span style={{ fontSize: '16px' }}>{lang === 'ar' ? '←' : '→'}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── HORIZONTAL SLIDER ─────────────────────────────────── */
function ProjectSlider({ slides, onViewProject }) {
  const { lang } = useLanguage();
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e) => {
    isDragging.current = false;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (e.buttons !== 1) return;
    isDragging.current = true;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    trackRef.current.style.cursor = 'grab';
  };

  return (
    <div>
      {/* Track */}
      <div
        ref={trackRef}
        className="slider-drag"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex', gap: '20px',
          overflowX: 'auto', overflowY: 'visible',
          paddingBottom: '20px',
          scrollbarWidth: 'none',
          scrollBehavior: 'smooth',
          paddingLeft: '80px', paddingRight: '80px',
        }}
      >
        <style>{`.slider-drag::-webkit-scrollbar { display: none; }`}</style>
        {slides.map((slide, i) => (
          <SlideCard
            key={slide.id}
            slide={slide}
            isActive={active === i}
            onClick={() => { if (!isDragging.current) setActive(i); }}
            onViewProject={(s) => { if (!isDragging.current) onViewProject(s); }}
          />
        ))}
      </div>

      {/* Dots + counter */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '20px',
        padding: '32px 80px 0',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: active === i ? '28px' : '8px',
                height: '8px', borderRadius: '100px',
                background: active === i ? 'var(--accent)' : 'rgba(var(--text-rgb),0.2)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.4s var(--ease-expo)',
                padding: 0,
              }}
            />
          ))}
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 500,
          color: 'var(--text-muted)',
        }}>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {String(active + 1).padStart(2, '0')}
          </span>
          /{String(slides.length).padStart(2, '0')}
        </span>

        {/* Prev / Next arrows */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          {[{ dir: -1, label: lang === 'ar' ? '→' : '←' }, { dir: 1, label: lang === 'ar' ? '←' : '→' }].map(({ dir, label }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1, borderColor: 'var(--accent)', color: 'var(--accent)' }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setActive(Math.max(0, Math.min(slides.length - 1, active + dir)))}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--text-light)',
                fontSize: '18px', cursor: 'pointer',
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

/* ─── GRID SECTION (all projects) ───────────────────────── */
function ProjectGrid({ slides, onViewProject }) {
  const { lang } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });

  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '2px',
      margin: '100px 0 0',
      background: 'var(--border)',
    }}>
      {slides.map((slide, i) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1], delay: i * 0.07 }}
          whileHover="hovered"
          onClick={() => onViewProject(slide)}
          style={{
            position: 'relative', height: '320px', overflow: 'hidden',
            cursor: 'pointer', background: 'var(--bg-dark)',
          }}
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            decoding="async"
            variants={{ hovered: { scale: 1.07 } }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(var(--bg-dark-rgb),0.88) 0%, rgba(var(--bg-dark-rgb),0.1) 60%)',
          }} />

          {/* Hover accent line top */}
          <motion.div
            variants={{ hovered: { scaleX: 1 } }}
            initial={{ scaleX: 0 }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: slide.accent, transformOrigin: 'left',
              transition: 'transform 0.5s var(--ease-expo)',
            }}
          />

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '24px 28px', zIndex: 2,
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600,
              letterSpacing: '0.18em', color: slide.accent, textTransform: 'uppercase',
              display: 'block', marginBottom: '8px',
            }}>{slide.category}</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px', fontWeight: 800,
                color: 'var(--text-light)', letterSpacing: '-0.01em', lineHeight: 1.2,
              }}>{slide.title}</h4>
              <motion.span
                variants={{ hovered: { x: 0, opacity: 1 } }}
                initial={{ x: lang === 'ar' ? 8 : -8, opacity: 0 }}
                style={{ color: slide.accent, fontSize: '18px' }}
              >{lang === 'ar' ? '↖' : '↗'}</motion.span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── EXPORTED SECTION ──────────────────────────────────── */
export default function WorkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const content = useLocale();
  const { lang } = useLanguage();
  const slides = content.projects;
  const [modalProject, setModalProject] = useState(null);

  return (
    <section id="work" ref={ref} style={{ background: 'var(--bg-dark)', paddingTop: '140px', paddingBottom: '160px' }}>

      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease: [0.16,1,0.3,1] }}
        style={{
          padding: '0 80px', marginBottom: '52px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}
      >
        <div>
          <p className="section-label">{lang === 'ar' ? '— أعمال مختارة' : '— Selected Work'}</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 6vw, 88px)',
            fontWeight: 900, lineHeight: 1.0,
            color: 'var(--text-light)',
            letterSpacing: '-0.03em',
          }}>
            {lang === 'ar' ? (
              <>
                مشاريع تحدد<br />
                <span style={{ color: 'var(--bg-dark)', textShadow: '-1px -1px 0 var(--text-light), 1px -1px 0 var(--text-light), -1px 1px 0 var(--text-light), 1px 1px 0 var(--text-light)' }}>
                  معايير
                </span>
                {' '}العمل.
              </>
            ) : (
              <>
                Projects that<br />
                <span style={{ WebkitTextStroke: '1.5px var(--text-light)', color: 'transparent' }}>
                  define
                </span>
                {' '}the work.
              </>
            )}
          </h2>
        </div>

        <div style={{ paddingBottom: '8px', textAlign: 'right' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '14px',
            color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '280px',
            marginBottom: '20px',
          }}>
            {lang === 'ar' ? 'مجموعة مختارة تشمل العلامات التجارية، الرقمية، التحرير، الموشن جرافيك، والتغليف.' : 'A curated selection spanning branding, digital, editorial, motion, and packaging.'}
          </p>
          <a href="#" style={{
            fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600,
            color: 'var(--accent)', letterSpacing: '0.04em',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}>{lang === 'ar' ? 'جميع المشاريع ←' : 'All projects →'}</a>
        </div>
      </motion.div>

      {/* ── Drag-to-scroll slider ── */}
      <ProjectSlider slides={slides} onViewProject={setModalProject} />

      {/* ── Grid thumbnail strip ── */}
      <div style={{ padding: '0 80px' }}>
        <div style={{ marginTop: '100px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800,
            color: 'var(--text-light)', letterSpacing: '-0.02em',
          }}>{lang === 'ar' ? 'جميع المشاريع' : 'All Projects'}</h3>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '13px',
            color: 'var(--text-muted)',
          }}>{slides.length} {lang === 'ar' ? 'مشاريع' : 'projects'}</span>
        </div>
      </div>
      <ProjectGrid slides={slides} onViewProject={setModalProject} />

      {/* ── Project Modal ── */}
      {modalProject && (
        <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
      )}
    </section>
  );
}
