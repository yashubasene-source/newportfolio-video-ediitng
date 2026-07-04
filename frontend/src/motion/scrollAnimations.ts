/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import { AnimationSettings } from './animationConfig';

/**
 * Custom React Hook to initialize and manage Lenis Smooth Scrolling.
 * Disables itself on low-end hardware (lite/reduced modes) to maximize performance.
 */
export function useLenisScroll(settings: AnimationSettings, mode: string) {
  useEffect(() => {
    // Only run smooth scrolling on Balanced/Full modes on Desktop/Tablet
    if (mode === 'lite' || mode === 'reduced' || typeof window === 'undefined') {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
    });

    let rafId: number;
    const update = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    // Stop Lenis during modal opens or overlay displays
    const preventScroll = () => lenis.stop();
    const enableScroll = () => lenis.start();

    window.addEventListener('modal-open', preventScroll);
    window.addEventListener('modal-close', enableScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('modal-open', preventScroll);
      window.removeEventListener('modal-close', enableScroll);
    };
  }, [settings, mode]);
}

/**
 * Helper to dynamically construct ScrollTrigger properties if GSAP is requested.
 */
export function getScrollTriggerConfig(element: string | HTMLElement, trigger: string | HTMLElement) {
  return {
    trigger: trigger,
    start: 'top 85%',
    toggleActions: 'play none none reverse',
  };
}
