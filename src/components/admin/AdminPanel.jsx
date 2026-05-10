import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';
import { useLanguage } from '../../hooks/useLanguage';

/* ── tiny helpers ─────────────────────────────────────── */
const inputStyle = {
  width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a',
  borderRadius: '8px', padding: '10px 14px', color: 'var(--text-light)',
  fontFamily: 'Inter, sans-serif', fontSize: '13px', outline: 'none',
  transition: 'border-color 0.2s ease', boxSizing: 'border-box',
};
const labelStyle = {
  fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.12em', color: '#c9a96e', textTransform: 'uppercase',
  display: 'block', marginBottom: '6px',
};
const sectionHead = {
  fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: 700,
  color: 'var(--text-light)', marginBottom: '16px', paddingBottom: '10px',
  borderBottom: '1px solid #222',
};

/* ── Image Upload Field ──────────────────────────────── */
function ImageUploadField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>

      {/* Preview */}
      {value && (
        <div style={{ position: 'relative', marginBottom: '8px', borderRadius: '8px', overflow: 'hidden', height: '140px' }}>
          <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button
            onClick={() => onChange('')}
            style={{
              position: 'absolute', top: '8px', right: '8px',
              background: 'rgba(var(--bg-dark-rgb),0.7)', border: '1px solid #444',
              borderRadius: '6px', color: '#e05555', fontWeight: 700,
              fontSize: '11px', padding: '4px 10px', cursor: 'pointer',
            }}
          >✕ Remove</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? '#c9a96e' : '#2a2a2a'}`,
          borderRadius: '8px', padding: '18px 12px',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(201,169,110,0.06)' : '#111',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ fontSize: '22px', marginBottom: '6px' }}>🖼</div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#666', margin: 0 }}>
          Drop image here or <span style={{ color: '#c9a96e' }}>click to browse</span>
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#444', margin: '4px 0 0' }}>
          PNG, JPG, WebP — saved in browser storage
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => readFile(e.target.files[0])}
      />
    </div>
  );
}

/* ── Multi-Screen Upload Field ──────────────────── */
function ScreensUploadField({ label, value = [], onChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const readFiles = (files) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => onChange([...value, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    readFiles(e.dataTransfer.files);
  };

  const move = (index, dir) => {
    const next = [...value];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>

      {/* Thumbnails grid */}
      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {value.map((src, i) => (
            <div key={i} style={{ 
              position: 'relative', width: '80px', height: '60px', 
              borderRadius: '8px', overflow: 'hidden', border: '1px solid #2a2a2a',
              background: 'var(--bg-dark)'
            }}>
              <img src={src} alt={`screen ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Overlay Controls */}
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(var(--bg-dark-rgb),0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '4px', opacity: 0, transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                {i > 0 && <button onClick={() => move(i, -1)} style={{ background: '#111', border: 'none', color: 'var(--text-light)', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>←</button>}
                {i < value.length - 1 && <button onClick={() => move(i, 1)} style={{ background: '#111', border: 'none', color: 'var(--text-light)', borderRadius: '4px', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>→</button>}
                <button
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  style={{
                    background: '#e05555', border: 'none',
                    color: 'var(--text-light)', width: '20px', height: '20px', borderRadius: '4px', cursor: 'pointer',
                    fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? '#c9a96e' : '#2a2a2a'}`,
          borderRadius: '10px', padding: '16px',
          textAlign: 'center', cursor: 'pointer',
          background: dragging ? 'rgba(201,169,110,0.06)' : '#111',
          transition: 'all 0.2s ease',
        }}
      >
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#666', margin: 0 }}>
          + Drop screens or <span style={{ color: '#c9a96e' }}>click to add</span>
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => readFiles(e.target.files)}
      />
    </div>
  );
}

function Field({ label, path, value, multiline = false, type = 'text', onChange }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={e => onChange(path, e.target.value)}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={e => e.target.style.borderColor = '#c9a96e'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
      ) : (
        <input type={type} value={value} onChange={e => onChange(path, e.target.value)}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#c9a96e'}
          onBlur={e => e.target.style.borderColor = '#2a2a2a'}
        />
      )}
    </div>
  );
}

function TagsField({ label, value, onChange }) {
  const [input, setInput] = useState('');
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
        {value.map((tag, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: '#2a2a2a', border: '1px solid #333',
            borderRadius: '100px', padding: '4px 10px 4px 12px',
            fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c9a96e',
          }}>
            {tag}
            <button onClick={() => onChange(value.filter((_, j) => j !== i))}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px', padding: 0, lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && input.trim()) { e.preventDefault(); onChange([...value, input.trim()]); setInput(''); } }}
          placeholder="Type and press Enter…"
          style={{ ...inputStyle, flex: 1 }} />
        <button onClick={() => { if (input.trim()) { onChange([...value, input.trim()]); setInput(''); } }}
          style={{ background: '#c9a96e', color: '#080808', border: 'none', borderRadius: '8px', padding: '0 14px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>+</button>
      </div>
    </div>
  );
}

function Accordion({ title, children, accent = '#c9a96e', onMove, isFirst, isLast }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: '10px', borderRadius: '12px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
      <div style={{ display: 'flex', background: '#111' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', padding: '14px 16px', cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600,
          color: 'var(--text-light)', textAlign: 'left',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
            {title}
          </span>
          <span style={{ color: '#555', fontSize: '16px', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}>›</span>
        </button>
        {onMove && (
          <div style={{ display: 'flex', borderLeft: '1px solid #1e1e1e' }}>
            <button disabled={isFirst} onClick={() => onMove(-1)} style={{ padding: '0 10px', background: 'none', border: 'none', borderRight: '1px solid #1e1e1e', color: isFirst ? '#222' : '#555', cursor: isFirst ? 'default' : 'pointer' }}>↑</button>
            <button disabled={isLast} onClick={() => onMove(1)} style={{ padding: '0 10px', background: 'none', border: 'none', color: isLast ? '#222' : '#555', cursor: isLast ? 'default' : 'pointer' }}>↓</button>
          </div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '20px', background: '#0d0d0d', borderTop: '1px solid #1e1e1e' }}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Tabs ──────────────────────────────────────────────── */
const TABS = ['General', 'Hero', 'Projects', 'Experience', 'Services', 'Contact'];

function TabGeneral({ content, upd }) {
  return (
    <div>
      <p style={sectionHead}>Navigation &amp; Branding</p>
      <Field label="Your Name" path="nav.name" value={content.nav.name} onChange={upd} />
      <Field label="Subtitle" path="nav.subtitle" value={content.nav.subtitle} onChange={upd} />
      <Field label="Availability Badge Text" path="nav.availableText" value={content.nav.availableText} onChange={upd} />
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Show "Available for Work"</label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input type="checkbox" checked={content.nav.available}
            onChange={e => upd('nav.available', e.target.checked)}
            style={{ accentColor: '#c9a96e', width: '16px', height: '16px' }} />
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>
            {content.nav.available ? 'Visible' : 'Hidden'}
          </span>
        </label>
      </div>
    </div>
  );
}

/* ── Slider Control ─────────────────────────────────── */
function SliderControl({ label, value, min, max, step = 1, unit = '', onChange, resetValue }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <label style={labelStyle}>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, color: '#c9a96e' }}>
            {typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value}{unit}
          </span>
          {resetValue !== undefined && value !== resetValue && (
            <button onClick={() => onChange(resetValue)}
              style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '13px', padding: 0, lineHeight: 1 }}
              title="Reset to default">↺</button>
          )}
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%', height: '4px', appearance: 'none', WebkitAppearance: 'none',
          background: `linear-gradient(to right, #c9a96e ${((value - min) / (max - min)) * 100}%, #2a2a2a ${((value - min) / (max - min)) * 100}%)`,
          borderRadius: '2px', outline: 'none', cursor: 'pointer', accentColor: '#c9a96e',
        }}
      />
    </div>
  );
}

/* ── Focal Point Picker ─────────────────────────────── */
function FocalPointPicker({ posX, posY, onChange }) {
  const boxRef = useRef(null);
  const pick = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)));
    onChange(x, y);
  };
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={labelStyle}>Focal Point — click or drag</label>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#555' }}>{posX}% / {posY}%</span>
      </div>
      <div
        ref={boxRef}
        onClick={pick}
        onMouseMove={e => { if (e.buttons === 1) pick(e); }}
        style={{
          position: 'relative', width: '100%', height: '88px',
          background: 'repeating-linear-gradient(45deg,#1a1a1a,#1a1a1a 4px,#111 4px,#111 8px)',
          borderRadius: '8px', border: '1px solid #2a2a2a', cursor: 'crosshair', overflow: 'hidden',
        }}
      >
        {[33, 66].map(p => <div key={p} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: '1px', background: 'rgba(var(--text-rgb),0.07)' }} />)}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: '1px', background: 'rgba(var(--text-rgb),0.07)' }} />
        <div style={{
          position: 'absolute', left: `${posX}%`, top: `${posY}%`,
          transform: 'translate(-50%,-50%)',
          width: '18px', height: '18px', borderRadius: '50%',
          background: '#c9a96e', border: '2px solid #fff',
          boxShadow: '0 0 0 3px rgba(201,169,110,0.35), 0 2px 8px rgba(var(--bg-dark-rgb),0.5)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5px', right: '8px',
          fontFamily: 'Inter, sans-serif', fontSize: '9px', color: '#444', letterSpacing: '0.05em',
        }}>DRAG TO PAN</div>
      </div>
    </div>
  );
}

function TabHero({ content, upd }) {
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const lightImageRef = useRef(null);
  const DEFAULTS = { type: 'video', src: '/gorilla_video.mp4', scale: 1, posX: 50, posY: 50, brightness: 100, contrast: 100, blur: 0, overlayStrength: 52 };
  const media = { ...DEFAULTS, ...(content.hero.media || {}) };

  const updMedia = (key, val) => upd('hero.media', { ...media, [key]: val });

  const readMedia = (file, type) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'lightImage') {
        upd('hero.media', { ...media, lightSrc: e.target.result });
      } else {
        upd('hero.media', { ...media, type, src: e.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const mediaStyle = {
    width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    objectPosition: `${media.posX}% ${media.posY}%`,
    transform: `scale(${media.scale})`,
    transformOrigin: `${media.posX}% ${media.posY}%`,
    filter: `brightness(${media.brightness}%) contrast(${media.contrast}%)${media.blur > 0 ? ` blur(${media.blur}px)` : ''}`,
    transition: 'filter 0.25s ease, transform 0.25s ease',
  };

  return (
    <div>
      <p style={sectionHead}>Hero Background Media</p>

      {/* Live preview with all effects applied */}
      <div style={{ marginBottom: '14px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #222', position: 'relative', background: '#111', height: '160px' }}>
        {media.src ? (
          media.type === 'video' ? (
            <video key={media.src} autoPlay muted loop playsInline style={mediaStyle}>
              <source src={media.src} type="video/mp4" />
            </video>
          ) : (
            <img src={media.src} alt="Hero preview" style={mediaStyle} />
          )
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '32px' }}>🎬</span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#444' }}>No media — upload below</span>
          </div>
        )}
        {/* Simulated dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: `rgba(var(--bg-dark-rgb),${media.overlayStrength / 100})`, pointerEvents: 'none' }} />
        {media.src && (
          <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(var(--bg-dark-rgb),0.75)', border: '1px solid #333', borderRadius: '6px', padding: '3px 10px', fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', gap: '6px' }}>
            <span>{media.type === 'video' ? '▶ Video' : '🖼 Image'}</span>
            {media.lightSrc && <span style={{ color: '#fff' }}>+ ☀️ Light</span>}
          </div>
        )}
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', fontFamily: 'Inter, sans-serif', fontSize: '9px', color: 'rgba(var(--text-rgb),0.3)', letterSpacing: '0.08em' }}>LIVE PREVIEW</div>
      </div>

      {/* Upload buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {[
          { label: 'Upload Video', icon: '🎬', sub: 'MP4, WebM', ref: videoRef, accept: 'video/mp4,video/webm', type: 'video' },
          { label: 'Dark Image', icon: '🖼', sub: 'PNG, JPG', ref: imageRef, accept: 'image/*', type: 'image' },
          { label: 'Light Image', icon: '☀️', sub: 'PNG, JPG', ref: lightImageRef, accept: 'image/*', type: 'lightImage' },
        ].map(({ label, icon, sub, ref, type }) => (
          <button key={type} onClick={() => ref.current.click()}
            style={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--text-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#c9a96e'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a2a'}
          >
            <span style={{ fontSize: '18px' }}>{icon}</span>{label}
            <span style={{ fontSize: '10px', color: '#555' }}>{sub}</span>
          </button>
        ))}
        <input ref={videoRef} type="file" accept="video/mp4,video/webm" style={{ display: 'none' }} onChange={e => readMedia(e.target.files[0], 'video')} />
        <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => readMedia(e.target.files[0], 'image')} />
        <input ref={lightImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => readMedia(e.target.files[0], 'lightImage')} />
      </div>

      {/* Reset / Remove */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => upd('hero.media', DEFAULTS)}
          style={{ flex: 1, background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '9px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#666', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.color = '#c9a96e'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = '#666'; }}>↺ Reset All</button>
        <button onClick={() => upd('hero.media', { ...media, src: '', lightSrc: '' })}
          style={{ flex: 1, background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.25)', borderRadius: '8px', padding: '9px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 600, color: '#e05555', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,60,60,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(220,60,60,0.08)'}>🗑 Remove Media</button>
      </div>

      {/* ── Adjustments ─────────────────────────── */}
      <p style={sectionHead}>Adjustments</p>
      <FocalPointPicker posX={media.posX} posY={media.posY} onChange={(x, y) => upd('hero.media', { ...media, posX: x, posY: y })} />
      <SliderControl label="Zoom" value={media.scale} min={1} max={2.5} step={0.05} onChange={v => updMedia('scale', v)} resetValue={1} />
      <SliderControl label="Brightness" value={media.brightness} min={20} max={180} unit="%" onChange={v => updMedia('brightness', v)} resetValue={100} />
      <SliderControl label="Contrast" value={media.contrast} min={50} max={200} unit="%" onChange={v => updMedia('contrast', v)} resetValue={100} />
      <SliderControl label="Blur" value={media.blur} min={0} max={20} unit="px" onChange={v => updMedia('blur', v)} resetValue={0} />
      <SliderControl label="Overlay Darkness" value={media.overlayStrength} min={0} max={90} unit="%" onChange={v => updMedia('overlayStrength', v)} resetValue={52} />

      {/* ── Hero Content ─────────────────────────── */}
      <p style={{ ...sectionHead, marginTop: '8px' }}>Hero Content</p>
      <ImageUploadField label="Profile / Hero Photo (optional overlay)" value={content.hero.profilePhoto || ''} onChange={val => upd('hero.profilePhoto', val)} />
      <Field label="Years of Experience" path="hero.yearsExp" value={content.hero.yearsExp} onChange={upd} />
      <Field label="Location Text" path="hero.location" value={content.hero.location} onChange={upd} />
      <Field label="Bio / Description" path="hero.bio" value={content.hero.bio} multiline onChange={upd} />
      <Field label="CTA Button — Primary" path="hero.ctaPrimary" value={content.hero.ctaPrimary} onChange={upd} />
      <Field label="CTA Button — Secondary" path="hero.ctaSecondary" value={content.hero.ctaSecondary} onChange={upd} />
      <Field label="Behance URL" path="hero.behanceUrl" value={content.hero.behanceUrl} onChange={upd} />
      <TagsField label="Role Chips (press Enter to add)" value={content.hero.roles} onChange={v => upd('hero.roles', v)} />
    </div>
  );
}

function TabProjects({ content, upd }) {
  const [newProj, setNewProj] = useState({ id: '', category: '', title: '', company: '', year: '', desc: '', tags: [], accent: '#c9a96e', image: '' });

  const addProject = () => {
    if (!newProj.title) return;
    const id = String(content.projects.length + 1).padStart(2, '0');
    upd('projects', [...content.projects, { ...newProj, id }]);
    setNewProj({ id: '', category: '', title: '', company: '', year: '', desc: '', tags: [], accent: '#c9a96e', image: '' });
  };

  const moveProject = (index, dir) => {
    const next = [...content.projects];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    // Renumber IDs
    const fixed = next.map((p, i) => ({ ...p, id: String(i + 1).padStart(2, '0') }));
    upd('projects', fixed);
  };

  return (
    <div>
      <p style={sectionHead}>Projects ({content.projects.length})</p>
      {content.projects.map((proj, i) => (
        <Accordion 
          key={proj.id} 
          title={`${proj.id}. ${proj.title}`} 
          accent={proj.accent}
          onMove={(dir) => moveProject(i, dir)}
          isFirst={i === 0}
          isLast={i === content.projects.length - 1}
        >
          {/* Image Upload */}
          <ImageUploadField
            label="Cover Image"
            value={proj.image}
            onChange={(val) => {
              const next = content.projects.map((p, j) => j === i ? { ...p, image: val } : p);
              upd('projects', next);
            }}
          />
          {/* Internal Screens */}
          <ScreensUploadField
            label="Internal Screens (Slideshow)"
            value={proj.screens || []}
            onChange={(val) => {
              const next = content.projects.map((p, j) => j === i ? { ...p, screens: val } : p);
              upd('projects', next);
            }}
          />
          {['category', 'title', 'company', 'year'].map(k => (
            <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}
              path={`projects.${i}.${k}`}
              value={proj[k]}
              onChange={(path, val) => {
                const next = content.projects.map((p, j) => j === i ? { ...p, [k]: val } : p);
                upd('projects', next);
              }} />
          ))}
          <Field label="Description" path={`projects.${i}.desc`} value={proj.desc} multiline
            onChange={(_, val) => { const next = content.projects.map((p, j) => j === i ? { ...p, desc: val } : p); upd('projects', next); }} />
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Accent Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="color" value={proj.accent}
                onChange={e => { const next = content.projects.map((p, j) => j === i ? { ...p, accent: e.target.value } : p); upd('projects', next); }}
                style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'none' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#888' }}>{proj.accent}</span>
            </div>
          </div>
          <TagsField label="Tags (Keywords)" value={proj.tags}
            onChange={v => { const next = content.projects.map((p, j) => j === i ? { ...p, tags: v } : p); upd('projects', next); }} />
          <button onClick={() => upd('projects', content.projects.filter((_, j) => j !== i))}
            style={{ width: '100%', background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.3)', borderRadius: '8px', padding: '10px', color: '#e05555', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer', marginTop: '8px' }}>
            🗑 Delete Project
          </button>
        </Accordion>
      ))}

      {/* Add new */}
      <div style={{ marginTop: '20px', padding: '16px', background: '#0d0d0d', borderRadius: '10px', border: '1px dashed #333' }}>
        <p style={{ ...labelStyle, marginBottom: '14px', fontSize: '11px', color: '#888' }}>+ Add New Project</p>
        <ImageUploadField
          label="Cover Image"
          value={newProj.image}
          onChange={(val) => setNewProj(p => ({ ...p, image: val }))}
        />
        <ScreensUploadField
          label="Internal Screens"
          value={newProj.screens || []}
          onChange={(val) => setNewProj(p => ({ ...p, screens: val }))}
        />
        {['title', 'category', 'company', 'year'].map(k => (
          <div key={k} style={{ marginBottom: '10px' }}>
            <label style={labelStyle}>{k.charAt(0).toUpperCase() + k.slice(1)}</label>
            <input value={newProj[k]} onChange={e => setNewProj(p => ({ ...p, [k]: e.target.value }))}
              style={inputStyle} placeholder={k} />
          </div>
        ))}
        <div style={{ marginBottom: '10px' }}>
          <label style={labelStyle}>Description</label>
          <textarea rows={2} value={newProj.desc} onChange={e => setNewProj(p => ({ ...p, desc: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <button onClick={addProject}
          style={{ width: '100%', background: '#c9a96e', color: '#080808', border: 'none', borderRadius: '8px', padding: '12px', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          + Add Project
        </button>
      </div>
    </div>
  );
}

function TabExperience({ content, upd }) {
  return (
    <div>
      <p style={sectionHead}>Experience ({content.experience.length})</p>
      {content.experience.map((job, i) => (
        <Accordion key={job.id} title={`${job.role} · ${job.company}`} accent={job.accent}>
          {['role', 'company', 'sub', 'period'].map(k => (
            <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} value={job[k]}
              onChange={(_, val) => { const next = content.experience.map((e, j) => j === i ? { ...e, [k]: val } : e); upd('experience', next); }} />
          ))}
          <Field label="Description" value={job.desc} multiline
            onChange={(_, val) => { const next = content.experience.map((e, j) => j === i ? { ...e, desc: val } : e); upd('experience', next); }} />
          <TagsField label="Key Highlights" value={job.highlights}
            onChange={v => { const next = content.experience.map((e, j) => j === i ? { ...e, highlights: v } : e); upd('experience', next); }} />
          <TagsField label="Tools Used" value={job.tools}
            onChange={v => { const next = content.experience.map((e, j) => j === i ? { ...e, tools: v } : e); upd('experience', next); }} />
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Mark as Current</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={job.current}
                onChange={e => { const next = content.experience.map((ex, j) => j === i ? { ...ex, current: e.target.checked } : ex); upd('experience', next); }}
                style={{ accentColor: '#c9a96e', width: '16px', height: '16px' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#888' }}>{job.current ? 'Current role' : 'Past role'}</span>
            </label>
          </div>
          <button onClick={() => upd('experience', content.experience.filter((_, j) => j !== i))}
            style={{ width: '100%', background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.3)', borderRadius: '8px', padding: '10px', color: '#e05555', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            🗑 Delete
          </button>
        </Accordion>
      ))}
    </div>
  );
}

function TabServices({ content, upd }) {
  return (
    <div>
      <p style={sectionHead}>Services ({content.services.length})</p>
      {content.services.map((svc, i) => (
        <Accordion key={svc.number} title={`${svc.number}. ${svc.title}`} accent={svc.accent}>
          <Field label="Title" value={svc.title}
            onChange={(_, val) => { const next = content.services.map((s, j) => j === i ? { ...s, title: val } : s); upd('services', next); }} />
          <Field label="Description" value={svc.desc} multiline
            onChange={(_, val) => { const next = content.services.map((s, j) => j === i ? { ...s, desc: val } : s); upd('services', next); }} />
          <TagsField label="Tags" value={svc.tags}
            onChange={v => { const next = content.services.map((s, j) => j === i ? { ...s, tags: v } : s); upd('services', next); }} />
        </Accordion>
      ))}
    </div>
  );
}

function TabContact({ content, upd }) {
  return (
    <div>
      <p style={sectionHead}>Contact Details</p>
      <Field label="Section Heading" path="contact.heading" value={content.contact.heading} onChange={upd} />
      <Field label="Subtext" path="contact.subtext" value={content.contact.subtext} multiline onChange={upd} />
      <Field label="Email" path="contact.email" value={content.contact.email} type="email" onChange={upd} />
      <Field label="Phone" path="contact.phone" value={content.contact.phone} onChange={upd} />
      <Field label="Behance URL" path="contact.behance" value={content.contact.behance} onChange={upd} />
      <Field label="Location" path="contact.location" value={content.contact.location} onChange={upd} />
      <Field label="Availability Note" path="contact.availability" value={content.contact.availability} onChange={upd} />
    </div>
  );
}

/* ── Main panel ────────────────────────────────────────── */
export default function AdminPanel() {
  const { 
    isAdmin, panelOpen, setPanelOpen, logout, 
    content: enContent, updateContent: updEn, resetContent: resetEn,
    arContent, updateArContent: updAr, resetArContent: resetAr
  } = useAdmin();
  const { lang } = useLanguage();
  
  const content = lang === 'ar' ? arContent : enContent;
  const updateContent = lang === 'ar' ? updAr : updEn;
  const resetContent = lang === 'ar' ? resetAr : resetEn;
  const [activeTab, setActiveTab] = useState('General');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isAdmin) return null;

  const tabContent = {
    General:    <TabGeneral    content={content} upd={updateContent} />,
    Hero:       <TabHero       content={content} upd={updateContent} />,
    Projects:   <TabProjects   content={content} upd={updateContent} />,
    Experience: <TabExperience content={content} upd={updateContent} />,
    Services:   <TabServices   content={content} upd={updateContent} />,
    Contact:    <TabContact    content={content} upd={updateContent} />,
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
        onClick={() => setPanelOpen(o => !o)}
        title="Open Admin Panel"
        style={{
          position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999,
          width: '52px', height: '52px', borderRadius: '50%',
          background: panelOpen ? '#1a1a1a' : 'var(--accent, #c9a96e)',
          border: '2px solid rgba(201,169,110,0.4)',
          color: panelOpen ? '#c9a96e' : '#080808',
          fontSize: '20px', cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(var(--bg-dark-rgb),0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >{panelOpen ? '✕' : '⚙'}</motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(var(--bg-dark-rgb),0.5)', zIndex: 9000, backdropFilter: 'blur(4px)' }} />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '420px', background: '#0a0a0a',
              borderLeft: '1px solid #1e1e1e', zIndex: 9999,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(var(--bg-dark-rgb),0.7)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid #1e1e1e',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '-0.02em' }}>
                  ⚙ Admin Panel
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: '#c9a96e', marginTop: '2px', letterSpacing: '0.06em' }}>
                  All changes auto-save ✦
                </div>
              </div>
              <button onClick={logout}
                style={{ background: 'rgba(220,60,60,0.12)', border: '1px solid rgba(220,60,60,0.25)', borderRadius: '8px', padding: '8px 14px', color: '#e05555', fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>
                LOGOUT
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2px', padding: '12px 16px', borderBottom: '1px solid #1e1e1e', flexShrink: 0, flexWrap: 'wrap' }}>
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '7px 13px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: 600,
                    fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em', border: 'none',
                    background: activeTab === tab ? '#c9a96e' : '#141414',
                    color: activeTab === tab ? '#080808' : '#888',
                    transition: 'all 0.2s ease',
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a #0a0a0a' }}>
              {tabContent[activeTab]}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #1e1e1e', flexShrink: 0 }}>
              {!confirmReset ? (
                <button onClick={() => setConfirmReset(true)}
                  style={{ width: '100%', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px', color: '#555', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Reset to Defaults
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => { resetContent(); setConfirmReset(false); }}
                    style={{ flex: 1, background: 'rgba(220,60,60,0.15)', border: '1px solid rgba(220,60,60,0.3)', borderRadius: '8px', padding: '10px', color: '#e05555', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                    Yes, reset all
                  </button>
                  <button onClick={() => setConfirmReset(false)}
                    style={{ flex: 1, background: '#141414', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px', color: '#888', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
