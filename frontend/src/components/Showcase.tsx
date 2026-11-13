/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Scissors, Film, Sparkles, Play, Pause, ExternalLink, ArrowRight, Video } from 'lucide-react';
import { Project, ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

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

  // Mode: Reels (9:16 vertical) vs Videos (16:9 landscape)
  const [mediaMode, setMediaMode] = useState<'reels' | 'videos'>('reels');
  const [selectedNiche, setSelectedNiche] = useState<string>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);

  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  const accentColor = currentTheme.accentHex || '#2BEE34';

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

  // Filter datasets
  const reelsDataset = useMemo(() => {
    return projectsList.filter((p) => p.mediaType === 'reel' || p.aspectRatio === '9:16' || p.link?.includes('/shorts/'));
  }, [projectsList]);

  const videosDataset = useMemo(() => {
    return projectsList.filter((p) => p.mediaType === 'video' || (p.mediaType !== 'reel' && p.aspectRatio !== '9:16'));
  }, [projectsList]);

  const activeModeProjects = mediaMode === 'reels' ? reelsDataset : videosDataset;

  const filteredProjects = useMemo(() => {
    if (selectedNiche === 'all') return activeModeProjects;
    return activeModeProjects.filter((p) => p.niche === selectedNiche);
  }, [activeModeProjects, selectedNiche]);

  // Ensure enough items to create seamless infinite marquee loop (minimum 8 cards per row)
  const prepareRowData = (items: Project[], offset: number) => {
    if (items.length === 0) return [];
    let pool = [...items];
    while (pool.length < 8) {
      pool = pool.concat(items);
    }
    // Alternate or slice for variety between Row 1 and Row 2
    const shifted = pool.slice(offset).concat(pool.slice(0, offset));
    return shifted.concat(shifted); // duplicate for continuous loop
  };

  const row1Projects = useMemo(() => prepareRowData(filteredProjects, 0), [filteredProjects]);
  const row2Projects = useMemo(() => prepareRowData(filteredProjects, Math.floor(filteredProjects.length / 2)), [filteredProjects]);

  const getNicheLabel = (nicheStr: string) => {
    switch (nicheStr) {
      case 'real-estate': return 'Real Estate';
      case 'ugc': return 'UGC Ad';
      case 'promotional': return 'Promotional';
      case 'educational': return 'Educational';
      default: return nicheStr.replace('-', ' ');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="work-section"
      className="relative bg-[#141414] py-24 sm:py-32 border-b border-white/5 overflow-hidden select-none text-white"
    >
      {/* Background radial atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-30" />

      {/* Section Header with Impactful Fjalla One + Script Typography */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-12 sm:mb-16">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#1A1D24]/80 backdrop-blur-md text-[10px] font-mono tracking-[0.2em] text-slate-300 uppercase shadow-md mb-4">
          <span
            className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'animate-ping'}`}
            style={{ backgroundColor: isPaused ? '#f59e0b' : accentColor }}
          />
          <span>{isPaused ? 'MARQUEE PAUSED' : 'DUAL-ROW CINEMATIC MARQUEE • LIVE'}</span>
        </div>

        {/* Headline using Fjalla One and Instrument Serif */}
        <h2 className="font-impact text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-wider text-white leading-none">
          SELECTED <br className="sm:hidden" />
          <span className="font-editorial-script text-4xl sm:text-6xl md:text-7xl lg:text-8xl lowercase text-slate-400 font-normal px-2">
            motion.
          </span>
          <span style={{ color: accentColor }}>WORKS</span>
          <span className="font-impact text-slate-500 text-3xl sm:text-5xl ml-3 tracking-widest font-normal">
            2026
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-slate-400 text-xs sm:text-sm md:text-base font-light leading-relaxed mt-4">
          Dual-stream continuous showcase. Row 1 sweeps left-to-right, Row 2 glides right-to-left. Hover any reel to inspect, click for full screen playback.
        </p>

        {/* Media Mode & Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          
          {/* Format Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1A1D24] border border-white/10 shadow-lg">
            <button
              onClick={() => {
                setMediaMode('reels');
                setSelectedNiche('all');
                playSound(600);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                mediaMode === 'reels' ? 'text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={{ backgroundColor: mediaMode === 'reels' ? accentColor : 'transparent' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>9:16 Reels</span>
              <span className="opacity-75 text-[10px]">({reelsDataset.length})</span>
            </button>

            <button
              onClick={() => {
                setMediaMode('videos');
                setSelectedNiche('all');
                playSound(600);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                mediaMode === 'videos' ? 'text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
              style={{ backgroundColor: mediaMode === 'videos' ? accentColor : 'transparent' }}
            >
              <Film className="w-3.5 h-3.5" />
              <span>16:9 Landscape</span>
              <span className="opacity-75 text-[10px]">({videosDataset.length})</span>
            </button>
          </div>

          {/* Pause / Play Speed Toggle */}
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              playSound(700);
            }}
            className="px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#1A1D24] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
            title={isPaused ? 'Resume Scrolling' : 'Pause Scrolling'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Studio Manager Link */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                playSound(850);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#1A1D24] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Scissors className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>Studio Manager</span>
            </button>
          )}
        </div>

        {/* Niche Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-5">
          {[
            { id: 'all', label: 'All Disciplines' },
            { id: 'real-estate', label: 'Real Estate' },
            { id: 'ugc', label: 'UGC' },
            { id: 'promotional', label: 'Promotional' },
            { id: 'educational', label: 'Educational' },
          ].map((cat) => {
            const isActive = selectedNiche === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedNiche(cat.id);
                  playSound(500);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-white text-black font-bold border-white shadow-md'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* DUAL-ROW CONVEYOR TRACKS */}
      <div className="relative w-full space-y-6 overflow-hidden py-4">
        
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-[#141414] via-[#141414]/90 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-[#141414] via-[#141414]/90 to-transparent z-20 pointer-events-none" />

        {/* ROW 1: Gliding Left to Right */}
        <div className="w-full overflow-hidden flex">
          <div
            className="animate-marquee-right flex gap-5 shrink-0"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
          >
            {row1Projects.map((p, idx) => (
              <ReelCard
                key={`r1-${p.id}-${idx}`}
                project={p}
                accentColor={accentColor}
                onSelect={() => {
                  playSound(800);
                  onSelectProject(p);
                }}
                nicheLabel={getNicheLabel(p.niche)}
                mediaMode={mediaMode}
                isHovered={hoveredProjectId === `r1-${p.id}-${idx}`}
                onHoverChange={(h) => setHoveredProjectId(h ? `r1-${p.id}-${idx}` : null)}
              />
            ))}
          </div>
        </div>

        {/* ROW 2: Gliding Right to Left */}
        <div className="w-full overflow-hidden flex">
          <div
            className="animate-marquee-left flex gap-5 shrink-0"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
          >
            {row2Projects.map((p, idx) => (
              <ReelCard
                key={`r2-${p.id}-${idx}`}
                project={p}
                accentColor={accentColor}
                onSelect={() => {
                  playSound(800);
                  onSelectProject(p);
                }}
                nicheLabel={getNicheLabel(p.niche)}
                mediaMode={mediaMode}
                isHovered={hoveredProjectId === `r2-${p.id}-${idx}`}
                onHoverChange={(h) => setHoveredProjectId(h ? `r2-${p.id}-${idx}` : null)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Bottom CTA hint */}
      <div className="text-center mt-8">
        <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">
          CLICK ANY REEL TO EXPAND COMPLETE PROJECT BREAKDOWN
        </p>
      </div>

    </section>
  );
}

// Subcomponent: Individual Reel Card
interface ReelCardProps {
  key?: string;
  project: Project;
  accentColor: string;
  onSelect: () => void;
  nicheLabel: string;
  mediaMode: 'reels' | 'videos';
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}

function ReelCard({
  project,
  accentColor,
  onSelect,
  nicheLabel,
  mediaMode,
  isHovered,
  onHoverChange,
}: ReelCardProps) {
  const isVertical = mediaMode === 'reels';

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border bg-[#1A1D24] shadow-xl hover:shadow-2xl hover:-translate-y-2 shrink-0 ${
        isVertical
          ? 'w-[210px] sm:w-[250px] md:w-[270px] aspect-[9/16]'
          : 'w-[280px] sm:w-[340px] md:w-[380px] aspect-video'
      }`}
      style={{
        borderColor: isHovered ? accentColor : 'rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered ? `0 12px 30px -4px ${accentColor}30` : undefined,
      }}
    >
      {/* Thumbnail Image */}
      <img
        src={project.thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800'}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
      />

      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/60 opacity-80 group-hover:opacity-60 transition-opacity" />

      {/* Top Bar: Niche & Duration Badges */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
        <span
          className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-black shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          {nicheLabel}
        </span>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
          {project.duration || '0:45'}
        </span>
      </div>

      {/* Center Play Button on Hover */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-0'
          }`}
          style={{ backgroundColor: accentColor }}
        >
          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
        </div>
      </div>

      {/* Bottom Info Glass Strip */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-10 space-y-1">
        {project.client && (
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
            {project.client}
          </span>
        )}
        <h3 className="font-sans font-bold text-sm sm:text-base text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-[11px] text-slate-300 line-clamp-1 font-light opacity-90">
          {project.description}
        </p>
      </div>
    </div>
  );
}