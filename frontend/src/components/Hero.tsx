/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, FileDown, ArrowDown, Sparkles } from 'lucide-react';
import { ThemeColors } from '../types';
import TactileCardStack from './TactileCardStack';
import { usePerformance } from '../motion/performanceManager';

interface HeroProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  heroConfig?: any;
}

export default function Hero({ currentTheme, soundEnabled, heroConfig }: HeroProps) {
  const { capabilities, settings } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

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

  const statusText = heroConfig?.statusText || "Available for Freelance Projects";
  const titleNormal = heroConfig?.titleNormal || "Cinematic";
  const titleGradient = heroConfig?.titleGradient || "Storytelling";
  const titleSuffix = heroConfig?.titleSuffix || "& Bold Visuals.";
  const description = heroConfig?.description || "I craft cinematic stories and bold graphic designs—from high-impact political documentaries to modern brand identities. Based in Bhopal, working globally.";
  const slotsText = heroConfig?.slotsText || "Only 2 client slots open this month";
  const cvLink = heroConfig?.cvLink || "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800";
  const metric1Val = heroConfig?.metric1Val || "50+";
  const metric1Lbl = heroConfig?.metric1Lbl || "Delivered";
  const metric2Val = heroConfig?.metric2Val || "3x";
  const metric2Lbl = heroConfig?.metric2Lbl || "Avg. CTR Boost";
  const metric3Val = heroConfig?.metric3Val || "24h";
  const metric3Lbl = heroConfig?.metric3Lbl || "Speed Edit";

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center pt-28 pb-16 bg-transparent overflow-hidden">
      {/* Background Neon Glowing Gradients (Only on Balanced/Full) */}
      {!isLiteMode && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full opacity-10 blur-[110px]"
            style={{ backgroundColor: currentTheme.accentHex }}
          />
          <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[130px]" />
          
          {/* Abstract Film Lines */}
          <div className="absolute inset-x-0 top-0 bottom-0 bg-[linear-gradient(rgba(15,23,42,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Bio & Title */}
        <div className="lg:col-span-6 flex flex-col items-start gap-6 text-left">
          
          {/* Active status pill */}
          <motion.div
            initial={isLiteMode ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: settings.duration }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-pill"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-700 uppercase">
              {statusText}
            </span>
          </motion.div>

          <h1 className="font-sans font-black text-5xl md:text-7xl leading-[1.05] tracking-tight text-slate-900">
            {titleNormal} <br className="hidden md:inline" />
            <span
              className="text-transparent bg-clip-text transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.accentHex}, #0f172a)`,
              }}
            >
              {titleGradient}
            </span>{' '}
            <br />
            {titleSuffix}
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
            {description}
          </p>

          {/* Quick Urgency / Quality Pledge Badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 border border-slate-200 bg-white/50 px-3 py-2 rounded-lg">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{slotsText}</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <a
              id="hero-view-work-btn"
              href="#work-section"
              onClick={() => playSound(600)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold tracking-wider text-white transition-all group font-mono hover:brightness-110"
              style={{
                backgroundColor: currentTheme.accentHex,
                boxShadow: `0 6px 20px ${currentTheme.glowColor}`,
              }}
            >
              <Play className="w-4 h-4 fill-white stroke-0 group-hover:scale-125 transition-transform" />
              VIEW WORK
            </a>

            <a
              id="hero-cv-btn"
              href={cvLink}
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound(500)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 hover:bg-white/40 transition-all font-mono"
            >
              <FileDown className="w-4 h-4" />
              DOWNLOAD CV
            </a>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 mt-8 pt-8 border-t border-slate-200 w-full">
            <div>
              <p className="font-sans font-black text-3xl md:text-4xl text-slate-900">{metric1Val}</p>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-1">{metric1Lbl}</p>
            </div>
            <div>
              <p className="font-sans font-black text-3xl md:text-4xl text-slate-900">{metric2Val}</p>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-1">{metric2Lbl}</p>
            </div>
            <div>
              <p className="font-sans font-black text-3xl md:text-4xl text-slate-900">{metric3Val}</p>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mt-1">{metric3Lbl}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Interactive Tactile Card Stack matching user's image */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <TactileCardStack accentHex={currentTheme.accentHex} soundEnabled={soundEnabled} />
        </div>
      </div>

      {/* Floating Animated Mouse Wheel Indicator */}
      <div className="absolute bottom-6 inset-x-0 flex justify-center pointer-events-none opacity-40">
        <motion.div
          animate={isLiteMode ? {} : { y: [0, 8, 0] }}
          transition={isLiteMode ? {} : { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-9 rounded-full border-2 border-slate-400 flex justify-center p-1.5">
            <span className="w-1 h-2 rounded-full bg-slate-500 animate-bounce" />
          </div>
          <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
        </motion.div>
      </div>
    </section>
  );
}
