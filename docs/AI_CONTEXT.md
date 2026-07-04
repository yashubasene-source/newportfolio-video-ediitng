# AI Context Specification (AI_CONTEXT)

This file is generated specifically for AI coding assistants (e.g. Cursor, Copilot, ChatGPT, Claude, Gemini, Windsurf, Antigravity) to establish absolute project context, architecture, design rules, and file mapping without requiring full codebase crawls.

---

## 1. Project Essence & Business Goals

- **What is it?**: A high-end, highly optimized interactive portfolio for a professional Video Editor and Graphic Designer (Anshay Basene).
- **Why does it exist?**: To act as a conversion engine for global clients (content creators, real estate agents, agencies) by demonstrating premium editing capabilities and providing a seamless pricing estimator and content manager.
- **Target Audience**: YouTubers, marketing agency directors, real estate developers, and commercial production leads looking for premium post-production.
- **Conversion Loops**:
  - Interactive pricing calculator providing quick budget estimations.
  - Immersive video grids demonstrating before/after editing value.
  - Direct communication triggers to WhatsApp and FormSubmit mail forms.

---

## 2. Core Architectural Design

- **Backend**: Express (Node.js) server acting as a static asset host and a JSON REST API provider.
- **Database**: Zero-dependency JSON flat-files located at `/backend/data/`. Simple synchronization script runs on server mutations to duplicate database states back to the client-side `frontend/src/data/` fallback directories.
- **Frontend**: Single Page Application (SPA) built with React 19, TypeScript, and Vite.
- **Styling**: Tailwind CSS v4 using pure utility layout variables.
- **Animations**: Progressive acceleration framework using Framer Motion (`motion/react`), Lenis smooth scrolling, and GSAP/ScrollTrigger.

---

## 3. Modular File & Component Map

### Frontend Components:
- **[App.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/App.tsx)**: Main layout coordinator. Initializes data load and sets up the `PerformanceProvider` context.
- **[Hero.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/Hero.tsx)**: Bio details and call-to-actions. Holds the [TactileCardStack](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/TactileCardStack.tsx) component.
- **[BeforeAfter.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/BeforeAfter.tsx)**: Synced horizontal video grids playing Raw, Edit, SFX/Color, and Final clips simultaneously with audio isolated on the final player.
- **[Showcase.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/Showcase.tsx)**: Carousel grids for Reels (9:16) and Videos (16:9). Clicking items launches the detail lightbox.
- **[Calculator.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/Calculator.tsx)**: Dynamic video pricing tool.
- **[AdminPanel.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/components/AdminPanel.tsx)**: CRUD manager for portfolios and landing texts.

### [motion/](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/motion/) Performance System:
- **[deviceDetection.ts](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/motion/deviceDetection.ts)**: Measures browser memory, CPU, and device widths.
- **[performanceManager.tsx](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/motion/performanceManager.tsx)**: Context provider tracking the performance states (`full`, `balanced`, `lite`, `reduced`).
- **[scrollAnimations.ts](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/motion/scrollAnimations.ts)**: Initializes Lenis smooth scrolling (auto-disabled on low-end hardware).

---

## 4. Coding Conventions & Decisions

### 1. Style Guides
- Tailwind CSS v4 must be used for all styling adjustments. Avoid inline CSS overrides except when loading dynamic configurations from the active theme object (`currentTheme`).
- Maintain consistent spacing tokens using standard Tailwind padding (`p-4`, `p-6`) and margins.

### 2. Animation Rules
- Animating layout-altering CSS keys (e.g. `width`, `height`, `top`, `left`, `margin`) is strictly forbidden.
- Always use GPU-accelerated keys: `transform` (using scale, x, y, rotate) and `opacity`.
- Showcase grid updates must set `layout={isLiteMode ? false : "position"}` to prevent expensive browser layout reflow calculations.

### 3. File Operations
- Write backend database records to JSON flat-files at `/backend/data/`. Do not introduce secondary SQLite or external DB connections unless explicitly requested.
- Use **Multer** settings in `server.ts` to restrict uploads strictly to images under 5MB.
