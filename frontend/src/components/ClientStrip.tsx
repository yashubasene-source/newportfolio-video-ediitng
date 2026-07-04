/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Youtube, Landmark, Building, GraduationCap, Store, Mic, Film, Shirt } from 'lucide-react';

export default function ClientStrip() {
  const niches = [
    { name: 'YouTube Creators', icon: Youtube, color: '#FF0000' },
    { name: 'Political Campaigns', icon: Landmark, color: '#FFD700' },
    { name: 'Real Estate Brands', icon: Building, color: '#10B981' },
    { name: 'EdTech Channels', icon: GraduationCap, color: '#3B82F6' },
    { name: 'Local Businesses', icon: Store, color: '#F59E0B' },
    { name: 'Podcast Studios', icon: Mic, color: '#8B5CF6' },
    { name: 'Documentary Films', icon: Film, color: '#EF4444' },
    { name: 'Fashion Brands', icon: Shirt, color: '#EC4899' },
  ];

  return (
    <section className="bg-white/50 backdrop-blur-md py-10 border-y border-slate-200/50 overflow-hidden relative select-none">
      {/* Absolute side overlay masks for smooth fade-in/out */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FAF7F2] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FAF7F2] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-2 max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase text-center mb-4">
          TRUSTED & WORKED WITH
        </p>

        {/* Marquee loop wrapper */}
        <div className="flex overflow-hidden w-full">
          <div className="flex gap-16 animate-[infinite-scroll_25s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center">
            {niches.concat(niches).map((niche, index) => {
              const Icon = niche.icon;
              return (
                <div
                  key={`${niche.name}-${index}`}
                  className="flex items-center gap-3.5 text-sm font-semibold tracking-wide text-slate-500 font-sans hover:text-slate-900 transition-colors cursor-default"
                >
                  <Icon className="w-5 h-5" style={{ color: niche.color }} />
                  <span>{niche.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global CSS Inject for continuous scroll */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
