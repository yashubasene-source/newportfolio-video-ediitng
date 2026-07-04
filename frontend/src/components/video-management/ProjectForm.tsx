import React, { useState } from 'react';
import { ProjectType, NicheType, ThemeColors } from '../../types';

interface ProjectFormProps {
  editingId: string | null;
  title: string;
  setTitle: (val: string) => void;
  link: string;
  setLink: (val: string) => void;
  type: ProjectType;
  setType: (val: ProjectType) => void;
  niche: NicheType;
  setNiche: (val: NicheType) => void;
  aspectRatio: '9:16' | '16:9';
  setAspectRatio: (val: '9:16' | '16:9') => void;
  description: string;
  setDescription: (val: string) => void;
  thumbnail: string;
  setThumbnail: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  software: string;
  setSoftware: (val: string) => void;
  client: string;
  setClient: (val: string) => void;
  resolution: string;
  setResolution: (val: string) => void;
  frameRate: string;
  setFrameRate: (val: string) => void;
  colorGrade: string;
  setColorGrade: (val: string) => void;
  audioSpecs: string;
  setAudioSpecs: (val: string) => void;
  challenges: string;
  setChallenges: (val: string) => void;
  solutions: string;
  setSolutions: (val: string) => void;
  fullDescription: string;
  setFullDescription: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  currentTheme: ThemeColors;
  playSound: (freq: number, dur?: number) => void;
  slotNumber?: number;
}

export default function ProjectForm({
  editingId,
  title,
  setTitle,
  link,
  setLink,
  type,
  setType,
  niche,
  setNiche,
  aspectRatio,
  setAspectRatio,
  description,
  setDescription,
  thumbnail,
  setThumbnail,
  duration,
  setDuration,
  role,
  setRole,
  software,
  setSoftware,
  client,
  setClient,
  resolution,
  setResolution,
  frameRate,
  setFrameRate,
  colorGrade,
  setColorGrade,
  audioSpecs,
  setAudioSpecs,
  challenges,
  setChallenges,
  solutions,
  setSolutions,
  fullDescription,
  setFullDescription,
  onSubmit,
  onCancel,
  currentTheme,
  playSound,
  slotNumber,
}: ProjectFormProps) {
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);

  const handleLinkBlur = async (urlVal: string) => {
    if (!urlVal) return;

    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = urlVal.match(youtubeRegExp);

    if (match && match[2].length === 11) {
      setIsFetchingYoutube(true);
      playSound(450, 0.1);
      try {
        const response = await fetch(`/api/youtube-details?url=${encodeURIComponent(urlVal)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.aspectRatio) setAspectRatio(data.aspectRatio);
          if (data.thumbnail) setThumbnail(data.thumbnail);
          if (data.type) setType(data.type);
          playSound(880, 0.2);
        }
      } catch (err) {
        console.error("Auto YouTube fetch failed:", err);
      } finally {
        setIsFetchingYoutube(false);
      }
    }
  };

  return (
    <div className="lg:col-span-5 flex flex-col gap-5 border-b lg:border-b-0 lg:border-r border-zinc-900 pb-8 lg:pb-0 lg:pr-8">
      <div>
        <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">PROJECT EDITOR</p>
        <h3 className="font-sans font-black text-sm text-white mt-0.5">
          {editingId 
            ? `Edit Project - Slot #${slotNumber || '?'}` 
            : `Add New Clip (Will be Slot #1)`}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 text-[11px] font-mono text-left">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Project Title (Required)</label>
          <input
            type="text"
            required
            placeholder="e.g. Real Estate Cinematic Walkthrough"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Video Link */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-zinc-500">Video Link / Embed URL (Required)</label>
            {isFetchingYoutube && (
              <span className="text-[9px] text-zinc-400 animate-pulse font-mono flex items-center gap-1">
                ⚡ AUTO-FETCHING YOUTUBE DETAILS...
              </span>
            )}
          </div>
          <input
            type="text"
            required
            placeholder="Youtube, Instagram, or local /uploads/... path"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={(e) => handleLinkBlur(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Niche, Type, Aspect Ratio Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Format</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="px-1.5 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="video">Video</option>
              <option value="graphic">Graphic</option>
              <option value="motion">Motion</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="px-1.5 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="normal-edit">Normal Edit</option>
              <option value="typography">Typography</option>
              <option value="motion">Motion Design</option>
              <option value="fun-edit">Fun Edit</option>
              <option value="daily-edit">Daily Vlog</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as '9:16' | '16:9')}
              className="px-1.5 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="16:9">16:9 Horizontal</option>
              <option value="9:16">9:16 Vertical</option>
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Short Description (Required)</label>
          <textarea
            required
            rows={2}
            placeholder="A quick 1-sentence teaser..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none resize-none font-sans"
          />
        </div>

        {/* Thumbnail URL */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Thumbnail URL (Optional)</label>
          <input
            type="text"
            placeholder="Leave empty for dynamic defaults"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Specs Row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Duration</label>
            <input
              type="text"
              placeholder="e.g. 0:45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Role</label>
            <input
              type="text"
              placeholder="e.g. Lead Editor"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Engines */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Software Used (Comma-separated)</label>
          <input
            type="text"
            placeholder="e.g. Premiere Pro, After Effects"
            value={software}
            onChange={(e) => setSoftware(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Advanced Specs section */}
        <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2.5">
          <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest block">ADVANCED FIELDS</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px]"
            />
            <input
              type="text"
              placeholder="Resolution (e.g. 1080p)"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Frame Rate"
              value={frameRate}
              onChange={(e) => setFrameRate(e.target.value)}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px]"
            />
            <input
              type="text"
              placeholder="Color LUT"
              value={colorGrade}
              onChange={(e) => setColorGrade(e.target.value)}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px]"
            />
            <input
              type="text"
              placeholder="Audio Specs"
              value={audioSpecs}
              onChange={(e) => setAudioSpecs(e.target.value)}
              className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px]"
            />
          </div>

          <textarea
            rows={2}
            placeholder="Extended story description..."
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px] resize-none font-sans"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <textarea
              rows={1.5}
              placeholder="Creative challenge..."
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="px-2 py-1 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px] resize-none font-sans"
            />
            <textarea
              rows={1.5}
              placeholder="Professional solution..."
              value={solutions}
              onChange={(e) => setSolutions(e.target.value)}
              className="px-2 py-1 rounded bg-zinc-950 border border-zinc-900 text-white text-[10px] resize-none font-sans"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded font-bold text-black cursor-pointer transition-all hover:brightness-115"
            style={{ backgroundColor: currentTheme.accentHex }}
          >
            {editingId ? 'SAVE CHANGES' : 'INJECT PROJECT'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { onCancel(); playSound(300); }}
              className="px-3 py-2.5 rounded border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
