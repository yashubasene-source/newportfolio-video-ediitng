/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Scissors, Film, Sparkles, Play, Pause } from 'lucide-react';
import { Project, ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';
import CurvedGalleryStage from './gallery/CurvedGalleryStage';
import ActiveProjectInfo from './gallery/ActiveProjectInfo';
import GalleryNavigation from './gallery/GalleryNavigation';

interface ShowcaseProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  projectsList: Project[];
  onOpenAdmin?: () => void;
  onSelectProject: (project: Project) => void;
  isViewerOpen?: boolean;
}

export default function Showcase({
  currentTheme,
  soundEnabled,
  projectsList,
  onOpenAdmin,
  onSelectProject,
  isViewerOpen = false,
}: ShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Strict Media Classification: 'reels' (9:16 vertical only) vs 'videos' (landscape only)
  const [mediaMode, setMediaMode] = useState<'reels' | 'videos'>('reels');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isModeTransitioning, setIsModeTransitioning] = useState<boolean>(false);

  // User control and autoplay states
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [motionDirection, setMotionDirection] = useState<'ltr' | 'rtl'>('rtl');
  const [introEntered, setIntroEntered] = useState<boolean>(false);
  const [isFocusing, setIsFocusing] = useState<boolean>(false);
  const [scrollExitProgress, setScrollExitProgress] = useState<number>(0);

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

  // State 01: Viewport Entrance Observation for Controlled Intro
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIntroEntered(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // State 11 & 12: Scroll-based storytelling and section exit
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const sectionBottom = rect.bottom;
            const threshold = windowHeight * 0.5;

            if (sectionBottom < threshold) {
              const exit = Math.min(1, Math.max(0, (threshold - sectionBottom) / threshold));
              setScrollExitProgress(exit);
            } else {
              setScrollExitProgress(0);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // STRICT SEPARATION & DEDUPLICATION: Reels and Videos datasets NEVER mix and never repeat!
  const reelsDataset = useMemo(() => {
    const seenIds = new Set<string>();
    const seenLinks = new Set<string>();
    return projectsList
      .filter((p) => p.mediaType === 'reel' || p.aspectRatio === '9:16' || p.link?.includes('/shorts/'))
      .filter((p) => {
        const link = (p.videoUrl || p.link || '').trim();
        if (seenIds.has(p.id) || (link && seenLinks.has(link))) {
          return false;
        }
        seenIds.add(p.id);
        if (link) seenLinks.add(link);
        return true;
      })
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  }, [projectsList]);

  const videosDataset = useMemo(() => {
    const seenIds = new Set<string>();
    const seenLinks = new Set<string>();
    return projectsList
      .filter((p) => p.mediaType === 'video' || (p.mediaType !== 'reel' && p.aspectRatio !== '9:16' && !p.link?.includes('/shorts/')))
      .filter((p) => {
        const link = (p.videoUrl || p.link || '').trim();
        if (seenIds.has(p.id) || (link && seenLinks.has(link))) {
          return false;
        }
        seenIds.add(p.id);
        if (link) seenLinks.add(link);
        return true;
      })
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      });
  }, [projectsList]);

  // Current active mode dataset
  const activeModeProjects = mediaMode === 'reels' ? reelsDataset : videosDataset;

  // Available niches strictly inside the selected mode
  const availableNiches = useMemo(() => {
    const rawNiches = activeModeProjects.map((p) => p.niche).filter(Boolean);
    const uniqueNiches: string[] = Array.from(new Set(rawNiches));
    return uniqueNiches.map((niche) => ({
      id: niche,
      name: niche.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      count: activeModeProjects.filter((p) => p.niche === niche).length,
    }));
  }, [activeModeProjects]);

  // Filtered projects within the active mode
  const filteredProjects = useMemo(() => {
    if (selectedNiche === 'all') return activeModeProjects;
    return activeModeProjects.filter((p) => p.niche === selectedNiche);
  }, [activeModeProjects, selectedNiche]);

  // Cinematic category switch animation (500–800ms)
  const handleModeChange = (newMode: 'reels' | 'videos') => {
    if (newMode === mediaMode || isModeTransitioning) return;
    playSound(750, 0.08);
    setIsModeTransitioning(true);

    // Step 1: Smooth fade & scale down out
    setTimeout(() => {
      setMediaMode(newMode);
      setSelectedNiche('all');
      setActiveIndex(0);

      // Step 2: Smooth enter from depth
      setTimeout(() => {
        setIsModeTransitioning(false);
      }, 50);
    }, 320);
  };

  const handlePrev = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conveyor-nudge', { detail: { dir: -1 } }));
    }
    playSound(600, 0.04);
  }, []);

  const handleNext = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('conveyor-nudge', { detail: { dir: 1 } }));
    }
    playSound(700, 0.04);
  }, []);

  // State 07: Project Focus Mode transition before opening viewer
  const handleOpenProjectFocus = (project: Project) => {
    setIsFocusing(true);
    playSound(850, 0.15);

    // Brief 280ms spatial elevation before overlay modal opens
    setTimeout(() => {
      onSelectProject(project);
      setIsFocusing(false);
    }, 280);
  };

  const safeActiveIndex =
    filteredProjects.length > 0 ? Math.min(activeIndex, filteredProjects.length - 1) : 0;
  const activeProject = filteredProjects[safeActiveIndex] || null;

  return (
    <section
      ref={sectionRef}
      id="work-section"
      className="relative bg-transparent py-20 sm:py-28 border-b border-slate-200/60 overflow-hidden select-none"
    >
      {/* Editorial Margins Coordinates */}
      <div className="absolute top-8 left-8 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-8 right-8 pointer-events-none text-slate-300 font-mono text-xs select-none">
        +
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* 
          STATE 01: INITIAL INTRO
          Large oversized typography: SELECTED WORK
        */}
        <div
          style={{
            transform: introEntered
              ? 'translate3d(0, 0, 0) scale(1)'
              : 'translate3d(0, 24px, 0) scale(0.96)',
            opacity: introEntered ? 1 : 0,
            transition: 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease',
          }}
          className="text-center flex flex-col items-center gap-3 sm:gap-4 max-w-4xl mx-auto mb-8 sm:mb-10"
        >
          {/* Phase Badge & Continuous Showcase Live Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-[10px] font-mono tracking-[0.2em] text-slate-600 uppercase shadow-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isPaused || isHovered || isDragging ? 'bg-amber-400' : 'animate-pulse'
              }`}
              style={{
                backgroundColor:
                  isPaused || isHovered || isDragging
                    ? '#f59e0b'
                    : currentTheme.accentHex || '#E63B2E',
              }}
            />
            <span>
              {isPaused
                ? '3D CONVEYOR · PAUSED (SPACE)'
                : isHovered
                ? '3D CONVEYOR · HOVER PAUSED'
                : isDragging
                ? '3D CONVEYOR · SCRUBBING'
                : '3D MEDIA CONVEYOR · RIGHT → LEFT LIVE'}
            </span>
          </div>

          {/* Oversized Cinematic Typography (State 01) */}
          <h2 className="font-sans font-black text-5xl sm:text-7xl md:text-8xl tracking-tight text-slate-900 leading-[0.95] uppercase">
            SELECTED <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.accentHex || '#E63B2E'}, #0f172a)`,
              }}
            >
              WORK
            </span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl font-sans mt-1">
            An interactive 3D spatial timeline of commercial edits, viral retention sequences, and documentary grade storytelling.
          </p>

          {onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                playSound(900, 0.15);
              }}
              className="mt-1 px-4 py-2 rounded-xl font-mono text-[11px] font-bold tracking-wider text-slate-700 bg-white border border-slate-200 hover:border-slate-400 hover:text-slate-900 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Scissors className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
              PORTFOLIO ARCHIVE MANAGER
            </button>
          )}
        </div>

        {/* 
          PRIMARY MEDIA MODE SWITCHER: [ REELS (21) ]  [ VIDEOS (12) ]
          Strict Separation: These two modes NEVER mix!
        */}
        <div
          style={{
            opacity: introEntered ? 1 : 0,
            transform: introEntered ? 'translate3d(0, 0, 0)' : 'translate3d(0, 15px, 0)',
            transition: 'transform 850ms cubic-bezier(0.22, 1, 0.36, 1) 150ms, opacity 850ms ease 150ms',
          }}
          className="flex flex-col items-center gap-3 mb-10 sm:mb-12"
        >
          {/* Main Mode Toggle */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm backdrop-blur-md">
            <button
              onClick={() => handleModeChange('reels')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                mediaMode === 'reels'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              style={{
                backgroundColor: mediaMode === 'reels' ? currentTheme.accentHex || '#E63B2E' : 'transparent',
                boxShadow: mediaMode === 'reels' ? `0 6px 18px -2px ${currentTheme.glowColor}` : 'none',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>REELS</span>
              <span className="opacity-75 text-[11px] font-medium ml-0.5">({reelsDataset.length})</span>
            </button>

            <button
              onClick={() => handleModeChange('videos')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                mediaMode === 'videos'
                  ? 'text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
              style={{
                backgroundColor: mediaMode === 'videos' ? currentTheme.accentHex || '#E63B2E' : 'transparent',
                boxShadow: mediaMode === 'videos' ? `0 6px 18px -2px ${currentTheme.glowColor}` : 'none',
              }}
            >
              <Film className="w-4 h-4" />
              <span>VIDEOS</span>
              <span className="opacity-75 text-[11px] font-medium ml-0.5">({videosDataset.length})</span>
            </button>
          </div>

          {/* Secondary Sub-Category Filter (Strictly filtered within active mode) */}
          {availableNiches.length > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
              <button
                onClick={() => {
                  setSelectedNiche('all');
                  setActiveIndex(0);
                  playSound(600, 0.03);
                }}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                  selectedNiche === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white/60 text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                All {mediaMode === 'reels' ? 'Reels' : 'Videos'} ({activeModeProjects.length})
              </button>
              {availableNiches.map((niche) => {
                const isActive = selectedNiche === niche.id;
                return (
                  <button
                    key={niche.id}
                    onClick={() => {
                      setSelectedNiche(niche.id);
                      setActiveIndex(0);
                      playSound(600, 0.03);
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white/60 text-slate-500 border-slate-200 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {niche.name} ({niche.count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 
          STATE 02, 03, 04, 05: CINEMATIC 3D CURVED PROJECT GALLERY STAGE
        */}
        {filteredProjects.length > 0 ? (
          <div
            style={{
              opacity: isModeTransitioning ? 0 : introEntered ? 1 : 0,
              transform: isModeTransitioning
                ? 'translate3d(0, 16px, -60px) scale(0.93)'
                : introEntered
                ? 'translate3d(0, 0, 0) scale(1)'
                : 'translate3d(0, 30px, 0)',
              transition: isModeTransitioning
                ? 'opacity 300ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1)'
                : 'opacity 500ms ease, transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            className="w-full flex flex-col items-center overflow-visible"
          >
            <CurvedGalleryStage
              projects={filteredProjects}
              activeIndex={safeActiveIndex}
              setActiveIndex={setActiveIndex}
              mediaMode={mediaMode}
              currentTheme={currentTheme}
              isLiteMode={isLiteMode}
              isTouch={isTouch}
              isFocusingProject={isFocusing}
              scrollExitProgress={scrollExitProgress}
              onSelectProject={handleOpenProjectFocus}
              onHoverChange={setIsHovered}
              onDragChange={setIsDragging}
              isPaused={isPaused}
              onTogglePause={() => setIsPaused((prev) => !prev)}
            />

            {/* STATE 06: Active Project Information Reveal */}
            <ActiveProjectInfo
              project={activeProject}
              currentIndex={safeActiveIndex}
              totalProjects={filteredProjects.length}
              currentTheme={currentTheme}
              onOpenViewer={handleOpenProjectFocus}
              isLiteMode={isLiteMode}
            />

            {/* STATE 09 & 10: Gallery Navigation & Continuous Infinite Cycle Controls */}
            <GalleryNavigation
              onPrev={handlePrev}
              onNext={handleNext}
              currentIndex={safeActiveIndex}
              totalProjects={filteredProjects.length}
              currentTheme={currentTheme}
              onSelectIndex={(idx) => {
                setActiveIndex(idx);
                playSound(650, 0.04);
              }}
              isPaused={isPaused}
              onTogglePause={() => {
                setIsPaused((prev) => !prev);
                playSound(isPaused ? 800 : 500, 0.04);
              }}
              motionDirection={motionDirection}
              onToggleDirection={() => {
                setMotionDirection((d) => (d === 'ltr' ? 'rtl' : 'ltr'));
                playSound(700, 0.05);
              }}
            />
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-200 rounded-3xl bg-white/40 flex flex-col items-center justify-center">
            <Film className="w-8 h-8 text-slate-400 mb-2" />
            <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
              No projects found in this category
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
