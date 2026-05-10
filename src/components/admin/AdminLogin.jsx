import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../hooks/useAdmin';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [open, setOpen] = useState(false);
  const [pw, setPw]     = useState('');
  const [error, setError] = useState(false);

  const submit = () => {
    const ok = login(pw);
    if (!ok) { setError(true); setTimeout(() => setError(false), 2000); }
    else { setOpen(false); setPw(''); }
  };

  return (
    <>
      {/* Hidden trigger — triple-click the footer or press Ctrl+Shift+A */}
      {/* Small lock button bottom-left */}
      <motion.button
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        title="Admin Login"
        style={{
          position: 'fixed', bottom: '32px', left: '32px', zIndex: 8000,
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(var(--text-rgb),0.04)', border: '1px solid rgba(var(--text-rgb),0.08)',
          color: 'rgba(var(--text-rgb),0.25)', fontSize: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; e.currentTarget.style.color = '#c9a96e'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(var(--text-rgb),0.08)'; e.currentTarget.style.color = 'rgba(var(--text-rgb),0.25)'; }}
      >🔒</motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setOpen(false); setPw(''); }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(var(--bg-dark-rgb),0.7)', zIndex: 9998, backdropFilter: 'blur(8px)' }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 9999, width: '340px',
                background: '#0a0a0a', border: '1px solid #1e1e1e',
                borderRadius: '20px', padding: '36px 32px',
                boxShadow: '0 40px 80px rgba(var(--bg-dark-rgb),0.8)',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', margin: '0 auto 16px',
                }}>🔐</div>
                <h3 style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, color: 'var(--text-light)', margin: 0 }}>Admin Access</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#555', marginTop: '6px' }}>Enter your password to continue</p>
              </div>

              <input
                type="password" value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="Password"
                autoFocus
                style={{
                  width: '100%', background: '#111', border: `1px solid ${error ? '#e05555' : '#2a2a2a'}`,
                  borderRadius: '10px', padding: '14px 16px', color: 'var(--text-light)',
                  fontFamily: 'Inter, sans-serif', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box', marginBottom: '8px',
                  transition: 'border-color 0.2s ease',
                  animation: error ? 'shake 0.4s ease' : 'none',
                }}
                onFocus={e => !error && (e.target.style.borderColor = '#c9a96e')}
                onBlur={e => !error && (e.target.style.borderColor = '#2a2a2a')}
              />

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#e05555', marginBottom: '12px', textAlign: 'center' }}>
                    Incorrect password. Try again.
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02, background: '#b8975a' }} whileTap={{ scale: 0.97 }}
                onClick={submit}
                style={{
                  width: '100%', background: '#c9a96e', color: '#080808',
                  border: 'none', borderRadius: '10px', padding: '14px',
                  fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', transition: 'background 0.2s ease', marginTop: '4px',
                }}
              >Enter Panel</motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
