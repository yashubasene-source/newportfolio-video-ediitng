/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Grid, Film, Image as ImageIcon, Sparkles, X, Clock, Monitor, Tag, User, Cpu, Layers, Palette, Volume2, Briefcase, Wrench, CheckCircle2, Scissors } from 'lucide-react';
import { Project, ProjectType, NicheType, ThemeColors } from '../types';
import { DEFAULT_PROJECTS } from '../data/defaultProjects';
import { usePerformance } from '../motion/performanceManager';

interface ShowcaseProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  projectsList: Project[];
  onOpenAdmin?: () => void;
}

export default function Showcase({ currentTheme, soundEnabled, projectsList, onOpenAdmin }: ShowcaseProps) {
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reels' | 'videos'>('all');

  const { capabilities, settings } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  const playSound = (freq: number, dur = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  // Convert generic YouTube link to proper embed URL
  const getEmbedUrl = (link: string): string => {
    if (!link) return '';
    let videoId = '';
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = link.match(youtubeRegExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    return link;
  };

  const isYouTube = (link: string): boolean => {
    return /youtube\.com|youtu\.be/i.test(link);
  };

  const isInstagram = (link: string): boolean => {
    return /instagram\.com\/(p|reel|reels|tv)\//i.test(link);
  };

  const getInstagramEmbedUrl = (link: string): string => {
    if (!link) return '';
    const cleanLink = link.split('?')[0].replace(/\/$/, '');
    return `${cleanLink}/embed`;
  };

  const isVideoFile = (link: string): boolean => {
    return /\.(mp4|webm|ogg)/i.test(link) || link.startsWith('http') && !isYouTube(link) && !isInstagram(link) && !/\.(jpg|jpeg|png|webp|gif)/i.test(link);
  };

  // Separate projects into exactly up to 20 Reels (9:16) and 20 Videos (16:9)
  const reels = projectsList.filter((project) => project.aspectRatio === '9:16').slice(0, 20);
  const videos = projectsList.filter((project) => project.aspectRatio !== '9:16').slice(0, 20);

  return (
    <section id="work-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-10">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            PORTFOLIO SHOWCASE
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            Work That Speaks <span style={{ color: currentTheme.accentHex }}>Volumes</span>
          </h2>
          <p className="text-slate-600 text-sm mb-2">
            Cinematic color-graded footage, scroll-stopping reels, and dynamic video edits designed to maximize engagement and watch time.
          </p>
          {onOpenAdmin && (
            <motion.button
              id="cut-to-admin-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onOpenAdmin();
                playSound(900, 0.15);
              }}
              className="px-6 py-3 rounded-xl font-mono text-xs font-black tracking-widest text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:brightness-110"
              style={{
                backgroundColor: currentTheme.accentHex,
                boxShadow: `0 8px 24px ${currentTheme.glowColor}`,
              }}
            >
              <Scissors className="w-3.5 h-3.5 rotate-90" />
              <span>CUT TO: PORTFOLIO MANAGER</span>
            </motion.button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {[
            { id: 'all', name: 'Show All', count: reels.length + videos.length },
            { id: 'reels', name: 'Demo Reels (9:16)', count: reels.length },
            { id: 'videos', name: 'Featured Videos (16:9)', count: videos.length },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id as any);
                  playSound(700, 0.08);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all border cursor-pointer ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'text-slate-500 border-slate-200 bg-white/40 hover:text-slate-900 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: isActive ? currentTheme.accentHex : undefined,
                  boxShadow: isActive ? `0 4px 12px ${currentTheme.glowColor}` : undefined,
                }}
              >
                {tab.name} <span className="opacity-60 ml-1">({tab.count})</span>
              </button>
            );
          })}
        </div>

        {/* CONTAINER 1: DEMO REELS (Vertical 9:16) */}
        {(activeFilter === 'all' || activeFilter === 'reels') && (
        <div id="reels-container-section" className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-200/40 pb-4 text-left">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600">
                  <Film className="w-4 h-4" />
                </span>
                <h3 className="font-sans font-black text-xl md:text-2xl text-slate-900 uppercase tracking-tight">
                  Demo Reels & Shorts
                </h3>
              </div>
              <p className="text-slate-500 text-xs font-sans max-w-xl">
                High-impact, rapid-retention vertical edits optimized for TikTok, Instagram, and YouTube Shorts.
              </p>
            </div>
            <div className="font-mono text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0">
              TIMELINE SYNC: <strong className="text-slate-700">{reels.length} / 20 REELS ACTIVE</strong>
            </div>
          </div>

          <div
            id="reels-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {reels.map((project) => (
                <motion.div
                  key={project.id}
                  layout={isLiteMode ? false : "position"}
                  id={`project-card-${project.id}`}
                  initial={{ opacity: 0, scale: isLiteMode ? 1.0 : settings.scaleOffset }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: isLiteMode ? 1.0 : settings.scaleOffset }}
                  transition={{ duration: settings.duration }}
                  className="group relative rounded-xl glass-card hover:bg-white overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between w-full"
                >
                  {/* Visual Thumbnail */}
                  <div
                    className="relative overflow-hidden bg-black cursor-pointer aspect-[9/16] transition-all duration-300"
                    onClick={() => {
                      setLightboxProject(project);
                      playSound(800, 0.1);
                    }}
                  >
                    <img
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-65 group-hover:opacity-40 transition-opacity" />

                    {/* Format tag badge */}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-[8px] font-mono tracking-widest uppercase text-zinc-400">
                      9:16 REEL
                    </span>

                    {/* Play Indicator overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: currentTheme.accentHex }}
                      >
                        <Play className="w-4 h-4 fill-white stroke-0 ml-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between text-left gap-1.5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400">
                        {project.niche.replace('-', ' ')}
                      </span>
                      <h4 className="font-sans font-bold text-xs text-slate-900 group-hover:text-slate-850 transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-slate-500 text-[10px] line-clamp-2 leading-normal">
                        {project.description}
                      </p>
                    </div>

                    {/* Card spec details foot */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {project.duration || '0:30'}
                      </span>
                      <span className="truncate max-w-[70px]" style={{ color: currentTheme.accentHex }}>
                        {project.software?.[0] || 'Premiere'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {reels.length === 0 && (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
              <Film className="w-6 h-6 text-slate-400 mb-2" />
              <p className="font-mono text-xs text-slate-500">NO REEL ELEMENTS INSERTED YET</p>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    playSound(400);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg text-[10px] font-mono border border-slate-200 hover:border-slate-300 bg-white shadow-sm hover:shadow text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                >
                  + Add Reel via Cut Room
                </button>
              )}
            </div>
          )}
        </div>
        )}

        {/* CONTAINER 2: FEATURED VIDEOS (Horizontal 16:9) */}
        {(activeFilter === 'all' || activeFilter === 'videos') && (
        <div id="videos-container-section">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-200/40 pb-4 text-left">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Play className="w-4 h-4" />
                </span>
                <h3 className="font-sans font-black text-xl md:text-2xl text-slate-900 uppercase tracking-tight">
                  Featured Videos
                </h3>
              </div>
              <p className="text-slate-500 text-xs font-sans max-w-xl">
                Cinematic horizontal narratives, interactive graphics, YouTube vlogs, and standard professional promotions.
              </p>
            </div>
            <div className="font-mono text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0">
              TIMELINE SYNC: <strong className="text-slate-700">{videos.length} / 20 VIDEOS ACTIVE</strong>
            </div>
          </div>

          <div
            id="videos-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {videos.map((project) => (
                <motion.div
                  key={project.id}
                  layout={isLiteMode ? false : "position"}
                  id={`project-card-${project.id}`}
                  initial={{ opacity: 0, scale: isLiteMode ? 1.0 : settings.scaleOffset }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: isLiteMode ? 1.0 : settings.scaleOffset }}
                  transition={{ duration: settings.duration }}
                  className="group relative rounded-xl glass-card hover:bg-white overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between w-full"
                >
                  {/* Visual Thumbnail */}
                  <div
                    className="relative overflow-hidden bg-black cursor-pointer aspect-video transition-all duration-300"
                    onClick={() => {
                      setLightboxProject(project);
                      playSound(800, 0.1);
                    }}
                  >
                    <img
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent opacity-65 group-hover:opacity-40 transition-opacity" />

                    {/* Format tag badge */}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800 text-[8px] font-mono tracking-widest uppercase text-zinc-400">
                      {project.type.toUpperCase()}
                    </span>

                    {/* Play Indicator overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: currentTheme.accentHex }}
                      >
                        <Play className="w-5 h-5 fill-white stroke-0 ml-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* Info Text */}
                  <div className="p-4 flex-1 flex flex-col justify-between text-left gap-3">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
                        {project.niche.replace('-', ' ')}
                      </span>
                      <h4 className="font-sans font-bold text-sm text-slate-900 group-hover:text-slate-850 transition-colors line-clamp-1">
                        {project.title}
                      </h4>
                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Card spec details foot */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {project.duration || '0:45'}
                      </span>
                      <span className="truncate max-w-[130px]" style={{ color: currentTheme.accentHex }}>
                        {project.software?.[0] || 'Adobe Suite'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {videos.length === 0 && (
            <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center">
              <Play className="w-6 h-6 text-slate-400 mb-2" />
              <p className="font-mono text-xs text-slate-500">NO VIDEO ELEMENTS INSERTED YET</p>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    playSound(400);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-lg text-[10px] font-mono border border-slate-200 hover:border-slate-300 bg-white shadow-sm hover:shadow text-slate-600 hover:text-slate-900 transition-all cursor-pointer"
                >
                  + Add Video via Cut Room
                </button>
              )}
            </div>
          )}
        </div>
        )}

      </div>

      {/* Immersive Project Detail Overlay */}
      <AnimatePresence>
        {lightboxProject && (
          <div
            id="lightbox-container"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/98 backdrop-blur-xl overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setLightboxProject(null);
                playSound(300);
              }
            }}
          >
            <motion.div
              initial={isLiteMode ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: settings.yOffset }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={isLiteMode ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: settings.yOffset }}
              transition={{ duration: settings.duration }}
              className="w-full max-w-5xl rounded-2xl border border-zinc-850 bg-[#06060a] overflow-hidden shadow-2xl flex flex-col md:flex-row relative my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                id="lightbox-close-btn"
                onClick={() => {
                  setLightboxProject(null);
                  playSound(300);
                }}
                className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:scale-105 transition-all shadow-md"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Column: Visual Media Display with ambient glow */}
              <div className={`flex-1 bg-black flex items-center justify-center relative p-3 ${
                lightboxProject.aspectRatio === '9:16'
                  ? 'aspect-[9/16] h-[380px] sm:h-[480px] md:h-[620px] max-h-[80vh] md:max-h-none'
                  : 'aspect-video md:aspect-auto md:min-h-[480px]'
              }`}>
                {/* Accent glow in background */}
                <div 
                  className="absolute inset-0 opacity-20 blur-[120px] pointer-events-none transition-all duration-1000"
                  style={{ backgroundColor: currentTheme.accentHex }}
                />

                <div className={`w-full h-full relative flex items-center justify-center ${
                  lightboxProject.aspectRatio === '9:16' ? 'max-w-[320px] mx-auto rounded-xl overflow-hidden border border-zinc-800/40 shadow-2xl bg-zinc-950' : ''
                }`}>
                  {isYouTube(lightboxProject.link) ? (
                    <iframe
                      id="lightbox-iframe-player"
                      src={getEmbedUrl(lightboxProject.link)}
                      className="w-full h-full border-0 absolute inset-0 rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={lightboxProject.title}
                    />
                  ) : isInstagram(lightboxProject.link) ? (
                    <div className="w-full h-full absolute inset-0 overflow-hidden rounded-lg bg-zinc-950 flex flex-col items-center justify-center p-6 text-center gap-4 border border-zinc-850">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                      </div>
                      <div className="flex flex-col gap-1.5 max-w-xs">
                        <h4 className="text-white font-bold text-sm">Instagram Reel / Video</h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Instagram embeds are restricted. You can watch this video directly on Instagram!
                        </p>
                      </div>
                      <a
                        href={lightboxProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-xl font-bold font-mono text-[9px] tracking-widest text-white transition-all bg-gradient-to-r from-yellow-500 via-red-500 to-purple-600 hover:brightness-110 shadow-md cursor-pointer uppercase"
                      >
                        Watch on Instagram ↗
                      </a>
                    </div>
                  ) : isVideoFile(lightboxProject.link) ? (
                    <video
                      id="lightbox-native-player"
                      src={lightboxProject.link}
                      controls
                      autoPlay
                      className={`w-full h-full absolute inset-0 rounded-lg ${
                        lightboxProject.aspectRatio === '9:16' ? 'object-cover' : 'object-contain'
                      }`}
                    />
                  ) : (
                    <img
                      id="lightbox-image-preview"
                      src={lightboxProject.link}
                      alt={lightboxProject.title}
                      className="w-full h-full object-contain p-2 absolute inset-0 rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Elaborate Specifications & Advanced Metadata */}
              <div className="w-full md:w-[420px] border-t md:border-t-0 md:border-l border-zinc-850/80 p-6 md:p-8 flex flex-col gap-6 text-left bg-[#09090e]/80 overflow-y-auto max-h-[85vh] md:max-h-[620px]">
                {/* Category Header */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 rounded text-[8px] font-mono tracking-widest text-white font-black uppercase"
                      style={{ backgroundColor: currentTheme.accentHex }}
                    >
                      {lightboxProject.niche.replace('-', ' ')}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      {lightboxProject.type} format
                    </span>
                  </div>
                  
                  <h3 className="font-sans font-black text-xl text-white leading-tight">
                    {lightboxProject.title}
                  </h3>
                </div>

                {/* Extended Narrative Story or Description */}
                <div className="flex flex-col gap-1.5 border-t border-zinc-900 pt-4">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    EDITORIAL STORY / PROFILE
                  </span>
                  <p className="text-zinc-350 text-xs leading-relaxed font-sans">
                    {lightboxProject.fullDescription || lightboxProject.description}
                  </p>
                </div>

                {/* Advanced Specifications List */}
                <div className="flex flex-col gap-3 border-t border-zinc-900 pt-4">
                  <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                    TECHNICAL PRODUCTION PROFILE
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                    <div className="flex items-start gap-2 text-zinc-400">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Client / Creator</span>
                        <span className="text-zinc-200 font-medium truncate max-w-[150px]">{lightboxProject.client || 'Independent Production'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Timeline Duration</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.duration || '0:45'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-400">
                      <User className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Assigned Role</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.role || 'Lead Editor'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-400">
                      <Monitor className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Resolution Profiling</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.resolution || '1080p Web Standard'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-400">
                      <Cpu className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Frame Rate</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.frameRate || '24 FPS Cinematic'}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-zinc-400">
                      <Palette className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Color Grade LUT</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.colorGrade || 'Rec.709 Space'}</span>
                      </div>
                    </div>
                  </div>

                  {lightboxProject.audioSpecs && (
                    <div className="flex items-start gap-2 text-zinc-400 text-[11px] font-mono border-t border-zinc-900/50 pt-3 mt-1">
                      <Volume2 className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-[8px] text-zinc-600 uppercase tracking-wider">Audio Engineering Specs</span>
                        <span className="text-zinc-200 font-medium">{lightboxProject.audioSpecs}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Behind The Scenes: Challenges and Solutions */}
                {(lightboxProject.challenges || lightboxProject.solutions) && (
                  <div className="flex flex-col gap-3 border-t border-zinc-900 pt-4">
                    <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                      BEHIND THE TIMELINE
                    </span>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {lightboxProject.challenges && (
                        <div className="p-3 rounded-lg border border-amber-950/30 bg-amber-950/10 flex flex-col gap-1 text-left">
                          <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] tracking-wider uppercase font-semibold">
                            <Wrench className="w-3 h-3" />
                            <span>Creative Challenge</span>
                          </div>
                          <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                            {lightboxProject.challenges}
                          </p>
                        </div>
                      )}

                      {lightboxProject.solutions && (
                        <div className="p-3 rounded-lg border border-emerald-950/30 bg-emerald-950/10 flex flex-col gap-1 text-left">
                          <div className="flex items-center gap-1.5 text-emerald-500 font-mono text-[9px] tracking-wider uppercase font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Professional Solution</span>
                          </div>
                          <p className="text-zinc-300 text-xs leading-relaxed font-sans">
                            {lightboxProject.solutions}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Software engines utilized */}
                {lightboxProject.software && lightboxProject.software.length > 0 && (
                  <div className="border-t border-zinc-900 pt-4 mt-auto">
                    <p className="text-[8px] font-mono text-zinc-600 tracking-widest uppercase mb-2">ENGINES & TOOLS</p>
                    <div className="flex flex-wrap gap-1">
                      {lightboxProject.software.map((sw) => (
                        <span
                          key={sw}
                          className="px-2 py-0.5 rounded text-[8px] font-mono text-zinc-300 border border-zinc-800 bg-zinc-900/60"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
