import type { GameFacts, HistoryRecord, HistoryService } from '../shared/types';
import { PUBLISHERS, type PublisherProfile } from '../data/publishers';
import { looseKey, normalizeTitle, titlesMatch } from './titles';

export const GIVEAWAY_SERVICES: HistoryService[] = ['epic', 'prime', 'gog', 'steam_free'];
export const SUBSCRIPTION_SERVICES: HistoryService[] = ['gamepass', 'psplus_extra'];
export const BUNDLE_SERVICES: HistoryService[] = ['humble_choice', 'humble_bundle', 'fanatical_bundle'];

export const SERVICE_LABEL: Record<HistoryService, string> = {
  epic: 'Epic Games Store',
  prime: 'Prime Gaming',
  gog: 'GOG',
  steam_free: 'Steam (free weekend/keep)',
  gamepass: 'Xbox Game Pass',
  psplus_extra: 'PlayStation Plus Extra',
  humble_choice: 'Humble Choice',
  humble_bundle: 'Humble Bundle',
  fanatical_bundle: 'Fanatical bundle',
  other: 'Other',
};

export function recordMatchesGame(r: HistoryRecord, facts: Pick<GameFacts, 'steamAppId' | 'title'>): boolean {
  if (r.steamAppId && facts.steamAppId) return r.steamAppId === facts.steamAppId;
  return titlesMatch(r.title, facts.title);
}

export function matchHistory(history: HistoryRecord[], facts: Pick<GameFacts, 'steamAppId' | 'title'>): HistoryRecord[] {
  return history.filter((r) => recordMatchesGame(r, facts)).sort((a, b) => Date.parse(b.start) - Date.parse(a.start));
}

/** De-duplicate records describing the same appearance (same game, service and month). */
export function dedupeHistory(records: HistoryRecord[]): HistoryRecord[] {
  const seen = new Map<string, HistoryRecord>();
  for (const r of records) {
    if (!r || typeof r.title !== 'string' || typeof r.start !== 'string') continue;
    const key = `${looseKey(r.title)}|${r.service}|${r.start.slice(0, 7)}`;
    const prev = seen.get(key);
    // Prefer live/imported data over the seed, and records carrying a Steam app ID.
    if (!prev || (prev.source === 'seed' && r.source !== 'seed') || (!prev.steamAppId && r.steamAppId)) {
      seen.set(key, { ...prev, ...r });
    }
  }
  return [...seen.values()];
}

/** A giveaway currently running or announced for the future. */
export function liveGiveaway(
  matched: HistoryRecord[],
  now: number,
): { record: HistoryRecord; status: 'current' | 'upcoming' } | null {
  for (const r of matched) {
    if (!GIVEAWAY_SERVICES.includes(r.service)) continue;
    const start = Date.parse(r.start);
    const end = r.end ? Date.parse(r.end) : NaN;
    if (start <= now && !Number.isNaN(end) && now < end) return { record: r, status: 'current' };
    if (start > now) return { record: r, status: 'upcoming' };
  }
  return null;
}

export function lookupPublisher(names: string[]): PublisherProfile | null {
  const norm = names.map((n) => ` ${normalizeTitle(n)} `);
  const hits: PublisherProfile[] = [];
  for (const p of PUBLISHERS) {
    if (p.patterns.some((pat) => norm.some((n) => n.includes(` ${normalizeTitle(pat)} `)))) hits.push(p);
  }
  if (hits.length === 0) return null;
  const veto = hits.find((h) => h.veto);
  if (veto) return veto;
  return hits.reduce((a, b) => (b.giveaway > a.giveaway ? b : a));
}
