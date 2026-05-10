import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectModal({ project, onClose }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed] = useState(3000);
  const timerRef = useRef(null);

  const screens = project?.screens?.length ? project.screens : [project?.image].filter(Boolean);

  const nextScreen = useCallback(() => {
    if (!screens.length) return;
    setActiveScreen(s => s === screens.length - 1 ? 0 : s + 1);
  }, [screens.length]);

  const prevScreen = useCallback(() => {
    if (!screens.length) return;
    setActiveScreen(s => s === 0 ? screens.length - 1 : s - 1);
  }, [screens.length]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') nextScreen();
    if (e.key === 'ArrowLeft')  prevScreen();
  }, [onClose, nextScreen, prevScreen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  useEffect(() => {
    if (isPlaying && screens.length > 1) {
      timerRef.current = setInterval(nextScreen, playSpeed);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, nextScreen, playSpeed, screens.length]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(2,2,2,0.96)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2vw',
        }}
      >
        <motion.div
          key="modal-card"
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '1400px', height: '85vh',
            background: '#060606',
            border: '1px solid rgba(var(--text-rgb),0.08)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '420px 1fr',
            boxShadow: '0 50px 150px rgba(var(--bg-dark-rgb),1)',
            position: 'relative',
          }}
        >
          {/* ── LEFT: Project Info ── */}
          <div style={{
            display: 'flex', flexDirection: 'column',
            padding: '48px 40px',
            borderRight: '1px solid rgba(var(--text-rgb),0.05)',
            overflowY: 'auto',
            background: '#080808',
            position: 'relative',
            zIndex: 5,
          }}>
            {/* Top badge */}
            <div style={{ marginBottom: '32px' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.2em', color: project.accent, textTransform: 'uppercase',
                background: project.accent + '12', border: `1px solid ${project.accent}33`,
                padding: '6px 16px', borderRadius: '100px',
              }}>{project.category}</span>
            </div>

            {/* ID + Title */}
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: '14px', color: 'rgba(var(--text-rgb),0.25)', marginBottom: '12px',
            }}>{project.id}</div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.05, letterSpacing: '-0.04em',
              color: 'var(--text-light)', margin: '0 0 12px',
            }}>{project.title}</h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '14px',
              color: project.accent, fontWeight: 700, marginBottom: '28px',
              letterSpacing: '0.02em',
            }}>{project.company}</p>

            {/* Year & Details */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
              <div style={{
                background: '#111', border: '1px solid #222',
                borderRadius: '10px', padding: '10px 16px',
                fontFamily: 'var(--font-body)', fontSize: '13px',
                color: '#999',
              }}>
                <span style={{ color: project.accent, marginRight: '8px' }}>✦</span> {project.year}
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.85,
              color: 'rgba(var(--text-rgb),0.45)', marginBottom: '32px',
            }}>{project.desc}</p>

            {/* Keywords / Tags */}
            <div style={{ marginBottom: '40px' }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 800,
                letterSpacing: '0.15em', color: '#555', textTransform: 'uppercase',
                marginBottom: '16px',
              }}>Keywords</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(project.tags || []).map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                    background: '#111', border: '1px solid #1a1a1a',
                    borderRadius: '8px', padding: '6px 14px', color: '#888',
                    letterSpacing: '0.02em', transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = project.accent; e.currentTarget.style.borderColor = project.accent + '44'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#1a1a1a'; }}
                  >{t}</span>
                ))}
              </div>
            </div>

            {/* Screen counter */}
            {screens.length > 1 && (
              <div style={{
                marginTop: 'auto', paddingTop: '32px',
                borderTop: '1px solid #1a1a1a',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#444' }}>
                  <span style={{ color: project.accent, fontWeight: 700 }}>
                    {String(activeScreen + 1).padStart(2, '0')}
                  </span> / {String(screens.length).padStart(2, '0')}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {screens.length > 1 && (
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      style={{ 
                        background: isPlaying ? project.accent + '22' : 'none', 
                        border: `1px solid ${isPlaying ? project.accent : '#222'}`, 
                        color: isPlaying ? project.accent : '#555', 
                        borderRadius: '100px', padding: '0 12px', 
                        fontSize: '10px', fontWeight: 800, cursor: 'pointer',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {isPlaying ? 'PAUSE SLIDESHOW' : 'AUTO PLAY'}
                    </button>
                  )}
                  <button onClick={prevScreen} style={{ background: 'none', border: '1px solid #222', color: '#888', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>←</button>
                  <button onClick={nextScreen} style={{ background: 'none', border: '1px solid #222', color: '#888', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '14px' }}>→</button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Draggable Slideshow ── */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: 'var(--bg-dark)' }}>
            
            {/* Close button (top right) */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '24px', right: '24px', zIndex: 100,
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(var(--bg-dark-rgb),0.5)', border: '1px solid rgba(var(--text-rgb),0.1)',
                color: 'var(--text-light)', fontSize: '18px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.scale = '1.1'; e.currentTarget.style.background = '#e05555'; }}
              onMouseLeave={e => { e.currentTarget.style.scale = '1'; e.currentTarget.style.background = 'rgba(var(--bg-dark-rgb),0.5)'; }}
            >✕</button>

            {/* Slideshow area */}
            <div style={{ flex: 1, position: 'relative', cursor: 'grab', overflow: 'hidden' }} active={activeScreen}>
              <AnimatePresence initial={false} custom={activeScreen}>
                <motion.div
                  key={activeScreen}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    const swipe = offset.x;
                    if (swipe < -100 && activeScreen < screens.length - 1) nextScreen();
                    else if (swipe > 100 && activeScreen > 0) prevScreen();
                  }}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                  }}
                >
                  <img
                    src={screens[activeScreen]}
                    alt={`${project.title} screen ${activeScreen + 1}`}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'center top',
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Subtle vignette */}
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 30%, rgba(var(--bg-dark-rgb),0.3) 100%)', pointerEvents: 'none' }} />
                </motion.div>
              </AnimatePresence>

              {/* Progress bar (bottom of image) */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px',
                background: 'rgba(var(--text-rgb),0.05)', zIndex: 10,
              }}>
                <motion.div
                  initial={false}
                  animate={{ width: `${((activeScreen + 1) / screens.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: '100%', background: project.accent, boxShadow: `0 0 20px ${project.accent}88` }}
                />
              </div>

              {/* Hint */}
              <div style={{
                position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(var(--bg-dark-rgb),0.6)', backdropFilter: 'blur(8px)',
                borderRadius: '100px', padding: '6px 14px',
                fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 600, color: 'rgba(var(--text-rgb),0.4)',
                letterSpacing: '0.08em', pointerEvents: 'none', textTransform: 'uppercase',
                border: '1px solid rgba(var(--text-rgb),0.05)',
              }}>
                Drag to slide ↔
              </div>
            </div>

            {/* Thumbnail Strip (Bottom) */}
            {screens.length > 1 && (
              <div style={{
                display: 'flex', gap: '8px', padding: '20px 24px',
                background: '#040404', borderTop: '1px solid rgba(var(--text-rgb),0.04)',
                overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none',
                alignItems: 'center',
              }}>
                {screens.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveScreen(i)}
                    style={{
                      flexShrink: 0, width: '84px', height: '56px',
                      borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                      border: `2px solid ${i === activeScreen ? project.accent : 'transparent'}`,
                      padding: 0, background: 'none',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      opacity: i === activeScreen ? 1 : 0.4,
                      transform: i === activeScreen ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <img src={src} alt={`thumb ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
