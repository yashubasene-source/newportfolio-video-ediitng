/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, Film, Image as ImageIcon, CheckCircle2, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { ThemeColors } from '../../types';

interface MediaUploaderProps {
  currentTheme: ThemeColors;
  poster: string;
  setPoster: (url: string) => void;
  previewVideo: string;
  setPreviewVideo: (url: string) => void;
  fullVideo: string;
  setFullVideo: (url: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: any) => void;
  setDuration?: (dur: string) => void;
  setResolution?: (res: string) => void;
  playSound?: (freq: number) => void;
}

export default function MediaUploader({
  currentTheme,
  poster,
  setPoster,
  previewVideo,
  setPreviewVideo,
  fullVideo,
  setFullVideo,
  aspectRatio,
  setAspectRatio,
  setDuration,
  setResolution,
  playSound,
}: MediaUploaderProps) {
  const [activeTab, setActiveTab] = useState<'poster' | 'preview' | 'full'>('full');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedInfo, setExtractedInfo] = useState<string>('');

  const posterInputRef = useRef<HTMLInputElement | null>(null);
  const previewInputRef = useRef<HTMLInputElement | null>(null);
  const fullVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Client-side automatic metadata extraction and poster frame generation
  const inspectVideoFile = (file: File): Promise<{
    durationStr: string;
    width: number;
    height: number;
    aspectRatioStr: '9:16' | '16:9' | '1:1' | '4:5';
    posterBlobUrl: string | null;
  }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      video.onloadedmetadata = () => {
        const durSec = Math.round(video.duration || 0);
        const mins = Math.floor(durSec / 60);
        const secs = durSec % 60;
        const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;
        const ratio = width / height;

        let calculatedRatio: '9:16' | '16:9' | '1:1' | '4:5' = '16:9';
        if (ratio < 0.65) calculatedRatio = '9:16';
        else if (ratio >= 0.65 && ratio < 0.9) calculatedRatio = '4:5';
        else if (ratio >= 0.9 && ratio <= 1.1) calculatedRatio = '1:1';
        else calculatedRatio = '16:9';

        // Seek to 1 second to capture poster frame
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        let posterBlobUrl: string | null = null;
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            posterBlobUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch (e) {
          // Canvas capture might fail if tainted, safe fallback
        }

        const durSec = Math.round(video.duration || 0);
        const mins = Math.floor(durSec / 60);
        const secs = durSec % 60;
        const durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;
        const ratio = width / height;
        let calculatedRatio: '9:16' | '16:9' | '1:1' | '4:5' = '16:9';
        if (ratio < 0.65) calculatedRatio = '9:16';
        else if (ratio >= 0.65 && ratio < 0.9) calculatedRatio = '4:5';
        else if (ratio >= 0.9 && ratio <= 1.1) calculatedRatio = '1:1';

        URL.revokeObjectURL(objectUrl);
        resolve({
          durationStr,
          width,
          height,
          aspectRatioStr: calculatedRatio,
          posterBlobUrl,
        });
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          durationStr: '0:30',
          width: 1920,
          height: 1080,
          aspectRatioStr: '16:9',
          posterBlobUrl: null,
        });
      };
    });
  };

  const handleUploadFile = async (
    file: File,
    type: 'poster' | 'preview' | 'full'
  ) => {
    setErrorMsg('');
    setUploading(true);
    setProgress(20);
    if (playSound) playSound(500);

    try {
      // If it is a video file, extract metadata automatically
      if (file.type.startsWith('video/')) {
        const metadata = await inspectVideoFile(file);
        setAspectRatio(metadata.aspectRatioStr);
        if (setDuration) setDuration(metadata.durationStr);
        if (setResolution) setResolution(`${metadata.width}x${metadata.height}`);
        setExtractedInfo(
          `Detected: ${metadata.width}x${metadata.height} (${metadata.aspectRatioStr}), ${metadata.durationStr}`
        );

        // If poster is empty and we captured a client-side frame, apply it as initial poster
        if (!poster && metadata.posterBlobUrl) {
          setPoster(metadata.posterBlobUrl);
        }
      }

      setProgress(40);
      const formData = new FormData();
      formData.append('file', file);

      const uploadFolder = type === 'poster' ? 'poster' : type === 'preview' ? 'preview' : 'video';
      const res = await fetch(`/api/upload-media?uploadType=${uploadFolder}`, {
        method: 'POST',
        body: formData,
      });

      setProgress(85);
      if (!res.ok) {
        throw new Error('Upload server rejected file');
      }

      const data = await res.json();
      const url = data.url;

      if (type === 'poster') {
        setPoster(url);
      } else if (type === 'preview') {
        setPreviewVideo(url);
      } else if (type === 'full') {
        setFullVideo(url);
      }

      setProgress(100);
      if (playSound) playSound(850);
      setTimeout(() => setProgress(0), 1200);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'File upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-zinc-950/40 border border-zinc-800 text-left">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
          PROJECT MEDIA STORAGE & ASSETS
        </span>
        {extractedInfo && (
          <span className="text-[9px] font-mono text-emerald-400 truncate max-w-[260px]">
            {extractedInfo}
          </span>
        )}
      </div>

      {/* Media Type Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('full')}
          className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'full'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Full Video</span>
          {fullVideo && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'preview'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Preview Video</span>
          {previewVideo && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('poster')}
          className={`py-2 px-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'poster'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'bg-zinc-900/60 text-zinc-500 hover:text-zinc-300 border border-transparent'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Poster Image</span>
          {poster && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
        </button>
      </div>

      {/* Active Tab Content Panel */}
      <div className="p-3.5 rounded-xl border border-zinc-850 bg-zinc-900/30 flex flex-col gap-3">
        {activeTab === 'full' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300">High-Resolution / Main Video</span>
              {fullVideo && (
                <button
                  type="button"
                  onClick={() => setFullVideo('')}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px]"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            {fullVideo ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <Film className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono text-zinc-300 truncate flex-1">{fullVideo}</span>
                <button
                  type="button"
                  onClick={() => fullVideoInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-white"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onClick={() => fullVideoInputRef.current?.click()}
                className="py-5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl bg-zinc-950/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-zinc-500 mb-1" />
                <p className="text-xs font-mono text-zinc-400 font-semibold">Click to upload Full Video</p>
                <p className="text-[10px] text-zinc-600 font-mono">MP4, WebM, MOV (Max 200MB)</p>
              </div>
            )}
            <input
              ref={fullVideoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file, 'full');
              }}
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300">Lightweight Hover Preview (Compressed MP4/WebM)</span>
              {previewVideo && (
                <button
                  type="button"
                  onClick={() => setPreviewVideo('')}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px]"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            {previewVideo ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <Film className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-mono text-zinc-300 truncate flex-1">{previewVideo}</span>
                <button
                  type="button"
                  onClick={() => previewInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-white"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onClick={() => previewInputRef.current?.click()}
                className="py-5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl bg-zinc-950/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-6 h-6 text-zinc-500 mb-1" />
                <p className="text-xs font-mono text-zinc-400 font-semibold">Click to upload Hover Preview</p>
                <p className="text-[10px] text-zinc-600 font-mono">Compressed video for desktop card hover (Max 30MB)</p>
              </div>
            )}
            <input
              ref={previewInputRef}
              type="file"
              accept="video/mp4,video/webm"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file, 'preview');
              }}
            />
          </div>
        )}

        {activeTab === 'poster' && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300">Poster Frame / Thumbnail</span>
              {poster && (
                <button
                  type="button"
                  onClick={() => setPoster('')}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px]"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
            {poster ? (
              <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                <img src={poster} alt="Poster" className="w-12 h-12 object-cover rounded shrink-0 border border-zinc-800" />
                <span className="text-xs font-mono text-zinc-300 truncate flex-1">{poster}</span>
                <button
                  type="button"
                  onClick={() => posterInputRef.current?.click()}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-white"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div
                onClick={() => posterInputRef.current?.click()}
                className="py-5 border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl bg-zinc-950/40 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <ImageIcon className="w-6 h-6 text-zinc-500 mb-1" />
                <p className="text-xs font-mono text-zinc-400 font-semibold">Click to upload Poster Image</p>
                <p className="text-[10px] text-zinc-600 font-mono">WebP, PNG, JPG (Poster-first rendering)</p>
              </div>
            )}
            <input
              ref={posterInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadFile(file, 'poster');
              }}
            />
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="w-full flex flex-col gap-1 mt-1">
            <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[9px] font-mono text-zinc-400 self-end">
              Uploading... {progress}%
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
