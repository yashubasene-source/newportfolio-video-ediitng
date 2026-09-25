/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Film,
  Clock,
  User,
  Monitor,
  Palette,
  Volume2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Smartphone,
} from 'lucide-react';
import { Project, ThemeColors } from '../types';
import {
  isYouTube,
  getYouTubeEmbedUrl,
  isVimeo,
  getVimeoEmbedUrl,
  isVideoFile,
  getAutoThumbnail,
} from '../utils/videoUtils';

interface ProjectViewerProps {
  project: Project | null;
  onClose: () => void;
  currentTheme: ThemeColors;
  allProjects?: Project[];
  onSelectRelated?: (project: Project) => void;
  isLiteMode?: boolean;
}

export default function ProjectViewer({
  project,
  onClose,
  currentTheme,
  allProjects = [],
  onSelectRelated,
  isLiteMode = false,
}: ProjectViewerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  // Precise vertical aspect ratio detection
  const isVertical =
    project.aspectRatio === '9:16' ||
    project.mediaType === 'reel' ||
    Boolean(project.link?.includes('/shorts/'));

  // Determine media URL and poster
  const posterUrl =
    project.poster ||
    project.thumbnail ||
    getAutoThumbnail(project.link) ||
    (isVertical
      ? 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=720'
      : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=720');

  const fullVideoSrc = project.fullVideo || project.link;
  const isDirectVideo = isVideoFile(fullVideoSrc) || isVideoFile(project.link);
  const isYT = isYouTube(project.link);
  const isVim = isVimeo(project.link);

  // Filter 3 related projects in the same orientation
  const relatedProjects = allProjects
    .filter((p) => {
      if (p.id === project.id) return false;
      const otherIsVertical =
        p.aspectRatio === '9:16' || p.mediaType === 'reel' || Boolean(p.link?.includes('/shorts/'));
      return otherIsVertical === isVertical;
    })
    .slice(0, 3);

  return (
    <AnimatePresence>
      <div
        id="project-viewer-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={isLiteMode ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={isLiteMode ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className={`w-full rounded-3xl border border-white/10 bg-[#0A0A0F] text-slate-100 overflow-hidden shadow-2xl flex flex-col relative my-auto max-h-[94vh] ${
            isVertical ? 'max-w-4xl' : 'max-w-5xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: currentTheme.accentHex || '#a855f7' }}
              />
              <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase font-bold flex items-center gap-1.5">
                {isVertical ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    VERTICAL REEL (9:16)
                  </>
                ) : (
                  <>
                    <Film className="w-3.5 h-3.5 text-slate-400" />
                    CINEMATIC PROJECT (16:9)
                  </>
                )}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-mono text-slate-400 hidden sm:inline-block">
                {project.niche?.replace('-', ' ') || 'Commercial'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Close project viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 
            =============================================================
            VERTICAL REEL INTERFACE (Dedicated 9:16 layout)
            =============================================================
          */}
          {isVertical ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start justify-center">
              
              {/* Native 9:16 Phone/Reel Stage (Sized specifically for vertical format!) */}
              <div className="w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[380px] shrink-0">
                <div className="w-full aspect-[9/16] max-h-[76vh] rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.8)] relative flex items-center justify-center">
                  {isYT ? (
                    <iframe
                      src={getYouTubeEmbedUrl(project.link)}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={project.title}
                    />
                  ) : isVim ? (
                    <iframe
                      src={getVimeoEmbedUrl(project.link)}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={project.title}
                    />
                  ) : isDirectVideo ? (
                    <video
                      ref={videoRef}
                      src={fullVideoSrc}
                      poster={posterUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <img
                      src={posterUrl}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  )}
                </div>
              </div>

              {/* Vertical Reel Information & Breakdown Column */}
              <div className="flex-1 w-full flex flex-col justify-between gap-5 text-left overflow-y-auto md:max-h-[76vh]">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-[9px] font-mono tracking-wider uppercase font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentTheme.accentHex || '#a855f7' }}
                    >
                      {project.niche?.replace('-', ' ') || 'Reel'}
                    </span>
                    {project.client && (
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                        Client: {project.client}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-mono tracking-wider text-emerald-400 font-bold">
                      9:16 VERTICAL
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-sans font-black text-white leading-tight">
                    {project.title}
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {project.fullDescription || project.description}
                  </p>

                  {/* Production Specifications */}
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5 text-xs">
                    <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase border-b border-white/10 pb-1.5 font-bold">
                      REEL SPECIFICATIONS
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-mono text-[10px]">FORMAT</span>
                        <span className="font-semibold text-white">9:16 Reel / Short</span>
                      </div>
                      {project.duration && (
                        <div>
                          <span className="text-slate-400 block font-mono text-[10px]">DURATION</span>
                          <span className="font-mono text-white">{project.duration}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-400 block font-mono text-[10px]">RESOLUTION</span>
                        <span className="font-mono text-white">{project.resolution || '1080x1920 (FHD)'}</span>
                      </div>
                      {project.frameRate && (
                        <div>
                          <span className="text-slate-400 block font-mono text-[10px]">FRAME RATE</span>
                          <span className="font-mono text-white">{project.frameRate}</span>
                        </div>
                      )}
                      {project.colorGrade && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-mono text-[10px]">COLOR GRADE</span>
                          <span className="text-slate-200">{project.colorGrade}</span>
                        </div>
                      )}
                      {project.audioSpecs && (
                        <div className="col-span-2">
                          <span className="text-slate-400 block font-mono text-[10px]">AUDIO MIX</span>
                          <span className="text-slate-200">{project.audioSpecs}</span>
                        </div>
                      )}
                    </div>

                    {/* Tools */}
                    {project.software && project.software.length > 0 && (
                      <div className="mt-1 pt-2 border-t border-white/10">
                        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block mb-1.5">
                          SOFTWARE APPLIED
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.software.map((tool, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Creative Challenges & Solutions */}
                  {(project.challenges || project.solutions) && (
                    <div className="flex flex-col gap-2 pt-1">
                      {project.challenges && (
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-400 uppercase mb-1">
                            <AlertCircle className="w-3 h-3" /> Creative Challenge
                          </div>
                          <p className="text-slate-400">{project.challenges}</p>
                        </div>
                      )}
                      {project.solutions && (
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-400 uppercase mb-1">
                            <CheckCircle2 className="w-3 h-3" /> Solution Applied
                          </div>
                          <p className="text-slate-400">{project.solutions}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Related Vertical Reels */}
                {relatedProjects.length > 0 && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-2 font-bold">
                      MORE VERTICAL REELS
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {relatedProjects.map((rel) => {
                        const thumb =
                          rel.poster ||
                          rel.thumbnail ||
                          getAutoThumbnail(rel.link) ||
                          'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=300';
                        return (
                          <div
                            key={rel.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectRelated?.(rel)}
                            className="group flex flex-col gap-1 p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer transition-all"
                          >
                            <div className="w-full aspect-[9/16] rounded overflow-hidden bg-black">
                              <img
                                src={thumb}
                                alt={rel.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                loading="lazy"
                              />
                            </div>
                            <span className="font-bold text-[10px] text-white truncate">
                              {rel.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* External Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all hover:border-white/30"
                  >
                    <span>Watch Original Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* 
              =============================================================
              HORIZONTAL CINEMATIC THEATER (Widescreen 16:9 layout)
              =============================================================
            */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col gap-8">
              {/* Main Widescreen 16:9 Video Stage */}
              <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center relative aspect-video">
                {isYT ? (
                  <iframe
                    src={getYouTubeEmbedUrl(project.link)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={project.title}
                  />
                ) : isVim ? (
                  <iframe
                    src={getVimeoEmbedUrl(project.link)}
                    className="w-full h-full border-0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={project.title}
                  />
                ) : isDirectVideo ? (
                  <video
                    ref={videoRef}
                    src={fullVideoSrc}
                    poster={posterUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={posterUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Project Overview & Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                {/* Left Column: Title & Extended Narrative */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-md text-[9px] font-mono tracking-wider uppercase font-bold text-white"
                      style={{ backgroundColor: currentTheme.accentHex || '#E63B2E' }}
                    >
                      {project.niche.replace('-', ' ')}
                    </span>
                    {project.client && (
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono tracking-wider text-slate-300 uppercase">
                        Client: {project.client}
                      </span>
                    )}
                    {project.createdAt && (
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono tracking-wider text-slate-400">
                        {project.createdAt}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-sans font-black text-white">
                    {project.title}
                  </h2>

                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    {project.fullDescription || project.description}
                  </p>

                  {/* Challenges & Solutions Breakdown */}
                  {(project.challenges || project.solutions) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/10">
                      {project.challenges && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase mb-2">
                            <AlertCircle className="w-4 h-4" />
                            Creative Challenge
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {project.challenges}
                          </p>
                        </div>
                      )}
                      {project.solutions && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase mb-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Solution Applied
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {project.solutions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Technical Editorial Specs */}
                <div className="lg:col-span-4 flex flex-col gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase border-b border-white/10 pb-2 font-bold">
                    PRODUCTION METRICS
                  </p>

                  <div className="flex flex-col gap-3 text-xs">
                    {project.role && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <User className="w-3.5 h-3.5" /> ROLE
                        </span>
                        <span className="font-semibold text-white">{project.role}</span>
                      </div>
                    )}

                    {project.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5" /> DURATION
                        </span>
                        <span className="font-mono text-white">{project.duration}</span>
                      </div>
                    )}

                    {project.resolution && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Monitor className="w-3.5 h-3.5" /> RESOLUTION
                        </span>
                        <span className="font-mono text-white">{project.resolution}</span>
                      </div>
                    )}

                    {project.frameRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Film className="w-3.5 h-3.5" /> FRAME RATE
                        </span>
                        <span className="font-mono text-white">{project.frameRate}</span>
                      </div>
                    )}

                    {project.colorGrade && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Palette className="w-3.5 h-3.5" /> COLOR
                        </span>
                        <span className="text-right text-slate-200 line-clamp-1">{project.colorGrade}</span>
                      </div>
                    )}

                    {project.audioSpecs && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5 font-mono text-[11px]">
                          <Volume2 className="w-3.5 h-3.5" /> AUDIO
                        </span>
                        <span className="text-right text-slate-200 line-clamp-1">{project.audioSpecs}</span>
                      </div>
                    )}
                  </div>

                  {/* Software / Tools */}
                  {project.software && project.software.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-white/10">
                      <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block mb-2">
                        TOOLS EMPLOYED
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.software.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Projects Strip */}
              {relatedProjects.length > 0 && (
                <div className="mt-4 pt-6 border-t border-white/10 text-left">
                  <p className="text-[10px] font-mono tracking-[0.2em] text-slate-400 uppercase mb-4 font-bold">
                    RELATED WORK
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedProjects.map((rel) => {
                      const thumb =
                        rel.poster ||
                        rel.thumbnail ||
                        getAutoThumbnail(rel.link) ||
                        'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600';
                      return (
                        <div
                          key={rel.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            if (onSelectRelated) onSelectRelated(rel);
                          }}
                          className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 cursor-pointer transition-all"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0">
                            <img
                              src={thumb}
                              alt={rel.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">
                              {rel.niche.replace('-', ' ')}
                            </span>
                            <span className="font-bold text-xs text-white truncate">
                              {rel.title}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
