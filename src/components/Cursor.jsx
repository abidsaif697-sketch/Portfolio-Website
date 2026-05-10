import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('.magnetic') ||
        getComputedStyle(e.target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }

      if (e.target.closest('.slider-drag')) {
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }

      if (e.target.closest('.view-cursor')) {
        setIsViewing(true);
      } else {
        setIsViewing(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isDragging || isViewing ? 0 : isHovering ? 0 : 1,
          opacity: isDragging || isViewing ? 0 : isHovering ? 0 : 1
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
        style={{ mixBlendMode: 'difference', zIndex: 9999, pointerEvents: 'none' }}
      />
      <motion.div
        className="cursor-ring"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isDragging || isViewing ? 2.5 : isHovering ? 1.5 : 1,
          backgroundColor: isDragging || isViewing ? 'rgba(255,255,255,1)' : 'transparent',
          borderColor: isDragging || isViewing ? 'transparent' : 'rgba(255,255,255,0.8)'
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
        style={{ mixBlendMode: 'difference', zIndex: 9998, pointerEvents: 'none' }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: isDragging || isViewing ? 1 : 0 }}
          style={{ 
            position: 'absolute', top: '50%', left: '50%', 
            transform: 'translate(-50%, -50%)', 
            fontFamily: 'var(--font-display)', fontSize: '6px', 
            fontWeight: 800, color: '#000', letterSpacing: '0.1em'
          }}
        >
          {isDragging ? 'DRAG' : 'VIEW'}
        </motion.span>
      </motion.div>
    </>
  );
}
