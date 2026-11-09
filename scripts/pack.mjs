import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const releaseDir = resolve(root, 'release');
const feedDir = resolve(root, 'public', 'feed');

if (!existsSync(distDir)) {
  console.error('Error: dist/ does not exist. Run "npm run build" first.');
  process.exit(1);
}

// 1. Generate public/feed/history.json from src/data/seedHistory.ts so the repo can serve as a live GitHub feed.
mkdirSync(feedDir, { recursive: true });
const seedSrc = readFileSync(resolve(root, 'src', 'data', 'seedHistory.ts'), 'utf8');
const rawMarker = 'String.raw`[';
const markerIdx = seedSrc.indexOf(rawMarker);
const arrStart = markerIdx >= 0 ? markerIdx + rawMarker.length - 1 : seedSrc.indexOf('[\n');
const arrEnd = seedSrc.lastIndexOf(']`');
const records = arrStart >= 0 && arrEnd > arrStart ? JSON.parse(seedSrc.slice(arrStart, arrEnd + 1)) : [];
const feedJson = JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), records }, null, 2);
writeFileSync(resolve(feedDir, 'history.json'), feedJson, 'utf8');
mkdirSync(resolve(distDir, 'feed'), { recursive: true });
writeFileSync(resolve(distDir, 'feed', 'history.json'), feedJson, 'utf8');
console.log(`Generated public/feed/history.json (${records.length} records).`);

// 2. Prepare release/ folder and zip archives for Chrome/Edge and Firefox AMO.
mkdirSync(releaseDir, { recursive: true });

function zipDirectory(sourceDir, outZipPath) {
  if (existsSync(outZipPath)) rmSync(outZipPath);
  const topEntries = readdirSync(sourceDir);
  if (process.platform === 'win32') {
    // Use built-in bsdtar (tar.exe -a -c -f) with explicit top-level entries so zip entry paths
    // have no './' prefix and use POSIX forward slashes ('/'), required by Chrome Web Store & Firefox AMO.
    execFileSync('tar.exe', ['-a', '-c', '-f', outZipPath, '-C', sourceDir, ...topEntries], { stdio: 'inherit' });
  } else {
    execFileSync('zip', ['-r', '-q', outZipPath, ...topEntries], { cwd: sourceDir, stdio: 'inherit' });
  }
}

const chromeZip = resolve(releaseDir, 'wait2play-chrome.zip');
zipDirectory(distDir, chromeZip);
console.log(`Created Chrome/Edge package: ${chromeZip}`);

// 3. Build Firefox AMO manifest variant (adds browser_specific_settings.gecko and background.scripts).
const manifestPath = resolve(distDir, 'manifest.json');
const originalManifest = readFileSync(manifestPath, 'utf8');
try {
  const firefoxManifest = JSON.parse(originalManifest);
  firefoxManifest.background = {
    scripts: ['background.js'],
    service_worker: 'background.js',
    type: 'module',
  };
  firefoxManifest.browser_specific_settings = {
    gecko: {
      id: 'wait2play@wait2play.dev',
      strict_min_version: '109.0',
    },
  };
  writeFileSync(manifestPath, JSON.stringify(firefoxManifest, null, 2), 'utf8');
  const firefoxZip = resolve(releaseDir, 'wait2play-firefox.zip');
  zipDirectory(distDir, firefoxZip);
  console.log(`Created Firefox AMO package: ${firefoxZip}`);
} finally {
  // Restore Chrome manifest in dist/
  writeFileSync(manifestPath, originalManifest, 'utf8');
}

// 4. Create Firefox AMO source code archive (required by Mozilla when submitting Vite/TypeScript builds).
const sourceZip = resolve(releaseDir, 'wait2play-source.zip');
if (existsSync(sourceZip)) rmSync(sourceZip);
const sourceItems = [
  'src',
  'public',
  'scripts',
  'tests',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'vite.config.ts',
  'vite.content.config.ts',
  'README.md',
  'PRIVACY.md',
].filter((item) => existsSync(resolve(root, item)));

if (process.platform === 'win32') {
  execFileSync('tar.exe', ['-a', '-c', '-f', sourceZip, '-C', root, ...sourceItems], { stdio: 'inherit' });
} else {
  execFileSync('zip', ['-r', '-q', sourceZip, ...sourceItems], { cwd: root, stdio: 'inherit' });
}
console.log(`Created Firefox AMO source archive: ${sourceZip}`);
