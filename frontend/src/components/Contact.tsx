/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Copy, Check, Instagram, Send } from 'lucide-react';
import { ThemeColors } from '../types';
import { usePerformance } from '../motion/performanceManager';

interface ContactProps {
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  contactConfig?: any;
}

export default function Contact({ currentTheme, soundEnabled, contactConfig }: ContactProps) {
  const { capabilities } = usePerformance();
  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState('Real Estate Video Walkthrough');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmittingSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const contactEmailVal = contactConfig?.email || 'yashubasene@gmail.com';
  const contactPhoneVal = contactConfig?.phone || '+91 8319610243';
  const instagramUrlVal = contactConfig?.instagramUrl || 'https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg==';
  const whatsappUrlVal = contactConfig?.whatsappUrl || 'https://wa.me/918319610243';
  const headline = contactConfig?.headline || "Start Your Creative Journey";
  const subheadline = contactConfig?.subheadline || "Ready to elevate your digital reach with cinematic color grades and scroll-stopping cuts? Let's discuss your next project.";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmailVal);
    setCopied(true);
    playSound(900, 0.1);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    playSound(600, 0.2);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('service', service);
      formData.append('budget', budget);
      formData.append('message', message);
      formData.append('_subject', `New Video Inquiry from ${name}`);
      formData.append('_captcha', 'false');

      const response = await fetch(`https://formsubmit.co/ajax/${contactEmailVal}`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.ok) {
        setSubmittingSuccess(true);
        playSound(880, 0.3);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (err) {
      alert('Form submission failed. Please message directly on WhatsApp or Instagram!');
      playSound(200, 0.3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const accentColor = currentTheme.accentHex || '#2BEE34';

  return (
    <section id="contact-section" className="relative bg-[#141414] py-24 border-b border-white/5 overflow-hidden text-left text-white">
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-15 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
              GET IN TOUCH
            </p>
            <h2 className="font-impact text-5xl md:text-6xl leading-tight text-white uppercase tracking-wider">
              Start Your <span className="font-editorial-script italic font-normal lowercase" style={{ color: accentColor }}>Journey</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Social connections stack */}
          <div className="flex flex-col gap-4 max-w-sm">
            {/* Email copying action box */}
            <div
              className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 flex items-center justify-between cursor-pointer group hover:border-white/20 transition-all shadow-md"
              onClick={handleCopyEmail}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-white/5" style={{ color: accentColor }}>
                  <Mail className="w-4 h-4" />
                </span>
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">SEND EMAIL</p>
                  <p className="text-xs font-sans font-bold text-white group-hover:text-emerald-300 transition-colors">{contactEmailVal}</p>
                </div>
              </div>
              <button className="text-slate-400 group-hover:text-white p-1.5 rounded transition-colors cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct Connect links */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={whatsappUrlVal}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound(500)}
                className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 hover:border-white/20 shadow-md transition-all flex items-center gap-3"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">WHATSAPP</p>
                  <p className="text-xs font-sans font-bold text-white">{contactPhoneVal}</p>
                </div>
              </a>

              <a
                href={instagramUrlVal}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound(520)}
                className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 hover:border-white/20 shadow-md transition-all flex items-center gap-3"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">INSTAGRAM</p>
                  <p className="text-xs font-sans font-bold text-white">@anshay.edit</p>
                </div>
              </a>
            </div>
          </div>

          <div className="text-slate-500 font-mono text-[10px] tracking-wider uppercase">
            RESPONSE TIME WITHIN 12-24 HOURS
          </div>
        </div>

        {/* Right Column: Custom Animated Form */}
        <div className="lg:col-span-7 bg-[#1A1D24]/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 flex flex-col justify-center border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 text-xs font-mono"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Anshay Basene"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-xl text-white outline-none focus:border-emerald-400 font-sans bg-[#12141A] border border-white/10 transition-colors"
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@brand.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 rounded-xl text-white outline-none focus:border-emerald-400 font-sans bg-[#12141A] border border-white/10 transition-colors"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Select Service Discipline</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="px-4 py-3 rounded-xl text-white outline-none font-sans bg-[#12141A] border border-white/10 transition-colors"
                  >
                    <option className="bg-[#12141A] text-white">Real Estate Video Walkthrough</option>
                    <option className="bg-[#12141A] text-white">UGC & Direct-Response Video Ad</option>
                    <option className="bg-[#12141A] text-white">Promotional Commercial / Campaign</option>
                    <option className="bg-[#12141A] text-white">Educational / Talking-Head Series</option>
                    <option className="bg-[#12141A] text-white">Monthly Video Editing Retainer</option>
                  </select>
                </div>

                {/* Project Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Project Scope & Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell me about your footage, turnaround deadline, and editing vision..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3 rounded-xl text-white outline-none focus:border-emerald-400 font-sans bg-[#12141A] border border-white/10 transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl text-black font-bold font-mono tracking-wider transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg flex items-center justify-center gap-2 cursor-pointer uppercase text-xs"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 4px 20px ${currentTheme.glowColor || 'rgba(43,238,52,0.35)'}`,
                  }}
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Request...' : 'Send Inquiry Message'}</span>
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-8 text-center gap-4 text-white"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
                >
                  <Check className="w-8 h-8" style={{ color: accentColor }} />
                </div>
                <h3 className="text-2xl font-bold font-sans">Message Dispatched!</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Thank you, {name}! Your inquiry has been sent to Anshay Basene. You will receive a response within 12–24 hours.
                </p>
                <button
                  onClick={() => setSubmittingSuccess(false)}
                  className="mt-4 px-6 py-2 rounded-xl text-xs font-mono font-bold text-white bg-white/10 border border-white/10 hover:bg-white/15 transition-all"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}