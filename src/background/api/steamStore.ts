import { DAY, cached } from '../cache';
import { getJson } from './http';

/** Trimmed subset of Steam's storefront appdetails response (the full payload is huge). */
export interface SteamApp {
  type: string;
  name: string;
  steamAppId: number;
  isFree: boolean;
  dlc: number[];
  publishers: string[];
  developers: string[];
  genres: string[];
  releaseDate: number | null;
  comingSoon: boolean;
  priceInitial: number | null;
  priceFinal: number | null;
  headerImage: string | null;
}

interface RawAppDetails {
  [id: string]: {
    success: boolean;
    data?: {
      type: string;
      name: string;
      steam_appid: number;
      is_free: boolean;
      dlc?: number[];
      publishers?: string[];
      developers?: string[];
      genres?: { id: string; description: string }[];
      release_date?: { coming_soon: boolean; date: string };
      price_overview?: { currency: string; initial: number; final: number };
      header_image?: string;
    };
  };
}

export interface SteamSearchItem {
  type: string;
  name: string;
  id: number;
  price?: { currency: string; initial: number; final: number };
  tiny_image?: string;
}

/** Parses Steam's English release strings ("Sep 17, 2020", "17 Sep, 2020", "Q1 2027", "2027"). */
export function parseSteamDate(s: string | undefined): number | null {
  if (!s) return null;
  const cleaned = s.replace(/,/g, '').trim();
  const t = Date.parse(`${cleaned} UTC`);
  if (!Number.isNaN(t)) return t;
  const q = cleaned.match(/Q([1-4])\s+(\d{4})/i);
  if (q) return Date.UTC(Number(q[2]), (Number(q[1]) - 1) * 3 + 1, 15);
  const y = cleaned.match(/^(\d{4})$/);
  if (y) return Date.UTC(Number(y[1]), 6, 1);
  return null;
}

export function appDetails(appId: number): Promise<SteamApp | null> {
  return cached(`steam:app:${appId}`, 3 * DAY, async () => {
    const raw = await getJson<RawAppDetails>(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`,
    );
    const entry = raw[String(appId)];
    if (!entry?.success || !entry.data) return null;
    const d = entry.data;
    return {
      type: d.type,
      name: d.name,
      steamAppId: d.steam_appid,
      isFree: d.is_free,
      dlc: d.dlc ?? [],
      publishers: (d.publishers ?? []).filter(Boolean),
      developers: (d.developers ?? []).filter(Boolean),
      genres: (d.genres ?? []).map((g) => g.description),
      releaseDate: parseSteamDate(d.release_date?.date),
      comingSoon: !!d.release_date?.coming_soon,
      priceInitial: d.price_overview?.currency === 'USD' ? d.price_overview.initial / 100 : null,
      priceFinal: d.price_overview?.currency === 'USD' ? d.price_overview.final / 100 : null,
      headerImage: d.header_image ?? null,
    } satisfies SteamApp;
  });
}

export function storeSearch(term: string): Promise<SteamSearchItem[]> {
  const t = term.trim().toLowerCase();
  return cached(`steam:search:${t}`, DAY, async () => {
    const r = await getJson<{ total: number; items: SteamSearchItem[] }>(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(t)}&l=english&cc=US`,
    );
    return r.items ?? [];
  });
}
