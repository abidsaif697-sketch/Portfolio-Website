import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    /* expose globally so Navigation can call lenis.scrollTo() */
    window.__lenis = lenis;

    /* intercept ALL hash anchor clicks site-wide */
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.6 });
        return;
      }
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { duration: 1.6, offset: -70 });
      }
    };
    document.addEventListener('click', handleAnchorClick);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.__lenis = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
