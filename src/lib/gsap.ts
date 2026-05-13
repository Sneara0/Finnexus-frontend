
'use client';

import gsap from 'gsap';

// GSAP টাইপ
type GSAPTarget = string | Element | Element[] | NodeListOf<Element>;

// ডিফল্ট কনফিগারেশন
if (typeof window !== 'undefined') {
  gsap.config({
    nullTargetWarn: false,
    autoSleep: 60,
    force3D: true,
  });
}

// ইউটিলিটি ফাংশন
export const fadeIn = (element: GSAPTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const scaleIn = (element: GSAPTarget, delay: number = 0) => {
  return gsap.fromTo(element,
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.6, delay, ease: 'back.out(0.8)' }
  );
};

export const slideIn = (element: GSAPTarget, direction: 'left' | 'right' = 'left', delay: number = 0) => {
  const x = direction === 'left' ? -50 : 50;
  return gsap.fromTo(element,
    { x, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, delay, ease: 'power3.out' }
  );
};

export const staggerFadeIn = (elements: GSAPTarget, staggerDelay: number = 0.1, delay: number = 0) => {
  return gsap.fromTo(elements,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.6, delay, stagger: staggerDelay, ease: 'power3.out' }
  );
};

export { gsap };