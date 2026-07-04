/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  screenWidth: number;
  cpuCores: number;
  deviceMemory: number; // in GB, fallback to 4 if not available
  mode: 'full' | 'balanced' | 'lite' | 'reduced';
}

export function detectDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      prefersReducedMotion: false,
      screenWidth: 1920,
      cpuCores: 4,
      deviceMemory: 4,
      mode: 'full',
    };
  }

  const userAgent = navigator.userAgent || '';
  const screenWidth = window.innerWidth;
  
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || (screenWidth < 768);
  const isTablet = (!isMobile && screenWidth <= 1024) || /iPad/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;
  
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  const cpuCores = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4; // defaults to 4GB if API is not supported

  // Automatically determine the performance mode
  let mode: 'full' | 'balanced' | 'lite' | 'reduced' = 'full';

  if (prefersReducedMotion) {
    mode = 'reduced';
  } else if (deviceMemory <= 2 || cpuCores <= 2 || (isMobile && screenWidth < 600)) {
    // Low-end mobile phones or old hardware -> Lite Mode
    mode = 'lite';
  } else if (deviceMemory <= 4 || cpuCores <= 4 || isTablet || isMobile) {
    // Mid-range mobile/tablet or mid-end laptops -> Balanced Mode
    mode = 'balanced';
  } else {
    // High-end hardware and desktop -> Full Mode
    mode = 'full';
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    prefersReducedMotion,
    screenWidth,
    cpuCores,
    deviceMemory,
    mode,
  };
}
