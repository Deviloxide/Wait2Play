import type {
  GameQuery,
  HistoryStats,
  LibrarySource,
  LibraryStats,
  SearchHit,
  SeasonalOverview,
  Settings,
  Verdict,
  VerdictResult,
} from './types';

/** All messages accepted by the background service worker. */
export type Request =
  | { type: 'evaluate'; query: GameQuery }
  | { type: 'search'; query: string }
  | { type: 'setPlayTonight'; key: string; value: boolean }
  | { type: 'markOwned'; source: LibrarySource; title: string; steamAppId?: number; key: string }
  | { type: 'getSeasonal' }
  | { type: 'getSettings' }
  | { type: 'saveSettings'; settings: Partial<Settings> }
  | { type: 'importLibraryCsv'; source: LibrarySource; csv: string }
  | { type: 'clearLibrary'; source: LibrarySource }
  | { type: 'getLibraryStats' }
  | { type: 'syncSteam' }
  | { type: 'syncSteamSession' }
  | { type: 'syncGog' }
  | { type: 'getHistoryStats' }
  | { type: 'importHistory'; json: string }
  | { type: 'fetchHistoryUrl'; url: string }
  | { type: 'refreshEpic' }
  | { type: 'exportHistory' }
  | { type: 'exportBackup' }
  | { type: 'importBackup'; json: string }
  | { type: 'setBadge'; verdict: Verdict | null; freebieProbability?: number }
  | { type: 'clearCache' };

export interface ResponseMap {
  evaluate: VerdictResult | null;
  search: SearchHit[];
  setPlayTonight: VerdictResult | null;
  markOwned: VerdictResult | null;
  getSeasonal: SeasonalOverview;
  getSettings: Settings;
  saveSettings: Settings;
  importLibraryCsv: { imported: number; skipped: number };
  clearLibrary: LibraryStats;
  getLibraryStats: LibraryStats;
  syncSteam: { count: number; unplayed: number; weeklyHours: number };
  syncSteamSession: { count: number; unplayed: number; weeklyHours: number; wishlistCount: number };
  syncGog: { count: number };
  getHistoryStats: HistoryStats;
  importHistory: { imported: number };
  fetchHistoryUrl: { imported: number };
  refreshEpic: { added: number };
  exportHistory: string;
  exportBackup: string;
  importBackup: { libraries: number; history: number; steamGames: number };
  setBadge: true;
  clearCache: true;
}

export type Response<T> = { ok: true; data: T } | { ok: false; error: string };

/** Message sent from the popup to a content script to ask what game the page shows. */
export interface PageGameRequest {
  type: 'getPageGame';
}

export async function send<R extends Request>(req: R): Promise<ResponseMap[R['type']]> {
  const res = (await chrome.runtime.sendMessage(req)) as Response<ResponseMap[R['type']]> | undefined;
  if (!res) throw new Error('No response from the Wait2Play background worker.');
  if (!res.ok) throw new Error(res.error);
  return res.data;
}
