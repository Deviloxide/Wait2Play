import { liveGiveaway } from '../core/history';
import { evaluate } from '../core/scoring';
import { activeWindows, nextEpicDrop, nextHumbleChoice, upcomingWindows } from '../core/seasonal';
import type { Request, Response, ResponseMap } from '../shared/messages';
import type { GameQuery, SeasonalOverview, Verdict, VerdictResult } from '../shared/types';
import { fetchActiveBundlesOverview } from './api/itad';
import { assembleGameFacts, searchGames } from './assembler';
import { clearCache, pruneCache } from './cache';
import {
  clearLibrary,
  exportFullBackup,
  exportHistoryJson,
  fetchHistoryFromUrl,
  findOwnedMatches,
  getBacklogInput,
  getHistory,
  getHistoryStats,
  getLibraryStats,
  getPlayTonight,
  getSettings,
  getWishlistTitles,
  importFullBackup,
  importHistoryJson,
  importLibraryCsv,
  indexSomeSteamGenres,
  isGameWishlisted,
  markGameOwned,
  refreshCommunityFeedIfConfigured,
  refreshEpicHistory,
  saveSettings,
  setPlayTonightFlag,
  syncSteamLibrary,
  syncGogSessionLibrary,
  syncSteamSessionLibrary,
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

async function evaluateGame(query: GameQuery): Promise<VerdictResult | null> {
  const facts = await assembleGameFacts(query);
  if (!facts) return null;
  const [history, owned, settings, backlog, wishlisted] = await Promise.all([
    getHistory(),
    findOwnedMatches(facts),
    getSettings(),
    getBacklogInput(),
    isGameWishlisted(facts.steamAppId, facts.title),
  ]);
  const key = facts.steamAppId ? `steam:${facts.steamAppId}` : `t:${facts.title.toLowerCase()}`;
  const playTonight = await getPlayTonight(key);
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

async function buildSeasonalOverview(): Promise<SeasonalOverview> {
  const now = Date.now();
  const [history, wishlistTitles] = await Promise.all([getHistory(), getWishlistTitles()]);
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
    case 'clearCache':
      await clearCache();
      return true;
  }
}

chrome.runtime.onInstalled.addListener(() => {
  void ensureCheapSharkUserAgentRule();
  void refreshEpicHistory().catch(() => {});
  void refreshCommunityFeedIfConfigured().catch(() => {});
  chrome.alarms.create(ALARM_EPIC, { periodInMinutes: 360 });
  chrome.alarms.create(ALARM_MAINTENANCE, { periodInMinutes: 60 });
});

chrome.runtime.onStartup.addListener(() => {
  void ensureCheapSharkUserAgentRule();
});

void ensureCheapSharkUserAgentRule();

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_EPIC) {
    void refreshEpicHistory().catch(() => {});
    void refreshCommunityFeedIfConfigured().catch(() => {});
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
