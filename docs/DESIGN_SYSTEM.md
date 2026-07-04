# Design System & Guidelines

This document specifies the typography, color scales, layout grids, spacing rules, and responsive design systems of the portfolio.

---

## 1. Color Palette System

The portfolio supports four dynamic theme configs. Each contains an accent, a hex code, and an ambient glow coefficient:

| Theme Name | Primary Accent | Accent Hex | glowColor |
| :--- | :--- | :--- | :--- |
| **Cyber Violet** | Purple | `#a855f7` | `rgba(168,85,247,0.3)` |
| **Emerald Hack** | Emerald | `#10b981` | `rgba(16,185,129,0.3)` |
| **Sunset Crimson** | Red | `#ef4444` | `rgba(239,68,68,0.3)` |
| **Electric Sky** | Cyan | `#06b6d4` | `rgba(6,182,212,0.3)` |

- **Core background color**: `#FAF7F2` (Warm linen canvas).
- **Core text color**: `#0F172A` (Slate 900).
- **Dark mode components**: `#06060a` (Vignette black backdrop for lightboxes and loaders).

---

## 2. Typography

- **Headers & Titles**: sans-serif font family with ultra-bold weights (`font-black`, e.g. Inter/Outfit).
- **Body Text**: Slate sans-serif with comfortable line heights (`leading-relaxed`, text size `text-sm` or `text-base`).
- **Code & Metadata**: monospace font family (`font-mono`, e.g. Fira Code/Source Code Pro) for timecodes, badges, tags, and status labels.

---

## 3. UI/UX Philosophy

### Glassmorphism & Tactile Materials:
- **tactile cards**: Multi-layered cards styled with custom borders (`border-slate-900`), solid background fill, and offset dropshadows.
- **glass capsules**: Rounded components (`glass-pill`) combining a light translucent border, subtle background opacity, and backdrop-blur effects.

### Responsive Design Bounds:
- **Mobile (< 768px)**: Horizontal grids scale to single-column card collections. Main showcases filter buttons stack vertically. Hover effects and smooth scrolling are disabled.
- **Tablet (768px - 1024px)**: Dual-column layouts. Layout animations use basic transition rules.
- **Desktop (> 1024px)**: Full scale grids (up to 8 columns for Reels). High-fidelity parallax scrolling and spring calculations are active.

---

## 4. Animation Specifications

Transitions are mapped to the performance mode:

```typescript
// Full Mode
{
  duration: 0.8,
  ease: 'power2.out',
  stagger: 0.1,
  yOffset: 30,
  scaleOffset: 0.98,
}

// Lite Mode
{
  duration: 0.4,
  ease: 'sine.out',
  stagger: 0,
  yOffset: 5,
  scaleOffset: 1.0,
}
```
- Continuous bouncing loops are disabled on low-power devices to avoid drawing main thread GPU cycles.
