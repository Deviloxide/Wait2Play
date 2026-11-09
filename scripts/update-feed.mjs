import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Automated feed updater run by GitHub Actions (.github/workflows/update-feed.yml)
 * or manually via `node scripts/update-feed.mjs`.
 * Pulls live giveaways from:
 * 1. josephmate/EpicFreeGamesList (GitHub weekly Epic archive)
 * 2. GamerPower API (live Steam, GOG, Prime Gaming, Epic, Humble giveaways)
 * 3. Epic Games Store freeGamesPromotions endpoint
 * Merges them with src/data/seedHistory.ts and writes public/feed/history.json.
 */

const root = process.cwd();
const seedPath = resolve(root, 'src', 'data', 'seedHistory.ts');
const feedDir = resolve(root, 'public', 'feed');
const feedPath = resolve(feedDir, 'history.json');

const seedSrc = readFileSync(seedPath, 'utf8');
const rawMarker = 'String.raw`[';
const markerIdx = seedSrc.indexOf(rawMarker);
const arrStart = markerIdx >= 0 ? markerIdx + rawMarker.length - 1 : seedSrc.indexOf('[\n');
const arrEnd = seedSrc.lastIndexOf(']`');
const baseRecords = arrStart >= 0 && arrEnd > arrStart ? JSON.parse(seedSrc.slice(arrStart, arrEnd + 1)) : [];

const seen = new Set();
const merged = [];

function addRecord(rec) {
  if (!rec || !rec.title || !rec.service || !rec.start) return;
  const norm = rec.title
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  if (!norm) return;
  const key = `${norm}|${rec.service}|${String(rec.start).slice(0, 7)}`;
  if (seen.has(key)) return;
  seen.add(key);
  merged.push(rec);
}

for (const r of baseRecords) addRecord(r);

// 1. Fetch josephmate/EpicFreeGamesList
try {
  const res = await fetch('https://raw.githubusercontent.com/josephmate/EpicFreeGamesList/main/epic_free_games.json');
  if (res.ok) {
    const list = await res.json();
    for (const row of list) {
      const m = String(row.steamUrl ?? row.steamDBUrl ?? '').match(/\/app\/(\d+)/);
      const rec = {
        title: String(row.gameTitle ?? '').trim(),
        service: 'epic',
        start: String(row.freeDate ?? '').slice(0, 10),
      };
      if (m) rec.steamAppId = Number(m[1]);
      addRecord(rec);
    }
  }
} catch (err) {
  console.warn('Warning: EpicFreeGamesList fetch failed:', err);
}

// 2. Fetch GamerPower live multi-store giveaways
try {
  const res = await fetch('https://www.gamerpower.com/api/giveaways?type=game');
  if (res.ok) {
    const list = await res.json();
    for (const row of list) {
      const plat = String(row.platforms ?? '').toLowerCase();
      if (!/pc|steam|epic|gog|playstation|xbox|drm-free/.test(plat)) continue;
      const title = String(row.title ?? '')
        .replace(
          /\s*\((?:Epic Games|Steam|GOG|Amazon Prime|Prime Gaming|IndieGala|Legacy Games|Itch\.io|PlayStation|Xbox)[^)]*\)\s*(?:Key\s*)?Giveaway$/i,
          '',
        )
        .replace(/\s+(?:Key\s+)?Giveaway$/i, '')
        .trim();
      const service = plat.includes('prime') || plat.includes('amazon')
        ? 'prime'
        : plat.includes('gog')
          ? 'gog'
          : plat.includes('steam')
            ? 'steam_free'
            : plat.includes('epic')
              ? 'epic'
              : plat.includes('humble')
                ? 'humble_bundle'
                : 'other';
      const start = String(row.published_date ?? '').slice(0, 10);
      if (title && start) addRecord({ title, service, start });
    }
  }
} catch (err) {
  console.warn('Warning: GamerPower fetch failed:', err);
}

// 3. Fetch IsThereAnyDeal live bundles RSS feed
try {
  const res = await fetch('https://isthereanydeal.com/feeds/US/USD/bundles.rss');
  if (res.ok) {
    const xml = await res.text();
    const decode = (s) =>
      String(s ?? '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#039;|&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const item = m[1] ?? '';
      const rawTitle = decode(item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '');
      if (!rawTitle) continue;
      const byIdx = rawTitle.lastIndexOf(' by ');
      const bundleTitle = byIdx > 0 ? rawTitle.slice(0, byIdx).trim() : rawTitle;
      const store = byIdx > 0 ? rawTitle.slice(byIdx + 4).trim() : 'Bundle';
      const pubRaw = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
      const pubMs = pubRaw ? Date.parse(pubRaw) : NaN;
      const start = !Number.isNaN(pubMs) ? new Date(pubMs).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

      const desc = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/)?.[1] ?? '';
      const expRaw = desc.match(/expires on\s+([^<|\r\n]+)/i)?.[1]?.trim();
      const expMs = expRaw ? Date.parse(expRaw) : NaN;
      const end = !Number.isNaN(expMs) ? new Date(expMs).toISOString() : undefined;
      const directRaw = desc.match(/<a\s+href=["']?([^"'>\s]+)["']?[^>]*>\s*go to bundle\s*<\/a>/i)?.[1];
      const url = directRaw ? decode(directRaw) : undefined;

      const combined = `${store} ${bundleTitle}`.toLowerCase();
      const service = combined.includes('humble choice')
        ? 'humble_choice'
        : combined.includes('humble')
          ? 'humble_bundle'
          : combined.includes('fanatical')
            ? 'fanatical_bundle'
            : 'other';

      for (const gm of desc.matchAll(/<a\s+href="https:\/\/isthereanydeal\.com\/game\/[^/"]+\/info\/"[^>]*>([\s\S]*?)<\/a>/g)) {
        const gameTitle = decode(gm[1]?.trim() ?? '');
        if (!gameTitle) continue;
        const rec = {
          title: gameTitle,
          service,
          start,
          note: `${bundleTitle} (${store})`,
        };
        if (end) rec.end = end;
        if (url) rec.url = url;
        addRecord(rec);
      }
    }
  }
} catch (err) {
  console.warn('Warning: IsThereAnyDeal bundles RSS fetch failed:', err);
}

merged.sort((a, b) => String(b.start).localeCompare(String(a.start)));
mkdirSync(feedDir, { recursive: true });
writeFileSync(
  feedPath,
  JSON.stringify({ updatedAt: new Date().toISOString().slice(0, 10), records: merged }, null, 2),
  'utf8',
);
console.log(`Updated public/feed/history.json with ${merged.length} records.`);
