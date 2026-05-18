import { useState, useEffect } from 'react';

/**
 * Returns { isMobile, isTablet, isDesktop }
 * mobile  : width < 768px
 * tablet  : 768px <= width < 1024px
 * desktop : width >= 1024px
 */
export function useBreakpoint() {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    isMobile:  width < 768,
    isTablet:  width >= 768 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
}
