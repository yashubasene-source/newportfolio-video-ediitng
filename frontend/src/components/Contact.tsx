/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Play, CheckCircle, AlertCircle, Copy, Check, Instagram, Youtube, Send } from 'lucide-react';
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
  const [service, setService] = useState('Short Form Reel');
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
  const contactPhoneVal = contactConfig?.phone || '+91 83196';
  const instagramUrlVal = contactConfig?.instagramUrl || 'https://instagram.com/anshay_edits';
  const whatsappUrlVal = contactConfig?.whatsappUrl || 'https://wa.me/918319610243';
  const headline = contactConfig?.headline || "Let's Create Together";
  const subheadline = contactConfig?.subheadline || "Ready to elevate your digital reach with cinematic color grades and scroll-stopping graphics? Send a message and let's talk about your next project!";

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
      formData.append('_subject', `New Portfolio Inquiry — ${name}`);
      formData.append('_captcha', 'false');

      // Submit to FormSubmit asynchronously
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
      alert('Form submission failed. Please try messaging directly via WhatsApp instead!');
      playSound(200, 0.3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInstagramHandle = (url: string) => {
    try {
      const parts = url.replace(/\/$/, '').split('/');
      const handle = parts[parts.length - 1];
      return handle ? `@${handle}` : '@instagram';
    } catch (e) {
      return '@instagram';
    }
  };

  return (
    <section id="contact-section" className="relative bg-transparent py-24 border-b border-slate-200/50 overflow-hidden text-left">
      <div className="absolute inset-x-0 bottom-0 top-0 opacity-20 bg-slate-100 rounded-full filter blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        
        {/* Left Column: Direct Info Links */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-mono tracking-[4px] text-slate-400 uppercase">
              GET IN TOUCH
            </p>
            <h2 className="font-sans font-black text-4xl md:text-5xl leading-tight text-slate-900">
              {headline.includes('Together') ? (
                <>Let&apos;s Create <span style={{ color: currentTheme.accentHex }}>Together</span></>
              ) : (
                headline
              )}
            </h2>
            <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
              {subheadline}
            </p>
          </div>

          {/* Social connections stack */}
          <div className="flex flex-col gap-4 max-w-sm">
            
            {/* Email copying action box (Solves plaintext harvesting risk) */}
            <div
              className="p-4 rounded-xl glass-card flex items-center justify-between cursor-pointer group hover:bg-white shadow-sm border border-slate-150 transition-colors"
              onClick={handleCopyEmail}
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded bg-purple-500/10">
                  <Mail className="w-4 h-4 text-purple-600" />
                </span>
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">SEND EMAIL</p>
                  <p className="text-xs font-sans font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{contactEmailVal}</p>
                </div>
              </div>
              <button className="text-slate-400 group-hover:text-slate-700 p-1.5 rounded transition-colors cursor-pointer">
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Direct Connect links */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href={whatsappUrlVal}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound(500)}
                className="p-4 rounded-xl glass-card hover:bg-white border border-slate-150 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">WHATSAPP</p>
                  <p className="text-xs font-sans font-bold text-slate-900">{contactPhoneVal}</p>
                </div>
              </a>

              <a
                href={instagramUrlVal}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound(520)}
                className="p-4 rounded-xl glass-card hover:bg-white border border-slate-150 shadow-sm hover:shadow-md transition-all flex items-center gap-3"
              >
                <Instagram className="w-4 h-4 text-pink-600" />
                <div className="text-left">
                  <p className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">INSTAGRAM</p>
                  <p className="text-xs font-sans font-bold text-slate-900">{getInstagramHandle(instagramUrlVal)}</p>
                </div>
              </a>
            </div>
          </div>

          <div className="text-slate-400 font-mono text-[10px] tracking-wider uppercase">
            RESPONSE TIME WITHIN 12-24 HOURS
          </div>
        </div>

        {/* Right Column: Custom Animated Form */}
        <div className="lg:col-span-7 glass-card-thick rounded-2xl p-6 md:p-8 flex flex-col justify-center border border-slate-200/50 shadow-md">
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
                    <label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Anshay Basene"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-3 rounded-xl text-slate-900 outline-none focus:border-slate-300 font-sans glass-input border border-slate-200"
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Your Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="client@creators.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-4 py-3 rounded-xl text-slate-900 outline-none focus:border-slate-300 font-sans glass-input border border-slate-200"
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Select Service Area</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="px-4 py-3 rounded-xl text-slate-900 outline-none font-sans glass-input border border-slate-200 bg-white"
                  >
                    <option className="bg-white text-slate-900">Short Form Reel</option>
                    <option className="bg-white text-slate-900">Long Form Documentary / Video</option>
                    <option className="bg-white text-slate-900">Typography Reel</option>
                    <option className="bg-white text-slate-900">Brand Identity Suite</option>
                    <option className="bg-white text-slate-900">YouTube Thumbnail Design</option>
                    <option className="bg-white text-slate-900">Monthly Retainer package</option>
                  </select>
                </div>

                {/* Budget Range */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Approximate Budget (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,000 - ₹15,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="px-4 py-3 rounded-xl text-slate-900 outline-none focus:border-slate-300 font-sans glass-input border border-slate-200"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-500 font-bold text-[10px] uppercase tracking-wider">Project Details *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your channel, content style, timeline pacing needs..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="px-4 py-3 rounded-xl text-slate-900 outline-none focus:border-slate-300 resize-none font-sans glass-input border border-slate-200"
                  />
                </div>

                {/* Submit button with loader state */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 py-4 rounded-xl text-xs font-bold font-mono tracking-widest text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.01] hover:brightness-110 cursor-pointer"
                  style={{
                    backgroundColor: currentTheme.accentHex,
                    boxShadow: `0 4px 14px ${currentTheme.glowColor}`,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      SUBMITTING TRANSMISSION...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND PROJECT INQUIRY
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              /* Success confirmation state in-app */
              <motion.div
                key="success-screen"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto"
              >
                <CheckCircle className={`w-16 h-12 text-emerald-600 mb-4 ${isLiteMode ? '' : 'animate-bounce'}`} />
                <h3 className="font-sans font-black text-xl text-slate-900">Inquiry Transmitted</h3>
                <p className="text-slate-600 text-xs font-sans mt-2 mb-6 leading-relaxed">
                  Thank you, <strong className="text-slate-900">{name}</strong>! Your project brief has been recorded successfully. Anshay will contact you within 12-24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmittingSuccess(false);
                    setName('');
                    setEmail('');
                    setMessage('');
                    setBudget('');
                    playSound(300);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-[10px] font-mono hover:text-slate-900 hover:border-slate-400 transition-colors cursor-pointer"
                >
                  SEND ANOTHER BRIEF &lsaquo;
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
