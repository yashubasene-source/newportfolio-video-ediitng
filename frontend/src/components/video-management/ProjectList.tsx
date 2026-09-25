/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  RotateCcw,
  Download,
  Edit3,
  Trash2,
  Video,
  Film,
  Eye,
  CheckCircle,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  onEditInit: (project: Project) => void;
  onDelete: (id: string) => void;
  onTogglePublish?: (id: string) => void;
  onReorder?: (fromIdx: number, toIdx: number) => void;
  onPreview?: (project: Project) => void;
  onResetDefaults: () => void;
  onExport: () => void;
  onAddNew: () => void;
  playSound: (freq: number, dur?: number) => void;
}

export default function ProjectList({
  projects,
  onEditInit,
  onDelete,
  onTogglePublish,
  onReorder,
  onPreview,
  onResetDefaults,
  onExport,
  onAddNew,
  playSound,
}: ProjectListProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<'all' | 'reels' | 'videos'>('all');

  // Filter projects by format
  const reels = projects.filter((p) => p.mediaType === 'reel' || p.aspectRatio === '9:16');
  const videos = projects.filter((p) => p.mediaType === 'video' || (p.mediaType !== 'reel' && p.aspectRatio !== '9:16'));

  const displayedProjects =
    filterType === 'reels' ? reels : filterType === 'videos' ? videos : projects;

  const currentSlots = filterType === 'videos' ? videos : reels;
  const slotGridItems = Array.from({ length: Math.max(20, currentSlots.length) }, (_, i) => currentSlots[i] || null);

  return (
    <div className="lg:col-span-7 flex flex-col gap-4 text-left">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">ACTIVE SHOWCASE</p>
          <h3 className="font-sans font-black text-sm text-white mt-0.5">
            Manage Portfolio Items ({projects.length})
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          {/* View Mode Switcher */}
          <div className="flex rounded bg-zinc-900 border border-zinc-850 overflow-hidden mr-2">
            <button
              onClick={() => {
                setViewMode('list');
                playSound(300);
              }}
              className={`px-3 py-1.5 transition-colors cursor-pointer text-[10px] ${
                viewMode === 'list'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => {
                setViewMode('grid');
                playSound(300);
              }}
              className={`px-3 py-1.5 transition-colors cursor-pointer text-[10px] ${
                viewMode === 'grid'
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Slots Grid
            </button>
          </div>

          <button
            onClick={() => {
              onResetDefaults();
              playSound(400);
            }}
            className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            title="Reset to Original Defaults"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={onExport}
            className="px-2 py-1.5 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            title="Download JSON Backup"
          >
            <Download className="w-3 h-3" /> Backup
          </button>
        </div>
      </div>

      {/* Admin Filter Preview Tabs (ALL / REELS / VIDEOS) */}
      <div className="flex items-center gap-2 p-1 rounded-lg bg-zinc-900/80 border border-zinc-850 text-[10px] font-mono">
        <button
          onClick={() => {
            setFilterType('all');
            playSound(300);
          }}
          className={`px-3 py-1 rounded cursor-pointer transition-colors ${
            filterType === 'all'
              ? 'bg-zinc-800 text-white font-bold shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          ALL ({projects.length})
        </button>
        <button
          onClick={() => {
            setFilterType('reels');
            playSound(300);
          }}
          className={`px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            filterType === 'reels'
              ? 'bg-red-950/80 text-red-300 font-bold border border-red-900/50 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>📱 REELS ({reels.length})</span>
        </button>
        <button
          onClick={() => {
            setFilterType('videos');
            playSound(300);
          }}
          className={`px-3 py-1 rounded cursor-pointer transition-colors flex items-center gap-1.5 ${
            filterType === 'videos'
              ? 'bg-blue-950/80 text-blue-300 font-bold border border-blue-900/50 shadow-xs'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span>🎬 VIDEOS ({videos.length})</span>
        </button>
      </div>

      {viewMode === 'list' ? (
        // LIST VIEW (Section 21: Thumbnail, Title, Category, Duration, Status, Actions)
        <div
          data-lenis-prevent
          className="max-h-[580px] overflow-y-auto flex flex-col gap-2 border border-zinc-900 bg-zinc-950/20 p-2.5 rounded-xl pr-2.5"
        >
          {displayedProjects.map((p, idx) => {
            const isPublished = p.status !== 'draft';
            const isReel = p.mediaType === 'reel' || p.aspectRatio === '9:16';
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all gap-4 ${
                  isPublished
                    ? 'border-zinc-900/80 bg-zinc-950/40 hover:bg-zinc-900/50'
                    : 'border-zinc-900/40 bg-zinc-950/20 opacity-60'
                }`}
              >
                {/* Thumbnail & Title Info */}
                <div className="flex items-center gap-3 truncate min-w-0">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-850">
                    <img
                      src={
                        p.poster ||
                        p.thumbnail ||
                        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=200'
                      }
                      className="w-full h-full object-cover"
                      alt=""
                    />
                    {p.featured && (
                      <span className="absolute top-0.5 right-0.5 p-0.5 bg-amber-500 rounded text-black shadow">
                        <Star className="w-2.5 h-2.5 fill-black stroke-0" />
                      </span>
                    )}
                  </div>

                  <div className="text-left truncate min-w-0">
                    <div className="flex items-center gap-2 truncate">
                      <p className="text-xs font-sans font-bold text-white truncate">{p.title}</p>
                      
                      {/* Media Mode Badge */}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          isReel
                            ? 'bg-red-950/60 text-red-400 border border-red-900/40'
                            : 'bg-blue-950/60 text-blue-400 border border-blue-900/40'
                        }`}
                      >
                        {isReel ? 'REEL' : 'VIDEO'}
                      </span>

                      {/* Publish Status Badge */}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50'
                            : 'bg-zinc-900 text-zinc-500'
                        }`}
                      >
                        {isPublished ? 'Live' : 'Draft'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 mt-0.5">
                      <span className="uppercase text-zinc-400">{p.niche}</span>
                      <span>·</span>
                      <span className="text-zinc-300 font-semibold">{p.aspectRatio || (isReel ? '9:16' : '16:9')}</span>
                      <span>·</span>
                      <span>Order #{p.order ?? idx + 1}</span>
                      <span>·</span>
                      <span>{p.duration || '0:30'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Block */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Reorder Buttons */}
                  {onReorder && (
                    <div className="flex items-center gap-0.5 mr-1">
                      <button
                        disabled={idx === 0}
                        onClick={() => onReorder(idx, idx - 1)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={idx === projects.length - 1}
                        onClick={() => onReorder(idx, idx + 1)}
                        className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Preview Button */}
                  {onPreview && (
                    <button
                      onClick={() => onPreview(p)}
                      className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                      title="Preview in Viewer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Publish Toggle Button */}
                  {onTogglePublish && (
                    <button
                      onClick={() => onTogglePublish(p.id)}
                      className={`p-1.5 rounded hover:bg-zinc-800 cursor-pointer ${
                        isPublished ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={isPublished ? 'Unpublish to Draft' : 'Publish Live'}
                    >
                      {isPublished ? <CheckCircle className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => onEditInit(p)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-1.5 rounded hover:bg-zinc-800 text-red-400 hover:text-red-300 cursor-pointer"
                    title="Delete Item"
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
        <div
          data-lenis-prevent
          className="max-h-[580px] overflow-y-auto flex flex-col gap-6 border border-zinc-900 bg-zinc-950/20 p-4 rounded-xl"
        >
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Film className="w-3 h-3 text-purple-400" /> {filterType === 'videos' ? 'Landscape Videos (16:9)' : 'Vertical Reels (9:16)'}
              </span>
              <span className="text-[9px] font-mono text-zinc-500">
                {currentSlots.length} Slots Filled
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {slotGridItems.map((p, idx) => {
                const slotNum = idx + 1;
                if (p) {
                  return (
                    <div
                      key={p.id}
                      onClick={() => onEditInit(p)}
                      className="group relative aspect-square rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden cursor-pointer hover:border-purple-500 transition-all flex flex-col items-center justify-center"
                      title={`Slot ${slotNum}: ${p.title}`}
                    >
                      <img
                        src={p.poster || p.thumbnail}
                        className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-1 left-1 bg-black/80 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded leading-none">
                        #{slotNum}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p.id);
                        }}
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
                      onClick={() => {
                        onAddNew();
                        playSound(500);
                      }}
                      className="aspect-square rounded-lg border border-dashed border-zinc-850 hover:border-zinc-700 bg-zinc-950/20 flex flex-col items-center justify-center cursor-pointer transition-colors"
                      title={`Empty Slot #${slotNum} - Click to Add`}
                    >
                      <span className="text-[9px] font-mono text-zinc-600">#{slotNum}</span>
                      <span className="text-xs text-zinc-600 font-bold">+</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
