import React, { useState } from 'react';
import { RotateCcw, Download, Edit3, Trash2, Video, Film, AlertTriangle } from 'lucide-react';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  onEditInit: (project: Project) => void;
  onDelete: (id: string) => void;
  onResetDefaults: () => void;
  onExport: () => void;
  onAddNew: () => void;
  playSound: (freq: number, dur?: number) => void;
}

export default function ProjectList({
  projects,
  onEditInit,
  onDelete,
  onResetDefaults,
  onExport,
  onAddNew,
  playSound,
}: ProjectListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filter projects by format
  const reels = projects.filter((p) => p.aspectRatio === '9:16');
  const videos = projects.filter((p) => p.aspectRatio !== '9:16');

  // Build fixed 20 slots
  const reelSlots = Array.from({ length: 20 }, (_, i) => reels[i] || null);
  const videoSlots = Array.from({ length: 20 }, (_, i) => videos[i] || null);

  return (
    <div className="lg:col-span-7 flex flex-col gap-5 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">ACTIVE SHOWCASE</p>
          <h3 className="font-sans font-black text-sm text-white mt-0.5">Manage Items ({projects.length})</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {/* View Mode Switcher */}
          <div className="flex rounded bg-zinc-900 border border-zinc-850 overflow-hidden mr-2">
            <button
              onClick={() => { setViewMode('list'); playSound(300); }}
              className={`px-3 py-1.5 transition-colors cursor-pointer text-[10px] ${
                viewMode === 'list' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => { setViewMode('grid'); playSound(300); }}
              className={`px-3 py-1.5 transition-colors cursor-pointer text-[10px] ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Slots Grid
            </button>
          </div>

          <button
            onClick={() => { onResetDefaults(); playSound(400); }}
            className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={onExport}
            className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" /> Backup
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        // LIST VIEW (Standard)
        <div data-lenis-prevent className="max-h-[500px] overflow-y-auto flex flex-col gap-2 border border-zinc-900 bg-zinc-950/20 p-2 rounded-xl pr-2.5">
          {projects.map((p) => {
            // Find slot index in its format
            const listFiltered = p.aspectRatio === '9:16' ? reels : videos;
            const slotIdx = listFiltered.findIndex(proj => proj.id === p.id);
            const slotNum = slotIdx !== -1 ? slotIdx + 1 : 1;
            const isOverage = slotNum > 20;

            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-2.5 rounded border border-zinc-900/60 bg-zinc-950/40 hover:bg-zinc-950/90 transition-colors gap-4"
              >
                <div className="flex items-center gap-3 truncate">
                  <img
                    src={p.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=200'}
                    className="w-10 h-10 object-cover rounded border border-zinc-850 flex-shrink-0"
                    alt=""
                  />
                  <div className="text-left truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-sans font-bold text-white truncate">{p.title}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                        isOverage ? 'bg-amber-950/30 text-amber-500 border border-amber-900/50' : 'bg-zinc-900 text-zinc-400'
                      }`}>
                        Slot {slotNum} {isOverage && '(Inactive)'}
                      </span>
                    </div>
                    <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                      {p.niche} · {p.type} · {p.aspectRatio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onEditInit(p)}
                    className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-1.5 rounded hover:bg-zinc-900 text-red-400 hover:text-red-300 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {projects.length === 0 && (
            <p className="text-zinc-500 font-mono text-xs text-center py-12">
              NO ACTIVE PROJECTS. CLICK RESET TO LOAD DEFAULTS.
            </p>
          )}
        </div>
      ) : (
        // SLOTS GRID VIEW
        <div data-lenis-prevent className="max-h-[500px] overflow-y-auto flex flex-col gap-6 border border-zinc-900 bg-zinc-950/20 p-4 rounded-xl">
          
          {/* Section 1: Reels Slots */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Film className="w-3 h-3 text-purple-400" /> Vertical Reels Slots (9:16)
              </span>
              <span className="text-[9px] font-mono text-zinc-500">
                {reels.length} / 20 Slots Filled
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {reelSlots.map((p, idx) => {
                const slotNum = idx + 1;
                if (p) {
                  return (
                    <div
                      key={p.id}
                      onClick={() => onEditInit(p)}
                      className="group relative aspect-square rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer hover:border-purple-500 transition-all flex flex-col items-center justify-center"
                      title={`Slot ${slotNum}: ${p.title}`}
                    >
                      <img src={p.thumbnail} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-1 left-1 bg-black/80 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded leading-none">
                        #{slotNum}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                        className="absolute top-1 right-1 bg-red-950/80 hover:bg-red-900 border border-red-900/40 text-red-300 hover:text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`empty-reel-${slotNum}`}
                      onClick={() => { onAddNew(); playSound(500); }}
                      className="aspect-square rounded-lg border border-dashed border-zinc-850 bg-zinc-950/20 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/20 transition-all"
                      title={`Slot ${slotNum}: Empty (Click to add)`}
                    >
                      <span className="text-[10px] font-bold text-zinc-600 font-mono">+{slotNum}</span>
                    </div>
                  );
                }
              })}
            </div>

            {reels.length > 20 && (
              <div className="p-2 rounded bg-amber-950/15 border border-amber-900/30 text-amber-500 text-[10px] font-mono flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                <span>
                  Warning: {reels.length - 20} extra Reel(s) will not display. Overage projects starts from Slot 21 onwards.
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Videos Slots */}
          <div className="flex flex-col gap-2.5 border-t border-zinc-900/60 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Video className="w-3 h-3 text-emerald-400" /> Horizontal Videos Slots (16:9)
              </span>
              <span className="text-[9px] font-mono text-zinc-500">
                {videos.length} / 20 Slots Filled
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {videoSlots.map((p, idx) => {
                const slotNum = idx + 1;
                if (p) {
                  return (
                    <div
                      key={p.id}
                      onClick={() => onEditInit(p)}
                      className="group relative aspect-square rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all flex flex-col items-center justify-center"
                      title={`Slot ${slotNum}: ${p.title}`}
                    >
                      <img src={p.thumbnail} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-1 left-1 bg-black/80 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded leading-none">
                        #{slotNum}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(p.id); }}
                        className="absolute top-1 right-1 bg-red-950/80 hover:bg-red-900 border border-red-900/40 text-red-300 hover:text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`empty-video-${slotNum}`}
                      onClick={() => { onAddNew(); playSound(500); }}
                      className="aspect-square rounded-lg border border-dashed border-zinc-850 bg-zinc-950/20 flex flex-col items-center justify-center cursor-pointer hover:border-zinc-700 hover:bg-zinc-900/20 transition-all"
                      title={`Slot ${slotNum}: Empty (Click to add)`}
                    >
                      <span className="text-[10px] font-bold text-zinc-600 font-mono">+{slotNum}</span>
                    </div>
                  );
                }
              })}
            </div>

            {videos.length > 20 && (
              <div className="p-2 rounded bg-amber-950/15 border border-amber-900/30 text-amber-500 text-[10px] font-mono flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                <span>
                  Warning: {videos.length - 20} extra Video(s) will not display. Overage projects starts from Slot 21 onwards.
                </span>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
