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
      a: 'For short form reels and typography under 1 minute, standard turnaround is 24–48 hours. For longer commercial projects or full documentaries, expect 5–7 working days depending on brief size.',
    },
    {
      q: 'How do I send you my raw footage and files?',
      a: 'You can bundle assets and upload them directly to Google Drive, WeTransfer, or Dropbox, then share a viewing/editor link. We coordinate folders easily over WhatsApp or email.',
    },
    {
      q: 'How do revisions work?',
      a: 'All project packages include 2 review/revisions rounds by default where we tighten pacing, tweak grading levels, and sync audio clips. If you need complete design shifts later, additional edits are charged flatly.',
    },
    {
      q: 'Do you offer monthly retainer plans?',
      a: 'Yes, retainer plans are available and highly recommended for consistent creators, YouTubers, and digital agencies needing priority queue slots, set delivery speed, and lower per-video costs.',
    },
    {
      q: 'Are you available to sign non-disclosure agreements (NDAs)?',
      a: 'Absolutely. I work frequently on sensitive corporate campaigns, fashion line drops, and political documentaries where strict confidentiality and secure local storage of raw assets are mandatory.',
    },
  ];

  return (
    <section id="faq-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden text-left">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            COMMON INQUIRIES
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            Got <span style={{ color: currentTheme.accentHex }}>Questions?</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to understand about asset delivery, turnaround pacing, monthly retributions, and system revisions.
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
                className="rounded-2xl border glass-card overflow-hidden transition-all shadow-sm"
                style={{
                  borderColor: isExpanded ? `${currentTheme.accentHex}40` : 'rgba(0,0,0,0.1)',
                }}
              >
                {/* Trigger Button */}
                <button
                  id={`faq-btn-${index}`}
                  onClick={() => {
                    setExpandedIndex(isExpanded ? null : index);
                    playSound(isExpanded ? 300 : 450);
                  }}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
                >
                  <span className="font-sans font-bold text-sm md:text-base text-slate-900 flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
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
                      <div className="p-6 pt-0 border-t border-slate-100 text-slate-600 text-xs md:text-sm leading-relaxed">
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
