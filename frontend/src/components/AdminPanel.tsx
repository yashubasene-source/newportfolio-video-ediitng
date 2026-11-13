/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Sparkles,
  Film,
  Building2,
  Megaphone,
  GraduationCap,
  Save,
  Check,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  FileText,
  Instagram,
  Database,
  Key,
  ShieldCheck,
  Layers,
  Sliders,
  AlertCircle,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { Project, ProjectType, NicheType, ThemeColors } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeColors;
  soundEnabled: boolean;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onResetDefaults: () => void;
  siteConfig: any;
  setSiteConfig: (config: any) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  currentTheme,
  soundEnabled,
  projects,
  setProjects,
  onResetDefaults,
  siteConfig,
  setSiteConfig,
}: AdminPanelProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sidebar Tab Navigation
  const [activeTab, setActiveTab] = useState<'projects' | 'pipeline' | 'profile' | 'socials' | 'settings'>('projects');
  const [saveToast, setSaveToast] = useState('');

  // Project Form States
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectNiche, setProjectNiche] = useState<NicheType>('real-estate');
  const [projectMediaType, setProjectMediaType] = useState<'reel' | 'video'>('reel');
  const [projectLink, setProjectLink] = useState('');
  const [projectThumbnail, setProjectThumbnail] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDuration, setProjectDuration] = useState('0:45');
  const [projectClient, setProjectClient] = useState('');
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [filterNiche, setFilterNiche] = useState<string>('all');

  // Pipeline States (The 4 Niches)
  const [progressions, setProgressions] = useState<any[]>([]);
  const [activePipelineNiche, setActivePipelineNiche] = useState<string>('real-estate');

  // Profile & Resume States
  const [cvLink, setCvLink] = useState('');
  const [heroStatusText, setHeroStatusText] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [aboutBio1, setAboutBio1] = useState('');
  const [aboutBio2, setAboutBio2] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Socials States
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [locationVal, setLocationVal] = useState('');

  // Settings & DB States
  const [mongoUri, setMongoUri] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [dbStatus, setDbStatus] = useState<string>('local_file');
  const [isSavingDb, setIsSavingDb] = useState(false);

  const accentColor = currentTheme.accentHex || '#2BEE34';

  // Sound feedback helper
  const playSound = (freq: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(''), 3000);
  };

  // Populate form fields from siteConfig on load
  useEffect(() => {
    if (siteConfig) {
      setCvLink(siteConfig.hero?.cvLink || 'https://drive.google.com');
      setHeroStatusText(siteConfig.hero?.statusText || '');
      setHeroDescription(siteConfig.hero?.description || '');
      setAboutBio1(siteConfig.about?.bioParagraph1 || '');
      setAboutBio2(siteConfig.about?.bioParagraph2 || '');
      setProfileImage(siteConfig.about?.profileImage || '');

      setInstagramUrl(siteConfig.contact?.instagramUrl || 'https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg==');
      setWhatsappUrl(siteConfig.contact?.whatsappUrl || 'https://wa.me/918319610243');
      setEmailVal(siteConfig.contact?.email || 'yashubasene@gmail.com');
      setPhoneVal(siteConfig.contact?.phone || '+91 8319610243');
      setLocationVal(siteConfig.contact?.location || 'Bhopal, India');

      setProgressions(siteConfig.progressions || []);
    }

    // Check DB status
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.database) setDbStatus(data.database);
      })
      .catch(() => {});
  }, [siteConfig]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'anshayadmin' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      playSound(700);
    } else {
      setAuthError('Incorrect studio password. Try again.');
      playSound(200);
    }
  };

  // Save Project (Add / Edit)
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectLink) {
      alert('Please fill out project title and video URL.');
      return;
    }

    let updatedList: Project[];
    if (editingId) {
      updatedList = projects.map((p) => {
        if (p.id === editingId) {
          return {
            ...p,
            title: projectTitle,
            niche: projectNiche,
            mediaType: projectMediaType,
            aspectRatio: projectMediaType === 'reel' ? '9:16' : '16:9',
            link: projectLink,
            videoUrl: projectLink,
            thumbnail: projectThumbnail || p.thumbnail,
            description: projectDescription,
            duration: projectDuration,
            client: projectClient,
            featured: projectFeatured,
          };
        }
        return p;
      });
      showToast('Project updated successfully!');
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        type: 'video',
        title: projectTitle,
        niche: projectNiche,
        mediaType: projectMediaType,
        aspectRatio: projectMediaType === 'reel' ? '9:16' : '16:9',
        link: projectLink,
        videoUrl: projectLink,
        thumbnail: projectThumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800',
        description: projectDescription,
        duration: projectDuration,
        client: projectClient,
        role: 'Lead Video Editor',
        software: ['Premiere Pro', 'DaVinci Resolve'],
        createdAt: '2026',
        featured: projectFeatured,
      };
      updatedList = [newProj, ...projects];
      showToast('New project created and published!');
    }

    setProjects(updatedList);
    resetProjectForm();
    playSound(800);
  };

  const handleEditProject = (p: Project) => {
    setEditingId(p.id);
    setProjectTitle(p.title);
    setProjectNiche(p.niche as NicheType);
    setProjectMediaType(p.mediaType || (p.aspectRatio === '9:16' ? 'reel' : 'video'));
    setProjectLink(p.videoUrl || p.link || '');
    setProjectThumbnail(p.thumbnail || '');
    setProjectDescription(p.description || '');
    setProjectDuration(p.duration || '0:45');
    setProjectClient(p.client || '');
    setProjectFeatured(Boolean(p.featured));
    setIsEditingProject(true);
    playSound(550);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      showToast('Project removed.');
      playSound(300);
    }
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setProjectTitle('');
    setProjectNiche('real-estate');
    setProjectMediaType('reel');
    setProjectLink('');
    setProjectThumbnail('');
    setProjectDescription('');
    setProjectDuration('0:45');
    setProjectClient('');
    setProjectFeatured(false);
    setIsEditingProject(false);
  };

  // Save Pipeline (Cinematic Transformation 4-Stage Videos)
  const handleUpdatePipelineField = (nicheId: string, stage: 'rawVideo' | 'editVideo' | 'sfxColorVideo' | 'finalVideo', url: string) => {
    const updated = progressions.map((p) => {
      if (p.niche === nicheId || p.id === nicheId) {
        return { ...p, [stage]: url };
      }
      return p;
    });
    setProgressions(updated);
  };

  const handleSavePipeline = () => {
    const newSiteConfig = {
      ...siteConfig,
      progressions,
    };
    setSiteConfig(newSiteConfig);
    showToast('Cinematic Pipeline progressions saved!');
    playSound(850);
  };

  // Save Profile & Resume
  const handleSaveProfile = () => {
    const newSiteConfig = {
      ...siteConfig,
      hero: {
        ...(siteConfig?.hero || {}),
        cvLink,
        statusText: heroStatusText,
        description: heroDescription,
      },
      about: {
        ...(siteConfig?.about || {}),
        bioParagraph1: aboutBio1,
        bioParagraph2: aboutBio2,
        profileImage,
      },
    };
    setSiteConfig(newSiteConfig);
    showToast('Profile & Resume information saved!');
    playSound(850);
  };

  // Save Socials
  const handleSaveSocials = () => {
    const newSiteConfig = {
      ...siteConfig,
      contact: {
        ...(siteConfig?.contact || {}),
        instagramUrl,
        whatsappUrl,
        email: emailVal,
        phone: phoneVal,
        location: locationVal,
      },
    };
    setSiteConfig(newSiteConfig);
    showToast('Contact channels and social links saved!');
    playSound(850);
  };

  // Save Cloud Database Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingDb(true);
    playSound(600);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoUri, geminiApiKey }),
      });
      const data = await res.json();
      if (data.database) setDbStatus(data.database);

      if (data.mongoStatus && data.mongoStatus.startsWith('error')) {
        alert(`MongoDB connection attempt returned an error:\n${data.mongoStatus}\n\nMake sure IP 0.0.0.0/0 is whitelisted in Atlas Network Access.`);
      } else {
        showToast('Database configuration connected and saved!');
      }
    } catch (err: any) {
      alert('Failed to save database settings: ' + err.message);
    } finally {
      setIsSavingDb(false);
    }
  };

  if (!isOpen) return null;

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#16181F] border border-white/10 rounded-2xl p-8 shadow-2xl relative text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-4">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}15`, border: `1px solid ${accentColor}30` }}
            >
              <Lock className="w-7 h-7" style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans">Anshay Studio Manager</h3>
              <p className="text-xs text-slate-400 mt-1">Enter your password to unlock the studio control panel</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Studio Password</label>
                <input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#0F1116] border border-white/10 text-white font-mono text-sm outline-none focus:border-emerald-400"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                Unlock Studio Panel
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered Projects for List View
  const filteredProjectsList = projects.filter((p) => {
    if (filterNiche === 'all') return true;
    return p.niche === filterNiche;
  });

  const activePipelineProg = progressions.find((p) => p.niche === activePipelineNiche) || progressions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="relative w-full max-w-6xl h-[92vh] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden text-white"
      >
        {/* Toast notification */}
        <AnimatePresence>
          {saveToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-black font-mono font-bold text-xs shadow-2xl flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{saveToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-[#161820]/90 p-5 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            {/* Header Brand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                <span className="font-sans font-black tracking-wider text-sm uppercase">STUDIO MANAGER</span>
              </div>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-400">
                {dbStatus === 'mongodb' ? 'Cloud Atlas' : 'Flat File'}
              </span>
            </div>

            {/* Nav Tabs */}
            <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
              {[
                { id: 'projects', label: 'Video Projects', icon: Film, count: projects.length },
                { id: 'pipeline', label: 'Cinematic Pipeline', icon: Sliders },
                { id: 'profile', label: 'Profile & Resume', icon: FileText },
                { id: 'socials', label: 'Socials & Links', icon: Instagram },
                { id: 'settings', label: 'Cloud Database', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      playSound(500);
                    }}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all text-left cursor-pointer shrink-0 ${
                      isActive
                        ? 'text-black font-bold shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    style={{
                      backgroundColor: isActive ? accentColor : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                playSound(300);
              }}
              className="text-xs text-slate-400 hover:text-white font-mono flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Panel</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5"
            >
              Exit Studio
            </button>
          </div>
        </aside>

        {/* RIGHT CONTENT WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#141414] flex flex-col justify-between">
          
          {/* TAB 1: PROJECTS MANAGER */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans">Portfolio Projects</h2>
                  <p className="text-xs text-slate-400">Curate and manage your video gallery across the 4 editing niches.</p>
                </div>
                <button
                  onClick={() => {
                    resetProjectForm();
                    setIsEditingProject(!isEditingProject);
                    playSound(600);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{isEditingProject ? 'Cancel' : 'Add New Project'}</span>
                </button>
              </div>

              {/* Add / Edit Form Modal / Block */}
              {isEditingProject && (
                <form onSubmit={handleSaveProject} className="p-6 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-4 shadow-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                    <Edit2 className="w-4 h-4" style={{ color: accentColor }} />
                    <span>{editingId ? 'Edit Project' : 'Add New Video Project'}</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Project Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Modern Villa Walkthrough"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Editing Niche (4 Focus Niches)</label>
                      <select
                        value={projectNiche}
                        onChange={(e) => setProjectNiche(e.target.value as NicheType)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none"
                      >
                        <option value="real-estate">Real Estate</option>
                        <option value="ugc">UGC & Direct-Response</option>
                        <option value="promotional">Promotional Commercial</option>
                        <option value="educational">Educational / Talking Head</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Media Format</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setProjectMediaType('reel')}
                          className={`py-2 rounded-xl text-center border cursor-pointer font-sans text-xs ${
                            projectMediaType === 'reel' ? 'bg-white text-black font-bold border-white' : 'bg-[#12141A] text-slate-400 border-white/10'
                          }`}
                        >
                          9:16 Vertical Reel
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectMediaType('video')}
                          className={`py-2 rounded-xl text-center border cursor-pointer font-sans text-xs ${
                            projectMediaType === 'video' ? 'bg-white text-black font-bold border-white' : 'bg-[#12141A] text-slate-400 border-white/10'
                          }`}
                        >
                          16:9 Landscape Video
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Video Link (YouTube URL or Cloudinary MP4) *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://youtu.be/... or https://res.cloudinary.com/..."
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Custom Thumbnail URL</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... or auto-detected"
                        value={projectThumbnail}
                        onChange={(e) => setProjectThumbnail(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 uppercase text-[10px]">Client / Brand Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Prime Estates or Glow Naturals"
                        value={projectClient}
                        onChange={(e) => setProjectClient(e.target.value)}
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="text-xs font-mono">
                    <label className="text-slate-400 uppercase text-[10px]">Short Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief highlight of the edit pacing, color grading, or metrics..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
                      <input
                        type="checkbox"
                        checked={projectFeatured}
                        onChange={(e) => setProjectFeatured(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <span>Mark as Featured in Hero Showcase</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={resetProjectForm}
                        className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl font-mono text-xs font-bold uppercase text-black"
                        style={{ backgroundColor: accentColor }}
                      >
                        {editingId ? 'Update Project' : 'Save & Publish'}
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Niche Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {['all', 'real-estate', 'ugc', 'promotional', 'educational'].map((n) => (
                  <button
                    key={n}
                    onClick={() => setFilterNiche(n)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                      filterNiche === n ? 'bg-white text-black font-bold' : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                    }`}
                  >
                    {n.replace('-', ' ')}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjectsList.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 shadow-md group"
                  >
                    <div className="space-y-2">
                      {/* Thumbnail Preview */}
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-white/5">
                        <img
                          src={p.thumbnail || 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800'}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 backdrop-blur-xs text-white border border-white/10 uppercase">
                          {p.niche}
                        </span>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/70 text-slate-300">
                          {p.mediaType === 'reel' ? '9:16 Reel' : '16:9 Video'}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{p.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={p.videoUrl || p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View</span>
                      </a>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProject(p)}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: CINEMATIC PIPELINE (4 STAGES) */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans">Cinematic Transformation Pipeline</h2>
                  <p className="text-xs text-slate-400">Manage the 4 video compilation stages (Raw, Cut, SFX+Color, Final) for each niche.</p>
                </div>
                <button
                  onClick={handleSavePipeline}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pipeline</span>
                </button>
              </div>

              {/* Niche Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'real-estate', label: 'Real Estate' },
                  { id: 'ugc', label: 'UGC' },
                  { id: 'promotional', label: 'Promotional' },
                  { id: 'educational', label: 'Educational' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePipelineNiche(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono uppercase transition-colors cursor-pointer ${
                      activePipelineNiche === item.id
                        ? 'text-black font-bold shadow-md'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: activePipelineNiche === item.id ? accentColor : undefined,
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* 4 Stages URL Inputs */}
              {activePipelineProg && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'rawVideo', label: '1. Raw Footage Video URL', placeholder: 'https://youtu.be/... or Cloudinary MP4' },
                    { key: 'editVideo', label: '2. Cut & Pacing Video URL', placeholder: 'https://youtu.be/... or Cloudinary MP4' },
                    { key: 'sfxColorVideo', label: '3. SFX + Color Grade URL', placeholder: 'https://youtu.be/... or Cloudinary MP4' },
                    { key: 'finalVideo', label: '4. Final Master Video URL', placeholder: 'https://youtu.be/... or Cloudinary MP4' },
                  ].map((field) => (
                    <div key={field.key} className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                      <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider block">
                        {field.label}
                      </label>
                      <input
                        type="url"
                        placeholder={field.placeholder}
                        value={activePipelineProg[field.key] || ''}
                        onChange={(e) => handleUpdatePipelineField(activePipelineProg.niche, field.key as any, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                      />
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Direct video stream or unlisted YouTube link.
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hosting Tip Box */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4" />
                  PERMANENT VIDEO STORAGE TIP
                </span>
                <p className="text-[11px] leading-relaxed">
                  Use <strong>Cloudinary</strong> (free 25GB) or <strong>YouTube unlisted links</strong> for these video URLs. They load instantly with zero buffering and will never be deleted when cloud servers restart!
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE & RESUME */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans">Profile & Resume</h2>
                  <p className="text-xs text-slate-400">Update your CV link, bio description, and hero headline status.</p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                {/* Resume URL Field with Test Button */}
                <div className="md:col-span-2 p-5 rounded-xl bg-[#1A1D24] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4" style={{ color: accentColor }} />
                      <span>Dedicated Resume / CV Document URL *</span>
                    </label>
                    <a
                      href={cvLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Resume Link</span>
                    </a>
                  </div>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or Cloudinary PDF link"
                    value={cvLink}
                    onChange={(e) => setCvLink(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                  />
                  <p className="text-[10px] text-slate-500 font-sans">
                    This link is opened when visitors click the &quot;Resume&quot; button in your top navigation or hero section.
                  </p>
                </div>

                {/* Hero Status & Bio */}
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 uppercase text-[10px]">Hero Status Badge</label>
                    <input
                      type="text"
                      value={heroStatusText}
                      onChange={(e) => setHeroStatusText(e.target.value)}
                      placeholder="e.g. Available for Freelance & Commercial Projects"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white font-sans text-xs outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase text-[10px]">Profile Image URL</label>
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-[#1A1D24] border border-white/10 text-white font-sans text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 uppercase text-[10px]">About Bio Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={aboutBio1}
                      onChange={(e) => setAboutBio1(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-white/10 text-white font-sans text-xs outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase text-[10px]">About Bio Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={aboutBio2}
                      onChange={(e) => setAboutBio2(e.target.value)}
                      className="w-full mt-1 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-white/10 text-white font-sans text-xs outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOCIALS & CHANNELS */}
          {activeTab === 'socials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-bold font-sans">Socials & Direct Channels</h2>
                  <p className="text-xs text-slate-400">Update your official Instagram profile, WhatsApp, and contact email.</p>
                </div>
                <button
                  onClick={handleSaveSocials}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Channels</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                  <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>Official Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://www.instagram.com/anshay.edit?exln=MWkwdHR1bXllMGJjcg=="
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500 font-sans block">Displays as @anshay.edit across the portfolio.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                  <label className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Contact URL</span>
                  </label>
                  <input
                    type="url"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="https://wa.me/8319610243"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none focus:border-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500 font-sans block">Used by the Instant Quote Calculator for client leads.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                  <label className="text-slate-300 font-bold uppercase tracking-wider block">Inquiry Email Address</label>
                  <input
                    type="email"
                    value={emailVal}
                    onChange={(e) => setEmailVal(e.target.value)}
                    placeholder="yashubasene@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none"
                  />
                </div>

                <div className="p-4 rounded-xl bg-[#1A1D24] border border-white/10 space-y-2">
                  <label className="text-slate-300 font-bold uppercase tracking-wider block">Phone & WhatsApp Number</label>
                  <input
                    type="text"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="+91 8319610243"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#12141A] border border-white/10 text-white font-sans text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CLOUD DATABASE & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 className="text-xl font-bold font-sans">Cloud Database (Permanent Data Storage)</h2>
                <p className="text-xs text-slate-400">Connect MongoDB Atlas to guarantee your edits and projects never reset on hosting reboots.</p>
              </div>

              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-[#1A1D24] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5" style={{ color: accentColor }} />
                    <span className="font-bold text-sm">MongoDB Atlas Connection</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      dbStatus === 'mongodb' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {dbStatus === 'mongodb' ? 'Connected (Atlas Cloud)' : 'Local File Mode (Will Reset on Free Hosting)'}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <label className="text-slate-300 uppercase text-[10px]">MongoDB Atlas URI</label>
                  <input
                    type="password"
                    placeholder="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
                    value={mongoUri}
                    onChange={(e) => setMongoUri(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#12141A] border border-white/10 text-white font-mono text-xs outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <label className="text-slate-300 uppercase text-[10px]">Gemini API Key (Optional for AI Autofill)</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#12141A] border border-white/10 text-white font-mono text-xs outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-sans">
                    Free Atlas account setup: 100% free forever cluster.
                  </span>
                  <button
                    type="submit"
                    disabled={isSavingDb}
                    className="px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black transition-all hover:scale-105 active:scale-95 shadow-lg"
                    style={{ backgroundColor: accentColor }}
                  >
                    {isSavingDb ? 'Testing Connection...' : 'Save & Connect'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </motion.div>
    </div>
  );
}