import React from 'react';
import { RotateCcw, Download, Edit3, Trash2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectListProps {
  projects: Project[];
  onEditInit: (project: Project) => void;
  onDelete: (id: string) => void;
  onResetDefaults: () => void;
  onExport: () => void;
  playSound: (freq: number, dur?: number) => void;
}

export default function ProjectList({
  projects,
  onEditInit,
  onDelete,
  onResetDefaults,
  onExport,
  playSound,
}: ProjectListProps) {
  return (
    <div className="lg:col-span-7 flex flex-col gap-5 text-left">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">ACTIVE SHOWCASE</p>
          <h3 className="font-sans font-black text-sm text-white mt-0.5">Manage Items ({projects.length})</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <button
            onClick={() => { onResetDefaults(); playSound(400); }}
            className="px-2 py-1 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
          <button
            onClick={onExport}
            className="px-2 py-1 rounded bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3" /> Backup
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto flex flex-col gap-2 border border-zinc-900 bg-zinc-950/20 p-2 rounded-xl pr-2.5">
        {projects.map((p) => (
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
                <p className="text-xs font-sans font-bold text-white truncate">{p.title}</p>
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
        ))}

        {projects.length === 0 && (
          <p className="text-zinc-500 font-mono text-xs text-center py-12">
            NO ACTIVE PROJECTS. CLICK RESET TO LOAD DEFAULTS.
          </p>
        )}
      </div>
    </div>
  );
}
