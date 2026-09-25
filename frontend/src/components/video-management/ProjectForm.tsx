/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ProjectType, NicheType, ThemeColors } from '../../types';
import { isCloudinary, getCloudinaryPosterUrl } from '../../utils/videoUtils';
import MediaUploader from './MediaUploader';

interface ProjectFormProps {
  editingId: string | null;
  title: string;
  setTitle: (val: string) => void;
  slug: string;
  setSlug: (val: string) => void;
  link: string;
  setLink: (val: string) => void;
  type: ProjectType;
  setType: (val: ProjectType) => void;
  mediaType: 'reel' | 'video';
  setMediaType: (val: 'reel' | 'video') => void;
  niche: NicheType;
  setNiche: (val: NicheType) => void;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  setAspectRatio: (val: any) => void;
  description: string;
  setDescription: (val: string) => void;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  thumbnail: string;
  setThumbnail: (val: string) => void;
  previewVideo: string;
  setPreviewVideo: (val: string) => void;
  fullVideo: string;
  setFullVideo: (val: string) => void;
  duration: string;
  setDuration: (val: string) => void;
  role: string;
  setRole: (val: string) => void;
  software: string;
  setSoftware: (val: string) => void;
  client: string;
  setClient: (val: string) => void;
  createdAt: string;
  setCreatedAt: (val: string) => void;
  featured: boolean;
  setFeatured: (val: boolean) => void;
  order: number;
  setOrder: (val: number) => void;
  tags: string;
  setTags: (val: string) => void;
  status: 'draft' | 'published';
  setStatus: (val: 'draft' | 'published') => void;
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
  slug,
  setSlug,
  link,
  setLink,
  type,
  setType,
  mediaType,
  setMediaType,
  niche,
  setNiche,
  aspectRatio,
  setAspectRatio,
  description,
  setDescription,
  shortDescription,
  setShortDescription,
  thumbnail,
  setThumbnail,
  previewVideo,
  setPreviewVideo,
  fullVideo,
  setFullVideo,
  duration,
  setDuration,
  role,
  setRole,
  software,
  setSoftware,
  client,
  setClient,
  createdAt,
  setCreatedAt,
  featured,
  setFeatured,
  order,
  setOrder,
  tags,
  setTags,
  status,
  setStatus,
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

    if (isCloudinary(urlVal)) {
      setType('video');
      const isVertical = /reel|reels|short|shorts|vertical|9_16|9-16/i.test(urlVal);
      if (isVertical) {
        setAspectRatio('9:16');
      }
      const poster = getCloudinaryPosterUrl(urlVal, 1);
      if (poster && !thumbnail) {
        setThumbnail(poster);
      }
      playSound(880, 0.2);
      return;
    }

    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = urlVal.match(youtubeRegExp);

    if (/instagram\.com\/(p|reel|reels|tv)\//i.test(urlVal)) {
      setAspectRatio(/reel|reels\//i.test(urlVal) ? '9:16' : '16:9');
      if (!thumbnail) {
        setThumbnail('https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200');
      }
      return;
    }

    if (match && match[2].length === 11) {
      setIsFetchingYoutube(true);
      playSound(450, 0.1);
      try {
        const response = await fetch(`/api/youtube-details?url=${encodeURIComponent(urlVal)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.title && !title) setTitle(data.title);
          if (data.description && !description) setDescription(data.description);
          if (data.aspectRatio) setAspectRatio(data.aspectRatio);
          if (data.thumbnail && !thumbnail) setThumbnail(data.thumbnail);
          if (data.type) setType(data.type);
          playSound(880, 0.2);
        }
      } catch (err) {
        console.error('Auto YouTube fetch failed:', err);
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
          {editingId ? `Edit Project - ${title || 'Selected'}` : `Add New Showcase Item`}
        </h3>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 text-[11px] font-mono text-left">
        
        {/* Title & Slug */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Project Title (Required)</label>
            <input
              type="text"
              required
              placeholder="e.g. Commercial Reel 2026"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }
              }}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Slug</label>
            <input
              type="text"
              placeholder="e.g. commercial-reel-2026"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Media Uploader Component (Section 17, 18, 19) */}
        <MediaUploader
          currentTheme={currentTheme}
          poster={thumbnail}
          setPoster={setThumbnail}
          previewVideo={previewVideo}
          setPreviewVideo={setPreviewVideo}
          fullVideo={fullVideo || (link.startsWith('/uploads') ? link : '')}
          setFullVideo={(url) => {
            setFullVideo(url);
            if (!link || link.startsWith('/uploads')) setLink(url);
          }}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          setDuration={setDuration}
          setResolution={setResolution}
          playSound={playSound}
        />

        {/* Primary Link / External Embed */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label className="text-zinc-500">Project URL / Embed Fallback (Required)</label>
            {isFetchingYoutube && (
              <span className="text-[9px] text-zinc-400 animate-pulse font-mono flex items-center gap-1">
                ⚡ AUTO-FETCHING YOUTUBE DETAILS...
              </span>
            )}
          </div>
          <input
            type="text"
            required
            placeholder="YouTube, Vimeo, Cloudinary, or uploaded file URL"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={(e) => handleLinkBlur(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Status & Featured Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Publish Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Featured</label>
            <select
              value={featured ? 'yes' : 'no'}
              onChange={(e) => setFeatured(e.target.value === 'yes')}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="no">No</option>
              <option value="yes">Yes (Hero Pin)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Order / Rank</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
        </div>

        {/* Media Mode Classification (Strict Reels vs Videos) */}
        <div className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              Showcase Media Classification (Required)
            </label>
            <span className="text-[9px] font-mono text-zinc-400">
              {mediaType === 'reel' ? 'Strictly Vertical (9:16)' : 'Strictly Landscape (16:9)'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMediaType('reel');
                setAspectRatio('9:16');
                playSound(650);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                mediaType === 'reel'
                  ? 'bg-red-500/20 border-red-500 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span>📱 REEL</span>
              <span className="text-[9px] opacity-75">(9:16 Vertical)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMediaType('video');
                setAspectRatio('16:9');
                playSound(650);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 border cursor-pointer transition-all ${
                mediaType === 'video'
                  ? 'bg-blue-500/20 border-blue-500 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <span>🎬 VIDEO</span>
              <span className="text-[9px] opacity-75">(16:9 Landscape)</span>
            </button>
          </div>

          {/* Validation Warnings */}
          {mediaType === 'reel' && aspectRatio !== '9:16' && (
            <div className="mt-1 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans flex items-start gap-1.5">
              <span>⚠️</span>
              <span>
                <strong>Warning:</strong> This media appears to be landscape ({aspectRatio}). Reels should normally use vertical 9:16 media.
              </span>
            </div>
          )}

          {mediaType === 'video' && aspectRatio === '9:16' && (
            <div className="mt-1 p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans flex items-start gap-1.5">
              <span>⚠️</span>
              <span>
                <strong>Warning:</strong> This media appears to be vertical (9:16). Video mode expects landscape media.
              </span>
            </div>
          )}
        </div>

        {/* Niche, Type, Aspect Ratio Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Format</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="video">Video</option>
              <option value="motion">Motion</option>
              <option value="graphic">Graphic</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheType)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="normal-edit">Normal Edit</option>
              <option value="typography">Typography</option>
              <option value="motion">Motion Design</option>
              <option value="daily-edit">Daily Edit</option>
              <option value="fun-edit">Fun Edit</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            >
              <option value="9:16">9:16 Vertical Reel</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="1:1">1:1 Square</option>
              <option value="4:5">4:5 Portrait</option>
            </select>
          </div>
        </div>

        {/* Client, Year, Duration Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Client / Creator</label>
            <input
              type="text"
              placeholder="e.g. YouTube Creator"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Year</label>
            <input
              type="text"
              placeholder="2026"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Duration</label>
            <input
              type="text"
              placeholder="0:45"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Short Summary (Card Preview)</label>
          <input
            type="text"
            placeholder="One-liner hook summarizing this project"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Full Description / Editorial Story</label>
          <textarea
            required
            rows={2}
            placeholder="Detailed narrative or breakdown of the editing pacing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700 resize-none"
          />
        </div>

        {/* Role & Software */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Your Role</label>
            <input
              type="text"
              placeholder="Lead Editor, Colorist"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Tools / Software (comma separated)</label>
            <input
              type="text"
              placeholder="Premiere Pro, After Effects, DaVinci"
              value={software}
              onChange={(e) => setSoftware(e.target.value)}
              className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500">Tags (comma separated)</label>
          <input
            type="text"
            placeholder="cinematic, sports, sound-design, retention"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
          />
        </div>

        {/* Technical Specs: Resolution, Frame Rate, Color Grade, Audio */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Resolution</label>
            <input
              type="text"
              placeholder="4K UHD (3840x2160)"
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500">Frame Rate</label>
            <input
              type="text"
              placeholder="24 FPS"
              value={frameRate}
              onChange={(e) => setFrameRate(e.target.value)}
              className="px-2 py-2 rounded bg-zinc-950 border border-zinc-900 text-white outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2">
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg text-black font-bold font-mono transition-all cursor-pointer hover:brightness-110 shadow-lg text-xs"
            style={{ backgroundColor: currentTheme.accentHex || '#E63B2E' }}
          >
            {editingId ? 'UPDATE PROJECT' : 'SAVE & PUBLISH ITEM'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
