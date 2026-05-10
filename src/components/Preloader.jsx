import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 15; // Faster increments
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(onComplete, 200); // Reduced from 800ms to 200ms wait at the end
      }
      setProgress(current);
    }, 40); // Reduced interval from 150ms to 40ms

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'var(--bg-dark)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-light)', fontFamily: 'var(--font-display)'
      }}
    >
      <div style={{ fontSize: '10vw', fontWeight: 900, lineHeight: 1 }}>
        {progress}%
      </div>
      <div style={{
        marginTop: '40px', width: '200px', height: '2px',
        background: 'var(--border)', position: 'relative', overflow: 'hidden'
      }}>
        <motion.div
          style={{
            position: 'absolute', top: 0, left: 0, bottom: 0,
            background: 'var(--accent)', width: `${progress}%`
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
}
