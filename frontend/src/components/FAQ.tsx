/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

interface FAQProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
}

export default function FAQ({ currentTheme, soundEnabled }: FAQProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { capabilities, settings } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

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

  const faqs = [
    {
      q: 'What is your typical turnaround time?',
      a: 'For short form vertical reels (Real Estate, UGC, Promo) under 60 seconds, standard turnaround is 24–48 hours. For full architectural tours or complex commercial campaigns, turnaround is 3–5 working days.',
    },
    {
      q: 'How do I send my raw footage?',
      a: 'You can upload your raw assets to Google Drive, Dropbox, or WeTransfer and share a folder link. We coordinate briefs and review links seamlessly over WhatsApp or Email.',
    },
    {
      q: 'Which 4 editing niches do you specialize in?',
      a: 'I specialize strictly in Real Estate Walkthroughs, UGC & Direct-Response conversion ads, Promotional brand campaigns, and Educational talking-head tutorials. Every edit is engineered for high retention and engagement.',
    },
    {
      q: 'How do revisions work?',
      a: 'All project packages include 2 polished revision rounds where we fine-tune cuts, sound effects, grading curves, and typography. Additional round iterations can be requested easily.',
    },
    {
      q: 'Do you offer monthly video retainer packages?',
      a: 'Yes! Retainers are available and highly recommended for consistent creators, agencies, and real estate brands requiring a predictable turnaround queue, fixed slots, and discounted per-video rates.',
    },
  ];

  return (
    <section id="faq-section" className="relative bg-[#141414] py-24 border-b border-white/5 overflow-hidden text-left text-white">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            COMMON INQUIRIES
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-white">
            Got <span style={{ color: accentColor }}>Questions?</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to know about asset delivery, turnaround times, monthly retainers, and revision workflows.
          </p>
        </div>

        {/* Collapsible FAQ Block */}
        <div className="flex flex-col gap-3.5">
          {faqs.map((faq, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                id={`faq-item-${index}`}
                className="rounded-2xl border bg-[#1A1D24] border-white/10 overflow-hidden transition-all shadow-md"
                style={{
                  borderColor: isExpanded ? `${accentColor}50` : 'rgba(255,255,255,0.08)',
                }}
              >
                {/* Trigger Button */}
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => {
                    setExpandedIndex(isExpanded ? null : index);
                    playSound(isExpanded ? 300 : 450);
                  }}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <span className="font-sans font-bold text-sm md:text-base text-white flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                    {faq.q}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Body Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={isLiteMode ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={isLiteMode ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                      exit={isLiteMode ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: settings.duration, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 border-t border-white/5 text-slate-300 text-xs md:text-sm leading-relaxed font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}