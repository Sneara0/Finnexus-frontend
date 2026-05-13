
declare module '@studio-freight/lenis' {
  interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    orientation?: 'vertical' | 'horizontal';
    gestureOrientation?: 'vertical' | 'horizontal';
    smoothWheel?: boolean;
    smoothTouch?: boolean;
    wheelMultiplier?: number;
    touchMultiplier?: number;
    infinite?: boolean;
  }

  class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
    scrollTo(target: number | string, options?: any): void;
    stop(): void;
    start(): void;
  }

  export default Lenis;
}
