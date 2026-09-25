/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Project, ThemeColors } from '../../types';
import { usePerformance } from '../../motion/performanceManager';
import CurvedGalleryCard from './CurvedGalleryCard';

interface CurvedGalleryStageProps {
  projects: Project[];
  activeIndex: number;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  mediaMode: 'reels' | 'videos';
  currentTheme: ThemeColors;
  isLiteMode: boolean;
  isTouch: boolean;
  isFocusingProject?: boolean;
  scrollExitProgress?: number;
  onSelectProject: (project: Project) => void;
  onHoverChange?: (hovered: boolean) => void;
  onDragChange?: (dragging: boolean) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
}

export default function CurvedGalleryStage({
  projects,
  activeIndex,
  setActiveIndex,
  mediaMode,
  currentTheme,
  isLiteMode,
  isTouch,
  isFocusingProject = false,
  scrollExitProgress = 0,
  onSelectProject,
  onHoverChange,
  onDragChange,
  isPaused = false,
  onTogglePause,
}: CurvedGalleryStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const total = projects.length;

  const { capabilities } = usePerformance();
  const profile = capabilities.profile || 'A';
  const isProfileLite = isLiteMode || profile === 'C' || profile === 'D';
  const allowVideoPreview = profile !== 'D' && !capabilities.saveData && !capabilities.isSlowNetwork;

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  // Responsive and Performance-Tiered Slot Count (Section 27)
  // Profile A: 9 slots | Profile B: 7 slots | Profile C: 5 slots | Profile D / Mobile: 3-5 slots
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const rawSlotCount = isMobile
    ? 3
    : profile === 'D'
    ? 3
    : isProfileLite
    ? 5
    : isTablet || profile === 'B'
    ? 7
    : 9;

  // Never create more slots than unique projects available to prevent repetition
  const slotCount = Math.max(1, Math.min(rawSlotCount, total > 0 ? total : 1));

  // Continuous stream offset in slot units (smooth floating progress)
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const dragVelocityRef = useRef(0);
  const isHorizontalGestureRef = useRef(false);
  const hasDeterminedGestureRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // DOM node references for slots (direct hardware transform updates, 60+ FPS zero-render performance)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Project index assigned to each slot — strictly unique projects
  const slotAssignmentsRef = useRef<number[]>([]);
  const [slotAssignments, setSlotAssignments] = useState<number[]>(() => {
    const initial: number[] = [];
    for (let s = 0; s < slotCount; s++) {
      const cycle = Math.floor((-s + slotCount / 2) / slotCount);
      const projectIndex = total > 0 ? (((s + cycle * slotCount) % total) + total) % total : 0;
      initial.push(projectIndex);
    }
    return initial;
  });

  const lastCenterProjIndexRef = useRef<number>(-1);
  const entranceProgressRef = useRef(0);
  const [hasEntered, setHasEntered] = useState(false);

  // Resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Viewport entrance observation (smooth 800–1200ms entrance)
  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync slot array when slotCount, mode, or total changes — strictly unique project assignments
  useEffect(() => {
    slotAssignmentsRef.current = [];
    for (let s = 0; s < slotCount; s++) {
      const cycle = Math.floor((-s + slotCount / 2) / slotCount);
      const projectIndex = total > 0 ? (((s + cycle * slotCount) % total) + total) % total : 0;
      slotAssignmentsRef.current.push(projectIndex);
    }
    setSlotAssignments([...slotAssignmentsRef.current]);
  }, [slotCount, total, mediaMode]);

  // Reset offset and sync when projects change externally
  useEffect(() => {
    offsetRef.current = 0;
    targetOffsetRef.current = null;
    lastCenterProjIndexRef.current = 0;
  }, [projects, mediaMode]);

  // Smooth slot nudge (Prev / Next buttons and keyboard)
  const smoothNudge = useCallback((direction: number) => {
    if (targetOffsetRef.current === null) {
      targetOffsetRef.current = Math.round(offsetRef.current) + direction;
    } else {
      targetOffsetRef.current += direction;
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        smoothNudge(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        smoothNudge(1);
      } else if (e.key === ' ') {
        e.preventDefault();
        onTogglePause?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [smoothNudge, onTogglePause]);

  // Listen to conveyor-nudge events from Prev/Next buttons
  useEffect(() => {
    const handleNudge = (e: Event) => {
      const custom = e as CustomEvent<{ dir: number }>;
      if (custom.detail && typeof custom.detail.dir === 'number') {
        smoothNudge(custom.detail.dir);
      }
    };
    window.addEventListener('conveyor-nudge', handleNudge);
    return () => window.removeEventListener('conveyor-nudge', handleNudge);
  }, [smoothNudge]);

  // Non-hijacking horizontal wheel / Shift + wheel listener
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const handleWheel = (e: WheelEvent) => {
      const isHorizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!isHorizontalIntent) return;

      e.preventDefault();
      const delta = e.shiftKey ? e.deltaY : e.deltaX;
      offsetRef.current += delta * 0.003;
      targetOffsetRef.current = null;
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => stage.removeEventListener('wheel', handleWheel);
  }, []);

  // Main 60+ FPS Continuous 3D Media Conveyor Animation Loop (rAF)
  useEffect(() => {
    if (total === 0) return;

    let rafId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      // Entrance animation progression (800–1200ms)
      if (hasEntered && entranceProgressRef.current < 1) {
        entranceProgressRef.current = Math.min(1, entranceProgressRef.current + dt * 1.1);
      }

      // Check prefers-reduced-motion
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // CONTINUOUS RIGHT → LEFT MOTION (Section 9 & 13)
      // Speed: ~70–110px/sec (~2.8–3.5s per project passing center)
      const baseSpeed = prefersReduced ? 0 : isMobile ? 0.35 : 0.31; // slot units per second

      if (!isPaused && !isHoveredRef.current && !isDraggingRef.current) {
        if (targetOffsetRef.current !== null) {
          // Smooth spring to target snap position
          const diff = targetOffsetRef.current - offsetRef.current;
          if (Math.abs(diff) > 0.008) {
            offsetRef.current += diff * Math.min(1, dt * 7.5);
          } else {
            offsetRef.current = targetOffsetRef.current;
            targetOffsetRef.current = null;
          }
        } else {
          // Continuous right-to-left travel
          offsetRef.current += baseSpeed * dt;
        }
      }

      // Apply drag inertia after release
      if (!isDraggingRef.current && Math.abs(dragVelocityRef.current) > 0.5) {
        offsetRef.current -= (dragVelocityRef.current * dt) / (mediaMode === 'reels' ? 140 : 180);
        dragVelocityRef.current *= Math.pow(0.85, dt * 60);
      }

      const currentOffset = offsetRef.current;
      const normalizer = 1.0; // t represents direct slot units from center
      const stepX = mediaMode === 'reels' ? (isMobile ? 190 : 300) : (isMobile ? 240 : 380);

      let closestDist = Infinity;
      let closestProjIdx = 0;
      let needsAssignmentsUpdate = false;

      // Calculate 3D Card Geometry according to exact Section 3, 5, 6, 7, 8 specifications:
      for (let s = 0; s < slotCount; s++) {
        // Continuous symmetrical position along track [-slotCount/2, slotCount/2]
        const rawPos = s - (currentOffset % slotCount);
        const pos =
          ((rawPos + slotCount / 2) % slotCount + slotCount) % slotCount - slotCount / 2;

        const t = pos / normalizer;
        const absT = Math.abs(t);

        let scale = 1.0;
        let rotateY = 0;
        let translateZ = 0;
        let translateX = 0;
        let zIndex = 50;

        if (isMobile) {
          // Dedicated Mobile Geometry (Section 24)
          // Center: rotateY(0deg), scale(1), translateZ(50px)
          // Sides: rotateY(±10-14deg), scale(.78), translateZ(0px)
          scale = Math.max(0.74, 1.0 - 0.22 * Math.min(1.5, absT));
          rotateY = -Math.sign(t) * Math.min(16, 12 * Math.pow(Math.min(1.5, absT), 0.8));
          translateZ = Math.max(-20, 50 - 50 * Math.min(1.5, absT));
          translateX = t * stepX;
          zIndex = Math.round(50 - absT * 15);
        } else {
          // Desktop & Tablet 3D Spatial Geometry (Section 5, 6, 7, 8)
          // CENTER (t = 0):
          // scale: 1.0, translateZ: 100px, rotateY: 0deg, translateX: 0, zIndex: 50
          //
          // IMMEDIATELY SIDES (|t| = 1.0):
          // scale: .88, translateZ: 20px, rotateY: ∓22deg, translateX: ±280-350px, zIndex: 40
          //
          // FAR SIDES (|t| = 2.0):
          // scale: .76, translateZ: -50px, rotateY: ∓34deg, translateX: ±480-650px, zIndex: 30
          //
          // EXTREME SIDES (|t| >= 3.0):
          // scale: .64, translateZ: -120px, rotateY: ∓44deg, opacity fades out
          scale = Math.max(0.62, 1.0 - 0.12 * Math.min(3.2, absT));
          rotateY = -Math.sign(t) * Math.min(48, 22 * Math.pow(Math.min(3.2, absT), 0.65));
          translateZ = 100 - 80 * Math.pow(Math.min(3.2, absT), 0.95);
          translateX = t * stepX * (1 - 0.05 * Math.min(2.5, absT));
          zIndex = Math.round(50 - absT * 10);
        }

        // Opacity: full across the focus arc, fades smoothly at the clipping boundary
        const fadeStart = isMobile ? 1.15 : 2.2;
        const fadeEnd = isMobile ? 1.55 : 3.3;
        let opacity = 1.0;
        if (absT > fadeStart) {
          opacity = Math.max(0, 1 - (absT - fadeStart) / (fadeEnd - fadeStart));
        }

        // Entrance & exit fading
        if (entranceProgressRef.current < 1) {
          opacity *= Math.max(0.05, entranceProgressRef.current);
        }
        if (scrollExitProgress > 0) {
          opacity *= Math.max(0, 1 - scrollExitProgress * 1.2);
        }

        // Apply transforms directly to slot DOM node (Zero React re-renders)
        const el = slotRefs.current[s];
        if (el) {
          el.style.transform = `translate3d(calc(-50% + ${translateX.toFixed(
            1
          )}px), -50%, ${translateZ.toFixed(1)}px) rotateY(${rotateY.toFixed(
            1
          )}deg) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
          el.style.zIndex = zIndex.toString();
        }

        // Infinite Circular Slot Recycling (Section 10 & 11)
        // When a slot exits on the left and wraps to the right (at opacity = 0), assign next project
        const cycle = Math.floor((currentOffset - s + slotCount / 2) / slotCount);
        const projectIndex = total > 0 ? (((s + cycle * slotCount) % total) + total) % total : 0;
        if (slotAssignmentsRef.current[s] !== projectIndex) {
          slotAssignmentsRef.current[s] = projectIndex;
          needsAssignmentsUpdate = true;
        }

        // Track project closest to center
        if (absT < closestDist) {
          closestDist = absT;
          closestProjIdx = projectIndex;
        }
      }

      // Re-render slot contents only when an offscreen slot has recycled its project
      if (needsAssignmentsUpdate) {
        setSlotAssignments([...slotAssignmentsRef.current]);
      }

      // Notify parent of active center project change for metadata sync
      if (closestProjIdx !== lastCenterProjIndexRef.current && total > 0) {
        lastCenterProjIndexRef.current = closestProjIdx;
        setActiveIndex(closestProjIdx);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [
    total,
    mediaMode,
    slotCount,
    isMobile,
    isPaused,
    scrollExitProgress,
    hasEntered,
    setActiveIndex,
  ]);

  // Touch and Mouse Drag / Swipe Handlers (Section 22 & 23)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    lastDragXRef.current = e.touches[0].clientX;
    dragVelocityRef.current = 0;
    isHorizontalGestureRef.current = false;
    hasDeterminedGestureRef.current = false;
    onDragChange?.(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - dragStartXRef.current;
    const diffY = currentY - (e.touches[0] as any).targetTouches?.[0]?.clientY || 0;

    if (!hasDeterminedGestureRef.current) {
      if (Math.abs(diffX) > 8 && Math.abs(diffX) > Math.abs(diffY)) {
        isHorizontalGestureRef.current = true;
        hasDeterminedGestureRef.current = true;
      } else if (Math.abs(diffY) > 8) {
        // Vertical gesture: release drag so browser scrolls page unhindered
        isHorizontalGestureRef.current = false;
        hasDeterminedGestureRef.current = true;
        isDraggingRef.current = false;
        onDragChange?.(false);
        return;
      }
    }

    if (isHorizontalGestureRef.current) {
      const deltaX = currentX - lastDragXRef.current;
      lastDragXRef.current = currentX;
      dragVelocityRef.current = deltaX;
      const slotWidth = (mediaMode === 'reels' ? 300 : 380);
      offsetRef.current -= deltaX / slotWidth;
      targetOffsetRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    isHorizontalGestureRef.current = false;
    hasDeterminedGestureRef.current = false;

    // Snap to nearest logical position (Section 23)
    targetOffsetRef.current = Math.round(offsetRef.current);

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      targetOffsetRef.current = null;
      onDragChange?.(false);
    }, 1500);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isTouch) return;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    dragVelocityRef.current = 0;
    onDragChange?.(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isTouch) return;
    const deltaX = e.clientX - lastDragXRef.current;
    lastDragXRef.current = e.clientX;
    dragVelocityRef.current = deltaX;
    const slotWidth = (mediaMode === 'reels' ? 300 : 380);
    offsetRef.current -= deltaX / slotWidth;
    targetOffsetRef.current = null;
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current || isTouch) return;
    isDraggingRef.current = false;

    // Snap to nearest logical position (Section 23)
    targetOffsetRef.current = Math.round(offsetRef.current);

    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      targetOffsetRef.current = null;
      onDragChange?.(false);
    }, 1500);
  };

  const handleSlotClick = (slotIdx: number) => {
    const projIdx = slotAssignments[slotIdx];
    const project = projects[projIdx];
    if (project) {
      onSelectProject(project);
    }
  };

  if (total === 0) return null;

  return (
    <div
      ref={stageRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => {
        isHoveredRef.current = true;
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        handleMouseUp();
        isHoveredRef.current = false;
        onHoverChange?.(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing transition-[height] duration-500 ${
        mediaMode === 'reels'
          ? 'h-[460px] sm:h-[530px] md:h-[610px] lg:h-[660px]'
          : 'h-[340px] sm:h-[400px] md:h-[480px] lg:h-[520px]'
      }`}
      style={{
        perspective: isMobile ? '850px' : '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 
        Section 21: Fixed Horizontal Center Visual Axis Track Line
        Media panels continuously travel across this visual axis.
      */}
      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none z-0 overflow-hidden h-[1.5px]">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/35 to-transparent shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
        <div className="absolute top-0 bottom-0 w-44 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-motion-track-scan opacity-80" />
      </div>

      {/* 3D Curved Conveyor Stage Space */}
      <div
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(0, calc(-${scrollExitProgress * 50}px), -${scrollExitProgress * 80}px)`,
        }}
      >
        {Array.from({ length: slotCount }).map((_, slotIdx) => {
          const projectIndex = slotAssignments[slotIdx] ?? 0;
          const project = projects[projectIndex];
          if (!project) return null;

          const isCenter = projectIndex === activeIndex;

          return (
            <CurvedGalleryCard
              key={`conveyor-slot-${slotIdx}`}
              cardRef={(el) => {
                slotRefs.current[slotIdx] = el;
              }}
              isConveyor={true}
              project={project}
              relativeIndex={isCenter ? 0 : 1}
              isActive={isCenter}
              isFocused={isFocusingProject}
              currentTheme={currentTheme}
              mediaMode={mediaMode}
              isLiteMode={isProfileLite}
              isTouch={isTouch}
              allowVideoPreview={allowVideoPreview}
              onSelectActive={() => handleSlotClick(slotIdx)}
              onNavigateTo={() => handleSlotClick(slotIdx)}
            />
          );
        })}
      </div>
    </div>
  );
}
