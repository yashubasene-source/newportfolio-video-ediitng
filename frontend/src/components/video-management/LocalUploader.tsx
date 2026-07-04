import React, { useState } from 'react';
import { Upload, Copy, Check } from 'lucide-react';
import { ThemeColors } from '../../types';

interface LocalUploaderProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  playSound: (freq: number, dur?: number) => void;
  onApplyUrl: (url: string) => void;
}

export default function LocalUploader({
  currentTheme,
  soundEnabled,
  playSound,
  onApplyUrl,
}: LocalUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [uploadType, setUploadType] = useState<'video' | 'reel'>('video');

  const handleLocalUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    setUploadingFile(true);
    setUploadProgress(15);
    playSound(500);

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      setUploadProgress(45);
      // Pass uploadType as query parameter to store it in /uploads/videos or /uploads/reels
      const res = await fetch(`/api/upload-video?uploadType=${uploadType}`, {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(85);
      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setUploadedUrl(data.url);
      setUploadProgress(100);
      playSound(880, 0.25);
    } catch (err: any) {
      console.error(err);
      alert('Upload failed: ' + err.message);
      setUploadProgress(0);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + uploadedUrl);
    setCopiedLink(true);
    playSound(950);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto text-left flex flex-col gap-6">
      <div>
        <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">SERVER STORAGE</p>
        <h3 className="font-sans font-black text-xl text-white mt-1">Direct Media Uploader</h3>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Upload videos or vertical reels directly to host storage.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 flex flex-col items-center justify-center text-center gap-5">
        <Upload className="w-8 h-8 text-zinc-500" />
        
        {/* Upload Category Selector */}
        <div className="flex flex-col gap-2 w-full text-left">
          <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Save Location (Folder)</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { setUploadType('video'); playSound(300); }}
              className={`py-2 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                uploadType === 'video'
                  ? 'border-white bg-white/5 text-white'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              🎥 /uploads/videos/
            </button>
            <button
              type="button"
              onClick={() => { setUploadType('reel'); playSound(300); }}
              className={`py-2 rounded-lg text-xs font-bold font-mono border transition-all cursor-pointer ${
                uploadType === 'reel'
                  ? 'border-white bg-white/5 text-white'
                  : 'border-zinc-800 bg-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              📱 /uploads/reels/
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full mt-2">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="text-xs text-zinc-400 file:mr-4 file:py-1.5 file:px-3.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-zinc-300 hover:file:bg-zinc-800 cursor-pointer w-full"
          />
          <span className="text-[10px] text-zinc-500">Max file size: 100MB</span>
        </div>

        {selectedFile && (
          <div className="text-xs text-zinc-300 font-mono">
            Selected: <strong className="text-white">{selectedFile.name}</strong> ({Math.round(selectedFile.size / 1024 / 1024)}MB)
          </div>
        )}

        <button
          onClick={handleLocalUpload}
          disabled={!selectedFile || uploadingFile}
          className="w-full py-2.5 rounded-lg font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:brightness-110"
          style={{ backgroundColor: currentTheme.accentHex }}
        >
          <Upload className="w-3.5 h-3.5" />
          {uploadingFile ? 'UPLOADING...' : 'START UPLOAD'}
        </button>

        {uploadProgress > 0 && (
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="h-full transition-all duration-300" style={{ width: `${uploadProgress}%`, backgroundColor: currentTheme.accentHex }} />
          </div>
        )}
      </div>

      {uploadedUrl && (
        <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/80 flex flex-col gap-3 font-mono text-xs text-left">
          <div className="flex flex-col gap-1">
            <span className="text-emerald-500 font-bold">✓ Upload Complete!</span>
            <span className="text-zinc-400 text-[10px]">Server File Path:</span>
            <div className="p-2 rounded bg-zinc-900 border border-zinc-850 text-white truncate break-all select-all flex items-center justify-between">
              <span className="truncate pr-4">{uploadedUrl}</span>
              <button
                onClick={handleCopyLink}
                className="p-1 rounded bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <button
            onClick={() => onApplyUrl(uploadedUrl)}
            className="py-2 rounded font-bold border hover:bg-white/5 cursor-pointer text-zinc-200 transition-all w-full"
            style={{ borderColor: currentTheme.accentHex }}
          >
            ➕ APPLY AS PROJECT LINK
          </button>
        </div>
      )}
    </div>
  );
}
