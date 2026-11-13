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
  const availability = aboutConfig?.availability || 'Open for New Projects';
  const experience = aboutConfig?.experience || 'Active Commercial Video Editor';
  const profileImage = aboutConfig?.profileImage || '/assets/anshay-profile.jpg';
  const locationStamp = aboutConfig?.locationStamp || 'BHOPAL, IN — UTC+5:30';
  const title = aboutConfig?.title || 'Turning Raw Footage Into Cinematic Art';
  const bioParagraph1 = aboutConfig?.bioParagraph1 || "Hi, I'm Anshay Basene, a Video Editor and Visual Storyteller from Bhopal, Madhya Pradesh. While currently pursuing my B.Tech degree (2nd Year), I work as a professional editor partnering with global brands, content creators, real estate agents, and digital agencies.";
  const bioParagraph2 = aboutConfig?.bioParagraph2 || "I specialize in dynamic pacing, immersive sound design, and color grading across 4 core disciplines: Real Estate, UGC, Promotional Campaigns, and Educational content. Every single cut and pixel is placed with client-converting intent.";
  const tags = aboutConfig?.tags || ['Real Estate Tours', 'UGC Ads', 'Promotional Campaigns', 'Educational Content', 'Color Grading', 'Sound Design'];

  const accentColor = currentTheme.accentHex || '#2BEE34';

  const infoCards = [
    { label: 'Location', value: location, icon: MapPin },
    { label: 'Education', value: education, icon: GraduationCap },
    { label: 'Availability', value: availability, icon: Clock, accent: true },
    { label: 'Experience', value: experience, icon: Award },
  ];

  return (
    <section id="about-section" className="relative bg-[#141414] py-24 border-b border-white/5 overflow-hidden text-left text-white">
      {!isLiteMode && (
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] rounded-full blur-[120px]" style={{ backgroundColor: accentColor }} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Image with cinematic outlines */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group max-w-sm w-full">
            {/* Background glowing frame */}
            <div
              className={`absolute -inset-1 rounded-2xl opacity-40 transition-opacity duration-300 ${
                isLiteMode ? '' : 'group-hover:opacity-75 blur duration-500'
              }`}
              style={{
                backgroundImage: `linear-gradient(to bottom, ${accentColor}, #059669)`,
              }}
            />
            
            {/* Image box */}
            <div className="relative aspect-[4/5] rounded-xl bg-[#181B22] border border-white/10 overflow-hidden shadow-2xl">
              <img
                src={profileImage}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-85"
                alt="Anshay Basene"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              {/* Location Stamp Overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 font-mono text-[9px] text-white px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
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
          <h2 className="font-impact text-5xl md:text-6xl leading-tight text-white uppercase tracking-wider">
            {title.includes('Cinematic Art') ? (
              <>Turning Raw Footage Into <span className="font-editorial-script italic font-normal lowercase" style={{ color: accentColor }}>Cinematic Art</span></>
            ) : (
              title
            )}
          </h2>

          <div className="text-slate-400 text-sm md:text-base leading-relaxed flex flex-col gap-4 font-light">
            <p>{bioParagraph1}</p>
            <p>{bioParagraph2}</p>
          </div>

          {/* Quick Pillar Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-slate-300"
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
                  className="p-4 rounded-xl border bg-[#1A1D24] border-white/10 hover:border-white/20 transition-all flex items-start gap-3 shadow-md"
                  style={{
                    borderColor: card.accent ? `${accentColor}50` : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: card.accent ? `${accentColor}20` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: card.accent ? accentColor : '#94a3b8' }} />
                  </span>
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-xs font-sans font-bold text-white mt-0.5">{card.value}</p>
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