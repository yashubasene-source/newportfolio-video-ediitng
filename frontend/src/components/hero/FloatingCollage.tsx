/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Project, ThemeColors } from '../../types';
import FloatingCollageCard from './FloatingCollageCard';

interface FloatingCollageProps {
  projects: Project[];
  currentTheme: ThemeColors;
  isLiteMode: boolean;
  isTouch: boolean;
  onSelectProject: (project: Project) => void;
}

export default function FloatingCollage({
  projects,
  currentTheme,
  isLiteMode,
  isTouch,
  onSelectProject,
}: FloatingCollageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Setup cards configuration mapping directly to the reference video's fan/arc layout
  const cardConfigs = [
    // 0: Card 1 - left-bottom (-14deg)
    {
      baseRotation: -14,
      scale: 0.92,
      zIndex: 14,
      floatClass: 'animate-float-1',
      parallaxDepth: 0.35,
      desktopClasses: '-translate-x-[210px] md:-translate-x-[280px] lg:-translate-x-[360px] translate-y-6',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    // 1: Card 2 - left-center (-7deg)
    {
      baseRotation: -7,
      scale: 0.96,
      zIndex: 22,
      floatClass: 'animate-float-2',
      parallaxDepth: 0.55,
      desktopClasses: '-translate-x-[110px] md:-translate-x-[140px] lg:-translate-x-[180px] -translate-y-2',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    // 2: Card 3 - center (0deg, slightly larger primary)
    {
      baseRotation: 0,
      scale: 1.02,
      zIndex: 30,
      floatClass: 'animate-float-3',
      parallaxDepth: 0.75,
      desktopClasses: 'translate-x-0 -translate-y-6',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    // 3: Card 4 - right-center (9deg)
    {
      baseRotation: 8,
      scale: 0.96,
      zIndex: 22,
      floatClass: 'animate-float-4',
      parallaxDepth: 0.55,
      desktopClasses: 'translate-x-[110px] md:translate-x-[140px] lg:translate-x-[180px] -translate-y-2',
      hideOnMobile: false,
      hideOnTablet: false,
    },
    // 4: Card 5 - far-right (15deg)
    {
      baseRotation: 15,
      scale: 0.92,
      zIndex: 14,
      floatClass: 'animate-float-5',
      parallaxDepth: 0.35,
      desktopClasses: 'translate-x-[210px] md:translate-x-[280px] lg:translate-x-[360px] translate-y-6',
      hideOnMobile: true,
      hideOnTablet: false,
    },
    // 5: Card 6 - bottom-left (outer anchor)
    {
      baseRotation: -19,
      scale: 0.86,
      zIndex: 10,
      floatClass: 'animate-float-6',
      parallaxDepth: 0.2,
      desktopClasses: '-translate-x-[320px] md:-translate-x-[420px] lg:-translate-x-[520px] translate-y-16',
      hideOnMobile: true,
      hideOnTablet: true,
    },
    // 6: Card 7 - bottom-right (outer anchor)
    {
      baseRotation: 21,
      scale: 0.86,
      zIndex: 10,
      floatClass: 'animate-float-7',
      parallaxDepth: 0.2,
      desktopClasses: 'translate-x-[320px] md:translate-x-[420px] lg:translate-x-[520px] translate-y-16',
      hideOnMobile: true,
      hideOnTablet: true,
    },
  ];

  // Mouse Parallax (Section 11)
  // Max movement: X: ±10px, Y: ±8px. Disabled on touch and lite/reduced modes.
  useEffect(() => {
    if (isLiteMode || isTouch || typeof window === 'undefined') return;

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized between -1 and 1
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      targetX = nx * 10;
      targetY = ny * 8;

      if (!rafId) {
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    const updateParallax = () => {
      // Lerp for smooth response
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--collage-mx', `${currentX.toFixed(2)}px`);
        containerRef.current.style.setProperty('--collage-my', `${currentY.toFixed(2)}px`);
      }

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(updateParallax);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isLiteMode, isTouch]);

  // Fallback if projects is empty or small: cycle or slice safely
  const activeProjects = projects.length > 0 ? projects : [];

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-col items-center justify-center overflow-visible mt-2 sm:mt-6 pb-12"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Cards collage fan layer */}
      <div className="relative w-full max-w-7xl h-[330px] sm:h-[370px] md:h-[420px] lg:h-[460px] flex items-center justify-center overflow-visible">
        {cardConfigs.map((config, index) => {
          // Dynamically map to project
          const project = activeProjects[index % Math.max(1, activeProjects.length)];
          if (!project) return null;

          return (
            <div
              key={`${project.id}-${index}`}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out ${config.desktopClasses} ${
                config.hideOnMobile ? 'hidden sm:block' : ''
              } ${config.hideOnTablet ? 'hidden lg:block' : ''}`}
              style={{
                zIndex: config.zIndex,
                transform: `translate3d(calc(-50% + var(--collage-mx, 0px) * ${config.parallaxDepth}), calc(-50% + var(--collage-my, 0px) * ${config.parallaxDepth}), 0)`,
              }}
            >
              <FloatingCollageCard
                project={project}
                baseRotation={config.baseRotation}
                scale={config.scale}
                zIndex={config.zIndex}
                floatClass={config.floatClass}
                isLiteMode={isLiteMode}
                isTouch={isTouch}
                currentTheme={currentTheme}
                onClick={onSelectProject}
              />
            </div>
          );
        })}
      </div>

      {/* 
        Circular Dial / Arc Element (as shown in reference video bottom center)
        Circular text badge: PORTFOLIO • CREATIVE • MOTION
      */}
      <div className="relative z-30 mt-6 sm:mt-8 flex flex-col items-center justify-center pointer-events-none select-none">
        <a
          href="#work-section"
          className="pointer-events-auto group flex flex-col items-center gap-1.5 focus:outline-none"
        >
          {/* Dial Arc Circle */}
          <div className="relative w-28 h-14 overflow-hidden flex items-end justify-center">
            <div className="w-28 h-28 rounded-full border border-slate-300/80 bg-white/70 backdrop-blur-sm shadow-sm flex flex-col items-center justify-start pt-2 transition-all duration-300 group-hover:scale-105 group-hover:border-slate-400">
              <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-slate-500 uppercase">
                SCROLL
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-800 transition-colors animate-bounce mt-0.5" />
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase group-hover:text-slate-700 transition-colors">
            EXPLORE WORK
          </span>
        </a>
      </div>

    </div>
  );
}
