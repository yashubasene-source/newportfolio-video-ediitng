/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Palette, Sparkles, Wand2, Sliders, Mic, ShieldAlert, Cpu } from 'lucide-react';
import { ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

interface SkillsProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
}

export default function Skills({ currentTheme, soundEnabled }: SkillsProps) {
  const [activeTab, setActiveTab] = useState<'video' | 'design'>('video');
  const { settings } = usePerformance();

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
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  const videoSkills = [
    {
      title: 'Adobe Premiere Pro',
      desc: 'Advanced timeline pacing, multi-camera syncing, keyframe speed ramping, and retention-focused cuts.',
      icon: Video,
    },
    {
      title: 'Adobe After Effects',
      desc: 'Complex 3D camera tracking, dynamic glitch transitions, kinetic typography, and motion design.',
      icon: Wand2,
    },
    {
      title: 'Cinematic DaVinci Resolve',
      desc: 'Node-based color grading, logarithmic gamut mapping, skin-tone isolation, and custom film LUTs.',
      icon: Sliders,
    },
    {
      title: 'Sound Design & Mastering',
      desc: 'Multi-layer foley, whooshes, risers, dialogue isolation, transient cleanup, and -14 LUFS loudness delivery.',
      icon: Mic,
    },
  ];

  const designSkills = [
    {
      title: 'Adobe Photoshop',
      desc: 'High-converting YouTube thumbnails, poster art, lighting composites, and advanced photo retouching.',
      icon: Palette,
    },
    {
      title: 'Adobe Illustrator',
      desc: 'Vector geometry, logo identity suites, custom icons, and typography guides for video branding.',
      icon: Cpu,
    },
    {
      title: 'Social Media Visual Strategy',
      desc: 'Thumb-stopping 9:16 mobile optimization, high CTR cover frames, and modern aesthetic guidelines.',
      icon: Sparkles,
    },
    {
      title: 'Brand Identity Systems',
      desc: 'Custom color palettes, kinetic motion guides, and cohesive multi-platform branding.',
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="skills-section" className="relative bg-[#141414] py-24 border-b border-white/5 overflow-hidden text-left text-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            TECHNICAL ARSENAL
          </p>
          <h2 className="font-impact text-5xl md:text-6xl leading-tight text-white uppercase tracking-wider">
            Professional <span className="font-editorial-script italic font-normal lowercase" style={{ color: accentColor }}>Capabilities</span>
          </h2>
          <p className="text-slate-400 text-sm">
            High-performance workflow built on industry-standard compilation tools and creative software suites.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-4 mb-12 border-b border-white/10 pb-4">
          <button
            onClick={() => {
              setActiveTab('video');
              playSound(400);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono uppercase tracking-widest relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'video' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Video className="w-4 h-4" style={{ color: activeTab === 'video' ? accentColor : undefined }} />
            <span>VIDEO EDITING & POST</span>
            {activeTab === 'video' && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('design');
              playSound(450);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-mono uppercase tracking-widest relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'design' ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4" style={{ color: activeTab === 'design' ? accentColor : undefined }} />
            <span>GRAPHIC & BRAND DESIGN</span>
            {activeTab === 'design' && (
              <span
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        </div>

        {/* Active Panel */}
        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'video' ? (
              <motion.div
                key="video-skills"
                initial={{ opacity: 0, y: settings.yOffset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -settings.yOffset }}
                transition={{ duration: settings.duration }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {videoSkills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.title}
                      id={`skill-video-${index}`}
                      className="p-6 rounded-2xl bg-[#1A1D24] border border-white/10 hover:border-white/20 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4"
                    >
                      <span
                        className="p-3 rounded-xl border flex items-center justify-center bg-[#12141A]"
                        style={{
                          borderColor: `${accentColor}30`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: accentColor }} />
                      </span>
                      <h3 className="font-sans font-bold text-base text-white">{skill.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{skill.desc}</p>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="design-skills"
                initial={{ opacity: 0, y: settings.yOffset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -settings.yOffset }}
                transition={{ duration: settings.duration }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {designSkills.map((skill, index) => {
                  const Icon = skill.icon;
                  return (
                    <div
                      key={skill.title}
                      id={`skill-design-${index}`}
                      className="p-6 rounded-2xl bg-[#1A1D24] border border-white/10 hover:border-white/20 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-start gap-4"
                    >
                      <span
                        className="p-3 rounded-xl border flex items-center justify-center bg-[#12141A]"
                        style={{
                          borderColor: `${accentColor}30`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: accentColor }} />
                      </span>
                      <h3 className="font-sans font-bold text-base text-white">{skill.title}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{skill.desc}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}