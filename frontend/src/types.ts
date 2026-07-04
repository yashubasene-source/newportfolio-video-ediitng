/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProjectType = 'video' | 'graphic' | 'motion';

export type NicheType = 'all' | 'fun-edit' | 'daily-edit' | 'motion' | 'normal-edit' | 'typography';

export interface Project {
  id: string;
  type: ProjectType;
  niche: NicheType;
  title: string;
  description: string;
  link: string; // YouTube URL, MP4 link, or Image URL
  thumbnail?: string; // Optional custom thumbnail URL
  software?: string[]; // e.g. ["Premiere Pro", "After Effects"]
  duration?: string; // e.g. "0:45" or "12:15"
  role?: string; // e.g. "Lead Editor", "VFX Artist"
  createdAt?: string; // e.g. "2026"
  aspectRatio?: '9:16' | '16:9'; // Added for vertical reel vs landscape video grid system
  
  // Extra detailed project metadata for full-screen detail overlay
  client?: string; // e.g. "TechCorp", "Gaming Influencer"
  resolution?: string; // e.g. "4K UHD (3840x2160)" or "1080x1920 Vertical"
  frameRate?: string; // e.g. "60 FPS", "24 FPS"
  colorGrade?: string; // e.g. "DaVinci Rec.709 Cinematic" or "S-Log3 custom LUT"
  audioSpecs?: string; // e.g. "Stereo, 48kHz, Sound Designed"
  challenges?: string; // Creative or technical challenges faced
  solutions?: string; // Professional solutions implemented to solve challenges
  fullDescription?: string; // Longer full-text story behind the edit
}

export interface CalculatorState {
  serviceType: string;
  duration: 'short' | 'medium' | 'long';
  turnaround: 'normal' | 'rush';
  revisions: 'two' | 'unlimited';
}

export interface ThemeColors {
  id: string;
  name: string;
  accent: string;       // Primary tailwind class, e.g. "purple"
  accentHex: string;    // Accent color code, e.g. "#a855f7"
  glowColor: string;    // RGBA glow string
}
