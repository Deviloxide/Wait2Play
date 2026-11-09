import { normalizeTitle, titlesMatch } from '../../core/titles';
import type { ActiveBundleInfo, HistoryRecord, HistoryService, LiveBundleOverviewItem } from '../../shared/types';
import { cached } from '../cache';

const RSS_TTL = 30 * 60 * 1000; // 30 minutes
const GAME_TTL = 2 * 60 * 60 * 1000; // 2 hours

interface RssBundleEntry {
  gameSlug: string;
  gameTitle: string;
  startIso: string;
  bundle: ActiveBundleInfo;
}

export interface ItadGameEnrichment {
  itadSlug: string | null;
  hltbMainHours: number | null;
  liveBundles: ActiveBundleInfo[];
  bundleHistory: HistoryRecord[];
  bestPriceUsd: { price: number; store: string | null; url: string | null } | null;
  historicalLowUsd: { price: number; dateMs: number | null } | null;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function cleanBundleUrl(rawUrl: string | undefined | null, fallbackUrl?: string): string {
  const raw = decodeHtmlEntities((rawUrl ?? '').trim());
  if (!raw) return fallbackUrl ?? 'https://isthereanydeal.com/bundles/';
  try {
    const u = new URL(raw);
    const inner = u.searchParams.get('u') ?? u.searchParams.get('ued') ?? u.searchParams.get('url');
    if (inner && /^https?:\/\//i.test(inner)) {
      return inner;
    }
    if (u.hostname === 'www.indiegala.com' && u.searchParams.get('ref') === 'itad') {
      u.searchParams.delete('ref');
      return u.toString();
    }
    return u.toString();
  } catch {
    return fallbackUrl ?? raw;
  }
}

export function toItadSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mapBundleService(storeName: string, bundleTitle: string): HistoryService {
  const combined = `${storeName} ${bundleTitle}`.toLowerCase();
  if (combined.includes('humble choice') || combined.includes('humble monthly')) {
    return 'humble_choice';
  }
  if (combined.includes('humble')) {
    return 'humble_bundle';
  }
  if (combined.includes('fanatical') || combined.includes('bundle stars')) {
    return 'fanatical_bundle';
  }
  return 'other';
}

/**
 * Parses IsThereAnyDeal's public US/USD bundles RSS feed (`https://isthereanydeal.com/feeds/US/USD/bundles.rss`).
 * Requires zero cookies or authentication and lists all currently active bundles and their tiers/games.
 */
export function parseItadBundlesRss(xml: string, now = Date.now()): RssBundleEntry[] {
  const entries: RssBundleEntry[] = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const m of itemMatches) {
    const item = m[1] ?? '';
    const rawTitle = decodeHtmlEntities(item.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? '');
    if (!rawTitle) continue;

    const byIdx = rawTitle.lastIndexOf(' by ');
    const bundleTitle = byIdx > 0 ? rawTitle.slice(0, byIdx).trim() : rawTitle;
    const store = byIdx > 0 ? rawTitle.slice(byIdx + 4).trim() : 'Bundle';

    const itadLink = item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() ?? 'https://isthereanydeal.com/bundles/';
    const pubDateRaw = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim();
    const pubDateMs = pubDateRaw ? Date.parse(pubDateRaw) : NaN;
    const startIso = !Number.isNaN(pubDateMs) ? new Date(pubDateMs).toISOString() : new Date(now).toISOString();

    const desc = item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/)?.[1] ?? '';
    if (!desc) continue;

    const expRaw = desc.match(/expires on\s+([^<|\r\n]+)/i)?.[1]?.trim();
    const expMs = expRaw ? Date.parse(expRaw) : NaN;
    if (!Number.isNaN(expMs) && expMs <= now) {
      continue;
    }
    const expiry = !Number.isNaN(expMs) ? new Date(expMs).toISOString() : null;

    const directRaw = desc.match(/<a\s+href=["']?([^"'>\s]+)["']?[^>]*>\s*go to bundle\s*<\/a>/i)?.[1];
    const url = cleanBundleUrl(directRaw, itadLink);

    const allGameLinks = [...desc.matchAll(/<a\s+href="https:\/\/isthereanydeal\.com\/game\/([^/"]+)\/info\/"[^>]*>([\s\S]*?)<\/a>/g)];
    const gamesCount = allGameLinks.length || null;

    // Split by tier headers so each game gets the exact price of the tier it belongs to.
    const tierBlocks = desc.split(/<b>\s*Tier\s+\d+[^<]*<\/b>/i);
    if (tierBlocks.length > 1) {
      for (const block of tierBlocks.slice(1)) {
        const priceMatch = block.match(/Price:\s*\$([0-9]+(?:\.[0-9]+)?)/i);
        const tierPrice = priceMatch ? Number(priceMatch[1]) : null;
        const gameMatches = block.matchAll(
          /<a\s+href="https:\/\/isthereanydeal\.com\/game\/([^/"]+)\/info\/"[^>]*>([\s\S]*?)<\/a>/g,
        );
        for (const gm of gameMatches) {
          const gameSlug = gm[1]?.trim() ?? '';
          const gameTitle = decodeHtmlEntities(gm[2]?.trim() ?? '');
          if (!gameSlug || !gameTitle) continue;
          entries.push({
            gameSlug,
            gameTitle,
            startIso,
            bundle: {
              title: bundleTitle,
              store,
              price: tierPrice != null && !Number.isNaN(tierPrice) ? tierPrice : null,
              currency: 'USD',
              url,
              expiry,
              gamesCount,
            },
          });
        }
      }
    } else {
      const priceMatch = desc.match(/Price:\s*\$([0-9]+(?:\.[0-9]+)?)/i);
      const tierPrice = priceMatch ? Number(priceMatch[1]) : null;
      for (const gm of allGameLinks) {
        const gameSlug = gm[1]?.trim() ?? '';
        const gameTitle = decodeHtmlEntities(gm[2]?.trim() ?? '');
        if (!gameSlug || !gameTitle) continue;
        entries.push({
          gameSlug,
          gameTitle,
          startIso,
          bundle: {
            title: bundleTitle,
            store,
            price: tierPrice != null && !Number.isNaN(tierPrice) ? tierPrice : null,
            currency: 'USD',
            url,
            expiry,
            gamesCount,
          },
        });
      }
    }
  }

  return entries;
}

async function fetchActiveRssBundles(): Promise<RssBundleEntry[]> {
  return cached('itad:rss:bundles:v1', RSS_TTL, async () => {
    try {
      const res = await fetch('https://isthereanydeal.com/feeds/US/USD/bundles.rss');
      if (!res.ok) return [];
      const xml = await res.text();
      return parseItadBundlesRss(xml);
    } catch {
      return [];
    }
  });
}

/**
 * Summarizes currently active PC bundles from IsThereAnyDeal for the Popup Radar,
 * cross-referencing every bundled game against the user's synced Steam Wishlist titles.
 */
export async function fetchActiveBundlesOverview(
  wishlistedTitles: string[] = [],
  limit = 5,
): Promise<LiveBundleOverviewItem[]> {
  const entries = await fetchActiveRssBundles();
  if (entries.length === 0) return [];

  const grouped = new Map<
    string,
    {
      title: string;
      store: string;
      prices: number[];
      url: string;
      expiry: string | null;
      gamesCount: number | null;
      games: string[];
      wishlistedGames: string[];
    }
  >();

  for (const e of entries) {
    const key = `${e.bundle.store}|${e.bundle.title}`;
    let g = grouped.get(key);
    if (!g) {
      g = {
        title: e.bundle.title,
        store: e.bundle.store,
        prices: [],
        url: e.bundle.url,
        expiry: e.bundle.expiry,
        gamesCount: e.bundle.gamesCount ?? null,
        games: [],
        wishlistedGames: [],
      };
      grouped.set(key, g);
    }
    if (e.bundle.price != null && !g.prices.includes(e.bundle.price)) {
      g.prices.push(e.bundle.price);
    }
    if (!g.games.includes(e.gameTitle)) {
      g.games.push(e.gameTitle);
      if (wishlistedTitles.some((wt) => titlesMatch(wt, e.gameTitle))) {
        g.wishlistedGames.push(e.gameTitle);
      }
    }
  }

  const items: LiveBundleOverviewItem[] = [...grouped.values()].map((g) => {
    const sortedPrices = [...g.prices].sort((a, b) => a - b);
    return {
      title: g.title,
      store: g.store,
      minPrice: sortedPrices[0] ?? null,
      maxPrice: sortedPrices.length > 1 ? sortedPrices[sortedPrices.length - 1]! : (sortedPrices[0] ?? null),
      url: g.url,
      expiry: g.expiry,
      gamesCount: g.gamesCount ?? g.games.length,
      sampleGames: g.games.slice(0, 4),
      wishlistedGames: g.wishlistedGames,
    };
  });

  // Sort bundles containing wishlisted games first, then Humble Bundle & Fanatical first
  const storePriority = (store: string): number => {
    const s = store.toLowerCase();
    if (s.includes('humble')) return 0;
    if (s.includes('fanatical')) return 1;
    if (s.includes('greenman')) return 2;
    return 3;
  };

  items.sort((a, b) => {
    if (a.wishlistedGames.length !== b.wishlistedGames.length) {
      return b.wishlistedGames.length - a.wishlistedGames.length;
    }
    return storePriority(a.store) - storePriority(b.store);
  });

  return items.slice(0, limit);
}

interface ItadInfoResponse {
  bundles?: Array<{
    id: number;
    url?: string;
    title?: string;
    start?: number | null;
    expiry?: number | null;
    price?: [number, string] | null;
    page?: { id?: number; name?: string; shopId?: number };
    counts?: { games?: number };
  }>;
  stats?: {
    best?: {
      cut?: number;
      price?: [number, string] | null;
      shop?: number;
      url?: string;
    } | null;
    history?: {
      all?: {
        cut?: number;
        price?: [number, string] | null;
        shop?: number;
        time?: number;
      } | null;
    };
  };
}

/**
 * Queries IsThereAnyDeal for a game's live bundles, past bundle history, exact HLTB main-story hours,
 * and cross-store lowest price. Combines the per-game ITAD page/API with the public RSS bundle feed.
 */
export async function fetchItadGameEnrichment(
  steamAppId: number | null,
  title: string,
): Promise<ItadGameEnrichment> {
  const cacheKey = `itad:game:v1:${steamAppId ?? normalizeTitle(title)}`;
  return cached(cacheKey, GAME_TTL, async () => {
    const now = Date.now();
    let itadSlug: string | null = null;
    let itadGid: string | null = null;
    let hltbMainHours: number | null = null;
    let sessionToken: string | null = null;
    let shopsMap: Record<string, string> = {};

    const pageUrl = steamAppId
      ? `https://isthereanydeal.com/steam/app/${steamAppId}/`
      : `https://isthereanydeal.com/game/${toItadSlug(title)}/info/`;

    const [rssEntries, pageHtml] = await Promise.all([
      fetchActiveRssBundles(),
      fetch(pageUrl, { credentials: 'include' })
        .then((r) => (r.ok ? r.text() : null))
        .catch(() => null),
    ]);

    if (pageHtml) {
      const tokenMatch = pageHtml.match(/"token"\s*:\s*"([^"]+)"/);
      if (tokenMatch?.[1]) sessionToken = tokenMatch[1];

      const varGMatch = pageHtml.match(/var g\s*=\s*(\{[\s\S]*?\});\s*var page/);
      if (varGMatch?.[1]) {
        try {
          const gObj = JSON.parse(varGMatch[1]) as { shops?: Record<string, [string, number]> };
          if (gObj.shops) {
            for (const [k, v] of Object.entries(gObj.shops)) {
              if (Array.isArray(v) && typeof v[0] === 'string') shopsMap[k] = v[0];
            }
          }
        } catch {
          // ignore
        }
      }

      const pageIdx = pageHtml.indexOf('var page =');
      if (pageIdx !== -1) {
        const scriptEnd = pageHtml.indexOf('var sentry =', pageIdx);
        const rawSlice = pageHtml
          .slice(pageIdx + 'var page ='.length, scriptEnd !== -1 ? scriptEnd : pageIdx + 25000)
          .trim()
          .replace(/;$/, '');
        try {
          const parsed = JSON.parse(rawSlice) as [
            string,
            {
              game?: { id?: string; slug?: string; title?: string };
              detail?: { hltb?: { main?: number | null } };
            },
          ];
          if (parsed[0] === 'Game' && parsed[1]) {
            itadGid = parsed[1].game?.id ?? null;
            itadSlug = parsed[1].game?.slug ?? null;
            const mainSec = parsed[1].detail?.hltb?.main;
            if (typeof mainSec === 'number' && mainSec > 0) {
              hltbMainHours = Math.max(1, Math.round((mainSec / 3600) * 10) / 10);
            }
          }
        } catch {
          // Fallback regex extraction if JSON slice has trailing script statements
          itadGid = pageHtml.match(/"game"\s*:\s*\{\s*"id"\s*:\s*"([^"]+)"/)?.[1] ?? null;
          itadSlug = pageHtml.match(/"game"\s*:\s*\{\s*"id"\s*:\s*"[^"]+"\s*,\s*"slug"\s*:\s*"([^"]+)"/)?.[1] ?? null;
          const hltbSec = Number(pageHtml.match(/"hltb"\s*:\s*\{[^}]*"main"\s*:\s*(\d+)/)?.[1] ?? 0);
          if (hltbSec > 0) {
            hltbMainHours = Math.max(1, Math.round((hltbSec / 3600) * 10) / 10);
          }
        }
      }
    }

    const liveBundlesMap = new Map<string, ActiveBundleInfo>();
    const bundleHistory: HistoryRecord[] = [];
    let bestPriceUsd: ItadGameEnrichment['bestPriceUsd'] = null;
    let historicalLowUsd: ItadGameEnrichment['historicalLowUsd'] = null;

    // 1. Match from public RSS feed first (has exact per-tier price for the game and works without cookies)
    const fallbackSlug = itadSlug ?? toItadSlug(title);
    for (const entry of rssEntries) {
      if (entry.gameSlug === fallbackSlug || titlesMatch(entry.gameTitle, title)) {
        const key = normalizeTitle(entry.bundle.title);
        liveBundlesMap.set(key, entry.bundle);
        bundleHistory.push({
          title,
          service: mapBundleService(entry.bundle.store, entry.bundle.title),
          start: entry.startIso,
          end: entry.bundle.expiry ?? undefined,
          steamAppId: steamAppId ?? undefined,
          source: 'live',
          note: `${entry.bundle.title} (${entry.bundle.store})`,
          url: entry.bundle.url,
        });
      }
    }

    // 2. Query /api/game/info/ when we have ITAD's game UUID and session token
    if (itadGid && sessionToken) {
      try {
        const infoRes = await fetch('https://isthereanydeal.com/api/game/info/', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'ITAD-SessionToken': sessionToken,
          },
          body: JSON.stringify({ gid: itadGid }),
        });
        if (infoRes.ok) {
          const info = (await infoRes.json()) as ItadInfoResponse;
          if (Array.isArray(info.bundles)) {
            for (const b of info.bundles) {
              const bTitle = (b.title ?? '').trim();
              if (!bTitle) continue;
              const store = b.page?.name?.trim() || 'Bundle';
              const isLive = b.expiry == null || b.expiry * 1000 > now;
              const expiryIso = b.expiry ? new Date(b.expiry * 1000).toISOString() : null;
              const startIso = b.start
                ? new Date(b.start * 1000).toISOString()
                : expiryIso ?? new Date(now).toISOString();
              const cleanUrl = cleanBundleUrl(b.url, `https://isthereanydeal.com/bundles/${b.id}/`);
              const apiPrice =
                Array.isArray(b.price) && typeof b.price[0] === 'number' ? b.price[0] / 100 : null;
              const apiCurrency =
                Array.isArray(b.price) && typeof b.price[1] === 'string' ? b.price[1] : 'USD';

              if (isLive) {
                const key = normalizeTitle(bTitle);
                const existing = liveBundlesMap.get(key);
                liveBundlesMap.set(key, {
                  title: bTitle,
                  store,
                  // Prefer RSS tier-specific price when available, otherwise use API bundle price
                  price: existing?.price ?? apiPrice,
                  currency: existing?.currency ?? apiCurrency,
                  url: cleanUrl,
                  expiry: expiryIso ?? existing?.expiry ?? null,
                  gamesCount: b.counts?.games ?? existing?.gamesCount ?? null,
                });
              }

              bundleHistory.push({
                title,
                service: mapBundleService(store, bTitle),
                start: startIso,
                end: expiryIso ?? undefined,
                steamAppId: steamAppId ?? undefined,
                source: 'live',
                note: `${bTitle} (${store})`,
                url: cleanUrl,
              });
            }
          }

          const bestPriceArr = info.stats?.best?.price;
          if (Array.isArray(bestPriceArr) && typeof bestPriceArr[0] === 'number' && bestPriceArr[1] === 'USD') {
            const shopId = info.stats?.best?.shop;
            bestPriceUsd = {
              price: bestPriceArr[0] / 100,
              store: shopId != null ? (shopsMap[String(shopId)] ?? null) : null,
              url: info.stats?.best?.url ?? null,
            };
          }

          const lowArr = info.stats?.history?.all?.price;
          if (Array.isArray(lowArr) && typeof lowArr[0] === 'number' && lowArr[1] === 'USD') {
            const lowTime = info.stats?.history?.all?.time;
            historicalLowUsd = {
              price: lowArr[0] / 100,
              dateMs: typeof lowTime === 'number' ? lowTime * 1000 : null,
            };
          }
        }
      } catch {
        // Fallback to RSS-only active bundles if /api/game/info/ fails
      }
    }

    return {
      itadSlug,
      hltbMainHours,
      liveBundles: [...liveBundlesMap.values()],
      bundleHistory,
      bestPriceUsd,
      historicalLowUsd,
    };
  });
}
