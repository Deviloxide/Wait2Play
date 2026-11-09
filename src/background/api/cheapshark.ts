import { DAY, HOUR, cached } from '../cache';
import { getJson } from './http';

/** CheapShark public API (no key). Requests carry a descriptive User-Agent via a DNR session rule. */
const BASE = 'https://www.cheapshark.com/api/1.0';

export interface CsGameHit {
  gameID: string;
  steamAppID: string | null;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}

export interface CsGameLookup {
  info: { title: string; steamAppID: string | null; thumb: string };
  cheapestPriceEver: { price: string; date: number };
  deals: { storeID: string; dealID: string; price: string; retailPrice: string; savings: string }[];
}

interface CsStore {
  storeID: string;
  storeName: string;
  isActive: number;
}

export function searchByTitle(title: string, limit = 15): Promise<CsGameHit[]> {
  const t = title.trim().toLowerCase();
  return cached(`cs:title:${t}:${limit}`, 12 * HOUR, () =>
    getJson<CsGameHit[]>(`${BASE}/games?title=${encodeURIComponent(t)}&limit=${limit}`),
  );
}

export function searchBySteamAppId(appId: number): Promise<CsGameHit[]> {
  return cached(`cs:steam:${appId}`, 12 * HOUR, () => getJson<CsGameHit[]>(`${BASE}/games?steamAppID=${appId}`));
}

export function gameById(gameId: string): Promise<CsGameLookup> {
  return cached(`cs:game:${gameId}`, 6 * HOUR, () => getJson<CsGameLookup>(`${BASE}/games?id=${encodeURIComponent(gameId)}`));
}

export async function storeNames(): Promise<Record<string, string>> {
  return cached('cs:stores', 7 * DAY, async () => {
    const stores = await getJson<CsStore[]>(`${BASE}/stores`);
    return Object.fromEntries(stores.map((s) => [s.storeID, s.storeName]));
  });
}

/** CheapShark asks integrators to link deals through their redirect (dealID is already URL-encoded). */
export const dealRedirect = (dealId: string): string => `https://www.cheapshark.com/redirect?dealID=${dealId}`;

export async function lookupBySteamAppId(appId: number): Promise<CsGameLookup | null> {
  const hits = await searchBySteamAppId(appId);
  const hit = hits[0];
  return hit ? gameById(hit.gameID) : null;
}
