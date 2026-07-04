/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import { MongoClient } from "mongodb";

// Load local environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support parsing JSON request bodies
  app.use(express.json());

  // Local flat-file database paths as fallback
  const dbPath = path.join(process.cwd(), "backend", "data", "projects-db.json");
  const siteDbPath = path.join(process.cwd(), "backend", "data", "site-db.json");
  const uploadsDir = path.join(process.cwd(), "backend", "uploads");

  // Create uploads directory if missing
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Cloud Database Integration (MongoDB Atlas) with local fallback
  let db: any = null;
  const MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      const client = await MongoClient.connect(MONGODB_URI);
      db = client.db("portfolio");
      console.log("Connected to MongoDB Atlas database successfully.");
    } catch (err) {
      console.error("Failed to connect to MongoDB, falling back to local files:", err);
    }
  } else {
    console.log("No MONGODB_URI found. Operating in Local Flat-File Mode.");
  }

  // Multer Storage Configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadType = (req.query.uploadType as string) || "video";
      const targetSubdir = uploadType === "reel" ? "reels" : "videos";
      const targetPath = path.join(uploadsDir, targetSubdir);

      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      cb(null, targetPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB video limit
  });

  // Serve static uploads
  app.use("/uploads", express.static(uploadsDir));

  // API Health route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // GET projects database content
  app.get("/api/projects", async (req, res) => {
    try {
      if (db) {
        const collection = db.collection("projects");
        const doc = await collection.findOne({ key: "projects_list" });
        if (doc) {
          return res.json(doc.data);
        } else {
          // If empty in cloud database, seed it from local projects-db.json file
          let localData: any[] = [];
          if (fs.existsSync(dbPath)) {
            const raw = fs.readFileSync(dbPath, "utf-8");
            localData = JSON.parse(raw);
          }
          await collection.insertOne({ key: "projects_list", data: localData });
          return res.json(localData);
        }
      } else {
        // Local File fallback
        if (fs.existsSync(dbPath)) {
          const raw = fs.readFileSync(dbPath, "utf-8");
          const parsed = JSON.parse(raw);
          return res.json(parsed);
        } else {
          return res.status(404).json({ error: "Database file not found" });
        }
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to read database" });
    }
  });

  // POST update projects list
  app.post("/api/projects", async (req, res) => {
    try {
      const updatedProjects = req.body;
      if (!Array.isArray(updatedProjects)) {
        return res.status(400).json({ error: "Invalid data format. Expected an array of projects." });
      }

      if (db) {
        const collection = db.collection("projects");
        await collection.updateOne(
          { key: "projects_list" },
          { $set: { data: updatedProjects } },
          { upsert: true }
        );
      } else {
        // Local File fallback
        fs.writeFileSync(dbPath, JSON.stringify(updatedProjects, null, 2), "utf-8");
      }
      return res.json({ status: "success", count: updatedProjects.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to save database" });
    }
  });

  // GET site database content
  app.get("/api/site", async (req, res) => {
    try {
      if (db) {
        const collection = db.collection("site");
        const doc = await collection.findOne({ key: "site_config" });
        if (doc) {
          return res.json(doc.data);
        } else {
          // Seed from local file
          let localData = {};
          if (fs.existsSync(siteDbPath)) {
            const raw = fs.readFileSync(siteDbPath, "utf-8");
            localData = JSON.parse(raw);
          }
          await collection.insertOne({ key: "site_config", data: localData });
          return res.json(localData);
        }
      } else {
        // Local File fallback
        if (fs.existsSync(siteDbPath)) {
          const raw = fs.readFileSync(siteDbPath, "utf-8");
          const parsed = JSON.parse(raw);
          return res.json(parsed);
        } else {
          return res.status(404).json({ error: "Site database file not found" });
        }
      }
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to read site database" });
    }
  });

  // POST update site database content
  app.post("/api/site", async (req, res) => {
    try {
      const updatedSite = req.body;
      if (db) {
        const collection = db.collection("site");
        await collection.updateOne(
          { key: "site_config" },
          { $set: { data: updatedSite } },
          { upsert: true }
        );
      } else {
        // Local File fallback
        fs.writeFileSync(siteDbPath, JSON.stringify(updatedSite, null, 2), "utf-8");
      }
      return res.json({ status: "success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to save site database" });
    }
  });

  // POST save settings (Gemini API Key)
  app.post("/api/settings", (req, res) => {
    try {
      const { geminiApiKey } = req.body;
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }

      if (envContent.includes("GEMINI_API_KEY=")) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY="${geminiApiKey}"`);
      } else {
        envContent += `\nGEMINI_API_KEY="${geminiApiKey}"\n`;
      }

      fs.writeFileSync(envPath, envContent, "utf-8");
      process.env.GEMINI_API_KEY = geminiApiKey;
      return res.json({ status: "success" });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to save settings" });
    }
  });

  // POST local video upload (routes to videos or reels based on query param)
  app.post("/api/upload-video", upload.single("video"), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const uploadType = (req.query.uploadType as string) || "video";
      const subfolder = uploadType === "reel" ? "reels" : "videos";
      const fileUrl = `/uploads/${subfolder}/${req.file.filename}`;
      return res.json({ url: fileUrl });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Upload failed" });
    }
  });

  // POST AI Autofill Project Metadata
  app.post("/api/autofill", async (req, res) => {
    const { link, captionText, customApiKey } = req.body;
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.status(400).json({ error: "Gemini API key is not configured. Please set it in the Settings tab." });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a professional video editor assistant. Analyze this video metadata and/or post caption and generate a structured JSON configuration for a video portfolio card.
Link: ${link}
Caption/Description: ${captionText || "No description provided."}

Based on this content, extract/guess the details and output a JSON object with these EXACT properties:
{
  "title": "A short, clean, professional title for the portfolio project",
  "description": "A punchy, high-retention 1-sentence description (max 100 chars)",
  "niche": "Must be one of: 'typography', 'motion', 'daily-edit', 'normal-edit', 'fun-edit'",
  "type": "Must be one of: 'video', 'graphic', 'motion'",
  "aspectRatio": "Must be '9:16' if it is a Reel/Short, or '16:9' if standard horizontal video",
  "software": ["Premiere Pro", "After Effects", "DaVinci Resolve", etc. (Choose relevant tools, max 3)],
  "duration": "Timeline duration (e.g., '0:30', '1:15', '10:00')",
  "role": "Editor's role (e.g., 'Lead Editor', 'Colorist & Sound Designer', 'Motion Artist')",
  "client": "Client or creator name (e.g., 'Independent Production' or specific name)",
  "resolution": "Resolution profile (e.g., '1080x1920' for 9:16, or '4K UHD (3840x2160)' for 16:9)",
  "frameRate": "Frame rate (e.g., '24 FPS', '30 FPS', '60 FPS')",
  "colorGrade": "LUT or color grading style (e.g., 'Rec.709 Space', 'Teal and orange cinematic', 'Clean natural tones')",
  "audioSpecs": "Audio specs (e.g., 'Stereo mix, voice gating, binaural SFX')",
  "challenges": "One technical/creative challenge (e.g., 'Correcting heavy backlighting in raw footage')",
  "solutions": "One professional solution applied (e.g., 'Used luminance grading tracks and custom tracking masks')",
  "fullDescription": "Extended narrative or behind-the-scenes breakdown (2-3 sentences)"
}

Do not include any formatting or markdown tags like \`\`\`json. Return only the raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedData = JSON.parse(cleanText);

      // Auto-detect YouTube thumbnail
      let thumbnail = "";
      const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      const match = link.match(youtubeRegExp);
      if (match && match[2].length === 11) {
        const videoId = match[2];
        thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      return res.json({ ...parsedData, thumbnail });
    } catch (error: any) {
      console.error("Gemini Autofill error:", error);
      return res.status(500).json({ error: error.message || "Failed to generate details" });
    }
  });

  // Serve with Vite in development, or serve statically in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: path.join(process.cwd(), "frontend"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
