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
      desc: 'Advanced timeline pacing, multi-camera syncing, keyframe ramping, and nested nesting workflows.',
      icon: Video,
    },
    {
      title: 'Adobe After Effects',
      desc: 'Complex tracking nodes, glitch effects, visual transitions, kinetic typography, and standard tracking masks.',
      icon: Wand2,
    },
    {
      title: 'Cinematic Color Grading',
      desc: 'Resolve node structures, skin-tone isolation, logarithmic conversion, and custom LUT calibration.',
      icon: Sliders,
    },
    {
      title: 'Sound Design & Mixing',
      desc: 'Ambient layer modeling, specialized effects overlays, transient cleanup, and -14 LUFS loudness mastering.',
      icon: Mic,
    },
  ];

  const designSkills = [
    {
      title: 'Adobe Photoshop',
      desc: 'High-contrast compositing, detailed skin cleanup, layer blending, and custom lighting mask manipulation.',
      icon: Palette,
    },
    {
      title: 'Adobe Illustrator',
      desc: 'Vector mathematics, precise icon design, brand guide scaling, and custom display fonts.',
      icon: Cpu,
    },
    {
      title: 'Social Media UI/UX',
      desc: 'High-converting thumb structures, mobile viewport optimization, and template structures in Figma.',
      icon: Sparkles,
    },
    {
      title: 'Brand Identity suites',
      desc: 'Custom color theory profiles, logo geometry design, typography pair structures, and complete guides.',
      icon: ShieldAlert,
    },
  ];

  return (
    <section id="skills-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            TECHNICAL ARSENAL
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            Professional <span style={{ color: currentTheme.accentHex }}>Capabilities</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Tuned workflow built on top-tier video compilation and brand graphic design standards, executing timelines cleanly.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-center gap-4 mb-12 border-b border-slate-200/50 pb-4">
          <button
            onClick={() => {
              setActiveTab('video');
              playSound(400);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-mono uppercase tracking-widest relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'video' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            VIDEO EDITING / COMPILATION
          </button>
          <button
            onClick={() => {
              setActiveTab('design');
              playSound(450);
            }}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-mono uppercase tracking-widest relative pb-4 transition-colors cursor-pointer ${
              activeTab === 'design' ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            GRAPHIC BRAND DESIGN
          </button>
        </div>

        {/* Active Panel with Fade-in Stagger */}
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
                      className="p-6 rounded-2xl glass-card hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4"
                    >
                      <span
                        className="p-3 rounded-xl border flex items-center justify-center bg-white"
                        style={{
                          borderColor: `${currentTheme.accentHex}20`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: currentTheme.accentHex }} />
                      </span>
                      <h3 className="font-sans font-bold text-base text-slate-900">{skill.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{skill.desc}</p>
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
                      className="p-6 rounded-2xl glass-card hover:bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-start gap-4"
                    >
                      <span
                        className="p-3 rounded-xl border flex items-center justify-center bg-white"
                        style={{
                          borderColor: `${currentTheme.accentHex}20`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: currentTheme.accentHex }} />
                      </span>
                      <h3 className="font-sans font-bold text-base text-slate-900">{skill.title}</h3>
                      <p className="text-slate-600 text-xs leading-relaxed">{skill.desc}</p>
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
