/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sliders, Sparkles, Video, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { ThemeColors } from '../types';

interface BeforeAfterProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  progressions: any[];
}

export default function BeforeAfter({
  currentTheme,
  soundEnabled,
  progressions,
}: BeforeAfterProps) {
  const [activeNiche, setActiveNiche] = useState<string>('');
  
  // Set default active category niche
  useEffect(() => {
    if (progressions.length > 0 && !activeNiche) {
      setActiveNiche(progressions[0].niche);
    }
  }, [progressions]);

  // Find currently active category
  const activeProg = progressions.find(p => p.niche === activeNiche) || progressions[0];

  // YouTube API states
  const [apiReady, setApiReady] = useState(false);
  const player1Ref = useRef<any>(null); // Raw
  const player2Ref = useRef<any>(null); // Edit
  const player3Ref = useRef<any>(null); // SFX + Color
  const player4Ref = useRef<any>(null); // Final

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // sound helper
  const playSound = (freq: number, dur = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  };

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Load YouTube Player API script
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setApiReady(true);
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const prevCallback = (window as any).onYouTubeIframeAPIReady;
    (window as any).onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      setApiReady(true);
    };
  }, []);

  // Initialize 4 Synced YouTube Players
  useEffect(() => {
    if (!apiReady || !activeProg) return;

    const rawId = getYouTubeId(activeProg.rawVideo);
    const editId = getYouTubeId(activeProg.editVideo);
    const sfxColorId = getYouTubeId(activeProg.sfxColorVideo);
    const finalId = getYouTubeId(activeProg.finalVideo);

    // Reset playback states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    const destroyPlayers = () => {
      try {
        if (player1Ref.current && typeof player1Ref.current.destroy === 'function') player1Ref.current.destroy();
        if (player2Ref.current && typeof player2Ref.current.destroy === 'function') player2Ref.current.destroy();
        if (player3Ref.current && typeof player3Ref.current.destroy === 'function') player3Ref.current.destroy();
        if (player4Ref.current && typeof player4Ref.current.destroy === 'function') player4Ref.current.destroy();
      } catch (e) {}
      player1Ref.current = null;
      player2Ref.current = null;
      player3Ref.current = null;
      player4Ref.current = null;
    };

    const initPlayers = () => {
      destroyPlayers();
      
      try {
        const commonVars = {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          mute: 1, // Start all muted
          playsinline: 1,
        };

        // Player 1: Raw (Muted, acts as Master Timeline)
        if (rawId) {
          player1Ref.current = new (window as any).YT.Player('raw-player', {
            videoId: rawId,
            playerVars: commonVars,
            events: {
              onReady: () => {
                const dur = player1Ref.current.getDuration();
                if (dur) setDuration(dur);
              },
              onStateChange: (event: any) => {
                const YTState = (window as any).YT.PlayerState;
                if (event.data === YTState.PLAYING) {
                  setIsPlaying(true);
                  const dur = player1Ref.current.getDuration();
                  setDuration(dur);
                } else if (event.data === YTState.PAUSED || event.data === YTState.ENDED) {
                  setIsPlaying(false);
                }
              },
            },
          });
        }

        // Player 2: Edit (Muted)
        if (editId) {
          player2Ref.current = new (window as any).YT.Player('edit-player', {
            videoId: editId,
            playerVars: commonVars,
          });
        }

        // Player 3: SFX + Color (Muted)
        if (sfxColorId) {
          player3Ref.current = new (window as any).YT.Player('sfx-player', {
            videoId: sfxColorId,
            playerVars: commonVars,
          });
        }

        // Player 4: Final (Audio output)
        if (finalId) {
          player4Ref.current = new (window as any).YT.Player('final-player', {
            videoId: finalId,
            playerVars: {
              ...commonVars,
              mute: isMuted ? 1 : 0, // Follow main mute state
            },
          });
        }
      } catch (e) {
        console.error('Failed to create YouTube Players:', e);
      }
    };

    const timeout = setTimeout(initPlayers, 150);

    return () => {
      clearTimeout(timeout);
      destroyPlayers();
    };
  }, [apiReady, activeNiche, activeProg]);

  // Sync Loop
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (player1Ref.current && typeof player1Ref.current.getCurrentTime === 'function') {
          const t1 = player1Ref.current.getCurrentTime();
          setCurrentTime(t1);

          // Force sync other players if they drift by >0.3 seconds
          [player2Ref, player3Ref, player4Ref].forEach(ref => {
            if (ref.current && typeof ref.current.getCurrentTime === 'function' && typeof ref.current.seekTo === 'function') {
              const t = ref.current.getCurrentTime();
              if (Math.abs(t1 - t) > 0.3) {
                ref.current.seekTo(t1, true);
              }
            }
          });
        }
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Sync Playback Controls
  const handlePlayPause = () => {
    playSound(600);
    const refs = [player1Ref, player2Ref, player3Ref, player4Ref];
    
    try {
      if (isPlaying) {
        refs.forEach(ref => ref.current && typeof ref.current.pauseVideo === 'function' && ref.current.pauseVideo());
        setIsPlaying(false);
      } else {
        refs.forEach(ref => ref.current && typeof ref.current.playVideo === 'function' && ref.current.playVideo());
        setIsPlaying(true);
      }
    } catch (e) {}
  };

  const handleSeek = (time: number) => {
    const refs = [player1Ref, player2Ref, player3Ref, player4Ref];
    try {
      refs.forEach(ref => ref.current && typeof ref.current.seekTo === 'function' && ref.current.seekTo(time, true));
      setCurrentTime(time);
    } catch (e) {}
  };

  const handleToggleMute = () => {
    if (!player4Ref.current) return;
    playSound(700);

    try {
      if (isMuted) {
        player4Ref.current.unMute();
        setIsMuted(false);
      } else {
        player4Ref.current.mute();
        setIsMuted(true);
      }
    } catch (e) {}
  };

  return (
    <section id="transformations-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden">
      
      {/* 
        Inject player styling to:
        1. Crop standard 16:9 YouTube video aspect ratios so they fill a vertical 9:16 card ratio
        2. Zoom in by 115% and crop out the top YouTube titles and bottom watermarks
        3. Prevent cursor clicks directly inside the iframe to keep layout locked
      */}
      <style dangerouslySetInnerHTML={{__html: `
        .vertical-video-wrapper iframe {
          width: 320% !important;
          height: 115% !important;
          position: absolute !important;
          top: -7.5% !important;
          left: -110% !important;
          pointer-events: none !important;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            Editing Pipeline Progression
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            The Cinematic <span style={{ color: currentTheme.accentHex }}>Transformation</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Inspect the step-by-step video compilation stages. Play them side-by-side to watch the draft turn into a cinematic masterpiece.
          </p>
        </div>

        {/* Tab Toggle / Categories */}
        {progressions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 max-w-4xl mx-auto">
            {progressions.map((prog) => (
              <button
                key={prog.id}
                onClick={() => {
                  setActiveNiche(prog.niche);
                  playSound(400 + (prog.label?.charCodeAt(0) || 0) * 2);
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono tracking-wider border transition-all cursor-pointer uppercase ${
                  activeNiche === prog.niche
                    ? 'text-white border-transparent shadow-md'
                    : 'text-slate-500 border-slate-200 hover:text-slate-900 hover:bg-slate-50 bg-white/50'
                }`}
                style={{
                  backgroundColor: activeNiche === prog.niche ? currentTheme.accentHex : undefined,
                }}
              >
                {prog.label}
              </button>
            ))}
          </div>
        )}

        {/* Sync Progression grid */}
        {activeProg ? (
          <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            
            {/* 4-Step Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Step 1: Raw */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">1. Raw</span>
                <div className="vertical-video-wrapper w-full aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200/60 shadow-xl bg-zinc-950 relative">
                  {getYouTubeId(activeProg.rawVideo) ? (
                    <div id="raw-player" className="w-full h-full absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-mono text-[9px] text-zinc-500">
                      NO VIDEO SET
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Edit */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">2. Edit</span>
                <div className="vertical-video-wrapper w-full aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200/60 shadow-xl bg-zinc-950 relative">
                  {getYouTubeId(activeProg.editVideo) ? (
                    <div id="edit-player" className="w-full h-full absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-mono text-[9px] text-zinc-500">
                      NO VIDEO SET
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: SFX + Color */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">3. sfx + color</span>
                <div className="vertical-video-wrapper w-full aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200/60 shadow-xl bg-zinc-950 relative">
                  {getYouTubeId(activeProg.sfxColorVideo) ? (
                    <div id="sfx-player" className="w-full h-full absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-mono text-[9px] text-zinc-500">
                      NO VIDEO SET
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Final */}
              <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1">
                  4. final
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                </span>
                <div className="vertical-video-wrapper w-full aspect-[9/16] rounded-2xl overflow-hidden border-2 shadow-xl bg-zinc-950 relative transition-colors duration-500" style={{ borderColor: currentTheme.accentHex }}>
                  {getYouTubeId(activeProg.finalVideo) ? (
                    <div id="final-player" className="w-full h-full absolute inset-0" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center font-mono text-[9px] text-zinc-500">
                      NO VIDEO SET
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Consolidated Playback Control Panel */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-white font-mono text-xs shadow-2xl">
              
              <button 
                onClick={handlePlayPause}
                className="w-full sm:w-auto px-5 py-2.5 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black stroke-0" /> : <Play className="w-3.5 h-3.5 fill-black stroke-0" />}
                {isPlaying ? 'PAUSE PIPELINE' : 'PLAY PIPELINE'}
              </button>

              <div className="flex-1 w-full flex items-center gap-3">
                <span className="text-[10px] text-zinc-500">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: currentTheme.accentHex }}
                />
                <span className="text-[10px] text-zinc-500">{formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-[9px] text-zinc-500 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  Timecode: {formatTime(currentTime)}
                </div>

                <button
                  onClick={handleToggleMute}
                  className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 transition-colors cursor-pointer text-zinc-400 hover:text-white flex-shrink-0"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>
        ) : (
          <div className="text-center font-mono text-zinc-500 text-xs py-12">
            NO SYNC PIPELINES CONFIGURABLE.
          </div>
        )}

      </div>
    </section>
  );
}
