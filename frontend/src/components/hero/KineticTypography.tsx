/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeColors } from '../../types';

interface KineticTypographyProps {
  currentTheme: ThemeColors;
  isLiteMode?: boolean;
}

export default function KineticTypography({ currentTheme, isLiteMode = false }: KineticTypographyProps) {
  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-4 sm:py-6">
      
      {/* 
        ACCENT RECTANGLE (Section 2)
        One large vertical rectangle behind typography.
        Width: 110-160px desktop, Height: 230-320px desktop.
        ScaleY pulse: 0.98 -> 1.02 -> 0.98 (4-6s).
      */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110px] sm:w-[130px] md:w-[150px] lg:w-[165px] h-[220px] sm:h-[260px] md:h-[300px] lg:h-[330px] rounded-sm transition-colors duration-700 pointer-events-none z-0 ${
          isLiteMode ? '' : 'animate-pillar-pulse'
        }`}
        style={{
          backgroundColor: currentTheme.accentHex || '#E63B2E',
          opacity: 0.92,
        }}
      />

      {/* 
        MAIN KINETIC TYPOGRAPHY (Section 2)
        TWO overlapping typography layers:
        Layer 1: Solid black / dark filled text
        Layer 2: Transparent fill, thin outline, slightly offset
        Continuously shifting against each other horizontally.
      */}
      <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none w-full max-w-7xl px-2">
        
        {/* Row 1: PORTFOLIO */}
        <div className="relative flex items-center justify-center w-full overflow-visible">
          {/* Outlined Layer (shifted opposite) */}
          <span
            className={`font-sans font-black tracking-tight uppercase leading-none select-none text-stroke-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] 2xl:text-[11rem] opacity-75 ${
              isLiteMode ? 'translate-x-2' : 'animate-kinetic-outline'
            }`}
            style={{
              WebkitTextStroke: '1.5px #0f172a',
              letterSpacing: '-0.03em',
            }}
          >
            PORTFOLIO
          </span>

          {/* Solid Filled Layer (centered/shifted) */}
          <span
            className={`absolute font-sans font-black tracking-tight uppercase leading-none select-none text-slate-900 text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] 2xl:text-[11rem] mix-blend-darken ${
              isLiteMode ? '-translate-x-1' : 'animate-kinetic-fill'
            }`}
            style={{
              letterSpacing: '-0.03em',
            }}
          >
            PORTFOLIO
          </span>
        </div>

      </div>

      {/* Editorial horizontal baseline & coordinate markers */}
      <div className="w-full max-w-5xl mx-auto px-6 mt-4 flex items-center justify-between text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase pointer-events-none select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
          ANSHAY BASENE
        </span>
        <span className="hidden sm:inline-block opacity-40">
          — — — — — — — — — — — —
        </span>
        <span className="flex items-center gap-1.5">
          VIDEO & MOTION EDITOR
          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
        </span>
      </div>

    </div>
  );
}
