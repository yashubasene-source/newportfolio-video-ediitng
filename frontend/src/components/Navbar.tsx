/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, ShieldAlert, Settings, Menu, X, Check } from 'lucide-react';
import { ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

interface NavbarProps {
  currentTheme: ThemeColors;
  setTheme: (theme: ThemeColors) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  themesList: ThemeColors[];
  onOpenAdmin: () => void;
  onOpenReport: () => void;
}

export default function Navbar({
  currentTheme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  themesList,
  onOpenAdmin,
  onOpenReport,
}: NavbarProps) {
  const { capabilities, settings } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const playClickSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const selectTheme = (t: ThemeColors) => {
    setTheme(t);
    playClickSound();
    setShowThemePicker(false);
  };

  const navLinks = [
    { name: 'Work', href: '#work-section' },
    { name: 'About', href: '#about-section' },
    { name: 'Skills', href: '#skills-section' },
    { name: 'Pricing', href: '#pricing-section' },
    { name: 'Contact', href: '#contact-section' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[#FAF7F2]/80 backdrop-blur-xl border-b border-slate-200/50 shadow-md'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          id="nav-logo-link"
          className="group flex items-center gap-1 font-sans font-extrabold text-xl tracking-tight text-slate-900 hover:opacity-90 transition-opacity"
          onClick={playClickSound}
        >
          ANSHAY
          <span
            className="w-1.5 h-1.5 rounded-full inline-block group-hover:scale-150 transition-transform duration-300"
            style={{ backgroundColor: currentTheme.accentHex, boxShadow: `0 0 10px ${currentTheme.accentHex}` }}
          />
        </a>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.name}
              id={`nav-link-${link.name.toLowerCase()}`}
              href={link.href}
              onClick={playClickSound}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1 relative group"
            >
              {link.name}
              <span
                className="absolute bottom-0 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
                style={{ backgroundColor: currentTheme.accentHex }}
              />
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Working Report Trigger */}
          <button
            id="nav-report-btn"
            onClick={() => {
              onOpenReport();
              playClickSound();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 bg-white/50 hover:bg-slate-100 transition-all cursor-pointer"
            title="View Security & Design Analysis Report"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Audit Report
          </button>

          {/* Theme Tint Switcher */}
          <div className="relative">
            <button
              id="nav-theme-picker-btn"
              onClick={() => {
                setShowThemePicker(!showThemePicker);
                playClickSound();
              }}
              className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Custom Accent Tints"
            >
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: currentTheme.accentHex, boxShadow: `0 0 8px ${currentTheme.accentHex}` }}
              />
            </button>

            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 p-3 rounded-xl border border-slate-200 bg-white shadow-xl min-w-[200px] flex flex-col gap-2"
                >
                  <p className="text-[10px] font-mono text-slate-400 px-1 mb-1">ACCENT THEMES</p>
                  {themesList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => selectTheme(t)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                        currentTheme.id === t.id ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-55'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: t.accentHex }} />
                        {t.name}
                      </div>
                      {currentTheme.id === t.id && <Check className="w-3 h-3 text-slate-800" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) {
                setTimeout(() => {
                  try {
                    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    osc.connect(ctx.destination);
                    osc.frequency.setValueAtTime(800, ctx.currentTime);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                  } catch (e) {}
                }, 50);
              }
            }}
            className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title={soundEnabled ? 'Monitor Sound: ON' : 'Monitor Sound: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Portfolio Manager Trigger (Admin Panel) */}
          <button
            id="nav-admin-btn"
            onClick={() => {
              onOpenAdmin();
              playClickSound();
            }}
            className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Portfolio Manager"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* HIRE ME Button */}
          <a
            id="nav-cta-hire-btn"
            href="#contact-section"
            onClick={playClickSound}
            className="px-4 py-2 text-xs font-bold tracking-wider rounded-lg text-white transition-all font-mono hover:brightness-110"
            style={{
              backgroundColor: currentTheme.accentHex,
              boxShadow: `0 4px 14px ${currentTheme.glowColor}`,
            }}
          >
            HIRE ME
          </a>
        </div>

        {/* Mobile Hamburger / Toggles */}
        <div className="md:hidden flex items-center gap-2">
          {/* Sound toggle mobile */}
          <button
            id="nav-sound-toggle-mobile"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg border border-slate-300 text-slate-500"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="nav-hamburger-mobile"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              playClickSound();
            }}
            className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={isLiteMode ? { opacity: 0, scale: 0.98 } : { opacity: 0, height: 0 }}
            animate={isLiteMode ? { opacity: 1, scale: 1 } : { opacity: 1, height: 'auto' }}
            exit={isLiteMode ? { opacity: 0, scale: 0.98 } : { opacity: 0, height: 0 }}
            transition={{ duration: settings.duration }}
            className="md:hidden border-b border-slate-200 bg-[#FAF7F2]/95 backdrop-blur-2xl px-6 py-4 flex flex-col gap-4 shadow-xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                id={`mobile-nav-link-${link.name.toLowerCase()}`}
                href={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  playClickSound();
                }}
                className="text-slate-600 hover:text-slate-900 transition-colors text-sm py-1 font-medium block"
              >
                {link.name}
              </a>
            ))}

            <div className="h-px bg-slate-200 my-1" />

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="mobile-nav-report"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReport();
                  playClickSound();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-300 text-slate-700 bg-white"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Audit Report
              </button>

              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                  playClickSound();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-slate-300 text-slate-700 bg-white"
              >
                <Settings className="w-3.5 h-3.5" />
                Manager Panel
              </button>
            </div>

            <a
              id="mobile-nav-hire-btn"
              href="#contact-section"
              onClick={() => {
                setMobileMenuOpen(false);
                playClickSound();
              }}
              className="py-2.5 rounded-lg text-center text-xs font-bold font-mono tracking-wider text-white block hover:brightness-110"
              style={{ backgroundColor: currentTheme.accentHex }}
            >
              HIRE ANSHAY
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
