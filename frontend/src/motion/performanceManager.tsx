/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectDeviceCapabilities, DeviceCapabilities } from './deviceDetection';
import { ANIMATION_CONFIGS, AnimationSettings } from './animationConfig';

interface PerformanceContextType {
  capabilities: DeviceCapabilities;
  settings: AnimationSettings;
  updateMode: (mode: 'full' | 'balanced' | 'lite' | 'reduced') => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(() => detectDeviceCapabilities());

  useEffect(() => {
    // Recalculate on mount (specifically for client-side checks)
    const initialCaps = detectDeviceCapabilities();
    setCapabilities(initialCaps);

    let timeoutId: any;
    const handleResize = () => {
      // Debounce resize events to protect main thread
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setCapabilities(prev => {
          const next = detectDeviceCapabilities();
          // Only trigger state update if the mode or screen dimensions change
          if (prev.mode !== next.mode || prev.screenWidth !== next.screenWidth) {
            return next;
          }
          return prev;
        });
      }, 250);
    };

    // Watch prefers-reduced-motion media query changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleQueryChange = () => {
      setCapabilities(detectDeviceCapabilities());
    };

    window.addEventListener('resize', handleResize);
    
    // Support modern and legacy change listeners
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleQueryChange);
    } else {
      mediaQuery.addListener(handleQueryChange);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleQueryChange);
      } else {
        mediaQuery.removeListener(handleQueryChange);
      }
    };
  }, []);

  const updateMode = (newMode: 'full' | 'balanced' | 'lite' | 'reduced') => {
    setCapabilities(prev => ({
      ...prev,
      mode: newMode,
    }));
  };

  const settings = ANIMATION_CONFIGS[capabilities.mode];

  return (
    <PerformanceContext.Provider value={{ capabilities, settings, updateMode }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
