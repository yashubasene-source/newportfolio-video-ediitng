# Project Overview

This portfolio is a premium, high-performance web application designed for a video editor and graphic designer (Anshay Basene) to showcase commercial campaigns, cinematic documentaries, short-form reels, and brand designs.

---

## 1. Key Features

### 🎬 Scene Entry Preloader
- Mimics a film slate clapperboard countdown (3-2-1) with synthetic beeps and a final mechanical clack.
- Triggers the main entrance transition and stores the preloader completed state in `sessionStorage` to avoid repeating.

### 🃏 Tactile Interactive Card Stack
- Located in the Hero section.
- Simulates a stack of physical papers held together by a binder clip.
- Users can hover to offset them or click individual sheets to inspect different creative sectors.

### 🔍 Synced Video Showcase
- Filters commercial work between vertical `9:16 Reels` and horizontal `16:9 Videos` (up to 20 slots each).
- Clicking any card opens a responsive dark lightbox. If the project contains a standard YouTube/Instagram video link, it renders an iframe player; if it is a local file, it renders an HTML5 video tag.

### 🔄 Synced 4-Step Cinematic Progression Grid
- Replaces standard slider tools to show editing stages: `1. Raw` (original camera format), `2. Edit` (timeline cuts), `3. SFX + Color` (sound design/color grade), and `4. Final`.
- Playback and scrubbing seek commands are synchronized across all 4 players using the **YouTube IFrame API**.
- Audio streams only from the final player to avoid echoing.

### 🧮 Interactive Pricing Calculator
- Allows potential clients to estimate budgets dynamically by inputting duration (seconds), editing style (glitch, clean, documentary), sound design complexity, and rush timeline targets.

### 🔒 Password-Protected Site Editor
- Allows editing projects list and site landing texts (headline, CV link, bio description, contact coordinates, synced video progression collections) directly from the browser.
- Updates are instantly persisted on the Node.js server database.
