/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Download, FileText, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { ThemeColors } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl?: string;
  currentTheme: ThemeColors;
}

export default function ResumeModal({
  isOpen,
  onClose,
  resumeUrl = 'https://drive.google.com',
  currentTheme,
}: ResumeModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accentColor = currentTheme.accentHex || '#2BEE34';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A0C10]/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#181B22]/60 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}40` }}
              >
                <FileText className="w-5 h-5" style={{ color: accentColor }} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                  Anshay Basene <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-normal">CV / Resume</span>
                </h3>
                <p className="text-xs text-slate-400">Cinematic Video Editor • Real Estate, UGC, Promo & Edu</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                title="Open in new window"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Link</span>
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Resume"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Resume Body / Quick Summary Card */}
          <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Specialization</span>
                <span className="text-white font-bold text-sm block">4 Core Disciplines</span>
                <span className="text-[11px] text-slate-400">Real Estate • UGC • Promo • Edu</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Experience</span>
                <span className="text-white font-bold text-sm block">Freelance Lead Editor</span>
                <span className="text-[11px] text-slate-400">50+ Commercial Deliveries</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Education</span>
                <span className="text-white font-bold text-sm block">B.Tech (2nd Year)</span>
                <span className="text-[11px] text-slate-400">Computer Science / Engg</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-xs text-slate-400 block mb-1 font-mono uppercase">Tooling Stack</span>
                <span className="text-white font-bold text-sm block">Adobe & DaVinci</span>
                <span className="text-[11px] text-slate-400">Premiere, AE, Resolve</span>
              </div>
            </div>

            {/* Core Competencies Highlights */}
            <div className="p-5 rounded-xl bg-[#171A21] border border-white/5 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: accentColor }} />
                Video Editing & Motion Design Highlights
              </h4>
              <ul className="grid sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                  <span><strong>Real Estate:</strong> Seamless speed-ramping, architectural pacing & twilight color grades.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                  <span><strong>UGC:</strong> Direct response retention hooks, animated captions & conversion sound design.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                  <span><strong>Promotional:</strong> Dynamic typography, beat-synced cuts & high-energy commercial pacing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentColor }} />
                  <span><strong>Educational:</strong> Talking-head retention, kinetic infographics & clean speech mastering.</span>
                </li>
              </ul>
            </div>

            {/* Embedded Resume Frame or Direct Document Preview */}
            <div className="relative rounded-xl border border-white/10 bg-[#0B0D12] overflow-hidden min-h-[300px] flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
              >
                <FileText className="w-8 h-8" style={{ color: accentColor }} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-white font-bold text-base">Full Document Available</h4>
                <p className="text-xs text-slate-400">
                  Access the official PDF resume detailing project timelines, software certifications, and client case studies.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <Download className="w-4 h-4" />
                  <span>View / Download Full Resume (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}