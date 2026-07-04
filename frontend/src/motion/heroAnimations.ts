/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimationSettings } from './animationConfig';

/**
 * Generates dynamic Framer Motion variants for stagger container animations
 */
export const getStaggerContainerVariants = (settings: AnimationSettings) => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: settings.stagger,
      },
    },
  };
};

/**
 * Generates dynamic Framer Motion variants for fade-up elements
 */
export const getFadeUpVariants = (settings: AnimationSettings) => {
  return {
    hidden: {
      opacity: 0,
      y: settings.yOffset,
      scale: settings.scaleOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: settings.duration,
        ease: settings.ease === 'power2.out' ? [0.25, 1, 0.5, 1] : [0.4, 0, 0.2, 1], // easeOutQuint vs easeInOut
      },
    },
  };
};

/**
 * Generates variants for simple, lightweight fades (used in Lite/Reduced modes)
 */
export const getSimpleFadeVariants = (settings: AnimationSettings) => {
  return {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: settings.duration,
        ease: 'easeInOut',
      },
    },
  };
};
