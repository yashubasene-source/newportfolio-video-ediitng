# Maintenance, Debugging & Troubleshooting

This document provides guidelines for testing, debugging local issues, resolving common runtime problems, and reviews the roadmap.

---

## 1. Testing Procedures

1. **Static Code Validation**:
   - Run the TypeScript compiler check across both frontend and backend configurations:
     ```bash
     npm run lint
     ```
2. **Production Bundle Verification**:
   - Verify that client compilation and server bundling build successfully:
     ```bash
     npm run build
     ```
3. **Local Testing Server**:
   - Start the local dev server using `tsx`:
     ```bash
     npm run dev
     ```

---

## 2. Debugging Guides

### Local JSON Databases:
- If site texts or project grids do not load, inspect the integrity of `/backend/data/site-db.json` and `/backend/data/projects-db.json`.
- When database edits are saved, the server duplicates the updated arrays back to `/frontend/src/data/`. If you notice discrepancies between local files and the website, verify that write permissions are enabled on the target directories.

### YouTube Synced Playback:
- If the 4-step progression grids do not sync, check if the browser console outputs `YT.Player` script errors. Ensure your development machine has access to `https://www.youtube.com/iframe_api`.
- Ad-blockers or security extensions can occasionally block the YouTube iframe API scripts. Temporarily disable them if players fail to initialize.

---

## 3. Common Troubleshooting

### 1. Iframe Third-Party Cookie Warnings
- **Cause**: Chrome/Safari flag warnings about YouTube cookie files.
- **Solution**: These are standard cross-origin warnings that do not impact user experiences or playback sync calculations.

### 2. Multer "File too large" Error
- **Cause**: Attempting to upload project visual thumbnails exceeding 5MB.
- **Solution**: Compress the image file (e.g. converting to `.webp` or `.jpg` at 80% quality) and re-upload.

---

## 4. Future Roadmap

- **Multi-Niche Filtering**: Allow tagging projects with multiple category niches (e.g., event + promo).
- **Vimeo / Wistia Sync Support**: Expand the 4-step synced player to support Vimeo video inputs alongside standard YouTube URLs.
- **Analytics Dashboard**: Add custom event triggers to measure calculator conversions and contact form clicks.
