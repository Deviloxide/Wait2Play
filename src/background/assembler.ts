import { CURRENCY_SYMBOL_MAP } from '../core/signals';
import { bestMatch, looksLikeSequel, sequelBase } from '../core/titles';
import type { DlcInfo, GameFacts, GameQuery, PriceInfo, SearchHit, SequelInfo } from '../shared/types';
import {
  dealRedirect,
  gameById,
  lookupBySteamAppId,
  searchByTitle,
  storeNames,
  type CsGameLookup,
} from './api/cheapshark';
import { fetchItadGameEnrichment, type ItadGameEnrichment } from './api/itad';
import { fetchHumbleSubredditMentions } from './api/redditHumble';
import { appDetails, storeSearch, type SteamApp } from './api/steamStore';

function bestDealPrice(
  cs: CsGameLookup | null,
  stores: Record<string, string>,
  steam: SteamApp | null,
  query: GameQuery,
  itad: ItadGameEnrichment | null = null,
): PriceInfo {
  const isConsole = query.platform === 'console';
  const currency = (query.pageCurrency ?? 'USD').toUpperCase();
  const currencySymbol = CURRENCY_SYMBOL_MAP[currency] ?? '$';
  const isNonUsd = currency !== 'USD' && (query.pageCurrentPrice != null || query.pageHistoricalLow != null);

  let usdCurrent: number | null = null;
  let usdRetail: number | null = null;
  let currentStore: string | null = null;
  let dealUrl: string | null = null;

  if (cs && cs.deals.length > 0) {
    const sorted = [...cs.deals].sort((a, b) => Number(a.price) - Number(b.price));
    const best = sorted[0]!;
    usdCurrent = Number(best.price);
    usdRetail = Number(best.retailPrice) || usdCurrent;
    currentStore = stores[best.storeID] ?? `Store #${best.storeID}`;
    dealUrl = dealRedirect(best.dealID);
  } else if (steam && steam.priceFinal != null) {
    usdCurrent = steam.priceFinal;
    usdRetail = steam.priceInitial ?? steam.priceFinal;
    currentStore = 'Steam';
  }

  if (itad?.bestPriceUsd && itad.bestPriceUsd.price >= 0) {
    if (usdCurrent == null || itad.bestPriceUsd.price < usdCurrent) {
      usdCurrent = itad.bestPriceUsd.price;
      if (itad.bestPriceUsd.store) currentStore = itad.bestPriceUsd.store;
      if (itad.bestPriceUsd.url && !dealUrl) dealUrl = itad.bestPriceUsd.url;
    }
  }

  const csLow = cs?.cheapestPriceEver?.price != null ? Number(cs.cheapestPriceEver.price) : null;
  const itadLow = itad?.historicalLowUsd?.price ?? null;
  const historicalLowDate =
    cs?.cheapestPriceEver?.date
      ? cs.cheapestPriceEver.date * 1000
      : (itad?.historicalLowUsd?.dateMs ?? null);

  if (isConsole) {
    const current = query.pageCurrentPrice ?? null;
    const retail = current;
    const lowCandidates = [query.pageHistoricalLow, current].filter((x): x is number => x != null && x > 0);
    const historicalLow = lowCandidates.length > 0 ? Math.min(...lowCandidates) : null;
    return {
      current,
      retail,
      currentStore: query.platformLabel ?? 'Console Store',
      historicalLow,
      historicalLowDate: null,
      dealUrl: null,
      currency,
      currencySymbol,
    };
  }

  // Non-USD PC page (e.g. EUR, GBP, CAD, AUD, PLN, BRL, JPY): keep all numbers in the page's local currency.
  if (isNonUsd) {
    const current = query.pageCurrentPrice ?? query.pageHistoricalLow ?? null;
    // Estimate local retail & all-time low from CheapShark's discount ratio if not explicitly scraped on page.
    const refUsd = usdCurrent && usdCurrent > 0 ? usdCurrent : usdRetail;
    const fx = current != null && refUsd && refUsd > 0 ? current / refUsd : null;
    const retail =
      fx && usdRetail ? Math.max(current ?? 0, Number((usdRetail * fx).toFixed(2))) : current;
    const bestKnownUsdLow =
      csLow != null && itadLow != null ? Math.min(csLow, itadLow) : (csLow ?? itadLow);
    const scaledLow =
      fx && bestKnownUsdLow != null && !Number.isNaN(bestKnownUsdLow)
        ? Number((bestKnownUsdLow * fx).toFixed(2))
        : null;
    const lowCandidates = [query.pageHistoricalLow ?? scaledLow, current].filter(
      (x): x is number => x != null && !Number.isNaN(x) && x >= 0,
    );
    const historicalLow = lowCandidates.length > 0 ? Math.min(...lowCandidates) : null;
    return {
      current,
      retail,
      currentStore,
      historicalLow,
      historicalLowDate,
      dealUrl,
      currency,
      currencySymbol,
    };
  }

  // USD PC page: merge CheapShark + ITAD USD deals with host-page scraped USD prices.
  let current = usdCurrent;
  const retail = usdRetail;
  if (query.pageCurrentPrice != null && query.pageCurrentPrice >= 0) {
    if (current == null || query.pageCurrentPrice < current) {
      current = query.pageCurrentPrice;
    }
  }

  const lowCandidates = [
    csLow != null && !Number.isNaN(csLow) ? csLow : null,
    itadLow != null && !Number.isNaN(itadLow) ? itadLow : null,
    query.pageHistoricalLow ?? null,
    current,
  ].filter((x): x is number => x != null && !Number.isNaN(x) && x >= 0);

  const historicalLow = lowCandidates.length > 0 ? Math.min(...lowCandidates) : null;

  return {
    current,
    retail,
    currentStore,
    historicalLow,
    historicalLowDate,
    dealUrl,
    currency: 'USD',
    currencySymbol: '$',
  };
}

async function detectUpcomingDlc(steam: SteamApp | null): Promise<DlcInfo[]> {
  if (!steam || steam.dlc.length === 0) return [];
  const newestIds = [...steam.dlc].sort((a, b) => b - a).slice(0, 3);
  const results = await Promise.all(
    newestIds.map(async (id) => {
      try {
        const d = await appDetails(id);
        if (!d) return null;
        return {
          name: d.name,
          steamAppId: d.steamAppId,
          releaseDate: d.releaseDate,
          comingSoon: d.comingSoon,
        } satisfies DlcInfo;
      } catch {
        return null;
      }
    }),
  );
  return results.filter((d): d is DlcInfo => d !== null);
}

async function detectSequel(title: string, steamAppId: number | null): Promise<SequelInfo | null> {
  const base = sequelBase(title);
  if (base.length < 3) return null;
  try {
    const items = await storeSearch(base);
    const candidate = items.find((it) => it.id !== steamAppId && looksLikeSequel(it.name, base, title));
    if (!candidate) return null;
    const det = await appDetails(candidate.id);
    return {
      name: candidate.name,
      steamAppId: candidate.id,
      releaseDate: det?.releaseDate ?? null,
      comingSoon: det?.comingSoon ?? false,
    };
  } catch {
    return null;
  }
}

export async function assembleGameFacts(query: GameQuery): Promise<GameFacts | null> {
  let steamAppId = query.steamAppId ?? null;
  let cheapSharkId: string | null = null;
  let csLookup: CsGameLookup | null = null;

  if (!steamAppId && query.title) {
    const [csHits, steamHits] = await Promise.all([
      searchByTitle(query.title, 10).catch(() => []),
      storeSearch(query.title).catch(() => []),
    ]);
    const bestCs = bestMatch(query.title, csHits, (h) => h.external, 0.68);
    const bestSteam = bestMatch(query.title, steamHits, (h) => h.name, 0.68);
    if (bestCs) {
      cheapSharkId = bestCs.gameID;
      if (bestCs.steamAppID) steamAppId = Number(bestCs.steamAppID);
    }
    if (!steamAppId && bestSteam) {
      steamAppId = bestSteam.id;
    }
  }

  const [steam, cs, stores] = await Promise.all([
    steamAppId ? appDetails(steamAppId).catch(() => null) : Promise.resolve(null),
    cheapSharkId
      ? gameById(cheapSharkId).catch(() => null)
      : steamAppId
        ? lookupBySteamAppId(steamAppId).catch(() => null)
        : Promise.resolve(null),
    storeNames().catch(() => ({} as Record<string, string>)),
  ]);
  csLookup = cs;

  const title = steam?.name ?? csLookup?.info.title ?? query.title?.trim() ?? '';
  if (!title) return null;

  if (!steamAppId && csLookup?.info.steamAppID) {
    steamAppId = Number(csLookup.info.steamAppID);
  }

  const [upcomingDlc, sequel, humbleCommunityMentions, itad] = await Promise.all([
    detectUpcomingDlc(steam),
    detectSequel(title, steamAppId),
    query.platform === 'console'
      ? Promise.resolve({ count: 0, latestPostTitle: null })
      : fetchHumbleSubredditMentions(title),
    query.platform === 'console'
      ? Promise.resolve(null)
      : fetchItadGameEnrichment(steamAppId, title).catch(() => null),
  ]);

  const price = bestDealPrice(csLookup, stores, steam, query, itad);
  const isFree = steam?.isFree ?? (price.retail === 0 && price.current === 0);

  return {
    title,
    steamAppId,
    cheapSharkId,
    publishers: steam?.publishers ?? [],
    developers: steam?.developers ?? [],
    genres: steam?.genres ?? [],
    releaseDate: steam?.releaseDate ?? null,
    comingSoon: steam?.comingSoon ?? false,
    isFree,
    price,
    upcomingDlc,
    sequel,
    thumb: steam?.headerImage ?? csLookup?.info.thumb ?? null,
    platform: query.platform ?? 'pc',
    platformLabel: query.platformLabel,
    humbleCommunityMentions,
    liveBundles: itad?.liveBundles ?? [],
    itadBundlesHistory: itad?.bundleHistory ?? [],
    hltbMainHours: itad?.hltbMainHours ?? null,
  };
}

export async function searchGames(term: string): Promise<SearchHit[]> {
  const q = term.trim();
  if (!q) return [];
  const [csHits, steamHits] = await Promise.all([
    searchByTitle(q, 10).catch(() => []),
    storeSearch(q).catch(() => []),
  ]);

  const out: SearchHit[] = [];
  const seenApp = new Set<number>();
  const seenTitle = new Set<string>();

  for (const s of steamHits) {
    seenApp.add(s.id);
    seenTitle.add(s.name.toLowerCase());
    const csMatch = csHits.find((c) => c.steamAppID && Number(c.steamAppID) === s.id);
    out.push({
      title: s.name,
      steamAppId: s.id,
      cheapest: csMatch ? Number(csMatch.cheapest) : s.price ? s.price.final / 100 : null,
      thumb: s.tiny_image ?? csMatch?.thumb ?? null,
    });
  }

  for (const c of csHits) {
    const appId = c.steamAppID ? Number(c.steamAppID) : null;
    if ((appId && seenApp.has(appId)) || seenTitle.has(c.external.toLowerCase())) continue;
    if (appId) seenApp.add(appId);
    seenTitle.add(c.external.toLowerCase());
    out.push({
      title: c.external,
      steamAppId: appId,
      cheapest: Number(c.cheapest),
      thumb: c.thumb || null,
    });
  }

  return out.slice(0, 12);
}
