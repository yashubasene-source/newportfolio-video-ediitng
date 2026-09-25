/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Play, Clock, Film } from 'lucide-react';
import { Project, ThemeColors } from '../types';
import { isVideoFile, getAutoThumbnail } from '../utils/videoUtils';

interface ProjectCardProps {
  key?: React.Key;
  project: Project;
  currentTheme: ThemeColors;
  onClick: (project: Project) => void;
  isLiteMode?: boolean;
  isTouch?: boolean;
}

export default function ProjectCard({
  project,
  currentTheme,
  onClick,
  isLiteMode = false,
  isTouch = false,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const posterUrl =
    project.poster ||
    project.thumbnail ||
    getAutoThumbnail(project.link) ||
    (project.aspectRatio === '9:16'
      ? 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600'
      : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600');

  const previewSource =
    project.previewVideo ||
    (isVideoFile(project.link) ? project.link : null);

  const canPreview = Boolean(previewSource) && !isLiteMode && !isTouch;

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
    if (canPreview && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  };

  const isVertical = project.aspectRatio === '9:16';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(project);
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-slate-900"
    >
      {/* Media Window */}
      <div
        className={`relative w-full bg-slate-950 overflow-hidden ${
          isVertical ? 'aspect-[9/16]' : 'aspect-video'
        }`}
      >
        {/* Poster Image */}
        <img
          src={posterUrl}
          alt={project.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            videoLoaded && isHovered ? 'opacity-0' : 'opacity-95'
          }`}
        />

        {/* Video Preview on Desktop Hover */}
        {canPreview && previewSource && (
          <video
            ref={videoRef}
            src={previewSource}
            muted
            playsInline
            loop
            preload="none"
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              videoLoaded && isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Bottom Shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Aspect Ratio / Format Tag */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[9px] font-mono tracking-widest uppercase text-white/90">
          {isVertical ? '9:16 REEL' : project.type.toUpperCase()}
        </span>

        {/* Play Icon on Hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span
            className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
            style={{ backgroundColor: currentTheme.accentHex || '#E63B2E' }}
          >
            <Play className="w-4 h-4 fill-white stroke-0 ml-0.5" />
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-wider text-slate-400">
            <span>{project.niche.replace('-', ' ')}</span>
            {project.client && <span className="text-slate-500 font-semibold">{project.client}</span>}
          </div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-slate-900 group-hover:text-black transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {project.shortDescription || project.description}
          </p>
        </div>

        {/* Bottom Metadata strip */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.duration || '0:30'}
          </span>
          <span className="font-medium" style={{ color: currentTheme.accentHex || '#E63B2E' }}>
            {project.software?.[0] || 'Adobe Suite'}
          </span>
        </div>
      </div>
    </div>
  );
}
