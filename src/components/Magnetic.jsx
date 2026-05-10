import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverSound, playClickSound } from '../utils/audio';

export default function Magnetic({ children, scale = 1.1, tension = 400, friction = 17 }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const handleEnter = () => {
    playHoverSound();
  };

  const handleClick = () => {
    playClickSound();
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      className="magnetic"
      style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap' }}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={reset}
      onMouseDown={handleClick}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: tension, damping: friction, mass: 0.1 }}
      whileHover={{ scale }}
    >
      {children}
    </motion.div>
  );
}
