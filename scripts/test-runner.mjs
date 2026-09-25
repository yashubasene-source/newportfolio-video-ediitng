import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passedCount = 0;
let failedCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ${colors.red}✗${colors.reset} ${name}`);
    console.error(`    ${colors.red}${err.message}${colors.reset}`);
    failedCount++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`  ${colors.red}✗${colors.reset} ${name}`);
    console.error(`    ${colors.red}${err.message}${colors.reset}`);
    failedCount++;
  }
}

console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}   ANSHAY BASENE PORTFOLIO TEST SUITE   ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

// ----------------------------------------------------
// SUITE 1: JSON Database Integrity Tests
// ----------------------------------------------------
console.log(`${colors.bold}[1] Database & Schema Integrity Tests${colors.reset}`);

runTest('backend/data/projects-db.json exists and is valid JSON', () => {
  const filePath = path.join(rootDir, 'backend', 'data', 'projects-db.json');
  assert.ok(fs.existsSync(filePath), 'projects-db.json must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  assert.ok(Array.isArray(data), 'projects-db.json must be an array');
  assert.ok(data.length > 0, 'projects-db.json should contain at least 1 project');
});

runTest('Projects in database have required schema fields', () => {
  const filePath = path.join(rootDir, 'backend', 'data', 'projects-db.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const project of data) {
    assert.ok(project.id, `Project missing id: ${JSON.stringify(project)}`);
    assert.ok(project.title, `Project ${project.id} missing title`);
    assert.ok(
      project.aspectRatio === '9:16' || project.aspectRatio === '16:9',
      `Project ${project.id} aspectRatio must be 9:16 or 16:9, got: ${project.aspectRatio}`
    );
    assert.ok(project.type, `Project ${project.id} missing type`);
  }
});

runTest('backend/data/site-db.json exists and has valid hero, about, and contact schema', () => {
  const filePath = path.join(rootDir, 'backend', 'data', 'site-db.json');
  assert.ok(fs.existsSync(filePath), 'site-db.json must exist');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(content);
  assert.ok(data.hero, 'site-db.json missing hero section');
  assert.ok(data.hero.titleNormal || data.hero.headline, 'site-db.json missing hero title');
  assert.ok(data.hero.description, 'site-db.json missing hero description');
  assert.ok(data.about, 'site-db.json missing about section');
  assert.ok(data.about.bioParagraph1 || data.about.bio, 'site-db.json missing about bio');
  assert.ok(data.contact, 'site-db.json missing contact section');
  assert.ok(data.contact.email, 'site-db.json missing contact email');
});

runTest('Progressions have required video streams (raw, edit, sfxColor, final)', () => {
  const filePath = path.join(rootDir, 'backend', 'data', 'site-db.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  assert.ok(Array.isArray(data.progressions), 'site-db.json missing progressions array');
  for (const prog of data.progressions) {
    assert.ok(prog.id, 'Progression missing id');
    assert.ok(prog.label || prog.title, 'Progression missing label/title');
    assert.ok(prog.rawVideo, `Progression ${prog.id} missing rawVideo`);
    assert.ok(prog.editVideo, `Progression ${prog.id} missing editVideo`);
    assert.ok(prog.sfxColorVideo, `Progression ${prog.id} missing sfxColorVideo`);
    assert.ok(prog.finalVideo, `Progression ${prog.id} missing finalVideo`);
  }
});

// ----------------------------------------------------
// SUITE 2: Video Utility Logic Tests
// ----------------------------------------------------
console.log(`\n${colors.bold}[2] Video Utility Logic Tests${colors.reset}`);

function isCloudinary(url) {
  if (!url) return false;
  return /cloudinary\.com/i.test(url);
}

function isYouTube(url) {
  if (!url) return false;
  return /youtube\.com|youtu\.be/i.test(url);
}

function getYouTubeId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}

function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }
  return url;
}

function isVideoFile(url) {
  if (!url) return false;
  if (isCloudinary(url)) return true;
  if (/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)) return true;
  if (url.startsWith('/uploads/') || url.startsWith('blob:') || url.startsWith('data:video/')) return true;
  if (url.startsWith('http') && !isYouTube(url) && !/instagram\.com/i.test(url) && !/vimeo\.com/i.test(url) && !/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(url)) {
    return true;
  }
  return false;
}

function getCloudinaryOptimizedVideo(url, options) {
  if (!url || !isCloudinary(url)) return url;
  const uploadMarker = '/video/upload/';
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return url;

  const quality = options?.quality || 'best';
  const widthTransform = options?.maxWidth ? `,w_${options.maxWidth},c_limit` : '';
  const transformString = `q_auto:${quality},f_auto,vc_auto${widthTransform}`;

  const prefix = url.substring(0, uploadIndex + uploadMarker.length);
  const remainder = url.substring(uploadIndex + uploadMarker.length);

  if (remainder.startsWith(transformString + '/')) {
    return url;
  }
  return `${prefix}${transformString}/${remainder}`;
}

runTest('getYouTubeId extracts standard 11-char ID correctly', () => {
  const id = getYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.strictEqual(id, 'dQw4w9WgXcQ');
});

runTest('getYouTubeId extracts from youtu.be shortlinks', () => {
  const id = getYouTubeId('https://youtu.be/dQw4w9WgXcQ?t=10');
  assert.strictEqual(id, 'dQw4w9WgXcQ');
});

runTest('getYouTubeId extracts from YouTube Shorts URLs', () => {
  const id = getYouTubeId('https://www.youtube.com/shorts/s030v85l0e4');
  assert.strictEqual(id, 's030v85l0e4');
});

runTest('getYouTubeId returns empty string for non-YouTube URLs', () => {
  assert.strictEqual(getYouTubeId('https://vimeo.com/1234567'), '');
  assert.strictEqual(getYouTubeId(''), '');
  assert.strictEqual(getYouTubeId('https://google.com'), '');
});

runTest('getYouTubeEmbedUrl generates proper embed with autoplay & playsinline', () => {
  const embed = getYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.ok(embed.includes('embed/dQw4w9WgXcQ'), 'Should include embed URL');
  assert.ok(embed.includes('playsinline=1'), 'Should include playsinline');
});

runTest('isCloudinary detects Cloudinary URLs', () => {
  assert.strictEqual(isCloudinary('https://res.cloudinary.com/demo/video/upload/sample.mp4'), true);
  assert.strictEqual(isCloudinary('https://youtube.com/watch?v=123'), false);
});

runTest('getCloudinaryOptimizedVideo applies q_auto, f_auto, and vc_auto', () => {
  const original = 'https://res.cloudinary.com/demo/video/upload/v12345/sample.mp4';
  const optimized = getCloudinaryOptimizedVideo(original);
  assert.ok(optimized.includes('q_auto:best,f_auto,vc_auto'), 'Must inject optimal transformations');
});

runTest('isVideoFile accurately categorizes media files', () => {
  assert.strictEqual(isVideoFile('/uploads/videos/test.mp4'), true);
  assert.strictEqual(isVideoFile('https://res.cloudinary.com/demo/video/upload/sample.mp4'), true);
  assert.strictEqual(isVideoFile('blob:http://localhost:3000/1234-5678'), true);
  assert.strictEqual(isVideoFile('https://example.com/poster.jpg'), false);
  assert.strictEqual(isVideoFile('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), false);
});

// ----------------------------------------------------
// SUITE 3: Server API Integration Tests
// ----------------------------------------------------
console.log(`\n${colors.bold}[3] Backend API Runtime & Health Tests${colors.reset}`);

// Check if a server is already listening on port 3000
let testPort = 3000;
let serverProcess = null;

async function checkPortOpen(port) {
  try {
    const res = await fetch(`http://localhost:${port}/api/health`, { signal: AbortSignal.timeout(1500) });
    return res.ok;
  } catch (e) {
    return false;
  }
}

const isLiveAlready = await checkPortOpen(3000);

if (isLiveAlready) {
  console.log(`  ${colors.green}✓${colors.reset} Connected to active server on port 3000`);
  passedCount++;
} else {
  // Spawn dist/server.cjs on an alternate test port
  testPort = 3899;
  try {
    serverProcess = await new Promise((resolve, reject) => {
      const proc = spawn('node', ['dist/server.cjs'], {
        cwd: rootDir,
        env: {
          ...process.env,
          PORT: String(testPort),
          NODE_ENV: 'production',
        },
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdoutData = '';
      proc.stdout.on('data', (d) => {
        stdoutData += d.toString();
        if (stdoutData.includes(`Server running on http://localhost:${testPort}`)) {
          resolve(proc);
        }
      });
      setTimeout(() => {
        if (!stdoutData.includes(`Server running on http://localhost:${testPort}`)) {
          proc.kill();
          reject(new Error(`Server startup timed out. Output: ${stdoutData}`));
        }
      }, 5000);
    });
    console.log(`  ${colors.green}✓${colors.reset} Test server started successfully on port ${testPort}`);
    passedCount++;
  } catch (err) {
    console.error(`  ${colors.red}✗ Failed to start test server:${colors.reset}`, err.message);
    failedCount++;
  }
}

// Test GET /api/health
await runAsyncTest('GET /api/health returns status "ok"', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'ok');
  assert.ok(data.database === 'mongodb' || data.database === 'local_file');
});

// Test GET /api/projects
await runAsyncTest('GET /api/projects returns valid list of projects', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/projects`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data), 'Response must be an array');
  assert.ok(data.length > 0, 'Response should contain projects');
});

// Test GET /api/site
await runAsyncTest('GET /api/site returns website configuration', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/site`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.hero, 'Site config must have hero section');
  assert.ok(data.about, 'Site config must have about section');
  assert.ok(data.contact, 'Site config must have contact section');
});

// Test GET /api/youtube-details
await runAsyncTest('GET /api/youtube-details validates missing URL param with 400', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/youtube-details`);
  assert.strictEqual(res.status, 400);
});

await runAsyncTest('GET /api/youtube-details rejects invalid YouTube format with 400', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/youtube-details?url=https://example.com/not-youtube`);
  assert.strictEqual(res.status, 400);
});

await runAsyncTest('GET /api/youtube-details extracts details for valid video', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/youtube-details?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.ok(data.thumbnail, 'Should return thumbnail');
  assert.ok(data.title, 'Should return video title');
  assert.strictEqual(data.aspectRatio, '16:9');
});

// Test POST /api/projects rejection of invalid payload
await runAsyncTest('POST /api/projects rejects non-array payload with 400', async () => {
  const res = await fetch(`http://localhost:${testPort}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notAnArray: true }),
  });
  assert.strictEqual(res.status, 400);
});

// Test static entry point or HTML serving
await runAsyncTest('GET / serves valid HTML entry point', async () => {
  const res = await fetch(`http://localhost:${testPort}/`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.ok(text.includes('<!DOCTYPE html>') || text.includes('<html') || text.includes('<div id="root">'), 'Should return HTML document');
});

if (serverProcess) {
  serverProcess.kill();
}

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log(`\n${colors.bold}${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.bold}Test Summary:${colors.reset}`);
console.log(`  Passed: ${colors.green}${passedCount}${colors.reset}`);
console.log(`  Failed: ${failedCount > 0 ? colors.red : colors.green}${failedCount}${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}========================================${colors.reset}\n`);

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
