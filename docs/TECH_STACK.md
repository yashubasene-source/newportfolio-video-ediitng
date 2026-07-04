# Tech Stack Specification

This document details the complete technology stack of the Anshay Basene Portfolio project, serving as the source of truth for all documentation.

---

## 1. Core Frameworks & Runtime

| Technology | Role | Version | Details / Architecture |
| :--- | :--- | :--- | :--- |
| **Node.js** | Backend Runtime | `v20.x+` | Standard JavaScript/TypeScript execution environment. |
| **Express** | Web/API Server | `^4.21.2` | Delivers static assets and hosts REST APIs. |
| **React** | Frontend UI Framework | `^19.0.1` | Declarative component-based UI rendering. |
| **Vite** | Build Tool & Bundler | `^6.2.3` | Orchestrates dev server hot-module replacement and minified production outputs. |
| **TypeScript** | Program Language | `~5.8.2` | Strict type safety check coverage for both client and server code. |
| **npm** | Package Manager | `v10.x+` | Package versioning and lockfile compiler. |

---

## 2. Frontend Modules & Design System

| Category | Library | Version | Usage |
| :--- | :--- | :--- | :--- |
| **Styling** | Tailwind CSS | `^4.1.14` | Styling layout utilities, variables, and dark/light components. |
| **Icons** | Lucide React | `^0.546.0` | SVG icon sets (Play, Sparkles, MapPin, settings, etc.). |
| **Animations** | motion/react (Framer Motion) | `^12.23.24` | Dynamic spring cards, text reveals, modals, and list grids. |
| **Smooth Scrolling** | Lenis | `^1.1.x` | Cinematic hardware-accelerated inertia scroll control. |
| **Timeline Tools** | GSAP / ScrollTrigger | `^3.12.x` | Precise scroll timeline sequencing hooks. |

---

## 3. Backend & Data Management

| Feature | Solution | Location / Detail |
| :--- | :--- | :--- |
| **Database** | Flat-File JSON Database | [site-db.json](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/backend/data/site-db.json) (synchronized client-side on save) |
| **Storage** | Multer | local `/assets/` directory (for project thumbnails and assets) |
| **AI Integration** | @google/genai | `^2.4.0` |

---

## 4. Custom Architectural Components

- **Performance Motion System**: Custom logic in [motion/](file:///d:/coding%20file/new%20modification%20of%20my%20portfolio/anshay-basene-portfolio/frontend/src/motion/) that dynamically checks browser capabilities and toggles between Full, Balanced, and Lite modes to prevent render frame-rate drops.
- **Synced Before/After Grid**: Hardware-accelerated 4-column video player syncing with standard 16:9 YouTube media cropped to 9:16 layout using absolute styling.
- **Calculator Engine**: Video pricing estimator based on seconds, timeline style, sound complexity, and delivery dates.
