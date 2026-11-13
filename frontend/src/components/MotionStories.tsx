/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Building2, Sparkles, Megaphone, GraduationCap, ArrowUpRight, Film, CheckCircle2 } from 'lucide-react';
import { ThemeColors } from '../types';

interface MotionStoriesProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
}

export default function MotionStories({ currentTheme, soundEnabled }: MotionStoriesProps) {
  const accentColor = currentTheme.accentHex || '#2BEE34';

  const disciplines = [
    {
      id: 'real-estate',
      title: 'Real Estate',
      icon: Building2,
      tag: 'Architectural Tours',
      description: 'Ultra-smooth speed ramping, cinematic twilight grades, and sky replacements that sell luxury properties faster.',
      deliverables: ['Interior Walkthroughs', 'FPV Drone Pacing', 'Twilight Grading'],
      stats: '4.2x Faster Sales Inquiry',
    },
    {
      id: 'ugc',
      title: 'UGC & Direct Response',
      icon: Sparkles,
      tag: 'High Conversion Ads',
      description: 'First 3-second hook retention, kinetic captions, sound pops, and dynamic zooms tailored for TikTok, Reels, & Shorts.',
      deliverables: ['Hook Variations', 'Kinetic Typography', 'Sound Design Pops'],
      stats: '3.4x Average ROAS',
    },
    {
      id: 'promotional',
      title: 'Promotional',
      icon: Megaphone,
      tag: 'Brand & Product Campaigns',
      description: 'High-octane commercial pacing, bass-synced rhythm cuts, and glitch transitions engineered for product launches.',
      deliverables: ['Commercial Beats', 'Brand Teasers', 'Motion Posters'],
      stats: '85%+ 3s Retention Rate',
    },
    {
      id: 'educational',
      title: 'Educational',
      icon: GraduationCap,
      tag: 'Talking Head Series',
      description: 'Documentary-level information density with visual B-roll overlays, animated diagrams, and pristine audio clarity.',
      deliverables: ['Infographic Overlays', 'Voice Isolation', 'Retention Framing'],
      stats: '60%+ Watch-Time Avg',
    },
  ];

  return (
    <section id="stories-section" className="relative py-28 bg-[#141414] text-white overflow-hidden border-b border-white/5">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[180px] opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-slate-300">
            <Film className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>NARRATIVE DISCIPLINES</span>
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-impact tracking-wider uppercase">
            Stories <span className="font-editorial-script italic font-normal text-slate-400 lowercase">through</span>{' '}
            <span style={{ color: accentColor }}>Motion</span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every frame is engineered with client-converting intent. Explore the 4 specialized editing pillars built for modern brands.
          </p>
        </div>

        {/* 4 Niches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplines.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-6 rounded-2xl bg-[#1A1D24]/60 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Glow border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 20px ${accentColor}15`,
                    borderColor: `${accentColor}40`,
                  }}
                />

                <div className="space-y-4">
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: accentColor }} />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {item.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Key Deliverables */}
                  <div className="pt-2 space-y-1.5 border-t border-white/5">
                    {item.deliverables.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Metric */}
                <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">IMPACT</span>
                  <span className="font-bold text-white" style={{ color: accentColor }}>
                    {item.stats}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Link to Instagram Reel Showcase */}
        <div className="mt-12 text-center">
          <a
            href="https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg=="
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
          >
            <span>Watch Full Reel Case Studies on Instagram (@anshay.edit)</span>
            <ArrowUpRight className="w-4 h-4" style={{ color: accentColor }} />
          </a>
        </div>
      </div>
    </section>
  );
}