/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Clock, User, Film, Monitor } from 'lucide-react';
import { Project, ThemeColors } from '../../types';

interface ActiveProjectInfoProps {
  project: Project | null;
  currentIndex: number;
  totalProjects: number;
  currentTheme: ThemeColors;
  onOpenViewer: (project: Project) => void;
  isLiteMode?: boolean;
}

export default function ActiveProjectInfo({
  project,
  currentIndex,
  totalProjects,
  currentTheme,
  onOpenViewer,
  isLiteMode = false,
}: ActiveProjectInfoProps) {
  if (!project) return null;

  // Format count string (Step 10: 01 / TOTAL)
  const currentStr = String(currentIndex + 1).padStart(2, '0');
  const totalStr = String(totalProjects).padStart(2, '0');

  // Format metadata summary line
  const metaParts: string[] = [];
  if (project.client) metaParts.push(project.client);
  if (project.niche) metaParts.push(project.niche.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()));
  if (project.software && project.software.length > 0) metaParts.push(project.software.slice(0, 2).join(' · '));
  if (project.createdAt) metaParts.push(project.createdAt);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center mt-6 sm:mt-8 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={isLiteMode ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={isLiteMode ? { opacity: 0 } : { opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 w-full"
        >
          {/* Top Counter & Format Pill */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="font-bold tracking-widest text-slate-800">
              <strong style={{ color: currentTheme.accentHex || '#E63B2E' }}>{currentStr}</strong>
              <span className="text-slate-400 mx-1.5">/</span>
              <span className="text-slate-500">{totalStr}</span>
            </span>

            <span className="w-1 h-1 rounded-full bg-slate-300" />

            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[9px] uppercase font-bold tracking-widest">
              {project.mediaType === 'reel' || project.aspectRatio === '9:16' ? '9:16 REEL' : '16:9 VIDEO'}
            </span>
          </div>

          {/* Project Title */}
          <h3 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight max-w-2xl">
            {project.title}
          </h3>

          {/* Short Narrative / Description */}
          <p className="text-slate-600 text-xs sm:text-sm max-w-xl line-clamp-2 leading-relaxed font-sans">
            {project.shortDescription || project.description}
          </p>

          {/* Metadata Line */}
          {metaParts.length > 0 && (
            <div className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center justify-center flex-wrap gap-2">
              {metaParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-300">·</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* CTA Button to open full project details viewer (Step 13) */}
          <button
            onClick={() => onOpenViewer(project)}
            className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold text-white shadow-md hover:brightness-110 transition-all cursor-pointer group"
            style={{
              backgroundColor: currentTheme.accentHex || '#E63B2E',
              boxShadow: `0 8px 20px -4px ${currentTheme.glowColor || 'rgba(230,59,46,0.3)'}`,
            }}
          >
            <span>VIEW PROJECT DETAILS</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
