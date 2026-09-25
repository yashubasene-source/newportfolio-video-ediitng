/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Sparkles, ArrowDown } from 'lucide-react';
import { Project, ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';
import KineticTypography from './hero/KineticTypography';
import FloatingCollage from './hero/FloatingCollage';

interface HeroProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  heroConfig?: any;
  projectsList: Project[];
  onSelectProject: (project: Project) => void;
}

export default function Hero({
  currentTheme,
  soundEnabled,
  heroConfig,
  projectsList,
  onSelectProject,
}: HeroProps) {
  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';
  const isTouch = capabilities.isTouch || capabilities.isMobile;

  const playSound = (freq: number, dur = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  return (
    <section
      id="hero-section"
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-20 sm:pt-24 pb-8 overflow-hidden select-none bg-[#FAF7F2]"
      style={{
        backgroundImage: `radial-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Editorial Corner Crosshairs & Coordinates */}
      <div className="absolute top-6 left-6 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-6 right-6 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>

      {/* 
        HERO TOP HEADER BAR (Section 2)
        TOP LEFT:
        Small text:
        WELCOME
        TO MY
        Uppercase compact typography. Around 7-9vw from left, around 7-9vh from top on desktop.
      */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-start justify-between relative z-20 pointer-events-none">
        {/* Top Left Label */}
        <div className="flex flex-col text-left font-mono text-[10px] sm:text-xs font-black tracking-[0.25em] text-slate-800 leading-tight uppercase pointer-events-auto">
          <span>WELCOME</span>
          <span>TO MY</span>
        </div>

        {/* Top Right Minimal Icon/Button (Section 2) */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <a
            href="#work-section"
            onClick={() => playSound(700)}
            className="w-8 h-8 rounded-full border border-slate-300 bg-white/70 backdrop-blur-sm flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-500 transition-all shadow-sm"
            aria-label="Jump to Selected Work"
            title="Target Work"
          >
            <Target className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 
        HERO CENTER COMPOSITION:
        - Accent Vertical Rectangle
        - Overlapping Kinetic "PORTFOLIO" Typography Layers
      */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-auto">
        <KineticTypography currentTheme={currentTheme} isLiteMode={isLiteMode} />
        
        {/* 
          FLOATING PROJECT COLLAGE (Section 3)
          5-8 dynamic project cards partially overlapping in fan/arc layout.
          Independent float movement, hover video preview, mouse parallax on desktop.
        */}
        <FloatingCollage
          projects={projectsList}
          currentTheme={currentTheme}
          isLiteMode={isLiteMode}
          isTouch={isTouch}
          onSelectProject={onSelectProject}
        />
      </div>

    </section>
  );
}
