/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Play, Sparkles } from 'lucide-react';
import { Project, ThemeColors } from '../../types';
import { isVideoFile, getAutoThumbnail, isYouTube, getYouTubeId } from '../../utils/videoUtils';

interface CurvedGalleryCardProps {
  key?: React.Key;
  project: Project;
  relativeIndex: number;
  isActive: number | boolean;
  isFocused?: boolean;
  transformStyle?: {
    translateX: number;
    translateZ: number;
    rotateY: number;
    scale: number;
    opacity: number;
    zIndex: number;
  };
  currentTheme: ThemeColors;
  mediaMode?: 'reels' | 'videos';
  isLiteMode: boolean;
  isTouch: boolean;
  onSelectActive: (project: Project) => void;
  onNavigateTo: () => void;
  cardRef?: React.Ref<HTMLDivElement>;
  isConveyor?: boolean;
  allowVideoPreview?: boolean;
}

export default function CurvedGalleryCard({
  project,
  relativeIndex,
  isActive,
  isFocused = false,
  transformStyle,
  currentTheme,
  mediaMode,
  isLiteMode,
  isTouch,
  onSelectActive,
  onNavigateTo,
  cardRef,
  isConveyor = false,
  allowVideoPreview = true,
}: CurvedGalleryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isCenter = relativeIndex === 0;

  // Determine poster thumbnail
  const posterUrl =
    project.poster ||
    project.thumbnail ||
    getAutoThumbnail(project.link) ||
    (project.aspectRatio === '9:16'
      ? 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=720'
      : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=720');

  // Video preview candidate: previewVideo or direct mp4/webm link
  const previewSource =
    project.previewVideo ||
    (isVideoFile(project.link) ? project.link : null);

  const ytId = !previewSource && isYouTube(project.link) ? getYouTubeId(project.link) : null;
  const canPlayPreview = isCenter && allowVideoPreview && Boolean(previewSource) && !videoFailed && !isLiteMode;
  const canPlayYTPreview = isCenter && allowVideoPreview && Boolean(ytId) && !videoFailed && !isLiteMode;

  // Autoplay/pause video based on center active state (Step 14)
  useEffect(() => {
    if (!videoRef.current) return;

    if (canPlayPreview) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented or aborted (browser policy or low battery)
          setVideoFailed(true);
        });
      }
    } else {
      videoRef.current.pause();
      try {
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
  }, [canPlayPreview]);

  // Adjust transform for side card hover and focus mode (Step 07 & Step 18)
  let translateX = transformStyle?.translateX ?? 0;
  let translateZ = transformStyle?.translateZ ?? 0;
  let rotateY = transformStyle?.rotateY ?? 0;
  let scale = transformStyle?.scale ?? 1;
  let opacity = transformStyle?.opacity ?? 1;
  let zIndex = transformStyle?.zIndex ?? 1;

  if (isFocused) {
    if (isCenter) {
      scale = 1.15;
      translateZ = 160;
      zIndex = 60;
    } else {
      opacity = 0.12;
      scale *= 0.72;
      translateZ -= 140;
    }
  } else if (isHovered && !isCenter && !isTouch) {
    scale *= 1.04;
    rotateY *= 0.65;
    translateZ += 24;
    zIndex += 10;
  }

  const handleCardClick = () => {
    if (isCenter) {
      onSelectActive(project);
    } else {
      // Clicking a side card navigates the carousel to that project
      onNavigateTo();
    }
  };

  const isVertical = mediaMode ? mediaMode === 'reels' : (project.mediaType === 'reel' || project.aspectRatio === '9:16');

  return (
    <div
      role="button"
      tabIndex={isCenter ? 0 : -1}
      ref={cardRef}
      aria-label={`${project.title} (${isCenter ? 'Active project, click to open details' : 'Click to view in center'})`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => !isTouch && setIsHovered(false)}
      style={{
        transform: isConveyor
          ? undefined
          : `translate3d(calc(-50% + ${translateX}px), -50%, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity: isConveyor ? undefined : opacity,
        zIndex: isConveyor ? undefined : zIndex,
        transition: isConveyor
          ? 'filter 400ms ease'
          : 'transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1100ms cubic-bezier(0.22, 1, 0.36, 1), filter 400ms ease',
        willChange: 'transform, opacity',
      }}
      className={`absolute top-1/2 left-1/2 cursor-pointer select-none focus:outline-none ${
        isCenter ? 'group' : 'hover:brightness-105'
      }`}
    >
      {/* 3D Card Shell */}
      <div
        className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-950 transition-all duration-500 border ${
          isCenter
            ? 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] border-white/25 ring-1 ring-white/10'
            : 'shadow-[0_15px_35px_-10px_rgba(0,0,0,0.4)] border-black/10'
        } ${
          isVertical
            ? 'w-[230px] sm:w-[270px] md:w-[310px] lg:w-[340px] aspect-[9/16]'
            : 'w-[320px] sm:w-[400px] md:w-[480px] lg:w-[540px] aspect-video'
        }`}
      >
        {/* Media Container */}
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          
          {/* Poster Image (Always rendered first for instant zero-latency visual) */}
          <img
            src={posterUrl}
            alt={project.title}
            loading={isCenter ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              isCenter && videoLoaded && canPlayPreview ? 'opacity-0' : 'opacity-100'
            } ${isCenter ? 'group-hover:scale-105' : ''}`}
          />

          {/* Active Center Video Preview (Plays muted loop preview) */}
          {canPlayPreview && (
            <video
              ref={videoRef}
              src={previewSource!}
              autoPlay
              muted
              playsInline
              loop
              preload="metadata"
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setVideoFailed(true)}
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => {});
                }
              }}
              className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-500 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Active Center YouTube Loop Preview (Muted & continuous looping) */}
          {canPlayYTPreview && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`}
              title={project.title}
              allow="autoplay; encrypted-media"
              className="absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-500"
              style={{ transform: 'scale(1.05)' }}
            />
          )}

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Center Subtle Play Button Cue */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
              isCenter
                ? 'opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100'
                : isHovered
                ? 'opacity-80 scale-100'
                : 'opacity-0 scale-90'
            }`}
          >
            <span
              className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl backdrop-blur-md transition-transform duration-300"
              style={{ backgroundColor: currentTheme.accentHex || '#E63B2E' }}
            >
              <Play className="w-5 h-5 fill-white stroke-0 ml-0.5" />
            </span>
          </div>

          {/* Top Format Pill Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest uppercase text-white/90">
              {isVertical ? '9:16 REEL' : '16:9 VIDEO'}
            </span>
          </div>

          {/* Bottom Card Title Banner (when not centered) */}
          {!isCenter && (
            <div className="absolute bottom-0 inset-x-0 p-3.5 text-left z-10 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent">
              <span className="text-[8px] font-mono uppercase tracking-wider text-slate-300 block line-clamp-1">
                {project.niche.replace('-', ' ')}
              </span>
              <p className="font-sans font-bold text-xs text-white truncate">
                {project.title}
              </p>
            </div>
          )}

          {/* Active Accent Border Line */}
          {isCenter && (
            <div
              className="absolute inset-0 border-2 rounded-2xl md:rounded-3xl pointer-events-none transition-colors duration-500"
              style={{ borderColor: currentTheme.accentHex || '#E63B2E' }}
            />
          )}

        </div>
      </div>
    </div>
  );
}
