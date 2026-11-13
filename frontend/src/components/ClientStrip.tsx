/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building2, Sparkles, Megaphone, GraduationCap, Video, Film, Camera, ShieldCheck } from 'lucide-react';

export default function ClientStrip() {
  const niches = [
    { name: 'Real Estate Brands', icon: Building2, color: '#2BEE34' },
    { name: 'UGC & Direct-Response', icon: Sparkles, color: '#F59E0B' },
    { name: 'Promotional Campaigns', icon: Megaphone, color: '#3B82F6' },
    { name: 'Educational Creators', icon: GraduationCap, color: '#A855F7' },
    { name: 'Luxury Architecture', icon: Building2, color: '#2BEE34' },
    { name: 'Commercial Brands', icon: Film, color: '#EF4444' },
    { name: 'Talking Head Series', icon: Video, color: '#10B981' },
    { name: 'Agency Retainers', icon: ShieldCheck, color: '#06B6D4' },
  ];

  return (
    <section className="bg-[#141414] py-10 border-y border-white/5 overflow-hidden relative select-none">
      {/* Side overlay masks for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#141414] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#141414] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col gap-2 max-w-7xl mx-auto px-6">
        <p className="text-[10px] font-mono tracking-[4px] text-slate-500 uppercase text-center mb-4">
          SPECIALIZED CLIENT DISCIPLINES
        </p>

        {/* Marquee loop wrapper */}
        <div className="flex overflow-hidden w-full">
          <div className="flex gap-16 animate-[infinite-scroll_25s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center">
            {niches.concat(niches).map((niche, index) => {
              const Icon = niche.icon;
              return (
                <div
                  key={`${niche.name}-${index}`}
                  className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-400 font-sans hover:text-white transition-colors cursor-default"
                >
                  <Icon className="w-4 h-4" style={{ color: niche.color }} />
                  <span>{niche.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS Inject for continuous scroll */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}