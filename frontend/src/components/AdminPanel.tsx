/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Project, ProjectType, NicheType, ThemeColors } from '../types';

// Modular video/reel management subcomponents
import LocalUploader from './video-management/LocalUploader';
import AiAutofill from './video-management/AiAutofill';
import ProjectForm from './video-management/ProjectForm';
import ProjectList from './video-management/ProjectList';

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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'ai-upload' | 'local-upload' | 'site-content' | 'settings'>('projects');

  // Form states for projects
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProjectType>('video');
  const [niche, setNiche] = useState<NicheType>('normal-edit');
  const [link, setLink] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [role, setRole] = useState('');
  const [software, setSoftware] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('16:9');
  const [client, setClient] = useState('');
  const [resolution, setResolution] = useState('');
  const [frameRate, setFrameRate] = useState('');
  const [colorGrade, setColorGrade] = useState('');
  const [audioSpecs, setAudioSpecs] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Site Settings Form states
  const [heroStatusText, setHeroStatusText] = useState('');
  const [heroTitleNormal, setHeroTitleNormal] = useState('');
  const [heroTitleGradient, setHeroTitleGradient] = useState('');
  const [heroTitleSuffix, setHeroTitleSuffix] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroSlotsText, setHeroSlotsText] = useState('');
  const [heroCvLink, setHeroCvLink] = useState('');
  const [heroMetric1Val, setHeroMetric1Val] = useState('');
  const [heroMetric1Lbl, setHeroMetric1Lbl] = useState('');
  const [heroMetric2Val, setHeroMetric2Val] = useState('');
  const [heroMetric2Lbl, setHeroMetric2Lbl] = useState('');
  const [heroMetric3Val, setHeroMetric3Val] = useState('');
  const [heroMetric3Lbl, setHeroMetric3Lbl] = useState('');

  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutBioParagraph1, setAboutBioParagraph1] = useState('');
  const [aboutBioParagraph2, setAboutBioParagraph2] = useState('');
  const [aboutExperience, setAboutExperience] = useState('');
  const [aboutEducation, setAboutEducation] = useState('');
  const [aboutAvailability, setAboutAvailability] = useState('');
  const [aboutLocation, setAboutLocation] = useState('');
  const [aboutProfileImage, setAboutProfileImage] = useState('');
  const [aboutLocationStamp, setAboutLocationStamp] = useState('');
  const [aboutTags, setAboutTags] = useState('');

  const [contactHeadline, setContactHeadline] = useState('');
  const [contactSubheadline, setContactSubheadline] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactInstagramUrl, setContactInstagramUrl] = useState('');
  const [contactWhatsappUrl, setContactWhatsappUrl] = useState('');
  const [contactLocation, setContactLocation] = useState('');
  const [progressions, setProgressions] = useState<any[]>([]);

  // API settings state
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('anshay-gemini-api-key') || '');
  const [savingApiKey, setSavingApiKey] = useState(false);

  // Sync siteConfig data to form states when it loads
  useEffect(() => {
    if (siteConfig) {
      setHeroStatusText(siteConfig.hero?.statusText || '');
      setHeroTitleNormal(siteConfig.hero?.titleNormal || '');
      setHeroTitleGradient(siteConfig.hero?.titleGradient || '');
      setHeroTitleSuffix(siteConfig.hero?.titleSuffix || '');
      setHeroDescription(siteConfig.hero?.description || '');
      setHeroSlotsText(siteConfig.hero?.slotsText || '');
      setHeroCvLink(siteConfig.hero?.cvLink || '');
      setHeroMetric1Val(siteConfig.hero?.metric1Val || '');
      setHeroMetric1Lbl(siteConfig.hero?.metric1Lbl || '');
      setHeroMetric2Val(siteConfig.hero?.metric2Val || '');
      setHeroMetric2Lbl(siteConfig.hero?.metric2Lbl || '');
      setHeroMetric3Val(siteConfig.hero?.metric3Val || '');
      setHeroMetric3Lbl(siteConfig.hero?.metric3Lbl || '');

      setAboutTitle(siteConfig.about?.title || '');
      setAboutBioParagraph1(siteConfig.about?.bioParagraph1 || '');
      setAboutBioParagraph2(siteConfig.about?.bioParagraph2 || '');
      setAboutExperience(siteConfig.about?.experience || '');
      setAboutEducation(siteConfig.about?.education || '');
      setAboutAvailability(siteConfig.about?.availability || '');
      setAboutLocation(siteConfig.about?.location || '');
      setAboutProfileImage(siteConfig.about?.profileImage || '');
      setAboutLocationStamp(siteConfig.about?.locationStamp || '');
      setAboutTags(siteConfig.about?.tags ? siteConfig.about.tags.join(', ') : '');

      setContactHeadline(siteConfig.contact?.headline || '');
      setContactSubheadline(siteConfig.contact?.subheadline || '');
      setContactEmail(siteConfig.contact?.email || '');
      setContactPhone(siteConfig.contact?.phone || '');
      setContactInstagramUrl(siteConfig.contact?.instagramUrl || '');
      setContactWhatsappUrl(siteConfig.contact?.whatsappUrl || '');
      setContactLocation(siteConfig.contact?.location || '');
      setProgressions(siteConfig.progressions || []);
    }
  }, [siteConfig]);

  // Dispatch custom events to pause/resume Lenis scrolling and lock document body scroll
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('modal-open'));
      document.body.style.overflow = 'hidden';
    } else {
      window.dispatchEvent(new CustomEvent('modal-close'));
      document.body.style.overflow = '';
    }
    return () => {
      window.dispatchEvent(new CustomEvent('modal-close'));
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'anshayadmin' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
      playSound(880, 0.15);
    } else {
      setAuthError('Incorrect Admin Passcode. Please try again.');
      playSound(220, 0.2);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !link || !description) {
      alert('Please fill out all required fields.');
      return;
    }

    const softwareArray = software
      ? software.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Adobe Suite'];

    let finalThumbnail = thumbnail.trim();
    if (!finalThumbnail && type === 'video') {
      const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      const match = link.match(youtubeRegExp);
      if (match && match[2].length === 11) {
        const videoId = match[2];
        finalThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    if (!finalThumbnail) {
      finalThumbnail =
        type === 'graphic'
          ? 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400'
          : type === 'motion'
          ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400'
          : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400';
    }

    if (editingId) {
      // Edit existing
      const updated = projects.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title,
              type,
              niche,
              link,
              thumbnail: finalThumbnail,
              description,
              duration: duration || '0:45',
              role: role || 'Lead Editor',
              software: softwareArray,
              aspectRatio,
              client: client || undefined,
              resolution: resolution || undefined,
              frameRate: frameRate || undefined,
              colorGrade: colorGrade || undefined,
              audioSpecs: audioSpecs || undefined,
              challenges: challenges || undefined,
              solutions: solutions || undefined,
              fullDescription: fullDescription || undefined,
            }
          : p
      );
      setProjects(updated);
      setEditingId(null);
      playSound(700);
      alert('Project updated successfully!');
    } else {
      // Add new
      const newProj: Project = {
        id: `custom-${Date.now()}`,
        title,
        type,
        niche,
        link,
        thumbnail: finalThumbnail,
        description,
        duration: duration || '0:45',
        role: role || 'Lead Editor',
        software: softwareArray,
        createdAt: '2026',
        aspectRatio,
        client: client || undefined,
        resolution: resolution || undefined,
        frameRate: frameRate || undefined,
        colorGrade: colorGrade || undefined,
        audioSpecs: audioSpecs || undefined,
        challenges: challenges || undefined,
        solutions: solutions || undefined,
        fullDescription: fullDescription || undefined,
      };
      setProjects([newProj, ...projects]);
      playSound(800);
      alert('New project inserted successfully!');
    }

    // Reset fields
    resetProjectForm();
  };

  const resetProjectForm = () => {
    setEditingId(null);
    setTitle('');
    setLink('');
    setThumbnail('');
    setDescription('');
    setDuration('');
    setRole('');
    setSoftware('');
    setAspectRatio('16:9');
    setClient('');
    setResolution('');
    setFrameRate('');
    setColorGrade('');
    setAudioSpecs('');
    setChallenges('');
    setSolutions('');
    setFullDescription('');
  };

  const handleEditInit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setType(p.type);
    setNiche(p.niche);
    setLink(p.link);
    setThumbnail(p.thumbnail || '');
    setDescription(p.description);
    setDuration(p.duration || '');
    setRole(p.role || '');
    setSoftware(p.software ? p.software.join(', ') : '');
    setAspectRatio(p.aspectRatio || '16:9');
    setClient(p.client || '');
    setResolution(p.resolution || '');
    setFrameRate(p.frameRate || '');
    setColorGrade(p.colorGrade || '');
    setAudioSpecs(p.audioSpecs || '');
    setChallenges(p.challenges || '');
    setSolutions(p.solutions || '');
    setFullDescription(p.fullDescription || '');
    setActiveTab('projects');
    playSound(600);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      const filtered = projects.filter((p) => p.id !== id);
      setProjects(filtered);
      playSound(300, 0.15);
    }
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'anshay_portfolio_backup.json');
    dlAnchor.click();
    playSound(950);
  };

  const handleAutofillComplete = (data: any, linkUrl: string) => {
    setTitle(data.title || '');
    setLink(linkUrl);
    setThumbnail(data.thumbnail || '');
    setDescription(data.description || '');
    setNiche(data.niche || 'normal-edit');
    setType(data.type || 'video');
    setAspectRatio(data.aspectRatio || '16:9');
    setSoftware(data.software ? data.software.join(', ') : '');
    setDuration(data.duration || '');
    setRole(data.role || '');
    setClient(data.client || '');
    setResolution(data.resolution || '');
    setFrameRate(data.frameRate || '');
    setColorGrade(data.colorGrade || '');
    setAudioSpecs(data.audioSpecs || '');
    setChallenges(data.challenges || '');
    setSolutions(data.solutions || '');
    setFullDescription(data.fullDescription || '');
    setActiveTab('projects');
  };

  const handleUpdateProgField = (id: string, field: string, val: string) => {
    setProgressions(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: val };
        if (field === 'label') {
          updated.niche = val.toLowerCase().replace(/\s+/g, '');
        }
        return updated;
      }
      return p;
    }));
  };

  // Save General Site Texts
  const handleSaveSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound(600);

    const updatedConfig = {
      hero: {
        statusText: heroStatusText,
        titleNormal: heroTitleNormal,
        titleGradient: heroTitleGradient,
        titleSuffix: heroTitleSuffix,
        description: heroDescription,
        slotsText: heroSlotsText,
        cvLink: heroCvLink,
        metric1Val: heroMetric1Val,
        metric1Lbl: heroMetric1Lbl,
        metric2Val: heroMetric2Val,
        metric2Lbl: heroMetric2Lbl,
        metric3Val: heroMetric3Val,
        metric3Lbl: heroMetric3Lbl,
      },
      about: {
        title: aboutTitle,
        bioParagraph1: aboutBioParagraph1,
        bioParagraph2: aboutBioParagraph2,
        experience: aboutExperience,
        education: aboutEducation,
        availability: aboutAvailability,
        location: aboutLocation,
        profileImage: aboutProfileImage,
        locationStamp: aboutLocationStamp,
        tags: aboutTags ? aboutTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      },
      contact: {
        headline: contactHeadline,
        subheadline: contactSubheadline,
        email: contactEmail,
        phone: contactPhone,
        instagramUrl: contactInstagramUrl,
        whatsappUrl: contactWhatsappUrl,
        location: contactLocation,
      },
      progressions: progressions,
    };

    setSiteConfig(updatedConfig);
  };

  // Save Settings & API key
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingApiKey(true);
    playSound(600);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey })
      });

      if (!res.ok) throw new Error('Failed to save settings on server');

      localStorage.setItem('anshay-gemini-api-key', geminiApiKey);
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert('Failed to save API key on server: ' + err.message);
    } finally {
      setSavingApiKey(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl rounded-2xl border border-zinc-850 bg-[#08080c] shadow-2xl overflow-hidden flex flex-col my-4 sm:my-8 max-h-[92vh] md:max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-850 p-4 sm:p-6 bg-zinc-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.accentHex }} />
            <h2 className="font-sans font-black text-base sm:text-lg text-white">Portfolio Command Center</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Gated Screen */}
        {!isAuthenticated ? (
          <div className="p-8 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-12">
            <Lock className="w-12 h-12 text-zinc-700 mb-4 animate-pulse" />
            <h3 className="text-white font-bold text-base">Security Verification Required</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6 leading-relaxed">
              To verify administrative privileges, enter the passcode.
            </p>

            <form onSubmit={handleAuth} className="flex flex-col gap-3 w-full text-left">
              <input
                type="password"
                placeholder="Enter passcode"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white text-xs font-mono outline-none focus:border-zinc-700"
                style={{ focusBorderColor: currentTheme.accentHex }}
              />
              {authError && (
                <div className="text-[10px] font-mono text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {authError}
                </div>
              )}
              <button
                type="submit"
                className="mt-2 py-3 rounded-xl text-xs font-bold font-mono tracking-wider text-black transition-all cursor-pointer hover:brightness-110"
                style={{ backgroundColor: currentTheme.accentHex }}
              >
                UNLOCK SYSTEM
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Admin Panel Dashboard */
          <div className="flex flex-col flex-1 min-h-0">
            
            {/* Top Navigation Tabs - Horizontally Scrollable on Mobile */}
            <div className="flex flex-nowrap items-center gap-2 p-3 overflow-x-auto border-b border-zinc-900 bg-zinc-950/40 scrollbar-none">
              <button
                onClick={() => { setActiveTab('projects'); playSound(350); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap`}
                style={
                  activeTab === 'projects'
                    ? { backgroundColor: `${currentTheme.accentHex}20`, border: `1px solid ${currentTheme.accentHex}`, color: 'white' }
                    : { border: '1px solid transparent', color: '#71717a' }
                }
              >
                🎬 PROJECTS TIMELINE
              </button>
              <button
                onClick={() => { setActiveTab('ai-upload'); playSound(350); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap`}
                style={
                  activeTab === 'ai-upload'
                    ? { backgroundColor: `${currentTheme.accentHex}20`, border: `1px solid ${currentTheme.accentHex}`, color: 'white' }
                    : { border: '1px solid transparent', color: '#71717a' }
                }
              >
                ✨ AI MAGIC AUTOFILL
              </button>
              <button
                onClick={() => { setActiveTab('local-upload'); playSound(350); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap`}
                style={
                  activeTab === 'local-upload'
                    ? { backgroundColor: `${currentTheme.accentHex}20`, border: `1px solid ${currentTheme.accentHex}`, color: 'white' }
                    : { border: '1px solid transparent', color: '#71717a' }
                }
              >
                📁 UPLOAD VIDEO
              </button>
              <button
                onClick={() => { setActiveTab('site-content'); playSound(350); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap`}
                style={
                  activeTab === 'site-content'
                    ? { backgroundColor: `${currentTheme.accentHex}20`, border: `1px solid ${currentTheme.accentHex}`, color: 'white' }
                    : { border: '1px solid transparent', color: '#71717a' }
                }
              >
                ✏️ EDIT SITE DETAILS
              </button>
              <button
                onClick={() => { setActiveTab('settings'); playSound(350); }}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-black tracking-wider transition-all cursor-pointer flex-shrink-0 whitespace-nowrap`}
                style={
                  activeTab === 'settings'
                    ? { backgroundColor: `${currentTheme.accentHex}20`, border: `1px solid ${currentTheme.accentHex}`, color: 'white' }
                    : { border: '1px solid transparent', color: '#71717a' }
                }
              >
                ⚙️ SYSTEM SETTINGS
              </button>
            </div>

            {/* Main Content Area */}
            <div data-lenis-prevent className="p-4 md:p-8 overflow-y-auto flex-1 min-h-0">
              
              {/* TAB 1: PROJECTS TIMELINE */}
              {activeTab === 'projects' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                  <ProjectForm
                    editingId={editingId}
                    title={title}
                    setTitle={setTitle}
                    link={link}
                    setLink={setLink}
                    type={type}
                    setType={setType}
                    niche={niche}
                    setNiche={setNiche}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    description={description}
                    setDescription={setDescription}
                    thumbnail={thumbnail}
                    setThumbnail={setThumbnail}
                    duration={duration}
                    setDuration={setDuration}
                    role={role}
                    setRole={setRole}
                    software={software}
                    setSoftware={setSoftware}
                    client={client}
                    setClient={setClient}
                    resolution={resolution}
                    setResolution={setResolution}
                    frameRate={frameRate}
                    setFrameRate={setFrameRate}
                    colorGrade={colorGrade}
                    setColorGrade={setColorGrade}
                    audioSpecs={audioSpecs}
                    setAudioSpecs={setAudioSpecs}
                    challenges={challenges}
                    setChallenges={setChallenges}
                    solutions={solutions}
                    setSolutions={setSolutions}
                    fullDescription={fullDescription}
                    setFullDescription={setFullDescription}
                    onSubmit={handleSaveProject}
                    onCancel={resetProjectForm}
                    currentTheme={currentTheme}
                    playSound={playSound}
                    slotNumber={
                      editingId
                        ? projects
                            .filter((p) => p.aspectRatio === aspectRatio)
                            .findIndex((p) => p.id === editingId) + 1 || 1
                        : 1
                    }
                  />

                  <ProjectList
                    projects={projects}
                    onEditInit={handleEditInit}
                    onDelete={handleDelete}
                    onResetDefaults={onResetDefaults}
                    onExport={handleExport}
                    onAddNew={resetProjectForm}
                    playSound={playSound}
                  />
                </div>
              )}

              {/* TAB 2: AI MAGIC AUTOFILL */}
              {activeTab === 'ai-upload' && (
                <AiAutofill
                  currentTheme={currentTheme}
                  soundEnabled={soundEnabled}
                  playSound={playSound}
                  geminiApiKey={geminiApiKey}
                  onAutofillComplete={handleAutofillComplete}
                />
              )}

              {/* TAB 3: LOCAL FILE UPLOADER */}
              {activeTab === 'local-upload' && (
                <LocalUploader
                  currentTheme={currentTheme}
                  soundEnabled={soundEnabled}
                  playSound={playSound}
                  onApplyUrl={(url) => {
                    setLink(url);
                    alert(`Applied URL path: ${url}`);
                    setActiveTab('projects');
                    playSound(700);
                  }}
                />
              )}

              {/* TAB 4: EDIT SITE DETAILS */}
              {activeTab === 'site-content' && (
                <form onSubmit={handleSaveSiteContent} className="text-left flex flex-col gap-8">
                  {/* Hero texts config */}
                  <div className="flex flex-col gap-4 border border-zinc-900 p-6 rounded-xl bg-zinc-950/20">
                    <div>
                      <h4 className="font-sans font-black text-sm text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex }} />
                        Hero Landing Page Text
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Edit texts appearing in the top landing view.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Available Pill Text</label>
                        <input
                          type="text"
                          value={heroStatusText}
                          onChange={(e) => setHeroStatusText(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Slots Notification Text</label>
                        <input
                          type="text"
                          value={heroSlotsText}
                          onChange={(e) => setHeroSlotsText(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Title Line 1 (Normal)</label>
                        <input
                          type="text"
                          value={heroTitleNormal}
                          onChange={(e) => setHeroTitleNormal(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Title Line 2 (Gradient)</label>
                        <input
                          type="text"
                          value={heroTitleGradient}
                          onChange={(e) => setHeroTitleGradient(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Title Line 3 (Suffix)</label>
                        <input
                          type="text"
                          value={heroTitleSuffix}
                          onChange={(e) => setHeroTitleSuffix(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs font-mono">
                      <label className="text-zinc-500">Hero Subtitle / Pitch Statement</label>
                      <textarea
                        rows={2}
                        value={heroDescription}
                        onChange={(e) => setHeroDescription(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white resize-none font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">CV Download URL</label>
                        <input
                          type="text"
                          value={heroCvLink}
                          onChange={(e) => setHeroCvLink(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                        />
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono border-t border-zinc-900/60 pt-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 1 Val</label>
                          <input type="text" value={heroMetric1Val} onChange={(e) => setHeroMetric1Val(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 1 Label</label>
                          <input type="text" value={heroMetric1Lbl} onChange={(e) => setHeroMetric1Lbl(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 2 Val</label>
                          <input type="text" value={heroMetric2Val} onChange={(e) => setHeroMetric2Val(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 2 Label</label>
                          <input type="text" value={heroMetric2Lbl} onChange={(e) => setHeroMetric2Lbl(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 3 Val</label>
                          <input type="text" value={heroMetric3Val} onChange={(e) => setHeroMetric3Val(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-zinc-500">Metric 3 Label</label>
                          <input type="text" value={heroMetric3Lbl} onChange={(e) => setHeroMetric3Lbl(e.target.value)} className="px-2 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About section config */}
                  <div className="flex flex-col gap-4 border border-zinc-900 p-6 rounded-xl bg-zinc-950/20">
                    <div>
                      <h4 className="font-sans font-black text-sm text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex }} />
                        About Section Content
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Manage biography, profile photos, and location tags.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs font-mono">
                      <label className="text-zinc-500">About Title Header</label>
                      <input
                        type="text"
                        value={aboutTitle}
                        onChange={(e) => setAboutTitle(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Bio Paragraph 1</label>
                        <textarea
                          rows={4}
                          value={aboutBioParagraph1}
                          onChange={(e) => setAboutBioParagraph1(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white resize-none font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Bio Paragraph 2</label>
                        <textarea
                          rows={4}
                          value={aboutBioParagraph2}
                          onChange={(e) => setAboutBioParagraph2(e.target.value)}
                          className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white resize-none font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Experience Stamp</label>
                        <input type="text" value={aboutExperience} onChange={(e) => setAboutExperience(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Education Stamp</label>
                        <input type="text" value={aboutEducation} onChange={(e) => setAboutEducation(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Availability Stamp</label>
                        <input type="text" value={aboutAvailability} onChange={(e) => setAboutAvailability(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Profile Image URL</label>
                        <input type="text" value={aboutProfileImage} onChange={(e) => setAboutProfileImage(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Location Stamp Header</label>
                        <input type="text" value={aboutLocationStamp} onChange={(e) => setAboutLocationStamp(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs font-mono">
                      <label className="text-zinc-500">Skills Tags (Comma-separated)</label>
                      <input
                        type="text"
                        value={aboutTags}
                        onChange={(e) => setAboutTags(e.target.value)}
                        className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white"
                      />
                    </div>
                  </div>

                  {/* Synced Video Progressions Manager */}
                  <div className="flex flex-col gap-6 border border-zinc-900 p-6 rounded-xl bg-zinc-950/20">
                    <div>
                      <h4 className="font-sans font-black text-sm text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex }} />
                        Synced 4-Step Video Progression Categories
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Customize the step-by-step video showcases shown in your Before/After tab.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {progressions.map((prog, idx) => (
                        <div key={prog.id || idx} className="border border-zinc-900 bg-zinc-950/30 rounded-lg p-4 flex flex-col gap-4 relative">
                          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase">#{idx + 1} Niche</span>
                              <input
                                type="text"
                                value={prog.label || ''}
                                onChange={(e) => handleUpdateProgField(prog.id, 'label', e.target.value)}
                                placeholder="Niche Name (e.g. Talking Head)"
                                className="font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-800 focus:border-zinc-700 outline-none text-xs px-1"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove the "${prog.label || 'Niche'}" progression card set?`)) {
                                  setProgressions(prev => prev.filter(p => p.id !== prog.id));
                                  playSound(400);
                                }
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300 font-mono cursor-pointer"
                            >
                              DELETE
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                            <div className="flex flex-col gap-1">
                              <label className="text-zinc-500">1. Raw Video (YouTube Link)</label>
                              <input
                                type="text"
                                value={prog.rawVideo || ''}
                                onChange={(e) => handleUpdateProgField(prog.id, 'rawVideo', e.target.value)}
                                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-800 text-[11px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-zinc-500">2. Edit Video (YouTube Link)</label>
                              <input
                                type="text"
                                value={prog.editVideo || ''}
                                onChange={(e) => handleUpdateProgField(prog.id, 'editVideo', e.target.value)}
                                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-800 text-[11px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-zinc-500">3. SFX + Color Video (YouTube Link)</label>
                              <input
                                type="text"
                                value={prog.sfxColorVideo || ''}
                                onChange={(e) => handleUpdateProgField(prog.id, 'sfxColorVideo', e.target.value)}
                                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-800 text-[11px]"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-zinc-500">4. Final Video (YouTube Link)</label>
                              <input
                                type="text"
                                value={prog.finalVideo || ''}
                                onChange={(e) => handleUpdateProgField(prog.id, 'finalVideo', e.target.value)}
                                className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-800 text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          const newId = 'prog_' + Math.random().toString(36).substr(2, 9);
                          setProgressions(prev => [
                            ...prev,
                            {
                              id: newId,
                              niche: 'new-niche',
                              label: 'New Niche Category',
                              rawVideo: '',
                              editVideo: '',
                              sfxColorVideo: '',
                              finalVideo: ''
                            }
                          ]);
                          playSound(500);
                        }}
                        className="py-2.5 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-400 hover:text-white font-bold transition-all text-xs font-mono cursor-pointer"
                      >
                        + ADD NEW SHOWCASE CATEGORY
                      </button>
                    </div>
                  </div>

                  {/* Contact section config */}
                  <div className="flex flex-col gap-4 border border-zinc-900 p-6 rounded-xl bg-zinc-950/20">
                    <div>
                      <h4 className="font-sans font-black text-sm text-white flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.accentHex }} />
                        Contact & Social Information
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Control email, telephone, location, and social links.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Contact Headline</label>
                        <input type="text" value={contactHeadline} onChange={(e) => setContactHeadline(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Contact Subheadline</label>
                        <input type="text" value={contactSubheadline} onChange={(e) => setContactSubheadline(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Email Address</label>
                        <input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Phone Number</label>
                        <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">Instagram Profile Link</label>
                        <input type="text" value={contactInstagramUrl} onChange={(e) => setContactInstagramUrl(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-zinc-500">WhatsApp chat Link</label>
                        <input type="text" value={contactWhatsappUrl} onChange={(e) => setContactWhatsappUrl(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 text-xs font-mono">
                      <label className="text-zinc-500">Business Location</label>
                      <input type="text" value={contactLocation} onChange={(e) => setContactLocation(e.target.value)} className="px-3 py-2 rounded bg-zinc-950 border border-zinc-900 text-white" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-3 rounded-xl font-bold text-black transition-all cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: currentTheme.accentHex }}
                  >
                    SAVE SITE CONTENT DATA
                  </button>
                </form>
              )}

              {/* TAB 5: SYSTEM SETTINGS */}
              {activeTab === 'settings' && (
                <div className="max-w-md mx-auto text-left flex flex-col gap-6">
                  <div>
                    <p className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">SYSTEM CONFIG</p>
                    <h3 className="font-sans font-black text-xl text-white mt-1">Keys & Defaults</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Enter your Gemini API key to enable AI autofill. The key is securely written to `.env` on your workspace server.
                    </p>
                  </div>

                  <form onSubmit={handleSaveSettings} className="flex flex-col gap-4 text-xs font-mono">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-zinc-400">GEMINI_API_KEY</label>
                      <input
                        type="password"
                        placeholder="Paste your Gemini API key"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        className="px-3.5 py-3 rounded-lg bg-zinc-950 border border-zinc-900 text-white outline-none focus:border-zinc-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={savingApiKey}
                      className="py-3 rounded-xl font-bold text-black transition-all cursor-pointer hover:brightness-110 disabled:opacity-50"
                      style={{ backgroundColor: currentTheme.accentHex }}
                    >
                      {savingApiKey ? 'SAVING KEY...' : 'SAVE SETTINGS'}
                    </button>
                  </form>

                  <div className="border-t border-zinc-900 pt-6 mt-4 flex flex-col gap-3">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Danger Zone</span>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all portfolio projects to preloaded defaults? This will erase custom added projects.')) {
                          onResetDefaults();
                          playSound(400);
                          alert('Reset successful!');
                        }
                      }}
                      className="w-full py-2.5 rounded-lg border border-red-950/40 bg-red-950/10 text-red-400 font-bold hover:bg-red-950/30 transition-all cursor-pointer text-xs"
                    >
                      Reset Portfolio Content to Defaults
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
