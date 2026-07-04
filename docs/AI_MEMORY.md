# AI Memory & Architectural Decisions (ADR)

This document records the architectural decisions, coding standards, and naming conventions to ensure consistency for future maintenance cycles.

---

## 1. Architectural Decision Records (ADR)

### ADR 01: Flat-File JSON Database vs Relational SQLite/MongoDB
- **Context**: The portfolio needs to load instantly and store only up to 20 Reels and 20 Videos, plus site text configs.
- **Decision**: Use flat-file JSON files (`site-db.json` and `projects-db.json`) located at `/backend/data/`.
- **Consequence**: Zero installation and maintenance overhead. High speed read/write operations. However, this requires a persistent filesystem deployment environment (like Render with a mounted persistent volume or a VPS).

### ADR 02: Local Multer Uploads vs External CDN/Cloudinary
- **Context**: Visual project thumbnails must be customizable from the admin panel.
- **Decision**: Use Node's local directory storage via **Multer** middleware, mapping assets to static server uploads.
- **Consequence**: Keeps the project self-contained and avoids dependencies on external paid visual storage APIs. Replaced filenames are timestamped to avoid cache collisions.

### ADR 03: Custom Performance Motion System vs Pure Framer Motion
- **Context**: The site must feel premium on high-end hardware, but remain responsive on budget Android phones.
- **Decision**: Avoid animating layout-altering keys and use a custom `usePerformance()` hook to scale animations down to opacity-only fades in `lite` mode.
- **Consequence**: Complete removal of scroll and animation lag on low-end mobile devices, while preserving fluid motion on desktop displays.

---

## 2. Coding Standards & Naming Conventions

### 1. File Naming Rules
- **React Components**: PascalCase (e.g., `TactileCardStack.tsx`, `BeforeAfter.tsx`).
- **Utility / Script Files**: camelCase (e.g., `deviceDetection.ts`, `server.ts`).
- **Styling Files**: lowercase (e.g., `index.css`).

### 2. Element IDs
- Every interactive element (tabs, inputs, modal triggers) must carry unique, descriptive `id` tags to facilitate automated client-side browser testing (e.g., `nav-admin-btn`, `cut-to-admin-btn`, `floating-whatsapp-btn`).

### 3. Component Design Rules
- Keep hooks and helper functions separated from component visual markup.
- Dynamically scale durations and translations using settings variables derived from `usePerformance()`.
