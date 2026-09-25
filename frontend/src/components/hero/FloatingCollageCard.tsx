/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Project, ThemeColors } from '../../types';
import { isVideoFile, getAutoThumbnail } from '../../utils/videoUtils';

interface FloatingCollageCardProps {
  key?: React.Key;
  project: Project;
  baseRotation: number;
  scale: number;
  zIndex: number;
  floatClass: string;
  isLiteMode: boolean;
  isTouch: boolean;
  currentTheme: ThemeColors;
  onClick: (project: Project) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingCollageCard({
  project,
  baseRotation,
  scale,
  zIndex,
  floatClass,
  isLiteMode,
  isTouch,
  currentTheme,
  onClick,
  className = '',
  style = {},
}: FloatingCollageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Determine poster thumbnail
  const posterUrl =
    project.poster ||
    project.thumbnail ||
    getAutoThumbnail(project.link) ||
    (project.aspectRatio === '9:16'
      ? 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600'
      : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600');

  // Candidate video for hover preview: previewVideo or direct mp4/webm link
  const previewSource =
    project.previewVideo ||
    (isVideoFile(project.link) ? project.link : null);

  const canPreviewVideo = Boolean(previewSource) && !isLiteMode && !isTouch;

  const handleMouseEnter = () => {
    if (isTouch) return;
    setIsHovered(true);
    if (canPreviewVideo && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay muted preview rejected or aborted, silently keep poster
      });
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

  // Hover transform: scale 1 -> 1.035, rotation toward neutral, translateY 0 -> -6px
  const currentRotation = isHovered ? baseRotation * 0.35 : baseRotation;
  const currentScale = isHovered ? scale * 1.035 : scale;
  const currentTranslateY = isHovered ? -6 : 0;

  return (
    <div
      style={{
        zIndex: isHovered ? 50 : zIndex,
        ...style,
      }}
      className={`relative select-none ${className}`}
    >
      {/* Outer wrapper applying float idle animation */}
      <div className={isLiteMode ? '' : floatClass}>
        {/* Inner container applying rotation, scale and hover transform */}
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
          style={{
            transform: `translate3d(0, ${currentTranslateY}px, 0) rotate(${currentRotation}deg) scale(${currentScale})`,
            transition: 'transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 380ms ease',
            willChange: 'transform',
          }}
          className={`group relative block cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden bg-white shadow-xl hover:shadow-2xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-slate-900 ${
            project.aspectRatio === '9:16'
              ? 'w-[150px] sm:w-[170px] md:w-[200px] lg:w-[220px] aspect-[9/14]'
              : 'w-[170px] sm:w-[200px] md:w-[240px] lg:w-[260px] aspect-[4/5]'
          }`}
        >
          {/* Card Media Container */}
          <div className="relative w-full h-full bg-slate-950 overflow-hidden">
            {/* Poster Image (Always rendered first) */}
            <img
              src={posterUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                videoLoaded && isHovered ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
              }`}
            />

            {/* Hover Video Preview (Desktop, non-lite only) */}
            {canPreviewVideo && previewSource && (
              <video
                ref={videoRef}
                src={previewSource}
                muted
                playsInline
                loop
                preload="none"
                onLoadedData={() => setVideoLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                  videoLoaded && isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

            {/* Minimal Badge / Tag (top left) */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-white/90">
                {project.aspectRatio === '9:16' ? 'REEL' : project.type.toUpperCase()}
              </span>
            </div>

            {/* Play Indicator on Hover (Center) */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <span
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform duration-300"
                style={{ backgroundColor: currentTheme.accentHex || '#E63B2E' }}
              >
                <Play className="w-4 h-4 fill-white stroke-0 ml-0.5" />
              </span>
            </div>

            {/* Card Information (Bottom) */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 text-left z-10 pointer-events-none">
              <p className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-slate-300 line-clamp-1">
                {project.client || project.niche.replace('-', ' ')}
              </p>
              <h4 className="font-sans font-bold text-xs sm:text-sm text-white line-clamp-1 leading-snug">
                {project.title}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
