import { liveGiveaway } from '../core/history';
import { evaluate } from '../core/scoring';
import { activeWindows, nextEpicDrop, nextHumbleChoice, upcomingWindows } from '../core/seasonal';
import { titlesMatch } from '../core/titles';
import type { Request, Response, ResponseMap } from '../shared/messages';
import type { ActiveBundleInfo, GameQuery, SeasonalOverview, Verdict, VerdictResult } from '../shared/types';
import { fetchActiveBundlesOverview } from './api/itad';
import { assembleGameFacts, searchGames } from './assembler';
import { clearCache, pruneCache } from './cache';
import {
  clearGameOverride,
  clearLibrary,
  exportFullBackup,
  exportHistoryJson,
  fetchHistoryFromUrl,
  findOwnedMatches,
  getBacklogInput,
  getGameOverride,
  getHistory,
  getHistoryStats,
  getLibraryStats,
  getPlayTonight,
  getSettings,
  getWatchedEntry,
  getWatchlist,
  getWishlistTitles,
  importFullBackup,
  importHistoryJson,
  importLibraryCsv,
  indexSomeSteamGenres,
  isGameWishlisted,
  isUserConfigured,
  markGameOwned,
  refreshCommunityFeedIfConfigured,
  refreshEpicHistory,
  removeWatchlistEntry,
  saveSettings,
  saveWatchlist,
  setGameOverride,
  setPlayTonightFlag,
  syncSteamLibrary,
  syncGogSessionLibrary,
  syncSteamSessionLibrary,
  toggleWatchlistEntry,
} from './storage';

const CHEAPSHARK_UA_RULE_ID = 1;
const ALARM_EPIC = 'w2p:epic';
const ALARM_MAINTENANCE = 'w2p:maintenance';

/** Ensures CheapShark receives a descriptive User-Agent header on every request. */
async function ensureCheapSharkUserAgentRule(): Promise<void> {
  if (!chrome.declarativeNetRequest?.updateSessionRules) return;
  try {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [CHEAPSHARK_UA_RULE_ID],
      addRules: [
        {
          id: CHEAPSHARK_UA_RULE_ID,
          priority: 1,
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            requestHeaders: [
              {
                header: 'User-Agent',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: 'Wait2Play/0.1 (Browser Extension; +https://github.com/wait2play)',
              },
            ],
          },
          condition: {
            urlFilter: '||cheapshark.com/api/',
            resourceTypes: [chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST],
          },
        },
      ],
    });
  } catch {
    // Fallback to browser default UA if session rules fail.
  }
}

const BADGE_STYLE: Record<Verdict, { text: string; bg: string }> = {
  BUY_NOW: { text: 'BUY', bg: '#10b981' },
  WAIT_FOR_SALE: { text: 'WAIT', bg: '#f59e0b' },
  HOLD_FOR_BUNDLE: { text: 'BNDL', bg: '#8b5cf6' },
  BUNDLE_NOW: { text: 'BNDL', bg: '#a855f7' },
  IN_SUBSCRIPTION: { text: 'SUB', bg: '#22c55e' },
  HIGH_GIVEAWAY_RISK: { text: 'RISK', bg: '#ef4444' },
  FREE_NOW: { text: 'FREE', bg: '#06b6d4' },
  FREE_SOON: { text: 'SOON', bg: '#06b6d4' },
  FREE_TO_PLAY: { text: 'F2P', bg: '#64748b' },
  OWNED: { text: 'OWN', bg: '#ec4899' },
  UNRELEASED: { text: 'TBA', bg: '#64748b' },
};

async function updateTabBadge(
  tabId: number | undefined,
  verdict: Verdict | null,
  freebieProbability?: number,
): Promise<void> {
  if (!tabId) return;
  if (!verdict) {
    await chrome.action.setBadgeText({ tabId, text: '' });
    return;
  }
  const style = BADGE_STYLE[verdict];
  const text =
    verdict === 'HIGH_GIVEAWAY_RISK' && freebieProbability != null
      ? `${Math.round(freebieProbability * 100)}%`
      : style.text;
  await chrome.action.setBadgeText({ tabId, text });
  await chrome.action.setBadgeBackgroundColor({ tabId, color: style.bg });
}

const lastEvaluatedByKey = new Map<string, GameQuery>();
const pageObservedBundles: Array<{ bundle: ActiveBundleInfo; games: string[]; observedAt: number }> = [];

async function evaluateGame(query: GameQuery): Promise<VerdictResult | null> {
  let effectiveQuery = query;
  let overrideApplied = false;
  if (query.title) {
    const ov = await getGameOverride(query.title);
    if (ov) {
      effectiveQuery = {
        ...query,
        title: ov.title,
        steamAppId: ov.steamAppId ?? query.steamAppId,
      };
      overrideApplied = true;
    }
  }

  const facts = await assembleGameFacts(effectiveQuery);
  if (!facts) return null;

  // Merge any live bundles directly observed on Humble Bundle pages during this session
  for (const obs of pageObservedBundles) {
    if (obs.games.some((g) => titlesMatch(g, facts.title))) {
      const existing = facts.liveBundles ?? [];
      if (!existing.some((b) => titlesMatch(b.title, obs.bundle.title))) {
        facts.liveBundles = [obs.bundle, ...existing];
      }
    }
  }
  const [history, owned, settings, backlog, wishlisted, configured] = await Promise.all([
    getHistory(),
    findOwnedMatches(facts),
    getSettings(),
    getBacklogInput(),
    isGameWishlisted(facts.steamAppId, facts.title),
    isUserConfigured(),
  ]);
  const key = facts.steamAppId ? `steam:${facts.steamAppId}` : `t:${facts.title.toLowerCase()}`;
  const [playTonight, watched] = await Promise.all([
    getPlayTonight(key),
    getWatchedEntry(key, facts.steamAppId, facts.title),
  ]);
  const res = evaluate(facts, {
    now: Date.now(),
    history,
    owned,
    playTonight,
    backlog,
    thresholds: { giveaway: settings.giveawayThreshold, bundle: settings.bundleThreshold },
    subscriptions: settings.subscriptions,
  });
  res.wishlisted = wishlisted;
  res.needsOnboarding = !configured;
  res.overrideApplied = overrideApplied;

  if (watched) {
    const liveBundle = facts.liveBundles?.[0];
    let triggered = watched.triggered ?? null;
    if (res.verdict === 'FREE_NOW') {
      triggered = {
        reason: 'Free to claim right now!',
        url: res.liveFreebie?.record.url ?? facts.price.dealUrl,
        price: 0,
        triggeredAt: Date.now(),
      };
    } else if (liveBundle && watched.notifyOnFreeOrBundle) {
      triggered = {
        reason: `In live bundle: ${liveBundle.title} (${liveBundle.store})`,
        url: liveBundle.url,
        price: liveBundle.price ?? null,
        triggeredAt: Date.now(),
      };
    } else if (
      watched.targetPrice != null &&
      facts.price.current != null &&
      facts.price.current <= watched.targetPrice
    ) {
      triggered = {
        reason: `Hit target price (${facts.price.currencySymbol ?? '$'}${facts.price.current.toFixed(2)} ≤ ${facts.price.currencySymbol ?? '$'}${watched.targetPrice.toFixed(2)})`,
        url: facts.price.dealUrl,
        price: facts.price.current,
        triggeredAt: Date.now(),
      };
    }
    watched.triggered = triggered;
    res.watched = watched;
  }

  lastEvaluatedByKey.set(res.key, {
    steamAppId: facts.steamAppId ?? undefined,
    title: facts.title,
    pageCurrentPrice: query.pageCurrentPrice,
    pageHistoricalLow: query.pageHistoricalLow,
    pageCurrency: query.pageCurrency,
    platform: query.platform,
    platformLabel: query.platformLabel,
  });
  return res;
}

async function checkWatchlistAlerts(): Promise<void> {
  const list = await getWatchlist();
  if (list.length === 0) return;
  let changed = false;
  for (const item of list.slice(0, 8)) {
    try {
      const res = await evaluateGame({
        steamAppId: item.steamAppId ?? undefined,
        title: item.title,
      });
      if (res?.watched && JSON.stringify(res.watched.triggered) !== JSON.stringify(item.triggered)) {
        item.triggered = res.watched.triggered;
        changed = true;
      }
    } catch {
      // ignore individual failure
    }
  }
  if (changed) {
    await saveWatchlist(list);
  }
  await updateGlobalAlertBadge(list);
}

async function updateGlobalAlertBadge(watchlist?: Awaited<ReturnType<typeof getWatchlist>>): Promise<void> {
  try {
    const settings = await getSettings();
    if (settings.notifyAlerts === false) {
      await chrome.action.setBadgeText({ text: '' });
      return;
    }
    const list = watchlist ?? (await getWatchlist());
    const triggeredCount = list.filter((w) => !!w.triggered).length;
    if (triggeredCount > 0) {
      await chrome.action.setBadgeText({ text: `!${triggeredCount}` });
      await chrome.action.setBadgeBackgroundColor({ color: '#a4d007' });
    } else {
      await chrome.action.setBadgeText({ text: '' });
    }
  } catch {
    // ignore
  }
}

async function buildSeasonalOverview(): Promise<SeasonalOverview> {
  const now = Date.now();
  const [history, wishlistTitles, watchlist] = await Promise.all([
    getHistory(),
    getWishlistTitles(),
    getWatchlist(),
  ]);
  const [liveBundles] = await Promise.all([
    fetchActiveBundlesOverview(wishlistTitles, 4).catch(() => []),
  ]);
  const liveEpic: SeasonalOverview['liveEpic'] = [];
  for (const r of history.filter((h) => ['epic', 'steam_free', 'gog', 'prime'].includes(h.service))) {
    const live = liveGiveaway([r], now);
    if (live) {
      const wishlisted = await isGameWishlisted(live.record.steamAppId, live.record.title);
      liveEpic.push({ ...live, wishlisted });
    }
  }
  return {
    active: activeWindows(now),
    upcoming: upcomingWindows(now, 90),
    nextEpicDrop: nextEpicDrop(now),
    nextHumbleChoice: nextHumbleChoice(now),
    liveEpic: liveEpic.slice(0, 6),
    liveBundles,
    watchlist,
  };
}

async function handleRequest(req: Request, sender: chrome.runtime.MessageSender): Promise<ResponseMap[Request['type']]> {
  switch (req.type) {
    case 'evaluate': {
      const res = await evaluateGame(req.query);
      if (sender.tab?.id && res) {
        void updateTabBadge(sender.tab.id, res.verdict, res.freebieProbability).catch(() => {});
      }
      return res;
    }
    case 'search':
      return searchGames(req.query);
    case 'setPlayTonight': {
      await setPlayTonightFlag(req.key, req.value);
      const q =
        lastEvaluatedByKey.get(req.key) ??
        (req.key.startsWith('steam:') ? { steamAppId: Number(req.key.slice(6)) } : { title: req.key.slice(2) });
      return evaluateGame(q);
    }
    case 'markOwned': {
      await markGameOwned(req.source, req.title, req.steamAppId);
      const q =
        lastEvaluatedByKey.get(req.key) ??
        (req.steamAppId ? { steamAppId: req.steamAppId, title: req.title } : { title: req.title });
      return evaluateGame(q);
    }
    case 'toggleWatch': {
      await toggleWatchlistEntry({
        key: req.key,
        title: req.title,
        steamAppId: req.steamAppId,
        targetPrice: req.targetPrice,
        currency: req.currency,
      });
      const q =
        lastEvaluatedByKey.get(req.key) ??
        (req.steamAppId ? { steamAppId: req.steamAppId, title: req.title } : { title: req.title });
      const res = await evaluateGame(q);
      void updateGlobalAlertBadge();
      return res;
    }
    case 'removeWatch': {
      const next = await removeWatchlistEntry(req.key);
      void updateGlobalAlertBadge(next);
      return next;
    }
    case 'setGameOverride': {
      await setGameOverride(req.rawTitle, req.override);
      return evaluateGame(req.currentQuery);
    }
    case 'clearGameOverride': {
      await clearGameOverride(req.rawTitle);
      return evaluateGame(req.currentQuery);
    }
    case 'recordLiveBundle': {
      const idx = pageObservedBundles.findIndex((x) => x.bundle.url === req.bundleUrl);
      const entry = {
        bundle: {
          title: req.bundleTitle,
          store: req.store,
          price: req.price,
          currency: 'USD',
          url: req.bundleUrl,
          expiry: null,
          gamesCount: req.games.length,
        },
        games: req.games,
        observedAt: Date.now(),
      };
      if (idx >= 0) pageObservedBundles[idx] = entry;
      else pageObservedBundles.unshift(entry);
      return true;
    }
    case 'getSeasonal':
      return buildSeasonalOverview();
    case 'getSettings':
      return getSettings();
    case 'saveSettings':
      return saveSettings(req.settings);
    case 'importLibraryCsv':
      return importLibraryCsv(req.source, req.csv);
    case 'clearLibrary':
      return clearLibrary(req.source);
    case 'getLibraryStats':
      return getLibraryStats();
    case 'syncSteam':
      return syncSteamLibrary();
    case 'syncSteamSession':
      return syncSteamSessionLibrary();
    case 'syncGog':
      return syncGogSessionLibrary();
    case 'getHistoryStats':
      return getHistoryStats();
    case 'importHistory':
      return importHistoryJson(req.json);
    case 'fetchHistoryUrl':
      return fetchHistoryFromUrl(req.url);
    case 'refreshEpic':
      return refreshEpicHistory();
    case 'exportHistory':
      return exportHistoryJson();
    case 'exportBackup':
      return exportFullBackup();
    case 'importBackup':
      return importFullBackup(req.json);
    case 'setBadge':
      await updateTabBadge(sender.tab?.id, req.verdict, req.freebieProbability);
      return true;
    case 'openOptions':
      await chrome.runtime.openOptionsPage();
      return true;
    case 'clearCache':
      await clearCache();
      return true;
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  void ensureCheapSharkUserAgentRule();
  void refreshEpicHistory().catch(() => {});
  void refreshCommunityFeedIfConfigured().catch(() => {});
  chrome.alarms.create(ALARM_EPIC, { periodInMinutes: 360 });
  chrome.alarms.create(ALARM_MAINTENANCE, { periodInMinutes: 60 });
  if (details.reason === 'install') {
    void chrome.tabs.create({ url: chrome.runtime.getURL('options/index.html?welcome=1') }).catch(() => {});
  }
});

chrome.runtime.onStartup.addListener(() => {
  void ensureCheapSharkUserAgentRule();
});

void ensureCheapSharkUserAgentRule();

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_EPIC) {
    void refreshEpicHistory().catch(() => {});
    void refreshCommunityFeedIfConfigured().catch(() => {});
    void checkWatchlistAlerts().catch(() => {});
  } else if (alarm.name === ALARM_MAINTENANCE) {
    void pruneCache().catch(() => {});
    void indexSomeSteamGenres(15).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((msg: Request, sender, sendResponse) => {
  handleRequest(msg, sender)
    .then((data) => sendResponse({ ok: true, data } satisfies Response<unknown>))
    .catch((err: unknown) => {
      const error = err instanceof Error ? err.message : String(err);
      sendResponse({ ok: false, error } satisfies Response<never>);
    });
  return true;
});
