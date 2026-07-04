import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeColors } from '../../types';

interface AiAutofillProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  playSound: (freq: number, dur?: number) => void;
  geminiApiKey: string;
  onAutofillComplete: (data: any, link: string) => void;
}

export default function AiAutofill({
  currentTheme,
  soundEnabled,
  playSound,
  geminiApiKey,
  onAutofillComplete,
}: AiAutofillProps) {
  const [aiLink, setAiLink] = useState('');
  const [aiCaption, setAiCaption] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIAutofill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiLink) {
      alert('Please paste a video or reel link first!');
      return;
    }
    setAiLoading(true);
    playSound(450);

    try {
      const res = await fetch('/api/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          link: aiLink,
          captionText: aiCaption,
          customApiKey: geminiApiKey,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to auto-fill details');
      }

      const data = await res.json();
      playSound(900, 0.2);
      alert('✨ AI successfully extracted and filled all details! Reviewing form...');
      onAutofillComplete(data, aiLink);
    } catch (err: any) {
      console.error(err);
      alert('AI Autofill Failed: ' + err.message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto text-left flex flex-col gap-6">
      <div>
        <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">Gemini integration</p>
        <h3 className="font-sans font-black text-xl text-white mt-1">Instant AI Autofill</h3>
        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
          Provide a YouTube or social video link with its caption description. Gemini will extract tags, software, specs, and details automatically.
        </p>
      </div>

      <form onSubmit={handleAIAutofill} className="flex flex-col gap-5 text-xs font-mono">
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500">Video Link / URL *</label>
          <input
            type="text"
            required
            placeholder="e.g., https://www.youtube.com/watch?v=..."
            value={aiLink}
            onChange={(e) => setAiLink(e.target.value)}
            className="px-3.5 py-3 rounded-lg bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-500 flex justify-between">
            <span>Video Caption or Description (Optional)</span>
            <span className="text-[10px] text-zinc-600">Improves metadata accuracy</span>
          </label>
          <textarea
            rows={4}
            placeholder="Paste description texts or copy-paste post captions here..."
            value={aiCaption}
            onChange={(e) => setAiCaption(e.target.value)}
            className="px-3.5 py-3 rounded-lg bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={aiLoading}
          className="py-3.5 rounded-xl font-bold font-mono tracking-wider text-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all hover:brightness-110"
          style={{ backgroundColor: currentTheme.accentHex }}
        >
          <Sparkles className="w-4 h-4 fill-black stroke-0 animate-spin" style={{ animationDuration: '4s' }} />
          {aiLoading ? 'ANALYZING VIDEO CONTENT...' : 'RUN AI AUTOFILL'}
        </button>
      </form>
    </div>
  );
}
