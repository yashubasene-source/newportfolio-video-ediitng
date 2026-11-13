/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { Project, ThemeColors } from './types';
import { DEFAULT_PROJECTS } from './data/defaultProjects';
import DEFAULT_SITE_CONFIG from './data/site-db.json';

import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ClientStrip from './components/ClientStrip';
import Showcase from './components/Showcase';
import BeforeAfter from './components/BeforeAfter';
import Calculator from './components/Calculator';
import About from './components/About';
import Skills from './components/Skills';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectViewer from './components/ProjectViewer';
import MotionStories from './components/MotionStories';
import ResumeModal from './components/ResumeModal';
import CinematicScrollExperience from './components/CinematicScrollExperience';

const AdminPanel = lazy(() => import('./components/AdminPanel'));
const AuditReport = lazy(() => import('./components/AuditReport'));

// Performance motion system imports
import { PerformanceProvider, usePerformance } from './motion/performanceManager';
import { useLenisScroll } from './motion/scrollAnimations';

// Themes configuration (Default: Luminous Moss & Silver #141414 from uploaded branding)
const THEMES: ThemeColors[] = [
  { id: 'luminous-moss', name: 'Luminous Moss', accent: 'moss', accentHex: '#2BEE34', glowColor: 'rgba(43,238,52,0.35)' },
  { id: 'violet', name: 'Cyber Violet', accent: 'purple', accentHex: '#a855f7', glowColor: 'rgba(168,85,247,0.3)' },
  { id: 'emerald', name: 'Emerald Hack', accent: 'emerald', accentHex: '#10b981', glowColor: 'rgba(16,185,129,0.3)' },
  { id: 'crimson', name: 'Sunset Crimson', accent: 'red', accentHex: '#ef4444', glowColor: 'rgba(239,68,68,0.3)' },
  { id: 'sky', name: 'Electric Sky', accent: 'cyan', accentHex: '#06b6d4', glowColor: 'rgba(6,182,212,0.3)' },
];

function MainContent() {
  const [preloaderComplete, setPreloaderComplete] = useState(() => {
    try {
      return sessionStorage.getItem('anshay-preloader-completed') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeColors>(THEMES[0]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [timecode, setTimecode] = useState('00:00:00:00');

  // Grab performance capability from context
  const { capabilities, settings } = usePerformance();

  // Initialize smooth scrolling with Lenis (auto-disabled in lite/reduced modes)
  useLenisScroll(settings, capabilities.mode);

  // Load portfolio projects and site config on initialization
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProjects(data);
            localStorage.setItem('anshay-portfolio-projects', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load projects from server, falling back to local storage', err);
      }

      // Local storage fallback
      try {
        const stored = localStorage.getItem('anshay-portfolio-projects');
        if (stored) {
          setProjects(JSON.parse(stored));
        } else {
          setProjects(DEFAULT_PROJECTS);
          localStorage.setItem('anshay-portfolio-projects', JSON.stringify(DEFAULT_PROJECTS));
        }
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
      }
    };

    const fetchSiteConfig = async () => {
      try {
        const response = await fetch('/api/site');
        if (response.ok) {
          const data = await response.json();
          if (data && data.hero) {
            setSiteConfig(data);
            localStorage.setItem('anshay-portfolio-site', JSON.stringify(data));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load site config from server, falling back to defaults', err);
      }

      // Local storage or default fallback
      try {
        const stored = localStorage.getItem('anshay-portfolio-site');
        if (stored) {
          setSiteConfig(JSON.parse(stored));
        } else {
          setSiteConfig(DEFAULT_SITE_CONFIG);
          localStorage.setItem('anshay-portfolio-site', JSON.stringify(DEFAULT_SITE_CONFIG));
        }
      } catch (e) {
        setSiteConfig(DEFAULT_SITE_CONFIG);
      }
    };

    fetchProjects();
    fetchSiteConfig();
  }, []);

  // Sync projects state to local storage and server backend
  const handleUpdateProjects = async (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    try {
      localStorage.setItem('anshay-portfolio-projects', JSON.stringify(updatedProjects));
    } catch (e) {}

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProjects),
      });
    } catch (err) {
      console.error('Failed to sync projects to server', err);
    }
  };

  // Sync site config state to local storage and server backend
  const handleUpdateSiteConfig = async (newConfig: any) => {
    setSiteConfig(newConfig);
    try {
      localStorage.setItem('anshay-portfolio-site', JSON.stringify(newConfig));
    } catch (e) {}

    try {
      await fetch('/api/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });
    } catch (err) {
      console.error('Failed to sync site config to server', err);
    }
  };

  // Reset to original preloaded projects
  const handleResetDefaults = async () => {
    setProjects(DEFAULT_PROJECTS);
    setSiteConfig(DEFAULT_SITE_CONFIG);
    try {
      localStorage.setItem('anshay-portfolio-projects', JSON.stringify(DEFAULT_PROJECTS));
      localStorage.setItem('anshay-portfolio-site', JSON.stringify(DEFAULT_SITE_CONFIG));
    } catch (e) {}

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(DEFAULT_PROJECTS),
      });
      await fetch('/api/site', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(DEFAULT_SITE_CONFIG),
      });
    } catch (err) {
      console.error('Failed to reset on server', err);
    }
  };

  // Scroll timecode controller
  useEffect(() => {
    const handleTimecode = () => {
      const scrollY = window.scrollY;
      const totalFrames = Math.floor(scrollY * 0.12); // Speed ratio
      const frames = String(totalFrames % 24).padStart(2, '0');
      const seconds = String(Math.floor(totalFrames / 24) % 60).padStart(2, '0');
      const minutes = String(Math.floor(totalFrames / (24 * 60)) % 60).padStart(2, '0');
      const hours = String(Math.floor(totalFrames / (24 * 60 * 60)) % 24).padStart(2, '0');
      setTimecode(`${hours}:${minutes}:${seconds}:${frames}`);
    };
    window.addEventListener('scroll', handleTimecode);
    return () => window.removeEventListener('scroll', handleTimecode);
  }, []);

  const isLiteMode = capabilities.mode === 'lite' || capabilities.mode === 'reduced';

  return (
    <div className="bg-[#141414] text-white min-h-screen selection:bg-[#2BEE34]/25 selection:text-white font-sans scroll-smooth antialiased relative overflow-x-hidden">
      
      {/* Cinematic count entry loader */}
      {!preloaderComplete ? (
        <Preloader
          onComplete={() => setPreloaderComplete(true)}
          soundEnabled={soundEnabled}
        />
      ) : (
        /* Full Portfolio Layout */
        <div className="flex flex-col relative min-h-screen">
          {/* Ambient Lighting Glows in Luminous Moss and Dark Obsidian */}
          {!isLiteMode && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute -top-[5%] -left-[10%] w-[50%] h-[45%] bg-[#2BEE34] rounded-full blur-[180px] opacity-[0.06] animate-glow-1" />
              <div className="absolute top-[30%] -right-[10%] w-[55%] h-[50%] bg-[#10b981] rounded-full blur-[180px] opacity-[0.05] animate-glow-2" />
              <div className="absolute top-[65%] -left-[15%] w-[50%] h-[45%] bg-[#2BEE34] rounded-full blur-[180px] opacity-[0.05] animate-glow-1" />
              <div className="absolute -bottom-[5%] right-[10%] w-[45%] h-[40%] bg-[#06b6d4] rounded-full blur-[160px] opacity-[0.05] animate-glow-2" />
            </div>
          )}

          {/* Header/Nav */}
          <Navbar
            currentTheme={currentTheme}
            setTheme={setCurrentTheme}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            themesList={THEMES}
            onOpenAdmin={() => setAdminOpen(true)}
            onOpenReport={() => setReportOpen(true)}
            onOpenResume={() => setResumeOpen(true)}
          />

          {/* Main sections */}
          <main className="flex-1">
            <Hero
              currentTheme={currentTheme}
              soundEnabled={soundEnabled}
              heroConfig={siteConfig?.hero}
              projectsList={projects}
              onSelectProject={setSelectedProject}
              onOpenResume={() => setResumeOpen(true)}
            />
            <ClientStrip />
            <MotionStories
              currentTheme={currentTheme}
              soundEnabled={soundEnabled}
            />
            <Showcase
              currentTheme={currentTheme}
              soundEnabled={soundEnabled}
              projectsList={projects}
              onOpenAdmin={() => setAdminOpen(true)}
              onSelectProject={setSelectedProject}
              isViewerOpen={Boolean(selectedProject) || adminOpen}
            />
            <Calculator currentTheme={currentTheme} soundEnabled={soundEnabled} />
            <About currentTheme={currentTheme} aboutConfig={siteConfig?.about} />
            <Skills currentTheme={currentTheme} soundEnabled={soundEnabled} />
            <FAQ currentTheme={currentTheme} soundEnabled={soundEnabled} />
            <Contact currentTheme={currentTheme} soundEnabled={soundEnabled} contactConfig={siteConfig?.contact} />
          </main>

          {/* Footer block */}
          <Footer currentTheme={currentTheme} soundEnabled={soundEnabled} />

          {/* Overlay Floating Film Timecode (mimics edit bays) */}
          <div className="fixed bottom-6 left-6 z-30 px-3 py-1.5 rounded-lg border border-white/10 bg-[#16181F]/90 backdrop-blur-md font-mono text-[9px] tracking-widest text-slate-400 shadow-xl flex items-center gap-1.5 select-none hidden sm:flex">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            TIMECODE: <span style={{ color: currentTheme.accentHex }} className="font-bold">{timecode}</span>
          </div>

          {/* Interactive Cinematic Scroll Experience (Audio synthesis, lightning velocity bar, glow aura cursor) */}
          <CinematicScrollExperience
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            currentTheme={currentTheme}
          />

          {/* Dedicated Resume Viewer Modal */}
          <ResumeModal
            isOpen={resumeOpen}
            onClose={() => setResumeOpen(false)}
            resumeUrl={siteConfig?.hero?.cvLink || '/assets/Anshay-Basene-Resume.pdf'}
            currentTheme={currentTheme}
          />

          {/* Portfolio Manager System Admin Modal */}
          {adminOpen && (
            <Suspense fallback={null}>
              <AdminPanel
                isOpen={adminOpen}
                onClose={() => setAdminOpen(false)}
                currentTheme={currentTheme}
                soundEnabled={soundEnabled}
                projects={projects}
                setProjects={handleUpdateProjects}
                onResetDefaults={handleResetDefaults}
                siteConfig={siteConfig}
                setSiteConfig={handleUpdateSiteConfig}
              />
            </Suspense>
          )}

          {/* Project Details Lightbox Viewer */}
          <ProjectViewer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            currentTheme={currentTheme}
            allProjects={projects}
            onSelectRelated={(p) => setSelectedProject(p)}
            isLiteMode={isLiteMode}
          />

          {/* Floating WhatsApp Action Button (Dynamic transitions based on capability) */}
          <motion.a
            id="floating-whatsapp-btn"
            href={siteConfig?.contact?.whatsappUrl || "https://wa.me/918319610243"}
            target="_blank"
            rel="noreferrer"
            initial={isLiteMode ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={isLiteMode ? { duration: 0.3 } : { delay: 1, type: 'spring' }}
            whileHover={isLiteMode ? {} : { scale: 1.1 }}
            whileTap={isLiteMode ? {} : { scale: 0.9 }}
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all bg-[#25D366] text-white hover:brightness-110 group"
            style={{
              boxShadow: isLiteMode ? 'none' : '0 8px 24px rgba(37, 211, 102, 0.4)',
            }}
          >
            <MessageCircle className="w-6 h-6 fill-white stroke-0" />
            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out font-mono text-[10px] uppercase font-bold tracking-wider whitespace-nowrap ml-0 group-hover:ml-2">
              Chat on WhatsApp
            </span>
          </motion.a>

          {/* Security and responsive design audit reports */}
          {reportOpen && (
            <Suspense fallback={null}>
              <AuditReport
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
                currentTheme={currentTheme}
                soundEnabled={soundEnabled}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <PerformanceProvider>
      <MainContent />
    </PerformanceProvider>
  );
}
