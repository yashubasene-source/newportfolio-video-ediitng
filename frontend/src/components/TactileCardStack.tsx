/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { usePerformance } from '../motion/performanceManager';

interface TactileCardStackProps {
  accentHex: string;
  soundEnabled: boolean;
}

export default function TactileCardStack({ accentHex, soundEnabled }: TactileCardStackProps) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number>(0); // top card is 0, allow clicking to inspect others!

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

  const handleCardClick = (index: number) => {
    setActiveCard(index);
    playSound(400 + index * 100, 0.1);
  };

  return (
    <div className="relative w-full max-w-[580px] h-[480px] md:h-[540px] flex items-center justify-center select-none py-10">
      
      {/* 1. Yellow Backdrop Block (Solid bright element) */}
      <motion.div
        animate={isLiteMode ? { rotate: -4, scale: 1 } : {
          rotate: hoveredCard !== null ? -6 : -4,
          scale: hoveredCard !== null ? 1.02 : 1,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 120, damping: 15 }}
        className="absolute left-[-2%] top-[12%] w-[68%] h-[74%] bg-[#FACC15] rounded-lg shadow-sm origin-bottom-right z-0"
      />

      {/* 2. Curled Sheet/Curved Base Card at the back */}
      <motion.div
        animate={isLiteMode ? { rotate: 1, y: 0 } : {
          rotate: hoveredCard === 4 ? 2 : 1,
          y: hoveredCard === 4 ? -8 : 0,
        }}
        transition={isLiteMode ? { duration: 0.1 } : undefined}
        className="absolute bottom-[4%] right-[4%] w-[82%] h-[78%] bg-white border border-slate-200 rounded-2xl shadow-xl z-10 overflow-hidden flex flex-col justify-end p-6 origin-bottom"
        style={{
          borderRadius: '24px 24px 220px 24px', // Creates the curled fold visual look!
        }}
      >
        {/* Curled fold shadow overlay at the bottom right corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-slate-100 via-slate-50/50 to-transparent pointer-events-none rounded-tl-3xl border-l border-t border-slate-200/50" />
        <div className="text-left max-w-[70%] relative z-10 mb-2">
          <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">04 / CREATIVE BAY</p>
          <h4 className="font-sans font-black text-xl text-slate-800 tracking-tight leading-none mt-1">Post-Production & CGI</h4>
        </div>
      </motion.div>

      {/* 3. Left Staggered Card "Mov" */}
      <motion.div
        onClick={() => handleCardClick(3)}
        onHoverStart={isLiteMode ? undefined : () => setHoveredCard(3)}
        onHoverEnd={isLiteMode ? undefined : () => setHoveredCard(null)}
        animate={isLiteMode ? {
          rotate: -7,
          x: -25,
          y: 0,
          scale: 1,
          zIndex: activeCard === 3 ? 35 : 15,
        } : {
          rotate: hoveredCard === 3 ? -10 : -7,
          x: hoveredCard === 3 ? -35 : -25,
          y: hoveredCard === 3 ? -10 : 0,
          scale: activeCard === 3 ? 1.05 : 1,
          zIndex: activeCard === 3 ? 35 : 15,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 12 }}
        className="absolute left-[2%] top-[20%] w-[58%] h-[68%] bg-white border-2 border-slate-900 rounded-2xl shadow-lg p-6 flex flex-col justify-between text-left cursor-pointer origin-center"
      >
        <div className="flex justify-between items-start">
          <span className="text-[9px] font-mono tracking-wider text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">VFX_BAY</span>
          <span className="text-[9px] font-mono text-slate-400">EST. 2026</span>
        </div>
        <div className="my-auto">
          <h3 className="font-sans font-black text-6xl md:text-7xl leading-none text-slate-900 tracking-tighter">Mov.</h3>
          <p className="text-xs text-slate-500 font-mono mt-2">Cinematography Suite</p>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <span className="text-[9px] font-mono text-slate-400">TIMELINE CHANNELS</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </motion.div>

      {/* 4. Fluid Gradient Card */}
      <motion.div
        onClick={() => handleCardClick(2)}
        onHoverStart={isLiteMode ? undefined : () => setHoveredCard(2)}
        onHoverEnd={isLiteMode ? undefined : () => setHoveredCard(null)}
        animate={isLiteMode ? {
          rotate: 4,
          x: 15,
          y: -5,
          scale: 1,
          zIndex: activeCard === 2 ? 35 : 20,
        } : {
          rotate: hoveredCard === 2 ? 6 : 4,
          x: hoveredCard === 2 ? 25 : 15,
          y: hoveredCard === 2 ? -15 : -5,
          scale: activeCard === 2 ? 1.05 : 1,
          zIndex: activeCard === 2 ? 35 : 20,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 12 }}
        className="absolute right-[4%] top-[12%] w-[60%] h-[64%] rounded-2xl shadow-xl overflow-hidden cursor-pointer origin-center border border-slate-200/50"
      >
        {/* Organic mesh gradient representation (Disable pulse on Lite Mode) */}
        <div className={`absolute inset-0 bg-gradient-to-br from-emerald-400 via-yellow-300 to-cyan-400 ${isLiteMode ? '' : 'animate-pulse duration-[8s]'}`} />
        
        {/* Overlay glass label */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 text-left bg-black/5 backdrop-blur-[2px]">
          <div className="flex justify-between items-center text-white/90">
            <span className="text-[9px] font-mono tracking-widest uppercase">GRADIENT_LAB</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-white/70">COLOR SPACE</p>
            <h4 className="text-lg font-sans font-bold text-white leading-tight">Fluid Aesthetics</h4>
          </div>
        </div>
      </motion.div>

      {/* 5. Showcase Work Thumbnail Card (Beverage Bottles mockup look) */}
      <motion.div
        onClick={() => handleCardClick(1)}
        onHoverStart={isLiteMode ? undefined : () => setHoveredCard(1)}
        onHoverEnd={isLiteMode ? undefined : () => setHoveredCard(null)}
        animate={isLiteMode ? {
          rotate: -2,
          y: 35,
          x: -8,
          scale: 1,
          zIndex: activeCard === 1 ? 35 : 22,
        } : {
          rotate: hoveredCard === 1 ? -4 : -2,
          y: hoveredCard === 1 ? 25 : 35,
          x: hoveredCard === 1 ? -12 : -8,
          scale: activeCard === 1 ? 1.05 : 1,
          zIndex: activeCard === 1 ? 35 : 22,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 12 }}
        className="absolute left-[12%] bottom-[6%] w-[68%] h-[56%] bg-teal-50 border border-slate-200 rounded-2xl shadow-xl overflow-hidden cursor-pointer p-4 flex flex-col justify-between"
      >
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-mono text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full font-bold">COMMERCIAL</span>
          <span className="text-[8px] font-mono text-slate-400">PACKAGING EDIT</span>
        </div>
        
        {/* Mock representation of the bottles/beverages in the image */}
        <div className="grid grid-cols-4 gap-2 my-auto items-end justify-center px-2">
          <div className="h-20 bg-emerald-400 rounded-md border border-slate-900/10 flex items-center justify-center p-1 relative shadow-sm">
            <span className="text-[6px] font-mono text-white leading-none rotate-90 whitespace-nowrap">PROTEIN</span>
          </div>
          <div className="h-24 bg-rose-400 rounded-md border border-slate-900/10 flex items-center justify-center p-1 relative shadow-sm">
            <span className="text-[6px] font-mono text-white leading-none rotate-90 whitespace-nowrap">ORGANIC</span>
          </div>
          <div className="h-20 bg-amber-400 rounded-md border border-slate-900/10 flex items-center justify-center p-1 relative shadow-sm">
            <span className="text-[6px] font-mono text-white leading-none rotate-90 whitespace-nowrap">MATCHA</span>
          </div>
          <div className="h-16 bg-sky-400 rounded-md border border-slate-900/10 flex items-center justify-center p-1 relative shadow-sm">
            <span className="text-[6px] font-mono text-white leading-none rotate-90 whitespace-nowrap">BERRY</span>
          </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-100">
          <span>Client: AMONATURAL</span>
          <span>100% CG</span>
        </div>
      </motion.div>

      {/* 6. Top Main Card (The centerpiece) */}
      <motion.div
        onClick={() => handleCardClick(0)}
        onHoverStart={isLiteMode ? undefined : () => setHoveredCard(0)}
        onHoverEnd={isLiteMode ? undefined : () => setHoveredCard(null)}
        animate={isLiteMode ? {
          rotate: -2,
          y: -5,
          scale: 1,
          zIndex: activeCard === 0 ? 30 : 25,
        } : {
          rotate: hoveredCard === 0 ? -1 : -2,
          y: hoveredCard === 0 ? -15 : -5,
          scale: activeCard === 0 ? 1.02 : 1,
          zIndex: activeCard === 0 ? 30 : 25,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 120, damping: 14 }}
        className="absolute top-[8%] w-[90%] h-[72%] bg-slate-50 border-2 border-slate-900 rounded-2xl shadow-2xl p-4 md:p-6 flex flex-col justify-between text-left cursor-pointer origin-center"
      >
        {/* Card Header matching the image layout */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="text-[10px] font-mono font-black tracking-widest text-slate-800">DIPSY</div>
          
          {/* Card Navigation Pills */}
          <div className="hidden sm:flex items-center gap-1.5">
            {['ABOUT', 'PROJECTS', 'VIBE'].map((item) => (
              <span
                key={item}
                className="px-2 py-0.5 rounded-full text-[8px] font-mono tracking-wider border border-slate-300 text-slate-500 hover:text-slate-900 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="text-[9px] font-mono text-slate-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentHex }} />
            START
          </div>
        </div>

        {/* Card Middle Heading matching image bold typography */}
        <div className="my-auto py-2">
          <h2 className="font-sans font-black text-2xl md:text-4xl text-slate-900 tracking-tight leading-[1.1] text-center max-w-[95%] mx-auto">
            We craft <span className="underline decoration-wavy" style={{ decorationColor: accentHex }}>cinematic</span> video edits & bold digital designs.
          </h2>
        </div>

        {/* Card Bottom: Rounded rect picture overlay of team/people like the image */}
        <div className="flex justify-center items-center mt-2">
          <div className="relative w-44 h-24 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-md group">
            <img
              src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-95"
              alt="Anshay Basene Studio"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-2 justify-center">
              <span className="text-[9px] font-mono tracking-widest text-white uppercase flex items-center gap-1">
                <Sparkles className={`w-3 h-3 text-yellow-300 ${isLiteMode ? '' : 'animate-spin'}`} />
                ACTIVE_STATION
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7. Beautiful Realistic SVG Orange Binder Clip holding it all together */}
      <motion.div
        animate={isLiteMode ? { y: -5, scale: 1 } : {
          y: hoveredCard !== null ? -12 : -5,
          scale: hoveredCard !== null ? 1.05 : 1,
        }}
        transition={isLiteMode ? { duration: 0.1 } : { type: 'spring', stiffness: 150, damping: 10 }}
        className="absolute top-[2%] left-1/2 -translate-x-1/2 z-40 pointer-events-none drop-shadow-md"
      >
        {/* Orange Binder Clip Illustration using precise custom SVGs */}
        <svg width="74" height="64" viewBox="0 0 74 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Metal Wire loop at the top */}
          <path
            d="M 37 40 C 37 8, 25 10, 27 22 C 28 30, 24 35, 20 40"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 37 40 C 37 8, 49 10, 47 22 C 46 30, 50 35, 54 40"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Clip Main triangular body (orange/peach color like the image) */}
          <path
            d="M 18 42 L 56 42 L 48 62 L 26 62 Z"
            fill="#F97316"
            stroke="#0F172A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          
          {/* Accent grip lines on the clip body */}
          <line x1="28" y1="48" x2="46" y2="48" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="31" y1="54" x2="43" y2="54" stroke="#7C2D12" strokeWidth="2.5" strokeLinecap="round" />

          {/* Core pivots */}
          <circle cx="23" cy="43" r="3" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="51" cy="43" r="3" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      </motion.div>

    </div>
  );
}
