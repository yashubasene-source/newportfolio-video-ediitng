/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ArrowRight, Play, Pause, ArrowRightLeft } from 'lucide-react';
import { ThemeColors } from '../../types';

interface GalleryNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalProjects: number;
  currentTheme: ThemeColors;
  onSelectIndex: (index: number) => void;
  isPaused?: boolean;
  onTogglePause?: () => void;
  motionDirection?: 'ltr' | 'rtl';
  onToggleDirection?: () => void;
}

export default function GalleryNavigation({
  onPrev,
  onNext,
  currentIndex,
  totalProjects,
  currentTheme,
  onSelectIndex,
  isPaused = false,
  onTogglePause,
  motionDirection = 'rtl',
  onToggleDirection,
}: GalleryNavigationProps) {
  if (totalProjects <= 1) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 flex items-center justify-between mt-8 select-none">
      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-mono font-bold tracking-wider cursor-pointer"
        aria-label="Previous project"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">PREV</span>
      </button>

      {/* Center Controls: Play/Pause Toggle + Progress Dots / Bar */}
      <div className="flex items-center gap-3">
        {onTogglePause && (
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume auto showcase (Space)' : 'Pause auto showcase (Space)'}
            aria-label={isPaused ? 'Resume auto showcase' : 'Pause auto showcase'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-[10px] font-mono font-bold tracking-wider cursor-pointer shadow-sm"
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 fill-current text-emerald-600" />
                <span className="hidden sm:inline text-slate-600">PLAY</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 fill-current text-slate-500" />
                <span className="hidden sm:inline text-slate-500">PAUSE</span>
              </>
            )}
          </button>
        )}

        {onToggleDirection && (
          <button
            onClick={onToggleDirection}
            title={`Direction: ${motionDirection === 'rtl' ? 'Right to Left (←)' : 'Left to Right (→)'}. Click to switch.`}
            aria-label="Toggle motion direction"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-all text-[9px] font-mono font-bold tracking-wider cursor-pointer shadow-sm"
          >
            <ArrowRightLeft className="w-2.5 h-2.5 text-slate-400" />
            <span>{motionDirection === 'rtl' ? '← RTL' : 'LTR →'}</span>
          </button>
        )}

        {/* Progress Dots / Bar (Shows up to 12 dots, or compressed bar if many projects) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200/80 backdrop-blur-sm">
          {totalProjects <= 12 ? (
            Array.from({ length: totalProjects }, (_, i) => {
              const isActive = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => onSelectIndex(i)}
                  aria-label={`Jump to project ${i + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive ? 'w-6 h-2' : 'w-2 h-2 hover:bg-slate-400 bg-slate-300'
                  }`}
                  style={{
                    backgroundColor: isActive ? currentTheme.accentHex || '#E63B2E' : undefined,
                  }}
                />
              );
            })
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-20 sm:w-32 h-1.5 rounded-full bg-slate-200 overflow-hidden relative">
                <span
                  className="absolute top-0 bottom-0 left-0 transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentIndex + 1) / totalProjects) * 100}%`,
                    backgroundColor: currentTheme.accentHex || '#E63B2E',
                  }}
                />
              </span>
              <span className="text-[9px] font-bold">
                {currentIndex + 1}/{totalProjects}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm transition-all text-xs font-mono font-bold tracking-wider cursor-pointer"
        aria-label="Next project"
      >
        <span className="hidden sm:inline">NEXT</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
