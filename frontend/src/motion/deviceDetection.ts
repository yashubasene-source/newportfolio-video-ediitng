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
  deviceMemory: number; // in GB
  saveData: boolean;
  isSlowNetwork: boolean;
  mode: 'full' | 'balanced' | 'lite' | 'reduced';
  profile: 'A' | 'B' | 'C' | 'D';
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
      saveData: false,
      isSlowNetwork: false,
      mode: 'full',
      profile: 'A',
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
  const deviceMemory = (navigator as any).deviceMemory || 4;

  // Network connection inspection (Section 26 & 32)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const saveData = connection?.saveData === true;
  const isSlowNetwork = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';

  // Automatically determine performance profile (Section 27)
  let profile: 'A' | 'B' | 'C' | 'D' = 'A';
  let mode: 'full' | 'balanced' | 'lite' | 'reduced' = 'full';

  if (prefersReducedMotion) {
    mode = 'reduced';
    profile = 'C';
  } else if (saveData || isSlowNetwork || deviceMemory <= 1.5) {
    // PROFILE D — VERY LOW (Poster-only, minimal complexity, zero video autoplay)
    mode = 'lite';
    profile = 'D';
  } else if (deviceMemory <= 2 || cpuCores <= 2 || (isMobile && screenWidth < 600)) {
    // PROFILE C — LOW (Budget Android, low memory/cpu)
    mode = 'lite';
    profile = 'C';
  } else if (deviceMemory <= 4 || cpuCores <= 4 || isTablet || isMobile) {
    // PROFILE B — NORMAL (Normal laptops, mid-range devices)
    mode = 'balanced';
    profile = 'B';
  } else {
    // PROFILE A — HIGH PERFORMANCE (Modern desktops, powerful hardware)
    mode = 'full';
    profile = 'A';
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
    saveData,
    isSlowNetwork,
    mode,
    profile,
  };
}
