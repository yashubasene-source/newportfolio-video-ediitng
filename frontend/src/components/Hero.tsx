/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import { Target, Sparkles, ArrowDown, FileText, Instagram, PenTool, Layers, Type, Wand2, Palette, MonitorPlay } from 'lucide-react';
import { Project, ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';
import FloatingCollage from './hero/FloatingCollage';

interface HeroProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  heroConfig?: any;
  projectsList: Project[];
  onSelectProject: (project: Project) => void;
  onOpenResume?: () => void;
}

export default function Hero({
  currentTheme,
  soundEnabled,
  heroConfig,
  projectsList,
  onSelectProject,
  onOpenResume,
}: HeroProps) {
  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';
  const isTouch = capabilities.isTouch || capabilities.isMobile;

  const creativeRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isLiteMode || isTouch) return;
    const currentTarget = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;

      if (creativeRef.current) {
        creativeRef.current.style.transform = `translate3d(${x * -16}px, ${y * -12}px, 0)`;
      }
      if (boxRef.current) {
        boxRef.current.style.transform = `perspective(1000px) rotateX(${y * -16}deg) rotateY(${x * 20}deg) translateZ(12px)`;
      }
    });
  };

  const handleHeroMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (creativeRef.current) {
      creativeRef.current.style.transform = 'translate3d(0, 0, 0)';
    }
    if (boxRef.current) {
      boxRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

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

  return (
    <section
      id="hero-section"
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-28 pb-12 overflow-hidden select-none bg-[#141414] text-white"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: accentColor }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none opacity-40" />

      {/* Editorial Corner Crosshairs */}
      <div className="absolute top-8 left-8 pointer-events-none text-white/20 font-mono text-sm">+</div>
      <div className="absolute top-8 right-8 pointer-events-none text-white/20 font-mono text-sm">+</div>
      <div className="absolute bottom-8 left-8 pointer-events-none text-white/20 font-mono text-sm">+</div>
      <div className="absolute bottom-8 right-8 pointer-events-none text-white/20 font-mono text-sm">+</div>

      {/* Top Header Label Strip */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accentColor }} />
          <span className="font-mono text-xs font-semibold tracking-widest text-slate-400 uppercase">
            {heroConfig?.statusText || "ANSHAY BASENE • CINEMATIC VIDEO EDITOR"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg=="
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSound(600)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Instagram className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>@anshay.edit</span>
          </a>
        </div>
      </div>

      {/* Center Cinematic Composition matching Reference Video */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto text-center">
        
        {/* Floating Process Badges (from Video) */}
        <div className="relative w-full flex flex-col items-center">
          
          {/* Badge 1: Sketch the Vision (Top Left) */}
          <div className="hidden lg:flex absolute -top-12 left-6 items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#1A1D24]/80 backdrop-blur-md text-xs text-slate-300 animate-orbital-1 shadow-lg pointer-events-none">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10" style={{ color: accentColor }}>
              <PenTool className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium tracking-tight">Sketch the Vision</span>
          </div>

          {/* Badge 2: Define the Text (Top Right) */}
          <div className="hidden lg:flex absolute -top-10 right-8 items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#1A1D24]/80 backdrop-blur-md text-xs text-slate-300 animate-orbital-2 shadow-lg pointer-events-none">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10" style={{ color: accentColor }}>
              <Type className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium tracking-tight">Define the Text</span>
          </div>

          {/* Badge 3: Shape the Layout (Bottom Left) */}
          <div className="hidden lg:flex absolute bottom-8 left-12 items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#1A1D24]/80 backdrop-blur-md text-xs text-slate-300 animate-orbital-3 shadow-lg pointer-events-none">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10" style={{ color: accentColor }}>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium tracking-tight">Shape the Layout</span>
          </div>

          {/* Badge 4: Add Creative Details (Bottom Right) */}
          <div className="hidden lg:flex absolute bottom-6 right-10 items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-[#1A1D24]/80 backdrop-blur-md text-xs text-slate-300 animate-orbital-1 shadow-lg pointer-events-none">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10" style={{ color: accentColor }}>
              <Wand2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium tracking-tight">Add Creative Details</span>
          </div>

          {/* Floating & Shimmering "Creative." Script Headline */}
          <div
            ref={creativeRef}
            className="transition-transform duration-200 ease-out animate-float-breathe will-change-transform"
          >
            <h2 className="font-editorial-script italic text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] tracking-tight mb-2 select-none animate-text-shimmer drop-shadow-[0_0_35px_rgba(43,238,52,0.25)]">
              Creative.
            </h2>
          </div>

          {/* Dynamic 3D Perspective PORTFOLIO Box with Corner Reticles and Scanning Laser */}
          <div
            ref={boxRef}
            className="relative inline-block px-8 sm:px-16 py-4 sm:py-6 border-2 rounded-sm mb-6 shadow-2xl bg-[#141414]/70 backdrop-blur-md animate-box-pulse transition-transform duration-150 ease-out will-change-transform"
          >
            {/* Animated Corner Crosshairs */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#2BEE34] animate-corner-pulse" />
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#2BEE34] animate-corner-pulse" />
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#2BEE34] animate-corner-pulse" />
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#2BEE34] animate-corner-pulse" />

            {/* Internal Futuristic Ambient Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-sm">
              <div className="w-full h-full bg-gradient-to-b from-transparent via-[#2BEE34]/15 to-transparent animate-motion-track-scan opacity-60" />
            </div>

            {/* Bold PORTFOLIO typography with green neon underglow */}
            <h1 className="relative z-10 font-impact uppercase tracking-wider text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white select-none leading-none drop-shadow-[0_0_24px_rgba(43,238,52,0.45)]">
              PORTFOLIO
            </h1>
          </div>

          {/* Subtitle & Niche Focus */}
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base md:text-lg font-light leading-relaxed mb-8">
            Transforming raw footage into high-retention stories across 4 core disciplines:
            <span className="font-semibold text-white"> Real Estate</span>,
            <span className="font-semibold text-white"> UGC Ads</span>,
            <span className="font-semibold text-white"> Promotional Campaigns</span> &
            <span className="font-semibold text-white"> Educational Content</span>.
          </p>

          {/* Action Button Row with Dedicated Resume Switch */}
          <div className="flex flex-wrap items-center justify-center gap-4 z-20">
            {/* Primary Explore CTA */}
            <a
              href="#work-section"
              onClick={() => playSound(750)}
              className="px-7 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 24px ${currentTheme.glowColor || 'rgba(43,238,52,0.35)'}`,
              }}
            >
              <MonitorPlay className="w-4 h-4" />
              <span>Explore Selected Work</span>
            </a>

            {/* Dedicated Resume Switch */}
            {onOpenResume && (
              <button
                onClick={() => {
                  onOpenResume();
                  playSound(850);
                }}
                className="px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" style={{ color: accentColor }} />
                <span>View Resume</span>
              </button>
            )}

            {/* Instagram Profile Link */}
            <a
              href="https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSound(650)}
              className="px-5 py-3 rounded-xl font-mono text-xs font-semibold text-slate-300 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Watch Reels on IG</span>
            </a>
          </div>

        </div>

        {/* Floating Project Cards on Desktop */}
        <div className="w-full mt-10">
          <FloatingCollage
            projects={projectsList}
            currentTheme={currentTheme}
            isLiteMode={isLiteMode}
            isTouch={isTouch}
            onSelectProject={onSelectProject}
          />
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-mono text-slate-500 z-20">
        <div className="flex items-center gap-2">
          <span>BHOPAL, INDIA</span>
          <span>•</span>
          <span>UTC+5:30</span>
        </div>
        <a
          href="#stories-section"
          onClick={() => playSound(500)}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" style={{ color: accentColor }} />
        </a>
      </div>
    </section>
  );
}