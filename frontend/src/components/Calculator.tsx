/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calculator as CalcIcon, Clock, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { ThemeColors } from '../types';

interface CalculatorProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
}

export default function Calculator({ currentTheme, soundEnabled }: CalculatorProps) {
  const [service, setService] = useState('real-estate');
  const [size, setSize] = useState('short');
  const [speed, setSpeed] = useState('normal');
  const [revisions, setRevisions] = useState('two');
  const [totalPrice, setTotalPrice] = useState(2500);
  const [deliveryTime, setDeliveryTime] = useState('2-3 working days');

  const accentColor = currentTheme.accentHex || '#2BEE34';

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

  const services = [
    { id: 'real-estate', name: 'Real Estate Tour', basePrice: 2500 },
    { id: 'ugc-ad', name: 'UGC & Direct Response', basePrice: 1800 },
    { id: 'promotional', name: 'Promotional Commercial', basePrice: 3200 },
    { id: 'educational', name: 'Educational / Talking Head', basePrice: 2000 },
    { id: 'thumbnail', name: 'Thumbnail / Cover Design', basePrice: 500 },
    { id: 'retainer', name: 'Monthly Video Retainer', basePrice: 15000 },
  ];

  useEffect(() => {
    const selectedService = services.find((s) => s.id === service);
    if (!selectedService) return;

    let price = selectedService.basePrice;

    // Size multiplier
    if (service !== 'thumbnail') {
      if (size === 'medium') price *= 1.4;
      if (size === 'long') price *= 1.8;
    }

    // Speed multiplier
    if (speed === 'rush') price *= 1.35;

    // Revisions
    if (revisions === 'unlimited') price += 500;

    setTotalPrice(Math.round(price));

    // Calculate delivery time
    let delivery = '2-3 working days';
    if (speed === 'rush') {
      delivery = '24-48 hours rush';
    } else {
      if (service === 'thumbnail') delivery = '24 hours';
      else if (service === 'retainer') delivery = 'Dedicated Monthly Queue';
      else if (size === 'long') delivery = '4-5 working days';
    }
    setDeliveryTime(delivery);
  }, [service, size, speed, revisions]);

  const getWhatsAppLink = (): string => {
    const selectedServiceName = services.find((s) => s.id === service)?.name || service;
    const sizeName = size === 'short' ? 'Short (<60s)' : size === 'medium' ? 'Medium (1-3m)' : 'Long (3m+)';
    const speedName = speed === 'rush' ? 'Rush (24-48h)' : 'Standard';
    const revName = revisions === 'unlimited' ? 'Unlimited' : '2 Revisions';

    const text = `Hi Anshay! I estimated a video editing project using the Calculator on your portfolio:
    
- Discipline: *${selectedServiceName}*
- Duration Scope: *${sizeName}*
- Turnaround: *${speedName}*
- Revisions: *${revName}*
- Estimated Investment: *₹${totalPrice.toLocaleString('en-IN')}*

Let's discuss getting started!`;

    return `https://wa.me/918319610243?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="pricing-section" className="relative bg-[#141414] py-24 border-b border-white/5 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            ESTIMATE YOUR INVESTMENT
          </p>
          <h2 className="font-impact text-5xl md:text-6xl leading-tight text-white uppercase tracking-wider">
            Instant Cost <span className="font-editorial-script italic font-normal lowercase" style={{ color: accentColor }}>Estimator</span>
          </h2>
          <p className="text-slate-400 text-sm">
            Select your content parameters below for a real-time price breakdown and projected delivery timeline. Transparent estimates, zero surprises.
          </p>
        </div>

        {/* Calculator Card Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Options side (Col-7) */}
          <div className="lg:col-span-7 bg-[#1A1D24] border border-white/10 p-6 md:p-8 rounded-2xl flex flex-col gap-6 text-left shadow-xl">
            
            {/* Group 1: Service selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">1. SELECT DISCIPLINE</label>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setService(s.id);
                      playSound(400);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                      service === s.id
                        ? 'text-black font-bold border'
                        : 'text-slate-300 border border-white/10 bg-white/5 hover:border-white/25 hover:text-white'
                    }`}
                    style={{
                      borderColor: service === s.id ? accentColor : undefined,
                      backgroundColor: service === s.id ? accentColor : undefined,
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: Project Size */}
            {service !== 'thumbnail' && (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">2. VIDEO DURATION / SCOPE</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'short', label: 'Short (<60s)' },
                    { id: 'medium', label: 'Medium (1-3m)' },
                    { id: 'long', label: 'Long (3m+)' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => {
                        setSize(sz.id);
                        playSound(450);
                      }}
                      className={`py-2 px-2 text-center rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                        size === sz.id
                          ? 'text-black font-bold border-transparent'
                          : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      style={{
                        backgroundColor: size === sz.id ? accentColor : undefined,
                      }}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Group 3: Delivery Speed */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">3. TURNAROUND SPEED</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setSpeed('normal');
                    playSound(500);
                  }}
                  className={`py-2 px-3 text-center rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                    speed === 'normal'
                      ? 'text-black font-bold border-transparent'
                      : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: speed === 'normal' ? accentColor : undefined,
                  }}
                >
                  Standard Delivery
                </button>
                <button
                  onClick={() => {
                    setSpeed('rush');
                    playSound(520);
                  }}
                  className={`py-2 px-3 text-center rounded-xl text-xs font-sans transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    speed === 'rush'
                      ? 'text-black font-bold border-transparent'
                      : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: speed === 'rush' ? accentColor : undefined,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rush (+35%)</span>
                </button>
              </div>
            </div>

            {/* Group 4: Revision Scope */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">4. REVISION ROUNDS</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setRevisions('two');
                    playSound(550);
                  }}
                  className={`py-2 px-3 text-center rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                    revisions === 'two'
                      ? 'text-black font-bold border-transparent'
                      : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: revisions === 'two' ? accentColor : undefined,
                  }}
                >
                  2 Polished Rounds
                </button>
                <button
                  onClick={() => {
                    setRevisions('unlimited');
                    playSound(570);
                  }}
                  className={`py-2 px-3 text-center rounded-xl text-xs font-sans transition-all cursor-pointer border ${
                    revisions === 'unlimited'
                      ? 'text-black font-bold border-transparent'
                      : 'text-slate-300 border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: revisions === 'unlimited' ? accentColor : undefined,
                  }}
                >
                  Unlimited (+₹500)
                </button>
              </div>
            </div>

          </div>

          {/* Result Card (Col-5) */}
          <div className="lg:col-span-5 bg-[#171A21] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col justify-between text-left shadow-2xl relative overflow-hidden">
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-20 pointer-events-none"
              style={{ backgroundColor: accentColor }}
            />

            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-white/10 pb-4">
                <CalcIcon className="w-4 h-4" style={{ color: accentColor }} />
                <span>ESTIMATED QUOTE</span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">PROJECT INVESTMENT</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black font-sans text-white">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-mono text-slate-400">INR</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 py-4 border-y border-white/10 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    Est. Delivery
                  </span>
                  <span className="font-bold text-white font-mono">{deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    Commercial License
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">100% Included</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound(800)}
                className="w-full py-3.5 px-4 rounded-xl text-black font-bold font-mono tracking-wider flex items-center justify-center gap-2 uppercase text-xs transition-transform hover:scale-105 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 4px 20px ${currentTheme.glowColor || 'rgba(43,238,52,0.35)'}`,
                }}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Book This Project via WhatsApp</span>
              </a>
              <p className="text-[10px] text-center text-slate-500 mt-2 font-mono">
                Direct WhatsApp discussion with Anshay
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}