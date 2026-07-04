/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MapPin, GraduationCap, Clock, Award, Star } from 'lucide-react';
import { ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

interface AboutProps {
  currentTheme: ThemeColors;
  aboutConfig?: any;
}

export default function About({ currentTheme, aboutConfig }: AboutProps) {
  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  const location = aboutConfig?.location || 'Bhopal, Madhya Pradesh';
  const education = aboutConfig?.education || 'B.Tech — 2nd Year Student';
  const availability = aboutConfig?.availability || 'Open for Freelance Work';
  const experience = aboutConfig?.experience || 'Active Professional Editor';
  const profileImage = aboutConfig?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop';
  const locationStamp = aboutConfig?.locationStamp || 'BHOPAL, IN — UTC+5:30';
  const title = aboutConfig?.title || 'Turning Raw Footage Into Cinematic Art';
  const bioParagraph1 = aboutConfig?.bioParagraph1 || "Hi, I'm Anshay Basene, a Video Editor and Graphic Designer from Bhopal, Madhya Pradesh. While currently pursuing my B.Tech degree (2nd Year), I work as a professional freelancer partnering with global content creators, real estate agents, and agencies.";
  const bioParagraph2 = aboutConfig?.bioParagraph2 || "I specialize in political documentaries, narrative walkthroughs, and fast-paced typography animations where timing, color grading depth, and audio pacing are crucial. Every single cut and pixel is placed with client-converting intent.";
  const tags = aboutConfig?.tags || ['Color Correction', 'Kinetic Typography', 'Logo suites', 'VFX Motion', 'Sound Design', 'Brand Strategy'];

  const infoCards = [
    { label: 'Location', value: location, icon: MapPin },
    { label: 'Education', value: education, icon: GraduationCap },
    { label: 'Availability', value: availability, icon: Clock, accent: true },
    { label: 'Experience', value: experience, icon: Award },
  ];

  return (
    <section id="about-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden text-left">
      {!isLiteMode && (
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] rounded-full blur-[100px]" style={{ backgroundColor: currentTheme.accentHex }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Image with cinematic outlines */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group max-w-sm w-full">
            {/* Background glowing frame (no blur on lite modes) */}
            <div
              className={`absolute -inset-1 rounded-2xl opacity-30 transition-opacity duration-300 ${
                isLiteMode ? '' : 'group-hover:opacity-60 blur duration-500'
              }`}
              style={{
                backgroundImage: `linear-gradient(to bottom, ${currentTheme.accentHex}, #10b981)`,
              }}
            />
            
            {/* Image box */}
            <div className="relative aspect-[4/5] rounded-xl glass-card overflow-hidden shadow-xl">
              <img
                src={profileImage}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-80"
                alt="Anshay Basene"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {/* Location Stamp Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 font-mono text-[9px] text-white glass-pill px-2.5 py-1.5 rounded-lg bg-black/40">
                <MapPin className="w-3.5 h-3.5" style={{ color: currentTheme.accentHex }} />
                <span>{locationStamp}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio Details */}
        <div className="lg:col-span-7 flex flex-col items-start gap-6">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            ABOUT ME
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            {title.includes('Cinematic Art') ? (
              <>Turning Raw Footage Into <span style={{ color: currentTheme.accentHex }}>Cinematic Art</span></>
            ) : (
              title
            )}
          </h2>

          <div className="text-slate-600 text-sm md:text-base leading-relaxed flex flex-col gap-4">
            <p>
              {bioParagraph1}
            </p>
            <p>
              {bioParagraph2}
            </p>
          </div>

          {/* Quick Pillar Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[10px] font-mono glass-pill text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bio Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
            {infoCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="p-4 rounded-xl border glass-card hover:bg-white transition-colors flex items-start gap-3"
                  style={{
                    borderColor: card.accent ? currentTheme.accentHex : 'rgba(15,23,42,0.08)',
                  }}
                >
                  <span
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: card.accent ? `${currentTheme.accentHex}15` : 'rgba(15,23,42,0.02)',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.accent ? currentTheme.accentHex : '#64748b' }} />
                  </span>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-xs font-sans font-bold text-slate-900 mt-0.5">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
