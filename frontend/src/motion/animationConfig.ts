/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnimationSettings {
  duration: number;
  ease: string;
  stagger: number;
  yOffset: number;
  scaleOffset: number;
  enableFloating: boolean;
  enableParallax: boolean;
  enableHoverEffect: boolean;
  enableMouseFollow: boolean;
  enableParticles: boolean;
  enableBlur: boolean;
  enableShadows: boolean;
}

export const ANIMATION_CONFIGS: Record<'full' | 'balanced' | 'lite' | 'reduced', AnimationSettings> = {
  full: {
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.1,
    yOffset: 30,
    scaleOffset: 0.98,
    enableFloating: true,
    enableParallax: true,
    enableHoverEffect: true,
    enableMouseFollow: true,
    enableParticles: true,
    enableBlur: true,
    enableShadows: true,
  },
  balanced: {
    duration: 0.6,
    ease: 'power1.out',
    stagger: 0.05,
    yOffset: 15,
    scaleOffset: 0.99,
    enableFloating: false,
    enableParallax: false,
    enableHoverEffect: true,
    enableMouseFollow: false,
    enableParticles: false,
    enableBlur: false,
    enableShadows: true,
  },
  lite: {
    duration: 0.4,
    ease: 'sine.out',
    stagger: 0,
    yOffset: 5,
    scaleOffset: 1.0, // No scale shift
    enableFloating: false,
    enableParallax: false,
    enableHoverEffect: false,
    enableMouseFollow: false,
    enableParticles: false,
    enableBlur: false,
    enableShadows: false,
  },
  reduced: {
    duration: 0.2,
    ease: 'linear',
    stagger: 0,
    yOffset: 0,
    scaleOffset: 1.0,
    enableFloating: false,
    enableParallax: false,
    enableHoverEffect: false,
    enableMouseFollow: false,
    enableParticles: false,
    enableBlur: false,
    enableShadows: false,
  },
};
