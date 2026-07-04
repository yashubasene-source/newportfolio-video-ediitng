/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimationSettings } from './animationConfig';

/**
 * Returns Framer Motion hover variants for buttons, scaling down slightly on click
 */
export const getButtonHoverVariants = (settings: AnimationSettings) => {
  if (!settings.enableHoverEffect) {
    return {
      hover: {},
      tap: {},
    };
  }

  return {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    tap: {
      scale: 0.98,
    },
  };
};

/**
 * Returns hover variants for cards and list items
 */
export const getCardHoverVariants = (settings: AnimationSettings) => {
  if (!settings.enableHoverEffect) {
    return {
      hover: {},
    };
  }

  return {
    hover: {
      y: -4,
      scale: 1.01,
      boxShadow: settings.enableShadows 
        ? '0 12px 24px -10px rgba(0, 0, 0, 0.15)' 
        : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };
};
