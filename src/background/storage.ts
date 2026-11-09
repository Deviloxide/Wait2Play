import { extractLibraryEntries } from '../core/csv';
import { dedupeHistory } from '../core/history';
import { titlesMatch } from '../core/titles';
import { evaluateGameCompletion } from '../data/genres';
import { SEED_HISTORY } from '../data/seedHistory';
import {
  DEFAULT_SETTINGS,
  type BacklogInput,
  type GameFacts,
  type HistoryRecord,
  type HistoryService,
  type HistoryStats,
  type LibraryGame,
  type LibrarySource,
  type LibraryStats,
  type OwnedEntry,
  type Settings,
} from '../shared/types';
import { fetchEpicFreeGames } from './api/epic';
import { fetchGogSessionLibrary } from './api/gog';
import { getJson } from './api/http';
import { appDetails } from './api/steamStore';
import { fetchSteamDynamicStoreUserdata, getOwnedGames, resolveSteamId } from './api/steamWebApi';

const KEY_SETTINGS = 'w2p:settings';
const KEY_HISTORY = 'w2p:history';
const KEY_EPIC_TS = 'w2p:epicTs';
const KEY_LIBRARIES = 'w2p:libraries';
const KEY_STEAM_SYNC = 'w2p:steamSync';
const KEY_GENRE_INDEX = 'w2p:genreIndex';
const KEY_PLAY_TONIGHT = 'w2p:playTonight';

interface SteamSyncState {
  syncedAt: number;
  weeklyHours: number;
  mode?: 'api' | 'session';
  wishlistCount?: number;
  wishlistApps?: number[];
  wishlistTitles?: Record<string, string>;
  games: { appid: number; name: string; playtimeMinutes: number }[];
}

export async function getSettings(): Promise<Settings> {
  const raw = (await chrome.storage.local.get(KEY_SETTINGS))[KEY_SETTINGS] as Partial<Settings> | undefined;
  return {
    ...DEFAULT_SETTINGS,
    ...raw,
    sites: { ...DEFAULT_SETTINGS.sites, ...(raw?.sites ?? {}) },
    subscriptions: { ...DEFAULT_SETTINGS.subscriptions, ...(raw?.subscriptions ?? {}) },
  };
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  const cur = await getSettings();
  const next: Settings = {
    ...cur,
    ...patch,
    sites: { ...cur.sites, ...(patch.sites ?? {}) },
    subscriptions: { ...cur.subscriptions, ...(patch.subscriptions ?? {}) },
  };
  await chrome.storage.local.set({ [KEY_SETTINGS]: next });
  return next;
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const raw = (await chrome.storage.local.get(KEY_HISTORY))[KEY_HISTORY] as HistoryRecord[] | undefined;
  const seed = SEED_HISTORY.map((r) => ({ ...r, source: 'seed' as const }));
  return dedupeHistory([...seed, ...(raw ?? [])]);
}

async function saveCustomHistory(records: HistoryRecord[]): Promise<void> {
  const custom = dedupeHistory(records).filter((r) => r.source !== 'seed');
  await chrome.storage.local.set({ [KEY_HISTORY]: custom });
}

export async function refreshEpicHistory(): Promise<{ added: number }> {
  const existing = await getHistory();
  const before = existing.length;
  const [liveEpic, gamerPowerRaw] = await Promise.all([
    fetchEpicFreeGames().catch(() => [] as HistoryRecord[]),
    getJson<unknown[]>('https://www.gamerpower.com/api/giveaways?type=game', 15_000).catch(() => [] as unknown[]),
  ]);
  const liveGamerPower = (Array.isArray(gamerPowerRaw) ? gamerPowerRaw : [])
    .map((item) => coerceHistoryRecord(item, 'live'))
    .filter((r): r is HistoryRecord => r !== null);
  const merged = dedupeHistory([...existing, ...liveEpic, ...liveGamerPower]);
  await saveCustomHistory(merged);
  await chrome.storage.local.set({ [KEY_EPIC_TS]: Date.now() });
  void refreshCommunityFeedIfConfigured();
  return { added: Math.max(0, merged.length - before) };
}

/** Quietly refreshes the remote community history feed if configured. */
export async function refreshCommunityFeedIfConfigured(): Promise<void> {
  try {
    const settings = await getSettings();
    const url = settings.historyUrl?.trim();
    if (!url) return;
    await fetchHistoryFromUrl(url);
  } catch {
    // Offline or feed unreachable; fall back to bundled seed + live Epic data.
  }
}

export function coerceHistoryRecord(
  raw: unknown,
  defaultSource: 'import' | 'live' = 'import',
): HistoryRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  // Filter out non-game DLC items or mobile/VR-only giveaways from GamerPower feeds
  if (typeof r.type === 'string' && r.type.toLowerCase().includes('dlc')) return null;
  if (typeof r.platforms === 'string') {
    const platLower = r.platforms.toLowerCase();
    const isDesktopOrConsole =
      platLower.includes('pc') ||
      platLower.includes('steam') ||
      platLower.includes('epic') ||
      platLower.includes('gog') ||
      platLower.includes('playstation') ||
      platLower.includes('xbox') ||
      platLower.includes('drm-free');
    if (!isDesktopOrConsole) return null;
  }

  let title =
    typeof r.title === 'string'
      ? r.title.trim()
      : typeof r.gameTitle === 'string'
        ? r.gameTitle.trim()
        : typeof r.name === 'string'
          ? r.name.trim()
          : '';
  // Clean GamerPower suffixes like "(Epic Games) Giveaway", "(Steam) Key Giveaway", "Free ... Key"
  title = title
    .replace(/\s*\((?:Epic Games|Steam|GOG|Amazon Prime|Prime Gaming|IndieGala|Legacy Games|Itch\.io|PlayStation|Xbox)[^)]*\)\s*(?:Key\s*)?Giveaway$/i, '')
    .replace(/\s+(?:Key\s+)?Giveaway$/i, '')
    .trim();

  const startRaw =
    typeof r.start === 'string'
      ? r.start
      : typeof r.startDate === 'string'
        ? r.startDate
        : typeof r.freeDate === 'string'
          ? r.freeDate
          : typeof r.published_date === 'string'
            ? r.published_date
            : typeof r.date === 'string'
              ? r.date
              : '';
  if (!title || !startRaw || Number.isNaN(Date.parse(startRaw))) return null;
  const start = startRaw.includes(' ') && !startRaw.includes('T') ? startRaw.slice(0, 10) : startRaw;

  const svcRaw = String(r.service ?? r.platforms ?? r.platform ?? r.store ?? 'epic').toLowerCase();
  const service: HistoryService = svcRaw.includes('prime') || svcRaw.includes('amazon')
    ? 'prime'
    : svcRaw.includes('gog')
      ? 'gog'
      : svcRaw.includes('gamepass') || svcRaw.includes('game pass') || svcRaw.includes('xbox')
        ? 'gamepass'
        : svcRaw.includes('psplus') || svcRaw.includes('ps plus') || svcRaw.includes('playstation')
          ? 'psplus_extra'
          : svcRaw.includes('choice')
            ? 'humble_choice'
            : svcRaw.includes('humble')
              ? 'humble_bundle'
              : svcRaw.includes('fanatical')
                ? 'fanatical_bundle'
                : svcRaw.includes('steam')
                  ? 'steam_free'
                  : svcRaw.includes('epic')
                    ? 'epic'
                    : 'other';
  const out: HistoryRecord = { title, service, start, source: defaultSource };
  const endRaw =
    typeof r.end === 'string'
      ? r.end
      : typeof r.endDate === 'string'
        ? r.endDate
        : typeof r.end_date === 'string' && r.end_date !== 'N/A'
          ? r.end_date
          : undefined;
  if (endRaw && !Number.isNaN(Date.parse(endRaw))) {
    out.end = endRaw.includes(' ') && !endRaw.includes('T') ? endRaw.slice(0, 10) : endRaw;
  }
  if (typeof r.steamAppId === 'number') {
    out.steamAppId = r.steamAppId;
  } else {
    const urlCandidate =
      typeof r.steamUrl === 'string' ? r.steamUrl : typeof r.steamDBUrl === 'string' ? r.steamDBUrl : '';
    const appMatch = urlCandidate.match(/\/app\/(\d+)/);
    if (appMatch) out.steamAppId = Number(appMatch[1]);
  }
  if (typeof r.publisher === 'string' && r.publisher.trim()) out.publisher = r.publisher.trim();
  return out;
}

export async function importHistoryJson(jsonText: string): Promise<{ imported: number }> {
  const parsed = JSON.parse(jsonText) as unknown;
  const arr = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { records?: unknown[] }).records)
      ? (parsed as { records: unknown[] }).records
      : null;
  if (!arr) throw new Error('Expected a JSON array of history records.');
  const valid = arr.map((item) => coerceHistoryRecord(item, 'import')).filter((r): r is HistoryRecord => r !== null);
  if (valid.length === 0) throw new Error('No valid history records found in JSON.');
  const existing = await getHistory();
  const merged = dedupeHistory([...existing, ...valid]);
  await saveCustomHistory(merged);
  return { imported: valid.length };
}

export async function fetchHistoryFromUrl(url: string): Promise<{ imported: number }> {
  const data = await getJson<unknown>(url, 20_000);
  return importHistoryJson(JSON.stringify(data));
}

export async function exportHistoryJson(): Promise<string> {
  const all = await getHistory();
  return JSON.stringify(all, null, 2);
}

export async function getHistoryStats(): Promise<HistoryStats> {
  const all = await getHistory();
  const epicTs = ((await chrome.storage.local.get(KEY_EPIC_TS))[KEY_EPIC_TS] as number | undefined) ?? null;
  const byService: Partial<Record<HistoryService, number>> = {};
  const bySource = { seed: 0, live: 0, import: 0 };
  for (const r of all) {
    byService[r.service] = (byService[r.service] ?? 0) + 1;
    const src = r.source ?? 'seed';
    bySource[src] = (bySource[src] ?? 0) + 1;
  }
  return { byService, bySource, lastEpicRefresh: epicTs };
}

type StoredLibraries = Partial<Record<LibrarySource, OwnedEntry[]>>;

async function getLibrariesMap(): Promise<StoredLibraries> {
  return ((await chrome.storage.local.get(KEY_LIBRARIES))[KEY_LIBRARIES] as StoredLibraries | undefined) ?? {};
}

export async function importLibraryCsv(
  source: LibrarySource,
  csv: string,
): Promise<{ imported: number; skipped: number }> {
  const { entries, skipped } = extractLibraryEntries(csv, source);
  if (entries.length === 0) throw new Error('No game titles found in CSV input.');
  const map = await getLibrariesMap();
  for (const e of entries) {
    const bucket = map[e.source] ?? [];
    if (!bucket.some((x) => titlesMatch(x.title, e.title))) {
      bucket.push(e);
    }
    map[e.source] = bucket;
  }
  await chrome.storage.local.set({ [KEY_LIBRARIES]: map });
  return { imported: entries.length, skipped };
}

/** One-click GOG library sync using the user's logged-in gog.com browser session. */
export async function syncGogSessionLibrary(): Promise<{ count: number }> {
  const entries = await fetchGogSessionLibrary();
  const map = await getLibrariesMap();
  const bucket = map.gog ?? [];
  for (const e of entries) {
    if (!bucket.some((x) => titlesMatch(x.title, e.title))) bucket.push(e);
  }
  map.gog = bucket;
  await chrome.storage.local.set({ [KEY_LIBRARIES]: map });
  return { count: entries.length };
}

/** Marks a single game as owned on the chosen launcher in one click from the widget or popup. */
export async function markGameOwned(
  source: LibrarySource,
  title: string,
  steamAppId?: number,
): Promise<void> {
  const cleanTitle = title.trim();
  if (!cleanTitle) return;
  const map = await getLibrariesMap();
  const bucket = map[source] ?? [];
  const exists = bucket.some(
    (x) => (steamAppId && x.steamAppId === steamAppId) || titlesMatch(x.title, cleanTitle),
  );
  if (!exists) {
    bucket.push({
      title: cleanTitle,
      source,
      date: new Date().toISOString().slice(0, 10),
      steamAppId,
    });
    map[source] = bucket;
    await chrome.storage.local.set({ [KEY_LIBRARIES]: map });
  }
}

export async function clearLibrary(source: LibrarySource): Promise<LibraryStats> {
  const map = await getLibrariesMap();
  delete map[source];
  await chrome.storage.local.set({ [KEY_LIBRARIES]: map });
  if (source === 'steam') {
    await chrome.storage.local.remove(KEY_STEAM_SYNC);
  }
  return getLibraryStats();
}

export async function isGameWishlisted(steamAppId?: number | null, title?: string): Promise<boolean> {
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  if (!sync) return false;
  if (steamAppId && Array.isArray(sync.wishlistApps) && sync.wishlistApps.includes(steamAppId)) {
    return true;
  }
  if (title && sync.wishlistTitles) {
    return Object.values(sync.wishlistTitles).some((wt) => titlesMatch(wt, title));
  }
  return false;
}

export async function getWishlistTitles(): Promise<string[]> {
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  if (!sync || !Array.isArray(sync.wishlistApps) || sync.wishlistApps.length === 0) return [];
  const titles = new Set<string>(Object.values(sync.wishlistTitles ?? {}));
  const wishSet = new Set<number>(sync.wishlistApps);
  for (const r of SEED_HISTORY) {
    if (r.steamAppId && wishSet.has(r.steamAppId)) {
      titles.add(r.title);
    }
  }
  return [...titles];
}

export async function findOwnedMatches(facts: Pick<GameFacts, 'steamAppId' | 'title'>): Promise<OwnedEntry[]> {
  const map = await getLibrariesMap();
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  const hits: OwnedEntry[] = [];
  if (sync) {
    const sg = sync.games.find(
      (g) =>
        (facts.steamAppId && g.appid === facts.steamAppId) ||
        (!g.name.startsWith('Steam #') && titlesMatch(g.name, facts.title)),
    );
    if (sg) {
      hits.push({
        title: sg.name.startsWith('Steam #') ? facts.title : sg.name,
        source: 'steam',
        steamAppId: sg.appid,
        playtimeMinutes: sg.playtimeMinutes,
      });
    }
  }
  for (const list of Object.values(map)) {
    for (const item of list ?? []) {
      if (item.source === 'steam' && hits.some((h) => h.source === 'steam')) continue;
      if ((item.steamAppId && item.steamAppId === facts.steamAppId) || titlesMatch(item.title, facts.title)) {
        hits.push(item);
      }
    }
  }
  return hits;
}

export async function syncSteamLibrary(): Promise<{ count: number; unplayed: number; weeklyHours: number }> {
  const settings = await getSettings();
  if (!settings.steamApiKey.trim() || !settings.steamId.trim()) {
    throw new Error('Enter your Steam Web API key and SteamID64 / vanity URL first.');
  }
  const steamId = await resolveSteamId(settings.steamApiKey.trim(), settings.steamId.trim());
  const rawGames = await getOwnedGames(settings.steamApiKey.trim(), steamId);
  const twoWeekMinutes = rawGames.reduce((s, g) => s + (g.playtime_2weeks ?? 0), 0);
  const derivedWeekly = twoWeekMinutes > 0 ? Math.round((twoWeekMinutes / 60 / 2) * 10) / 10 : 6;
  const state: SteamSyncState = {
    syncedAt: Date.now(),
    weeklyHours: derivedWeekly,
    mode: 'api',
    games: rawGames
      .filter((g) => g.name)
      .map((g) => ({
        appid: g.appid,
        name: g.name!,
        playtimeMinutes: g.playtime_forever ?? 0,
      })),
  };
  await chrome.storage.local.set({ [KEY_STEAM_SYNC]: state });
  const idx = await getGenreIndex();
  const unplayed = state.games.filter(
    (g) =>
      evaluateGameCompletion(
        { title: g.name, genres: idx[String(g.appid)], playtimeMinutes: g.playtimeMinutes },
        settings.unplayedThresholdMinutes,
      ).isUnfinished,
  ).length;
  void indexSomeSteamGenres(20);
  return { count: state.games.length, unplayed, weeklyHours: settings.weeklyHoursOverride ?? state.weeklyHours };
}

/**
 * Zero-API-key Steam sync via the user's logged-in store.steampowered.com browser session.
 */
export async function syncSteamSessionLibrary(): Promise<{
  count: number;
  unplayed: number;
  weeklyHours: number;
  wishlistCount: number;
}> {
  const settings = await getSettings();
  const prev = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  const prevByApp = new Map((prev?.games ?? []).map((g) => [g.appid, g]));

  const userdata = await fetchSteamDynamicStoreUserdata();
  if (userdata.rgOwnedApps.length === 0) {
    throw new Error(
      'No owned games returned from Steam. Sign into store.steampowered.com in this browser first, or use a Steam Web API key below.',
    );
  }

  // Sort newest AppIDs first so recent games get title + genre resolution first
  const sortedApps = [...new Set(userdata.rgOwnedApps)].sort((a, b) => b - a);
  const games = sortedApps.map((appid) => {
    const existing = prevByApp.get(appid);
    return {
      appid,
      name: existing?.name ?? `Steam #${appid}`,
      playtimeMinutes: existing?.playtimeMinutes ?? 0,
    };
  });

  const weeklyHours = settings.weeklyHoursOverride ?? prev?.weeklyHours ?? 6;
  const state: SteamSyncState = {
    syncedAt: Date.now(),
    weeklyHours,
    mode: 'session',
    wishlistCount: userdata.rgWishlist.length,
    wishlistApps: userdata.rgWishlist,
    wishlistTitles: prev?.wishlistTitles ?? {},
    games,
  };
  await chrome.storage.local.set({ [KEY_STEAM_SYNC]: state });
  const idx = await getGenreIndex();
  const unplayed = state.games.filter(
    (g) =>
      evaluateGameCompletion(
        { title: g.name, genres: idx[String(g.appid)], playtimeMinutes: g.playtimeMinutes },
        settings.unplayedThresholdMinutes,
      ).isUnfinished,
  ).length;
  void indexSomeSteamGenres(20);
  return {
    count: state.games.length,
    unplayed,
    weeklyHours,
    wishlistCount: userdata.rgWishlist.length,
  };
}

async function getGenreIndex(): Promise<Record<string, string[]>> {
  return ((await chrome.storage.local.get(KEY_GENRE_INDEX))[KEY_GENRE_INDEX] as Record<string, string[]> | undefined) ?? {};
}

function isSteamEntryUnfinished(
  g: { appid: number; name: string; playtimeMinutes: number },
  idx: Record<string, string[]>,
  minThresholdMinutes: number,
): boolean {
  return evaluateGameCompletion(
    { title: g.name, genres: idx[String(g.appid)], playtimeMinutes: g.playtimeMinutes },
    minThresholdMinutes,
  ).isUnfinished;
}

/** Fetches genre tags (and real game titles for session-synced AppIDs and wishlist items) in the background. */
export async function indexSomeSteamGenres(batchSize = 15): Promise<void> {
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  if (!sync) return;
  const settings = await getSettings();
  const idx = await getGenreIndex();
  const candidates = sync.games.filter(
    (g) => !(String(g.appid) in idx) && isSteamEntryUnfinished(g, idx, settings.unplayedThresholdMinutes),
  );
  let syncUpdated = false;
  for (const g of candidates.slice(0, batchSize)) {
    try {
      const det = await appDetails(g.appid);
      idx[String(g.appid)] = det?.genres ?? [];
      if (det?.name && g.name.startsWith('Steam #')) {
        g.name = det.name;
        syncUpdated = true;
      }
    } catch {
      idx[String(g.appid)] = [];
    }
  }

  // Also resolve titles for a batch of synced Steam Wishlist AppIDs so live bundle radar can match them by title
  if (Array.isArray(sync.wishlistApps) && sync.wishlistApps.length > 0) {
    sync.wishlistTitles = sync.wishlistTitles ?? {};
    const unindexedWish = sync.wishlistApps.filter((id) => !(String(id) in sync.wishlistTitles!));
    for (const wid of unindexedWish.slice(0, 8)) {
      try {
        const det = await appDetails(wid);
        if (det?.name) {
          sync.wishlistTitles[String(wid)] = det.name;
          syncUpdated = true;
        }
      } catch {
        // ignore
      }
    }
  }

  await chrome.storage.local.set({ [KEY_GENRE_INDEX]: idx });
  if (syncUpdated) {
    await chrome.storage.local.set({ [KEY_STEAM_SYNC]: sync });
  }
}

export async function getBacklogInput(): Promise<BacklogInput | null> {
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  if (!sync || sync.games.length === 0) return null;
  const settings = await getSettings();
  const idx = await getGenreIndex();
  const unplayedRaw = sync.games.filter((g) => isSteamEntryUnfinished(g, idx, settings.unplayedThresholdMinutes));
  const indexedCount = unplayedRaw.filter((g) => String(g.appid) in idx).length;
  if (indexedCount < Math.min(12, unplayedRaw.length)) {
    await indexSomeSteamGenres(10);
  }
  const freshIdx = await getGenreIndex();
  const freshSync =
    ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? sync;
  const unplayed: LibraryGame[] = freshSync.games
    .filter((g) => isSteamEntryUnfinished(g, freshIdx, settings.unplayedThresholdMinutes))
    .map((g) => ({
      title: g.name,
      steamAppId: g.appid,
      genres: freshIdx[String(g.appid)],
      playtimeMinutes: g.playtimeMinutes,
    }));
  const indexed = unplayed.filter((g) => Array.isArray(g.genres)).length;
  return {
    unplayed,
    weeklyHours: settings.weeklyHoursOverride ?? freshSync.weeklyHours ?? 6,
    indexed,
    total: unplayed.length,
  };
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const map = await getLibrariesMap();
  const sync = ((await chrome.storage.local.get(KEY_STEAM_SYNC))[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null;
  const settings = await getSettings();
  const idx = await getGenreIndex();
  const bySource: Partial<Record<LibrarySource, number>> = {};
  for (const [k, v] of Object.entries(map)) {
    if (v?.length) bySource[k as LibrarySource] = v.length;
  }
  if (sync) {
    bySource.steam = (bySource.steam ?? 0) + sync.games.length;
  }
  const unplayedRaw = sync
    ? sync.games.filter((g) => isSteamEntryUnfinished(g, idx, settings.unplayedThresholdMinutes))
    : [];
  const indexed = unplayedRaw.filter((g) => String(g.appid) in idx).length;
  return {
    bySource,
    steamSync: sync
      ? {
          syncedAt: sync.syncedAt,
          count: sync.games.length,
          unplayed: unplayedRaw.length,
          weeklyHours: settings.weeklyHoursOverride ?? sync.weeklyHours,
          mode: sync.mode,
          wishlistCount: sync.wishlistCount,
        }
      : null,
    genreIndex: { indexed, total: unplayedRaw.length },
  };
}

export async function getPlayTonight(key: string): Promise<boolean> {
  const map = ((await chrome.storage.local.get(KEY_PLAY_TONIGHT))[KEY_PLAY_TONIGHT] as Record<string, boolean> | undefined) ?? {};
  return !!map[key];
}

export async function setPlayTonightFlag(key: string, value: boolean): Promise<void> {
  const map = ((await chrome.storage.local.get(KEY_PLAY_TONIGHT))[KEY_PLAY_TONIGHT] as Record<string, boolean> | undefined) ?? {};
  if (value) map[key] = true;
  else delete map[key];
  await chrome.storage.local.set({ [KEY_PLAY_TONIGHT]: map });
}

export interface FullBackupPayload {
  version: 1;
  exportedAt: string;
  settings?: Partial<Settings>;
  libraries?: StoredLibraries;
  steamSync?: SteamSyncState | null;
  genreIndex?: Record<string, string[]>;
  customHistory?: HistoryRecord[];
  playTonight?: Record<string, boolean>;
}

/** Exports all user settings, imported libraries, Steam sync state, and custom history as a single JSON backup. */
export async function exportFullBackup(): Promise<string> {
  const raw = await chrome.storage.local.get([
    KEY_SETTINGS,
    KEY_LIBRARIES,
    KEY_STEAM_SYNC,
    KEY_GENRE_INDEX,
    KEY_HISTORY,
    KEY_PLAY_TONIGHT,
  ]);
  const payload: FullBackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: raw[KEY_SETTINGS] as Partial<Settings> | undefined,
    libraries: raw[KEY_LIBRARIES] as StoredLibraries | undefined,
    steamSync: (raw[KEY_STEAM_SYNC] as SteamSyncState | undefined) ?? null,
    genreIndex: raw[KEY_GENRE_INDEX] as Record<string, string[]> | undefined,
    customHistory: raw[KEY_HISTORY] as HistoryRecord[] | undefined,
    playTonight: raw[KEY_PLAY_TONIGHT] as Record<string, boolean> | undefined,
  };
  return JSON.stringify(payload, null, 2);
}

/** Restores user settings, imported libraries, Steam sync state, and custom history from a JSON backup. */
export async function importFullBackup(
  jsonText: string,
): Promise<{ libraries: number; history: number; steamGames: number }> {
  const data = JSON.parse(jsonText) as Partial<FullBackupPayload>;
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid backup JSON file.');
  }
  if (data.settings && typeof data.settings === 'object') {
    await saveSettings(data.settings);
  }
  let librariesCount = 0;
  if (data.libraries && typeof data.libraries === 'object') {
    await chrome.storage.local.set({ [KEY_LIBRARIES]: data.libraries });
    for (const list of Object.values(data.libraries)) {
      librariesCount += Array.isArray(list) ? list.length : 0;
    }
  }
  let steamGames = 0;
  if (data.steamSync && typeof data.steamSync === 'object' && Array.isArray(data.steamSync.games)) {
    await chrome.storage.local.set({ [KEY_STEAM_SYNC]: data.steamSync });
    steamGames = data.steamSync.games.length;
  }
  if (data.genreIndex && typeof data.genreIndex === 'object') {
    await chrome.storage.local.set({ [KEY_GENRE_INDEX]: data.genreIndex });
  }
  let historyCount = 0;
  if (Array.isArray(data.customHistory) && data.customHistory.length > 0) {
    const res = await importHistoryJson(JSON.stringify(data.customHistory));
    historyCount = res.imported;
  }
  if (data.playTonight && typeof data.playTonight === 'object') {
    await chrome.storage.local.set({ [KEY_PLAY_TONIGHT]: data.playTonight });
  }
  return { libraries: librariesCount, history: historyCount, steamGames };
}
