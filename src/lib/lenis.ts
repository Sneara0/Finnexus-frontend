

import { useEffect, useRef } from 'react';

// Lenis টাইপ ডিক্লেয়ারেশন
interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
}

export const useLenis = () => {
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    let isMounted = true;
    let animationId: number;

    const initLenis = async () => {
      try {
        // Dynamic import for Lenis
        const LenisModule = await import('@studio-freight/lenis');
        const Lenis = LenisModule.default;
        
        if (!Lenis || !isMounted) return;

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          infinite: false,
        });

        lenisRef.current = lenis;

        const raf = (time: number) => {
          if (lenisRef.current) {
            lenisRef.current.raf(time);
          }
          animationId = requestAnimationFrame(raf);
        };

        animationId = requestAnimationFrame(raf);
      } catch (error) {
        console.warn('Lenis not available, using default scroll');
      }
    };

    initLenis();

    return () => {
      isMounted = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);
};

export default useLenis;
