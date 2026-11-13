/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { ThemeColors } from '../types';

interface CinematicScrollExperienceProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  currentTheme: ThemeColors;
}

export default function CinematicScrollExperience({
  soundEnabled,
  setSoundEnabled,
  currentTheme,
}: CinematicScrollExperienceProps) {
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cursorBadgeRef = useRef<HTMLSpanElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const whooshCooldown = useRef(0);
  const lastSectionIndex = useRef(-1);
  const sectionOffsets = useRef<{ id: string; top: number; bottom: number }[]>([]);

  const accentColor = currentTheme.accentHex || '#2BEE34';

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Sound Synth 1: Smooth Cinematic Whoosh on fast scroll
  const playScrollWhoosh = (intensity: number) => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - whooshCooldown.current < 320) return;
    whooshCooldown.current = now;

    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const bufferSize = ctx.sampleRate * 0.16;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.07);
      filter.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.16);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);

      const gain = ctx.createGain();
      const vol = Math.min(0.035, 0.01 + intensity * 0.004);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(ctx.currentTime + 0.16);
    } catch (e) {}
  };

  // Sound Synth 2: Warm Harmonic Drone Chime on Section Entry
  const playSectionChime = (sectionIdx: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const baseFrequencies = [110, 130.81, 146.83, 164.81, 196, 220];
      const rootFreq = baseFrequencies[sectionIdx % baseFrequencies.length];

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(rootFreq, ctx.currentTime);
      osc2.frequency.setValueAtTime(rootFreq * 2.002, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.4);
      osc2.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Cache section offsets once and on window resize (Prevents Forced Synchronous Layout during scroll)
  const updateSectionOffsets = () => {
    const sectionIds = ['hero-section', 'stories-section', 'work-section', 'transformations-section', 'pricing-section', 'about-section', 'contact-section'];
    const offsets: { id: string; top: number; bottom: number }[] = [];
    const scrollY = window.scrollY;

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + scrollY;
        offsets.push({ id, top, bottom: top + rect.height });
      }
    });
    sectionOffsets.current = offsets;
  };

  useEffect(() => {
    updateSectionOffsets();
    window.addEventListener('resize', updateSectionOffsets, { passive: true });
    return () => window.removeEventListener('resize', updateSectionOffsets);
  }, []);

  // High-performance scroll handler via direct DOM & requestAnimationFrame (ZERO React state lag)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const now = Date.now();
          const currentScrollY = window.scrollY;
          const deltaTime = Math.max(1, now - lastScrollTime.current);
          const deltaY = Math.abs(currentScrollY - lastScrollY.current);
          const velocity = deltaY / deltaTime;

          // Sound trigger on rapid scroll
          if (velocity > 1.6) {
            playScrollWhoosh(velocity);
          }

          // Section entry sound check using cached positions (zero layout thrashing)
          const scrollMiddle = currentScrollY + window.innerHeight * 0.45;
          const offsets = sectionOffsets.current;
          for (let i = 0; i < offsets.length; i++) {
            if (scrollMiddle >= offsets[i].top && scrollMiddle <= offsets[i].bottom) {
              if (lastSectionIndex.current !== i) {
                lastSectionIndex.current = i;
                playSectionChime(i);
              }
              break;
            }
          }

          // Update Top Progress Bar directly via DOM (no React state re-render)
          if (progressBarRef.current) {
            const totalDoc = document.documentElement.scrollHeight - window.innerHeight;
            if (totalDoc > 0) {
              const progress = Math.min(100, Math.max(0, (currentScrollY / totalDoc) * 100));
              progressBarRef.current.style.width = `${progress}%`;
            }
          }

          lastScrollY.current = currentScrollY;
          lastScrollTime.current = now;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [soundEnabled]);

  // Ultra-light mouse follower cursor via direct DOM style (ZERO React state re-renders)
  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateCursor = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* 1. TOP SCROLL LIGHTNING PROGRESS BAR (Hardware-Accelerated) */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-white/5">
        <div
          ref={progressBarRef}
          className="h-full shadow-[0_0_12px_#2BEE34] will-change-transform"
          style={{
            width: '0%',
            backgroundColor: accentColor,
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* 2. CUSTOM AURA GLOW CURSOR (Desktop only, 120 FPS Direct Hardware Acceleration) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block will-change-transform"
        style={{
          transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
          style={{
            backgroundColor: `${accentColor}12`,
            border: `1.5px solid ${accentColor}`,
            boxShadow: `0 0 16px ${accentColor}35`,
          }}
        >
          <span
            ref={cursorBadgeRef}
            className="font-mono text-[7px] font-black tracking-widest text-black uppercase"
          />
        </div>
      </div>

      {/* 3. FLOATING CINEMATIC SOUNDSCAPE PILL */}
      <div className="fixed bottom-6 right-20 sm:right-24 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (next) {
              getAudioContext();
              playSectionChime(2);
            }
          }}
          className="group px-3.5 py-2 rounded-full border border-white/10 bg-[#161820]/90 backdrop-blur-md text-white font-mono text-xs flex items-center gap-2 shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            borderColor: soundEnabled ? `${accentColor}60` : 'rgba(255,255,255,0.1)',
            boxShadow: soundEnabled ? `0 4px 16px ${accentColor}25` : undefined,
          }}
          title="Toggle Cinematic Audio Experience"
        >
          {soundEnabled ? (
            <>
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-full rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ backgroundColor: accentColor }} />
                <span className="w-0.5 h-2 rounded-full animate-[bounce_0.8s_ease-in-out_0.2s_infinite]" style={{ backgroundColor: accentColor }} />
                <span className="w-0.5 h-3 rounded-full animate-[bounce_0.5s_ease-in-out_0.1s_infinite]" style={{ backgroundColor: accentColor }} />
              </div>
              <span className="text-[10px] font-bold tracking-wider" style={{ color: accentColor }}>
                AUDIO LIVE
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              <span className="text-[10px] text-slate-400 group-hover:text-white tracking-wider">
                SOUND OFF
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}