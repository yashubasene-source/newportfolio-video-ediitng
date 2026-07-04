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
  const [service, setService] = useState('short-reel');
  const [size, setSize] = useState('short');
  const [speed, setSpeed] = useState('normal');
  const [revisions, setRevisions] = useState('two');
  const [totalPrice, setTotalPrice] = useState(1200);
  const [deliveryTime, setDeliveryTime] = useState('3-5 working days');

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
    { id: 'short-reel', name: 'Short Reel', basePrice: 1200 },
    { id: 'typography-reel', name: 'Typography Reel', basePrice: 700 },
    { id: 'longform-video', name: 'Long-Form Video', basePrice: 3500 },
    { id: 'documentary', name: 'Documentary', basePrice: 6000 },
    { id: 'thumbnail', name: 'Thumbnail Design', basePrice: 400 },
    { id: 'logo-design', name: 'Logo Design', basePrice: 1500 },
    { id: 'brand-identity', name: 'Brand Identity', basePrice: 4500 },
  ];

  useEffect(() => {
    // Pricing calculation logic
    const selectedService = services.find((s) => s.id === service);
    if (!selectedService) return;

    let price = selectedService.basePrice;

    // Apply size multiplier (only applies to video-based types)
    const isVideoType = ['short-reel', 'typography-reel', 'longform-video', 'documentary'].includes(service);
    if (isVideoType) {
      if (size === 'medium') price *= 1.3;
      if (size === 'long') price *= 1.7;
    }

    // Apply speed surcharge
    if (speed === 'rush') {
      price *= 1.5;
    }

    // Apply revision fee
    if (revisions === 'unlimited') {
      price += 800;
    }

    setTotalPrice(Math.round(price));

    // Calculate delivery estimate
    let delivery = '3-5 working days';
    if (speed === 'rush') {
      delivery = ['thumbnail', 'typography-reel'].includes(service) ? 'Same day (24 hours)' : '24-48 hours (Rush)';
    } else {
      if (['thumbnail', 'typography-reel'].includes(service)) {
        delivery = '1-2 working days';
      } else if (service === 'documentary' || service === 'brand-identity') {
        delivery = '5-7 working days';
      }
    }
    setDeliveryTime(delivery);
  }, [service, size, speed, revisions]);

  // Handle WhatsApp message compilation
  const getWhatsAppLink = (): string => {
    const selectedServiceName = services.find((s) => s.id === service)?.name || service;
    const sizeName = size === 'short' ? 'Short' : size === 'medium' ? 'Medium' : 'Long';
    const speedName = speed === 'rush' ? 'Rush (24-48h)' : 'Standard';
    const revName = revisions === 'unlimited' ? 'Unlimited' : '2 Revisions';

    const text = `Hi Anshay! I estimated a project using the Pricing Calculator on your portfolio:
    
- Service: *${selectedServiceName}*
- Project Size: *${sizeName}*
- Turnaround: *${speedName}*
- Revisions: *${revName}*
- Estimated Investment: *₹${totalPrice.toLocaleString('en-IN')}*

I'd like to discuss starting this project with you!`;

    return `https://wa.me/918319610243?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="pricing-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4 max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
            ESTIMATE YOUR INVESTMENT
          </p>
          <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
            Instant Cost <span style={{ color: currentTheme.accentHex }}>Estimator</span>
          </h2>
          <p className="text-slate-600 text-sm">
            Select your content parameters below to review a real-time price breakdown and projected delivery window. Transparent project estimates, zero surprises.
          </p>
        </div>

        {/* Calculator Card Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* Options side (Col-7) */}
          <div className="lg:col-span-7 glass-card p-6 md:p-8 rounded-2xl flex flex-col gap-6 text-left shadow-md">
            
            {/* Group 1: Service selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">1. WHAT SERVICE DO YOU NEED?</label>
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
                        ? 'text-slate-900 font-bold border'
                        : 'text-slate-500 border border-slate-200 bg-white/50 hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: service === s.id ? currentTheme.accentHex : undefined,
                      backgroundColor: service === s.id ? `${currentTheme.accentHex}10` : undefined,
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 2: Project Size (Only show for videos) */}
            {['short-reel', 'typography-reel', 'longform-video', 'documentary'].includes(service) && (
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
                <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">2. VIDEO SIZE / TIMELINE DURATION</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'short', name: 'Short (< 5 min)' },
                    { id: 'medium', name: 'Medium (5–15 min)' },
                    { id: 'long', name: 'Long (> 15 min)' },
                  ].map((sz) => (
                    <button
                      key={sz.id}
                      onClick={() => {
                        setSize(sz.id);
                        playSound(420);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                        size === sz.id
                          ? 'text-slate-900 font-bold border'
                          : 'text-slate-500 border border-slate-200 bg-white/50 hover:border-slate-300'
                      }`}
                      style={{
                        borderColor: size === sz.id ? currentTheme.accentHex : undefined,
                        backgroundColor: size === sz.id ? `${currentTheme.accentHex}10` : undefined,
                      }}
                    >
                      {sz.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Group 3: Speed option */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">3. DELIVERY PACE SPEED</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'normal', name: 'Standard (Flexible)' },
                  { id: 'rush', name: 'Rush Speed (24-48h) +50%' },
                ].map((spd) => (
                  <button
                    key={spd.id}
                    onClick={() => {
                      setSpeed(spd.id);
                      playSound(450);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      speed === spd.id
                        ? 'text-slate-900 font-bold border'
                        : 'text-slate-500 border border-slate-200 bg-white/50 hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: speed === spd.id ? currentTheme.accentHex : undefined,
                      backgroundColor: speed === spd.id ? `${currentTheme.accentHex}10` : undefined,
                    }}
                  >
                    {spd.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Group 4: Revisions */}
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <label className="text-xs font-mono tracking-widest text-slate-400 uppercase">4. COLLABORATION REVISIONS</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'two', name: '2 Review Rounds (Included)' },
                  { id: 'unlimited', name: 'Unlimited Revisions (+₹800)' },
                ].map((rev) => (
                  <button
                    key={rev.id}
                    onClick={() => {
                      setRevisions(rev.id);
                      playSound(480);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      revisions === rev.id
                        ? 'text-slate-900 font-bold border'
                        : 'text-slate-500 border border-slate-200 bg-white/50 hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: revisions === rev.id ? currentTheme.accentHex : undefined,
                      backgroundColor: revisions === rev.id ? `${currentTheme.accentHex}10` : undefined,
                    }}
                  >
                    {rev.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Pricing breakdown summary card (Col-5) */}
          <div className="lg:col-span-5 glass-card-thick rounded-2xl p-6 md:p-8 flex flex-col justify-between items-stretch text-left relative overflow-hidden shadow-xl border border-slate-200/50">
            {/* Top glowing ambient gradient */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-emerald-400 to-cyan-500" />

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">PROJECT SUMMARY</p>
                <h3 className="font-sans font-black text-xl text-slate-900 mt-1 uppercase">Estimated Investment</h3>
              </div>

              {/* Huge Price Figure */}
              <div className="py-4 border-y border-slate-150 flex items-baseline justify-between">
                <span className="text-[10px] font-mono text-slate-400">TOTAL COST</span>
                <span className="font-sans font-black text-4xl text-slate-900 tracking-tight">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Meta details list */}
              <div className="flex flex-col gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Delivery timeline: <strong className="text-slate-900">{deliveryTime}</strong></span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>All formats exported: <strong className="text-emerald-700 font-bold">MP4, ProRes, PNG</strong></span>
                </div>
              </div>

              {/* Explanatory text */}
              <p className="text-[10px] font-mono text-slate-400 leading-relaxed">
                *This tool provides a baseline project budget projection. Final pricing is calculated upon review of actual media footage, asset quantity, and advanced VFX needs.
              </p>
            </div>

            {/* Discuss Button */}
            <a
              id="calculator-whatsapp-btn"
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => playSound(900, 0.15)}
              className="mt-8 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-xs font-bold font-mono tracking-wider text-white transition-all hover:scale-[1.02] hover:brightness-110"
              style={{
                backgroundColor: currentTheme.accentHex,
                boxShadow: `0 4px 15px ${currentTheme.glowColor}`,
              }}
            >
              <PhoneCall className="w-4 h-4 fill-white stroke-0" />
              DISCUSS ON WHATSAPP
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
