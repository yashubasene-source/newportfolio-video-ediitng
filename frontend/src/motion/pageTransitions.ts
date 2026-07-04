/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimationSettings } from './animationConfig';

/**
 * Returns page/modal transition properties based on settings
 */
export const getPageTransitionVariants = (settings: AnimationSettings) => {
  return {
    initial: {
      opacity: 0,
      y: settings.yOffset,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: settings.duration,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -settings.yOffset,
      transition: {
        duration: settings.duration * 0.75, // Exit transitions slightly faster
        ease: 'easeIn',
      },
    },
  };
};

/**
 * Tab switcher transition variants
 */
export const getTabTransitionVariants = (settings: AnimationSettings) => {
  return {
    initial: {
      opacity: 0,
      scale: settings.scaleOffset,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: settings.duration * 0.8,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      scale: settings.scaleOffset,
      transition: {
        duration: settings.duration * 0.6,
        ease: 'easeIn',
      },
    },
  };
};
