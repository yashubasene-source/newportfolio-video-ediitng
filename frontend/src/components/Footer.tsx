/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ArrowUp, Instagram, Youtube, Mail, MessageSquare } from 'lucide-react';
import { ThemeColors } from '../types';

interface FooterProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
}

export default function Footer({ currentTheme, soundEnabled }: FooterProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playSound = (freq: number, dur = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playSound(800, 0.15);
  };

  return (
    <footer className="relative bg-[#141414] py-16 border-t border-white/5 overflow-hidden text-slate-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo and links */}
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <a
            href="#"
            className="font-sans font-black text-lg text-white tracking-wider flex items-center gap-1.5"
            onClick={() => playSound(400)}
          >
            <span>ANSHAY</span>
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: currentTheme.accentHex || '#2BEE34' }}
            />
          </a>
          <p className="text-[10px] text-slate-500">
            CINEMATIC VIDEO EDITOR • REAL ESTATE, UGC, PROMO & EDU • BHOPAL, MP
          </p>
        </div>

        {/* Navigation list shortcut copies */}
        <div className="flex items-center gap-6 text-slate-400">
          <a href="#work-section" onClick={() => playSound(400)} className="hover:text-white transition-colors">Work</a>
          <a href="#stories-section" onClick={() => playSound(400)} className="hover:text-white transition-colors">Stories</a>
          <a href="#about-section" onClick={() => playSound(400)} className="hover:text-white transition-colors">About</a>
          <a href="#contact-section" onClick={() => playSound(400)} className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Social Connect channels */}
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg=="
            target="_blank"
            rel="noreferrer"
            onClick={() => playSound(500)}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Instagram @anshay.edit"
          >
            <Instagram className="w-4 h-4 text-pink-400" />
          </a>
          <a
            href="mailto:yashubasene@gmail.com"
            onClick={() => playSound(540)}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/918319610243"
            target="_blank"
            rel="noreferrer"
            onClick={() => playSound(560)}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </a>

          {/* Scroll to Top */}
          <button
            onClick={handleScrollTop}
            className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Copyright & Status */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
        <span>© 2026 Anshay Basene. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex || '#2BEE34' }} />
          <span>INSTAGRAM: @anshay.edit</span>
        </div>
      </div>
    </footer>
  );
}