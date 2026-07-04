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
    <footer className="relative bg-transparent py-16 border-t border-slate-200/50 overflow-hidden text-slate-500 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Logo and links */}
        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
          <a
            href="#"
            className="font-sans font-black text-lg text-slate-900 tracking-wider"
            onClick={() => playSound(400)}
          >
            ANSHAY
            <span
              className="w-1.5 h-1.5 rounded-full inline-block ml-1"
              style={{ backgroundColor: currentTheme.accentHex }}
            />
          </a>
          <p className="text-[10px] text-slate-400">
            CINEMATIC EDITING · GRAPHIC BRAND DESIGN · BHOPAL, MP
          </p>
        </div>

        {/* Navigation list shortcut copies */}
        <div className="flex items-center gap-6 text-slate-500">
          <a href="#work-section" onClick={() => playSound(400)} className="hover:text-slate-900 transition-colors">Work</a>
          <a href="#about-section" onClick={() => playSound(400)} className="hover:text-slate-900 transition-colors">About</a>
          <a href="#skills-section" onClick={() => playSound(400)} className="hover:text-slate-900 transition-colors">Skills</a>
          <a href="#pricing-section" onClick={() => playSound(400)} className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#contact-section" onClick={() => playSound(400)} className="hover:text-slate-900 transition-colors">Contact</a>
        </div>

        {/* Social Connect channels */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => playSound(500)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => playSound(520)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            title="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
          <a
            href="mailto:yashubasene@gmail.com"
            onClick={() => playSound(540)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://wa.me/918319610243"
            target="_blank"
            rel="noreferrer"
            onClick={() => playSound(560)}
            className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Copy line footer */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-200/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[10px] tracking-wider gap-4">
        <span>© 2026 ANSHAY BASENE. ALL RIGHTS RESERVED.</span>
        <span>DESIGNED WITH OUTSTANDING REACT CRAFTSMANSHIP</span>
      </div>

      {/* Back to Top Floating Button (with circular scroll tracker) */}
      <button
        onClick={handleScrollTop}
        className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full glass-card border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-md transition-all cursor-pointer group"
        title="Scroll to Top"
      >
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="22"
            cy="22"
            r="19"
            className="stroke-slate-100 fill-none"
            strokeWidth="2"
          />
          <circle
            cx="22"
            cy="22"
            r="19"
            className="fill-none transition-all duration-75"
            strokeWidth="2"
            strokeDasharray={2 * Math.PI * 19}
            strokeDashoffset={2 * Math.PI * 19 * (1 - scrollProgress / 100)}
            style={{ stroke: currentTheme.accentHex }}
          />
        </svg>
        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
      </button>
    </footer>
  );
}
