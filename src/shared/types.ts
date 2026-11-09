/** Shared domain types used by the background worker, content scripts, popup and options page. */

export type Verdict =
  | 'BUY_NOW'
  | 'WAIT_FOR_SALE'
  | 'HOLD_FOR_BUNDLE'
  | 'BUNDLE_NOW'
  | 'IN_SUBSCRIPTION'
  | 'HIGH_GIVEAWAY_RISK'
  | 'FREE_NOW'
  | 'FREE_SOON'
  | 'FREE_TO_PLAY'
  | 'OWNED'
  | 'UNRELEASED';

export type GamePlatform = 'pc' | 'console';

export interface ActiveBundleInfo {
  title: string;
  store: string;
  price: number | null;
  currency?: string;
  url: string;
  expiry: string | null;
  gamesCount?: number | null;
}

export interface GameQuery {
  steamAppId?: number;
  title?: string;
  /** Current best price scraped from the active storefront page, if visible. */
  pageCurrentPrice?: number | null;
  /** All-time low price scraped from the active storefront page, if visible. */
  pageHistoricalLow?: number | null;
  /** ISO currency code detected on the active storefront page (e.g. "USD", "EUR", "GBP", "CAD"). */
  pageCurrency?: string;
  /** Whether the active storefront page is for PC or a console platform (Xbox, PlayStation, Switch). */
  platform?: GamePlatform;
  /** Human-readable platform name when on a console page (e.g. "Xbox", "PlayStation", "Switch"). */
  platformLabel?: string;
}

export interface PriceInfo {
  /** Best current price across tracked stores (or host page currency when non-USD). */
  current: number | null;
  /** Regular (undiscounted) price. */
  retail: number | null;
  currentStore: string | null;
  /** All-time low (CheapShark or host page). */
  historicalLow: number | null;
  /** Epoch ms of the all-time low. */
  historicalLowDate: number | null;
  /** CheapShark redirect URL for the best deal (keeps their attribution intact). */
  dealUrl: string | null;
  /** ISO 4217 currency code for current/retail/historicalLow (defaults to "USD"). */
  currency?: string;
  /** Display symbol for the currency (e.g. "$", "€", "£", "CA$", "A$"). */
  currencySymbol?: string;
}

export interface DlcInfo {
  name: string;
  steamAppId: number;
  releaseDate: number | null;
  comingSoon: boolean;
}

export interface SequelInfo {
  name: string;
  steamAppId: number;
  releaseDate: number | null;
  comingSoon: boolean;
}

/** Everything we know about a game, assembled from CheapShark + Steam + IsThereAnyDeal + host page overrides. */
export interface GameFacts {
  title: string;
  steamAppId: number | null;
  cheapSharkId: string | null;
  publishers: string[];
  developers: string[];
  genres: string[];
  releaseDate: number | null;
  comingSoon: boolean;
  isFree: boolean;
  price: PriceInfo;
  upcomingDlc: DlcInfo[];
  sequel: SequelInfo | null;
  thumb: string | null;
  platform?: GamePlatform;
  platformLabel?: string;
  /** Recent r/humblebundles prediction / Choice discussion mentions. */
  humbleCommunityMentions?: {
    count: number;
    latestPostTitle: string | null;
  };
  /** Currently active PC bundles containing this game (from IsThereAnyDeal). */
  liveBundles?: ActiveBundleInfo[];
  /** Past & current bundle records discovered on IsThereAnyDeal for this game. */
  itadBundlesHistory?: HistoryRecord[];
  /** Exact HowLongToBeat main-story hours when reported by IsThereAnyDeal. */
  hltbMainHours?: number | null;
}

export type HistoryService =
  | 'epic'
  | 'prime'
  | 'gog'
  | 'steam_free'
  | 'gamepass'
  | 'psplus_extra'
  | 'humble_choice'
  | 'humble_bundle'
  | 'fanatical_bundle'
  | 'other';

/** One appearance of a game in a giveaway, subscription or bundle. */
export interface HistoryRecord {
  title: string;
  service: HistoryService;
  /** ISO 8601 date/time. */
  start: string;
  end?: string;
  steamAppId?: number;
  publisher?: string;
  source?: 'seed' | 'live' | 'import';
  /** Optional bundle or giveaway title (e.g. "Phunkier Physics Bundle"). */
  note?: string;
  /** Optional direct URL to the bundle or giveaway. */
  url?: string;
}

export type LibrarySource = 'steam' | 'epic' | 'gog' | 'amazon' | 'ea' | 'ubisoft' | 'other';

export interface OwnedEntry {
  title: string;
  source: LibrarySource;
  /** Claimed / purchased date if known (ISO or free text from the CSV). */
  date?: string;
  steamAppId?: number;
  playtimeMinutes?: number;
}

export type SignalId =
  | 'live_epic'
  | 'live_bundle'
  | 'last_gasp'
  | 'dlc_sequel'
  | 'publisher'
  | 'cross_platform'
  | 'humble_prediction'
  | 'seasonal'
  | 'track_record'
  | 'age'
  | 'price_tier';

export interface Signal {
  id: SignalId;
  label: string;
  /** Contribution to the freebie log-odds. */
  weight: number;
  /** Contribution to the bundle log-odds. */
  bundleWeight: number;
  detail: string;
  /** Whether the signal is notable enough to highlight. */
  active: boolean;
}

export interface SeasonalWindow {
  id: string;
  name: string;
  kind: 'giveaway' | 'sale';
  start: number;
  end: number;
  warnFrom: number;
  approximate: boolean;
  advice: string;
}

export interface SavingsEstimate {
  horizonMonths: number;
  currentPrice: number;
  expectedPrice: number;
  expectedSavings: number;
  pFree: number;
  pBundle: number;
  pSale: number;
  saleTarget: number | null;
}

export interface LibraryGame {
  title: string;
  steamAppId?: number;
  genres?: string[];
  playtimeMinutes?: number;
}

export interface BacklogInput {
  unplayed: LibraryGame[];
  weeklyHours: number;
  indexed: number;
  total: number;
}

export interface BacklogTax {
  genre: string;
  unplayedCount: number;
  unplayedHours: number;
  monthsToFinishTwo: number;
  weeklyHours: number;
  targetPrice: number;
  probability: number;
  sampleTitles: string[];
  message: string;
  partialIndex: boolean;
}

export interface Link {
  label: string;
  url: string;
}

export interface VerdictResult {
  key: string;
  facts: GameFacts;
  verdict: Verdict;
  headline: string;
  freebieProbability: number;
  bundleProbability: number;
  signals: Signal[];
  savings: SavingsEstimate | null;
  playTonight: boolean;
  playTonightNote: string | null;
  owned: OwnedEntry[];
  wishlisted?: boolean;
  priorAppearances: HistoryRecord[];
  liveFreebie: { record: HistoryRecord; status: 'current' | 'upcoming' } | null;
  seasonal: SeasonalWindow[];
  backlog: BacklogTax | null;
  links: Link[];
  computedAt: number;
}

export interface SearchHit {
  title: string;
  steamAppId: number | null;
  cheapest: number | null;
  thumb: string | null;
}

export interface Settings {
  steamApiKey: string;
  steamId: string;
  unplayedThresholdMinutes: number;
  /** null = derive from recent Steam playtime. */
  weeklyHoursOverride: number | null;
  sites: {
    steam: boolean;
    humble: boolean;
    ggdeals: boolean;
    itad: boolean;
    gog: boolean;
    epic: boolean;
  };
  /** Active gaming subscriptions the user already pays for. */
  subscriptions: {
    gamepass: boolean;
    psplus: boolean;
  };
  historyUrl: string;
  giveawayThreshold: number;
  bundleThreshold: number;
}

export const DEFAULT_COMMUNITY_FEED_URL =
  'https://raw.githubusercontent.com/josephmate/EpicFreeGamesList/main/epic_free_games.json';

export const DEFAULT_SETTINGS: Settings = {
  steamApiKey: '',
  steamId: '',
  unplayedThresholdMinutes: 60,
  weeklyHoursOverride: null,
  sites: { steam: true, humble: true, ggdeals: true, itad: true, gog: true, epic: true },
  subscriptions: { gamepass: false, psplus: false },
  historyUrl: DEFAULT_COMMUNITY_FEED_URL,
  giveawayThreshold: 0.35,
  bundleThreshold: 0.4,
};

export interface LibraryStats {
  bySource: Partial<Record<LibrarySource, number>>;
  steamSync: {
    syncedAt: number;
    count: number;
    unplayed: number;
    weeklyHours: number;
    mode?: 'api' | 'session';
    wishlistCount?: number;
  } | null;
  genreIndex: { indexed: number; total: number };
}

export interface HistoryStats {
  byService: Partial<Record<HistoryService, number>>;
  bySource: { seed: number; live: number; import: number };
  lastEpicRefresh: number | null;
}

export interface LiveBundleOverviewItem {
  title: string;
  store: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency?: string;
  url: string;
  expiry: string | null;
  gamesCount: number | null;
  sampleGames: string[];
  wishlistedGames: string[];
}

export interface SeasonalOverview {
  active: SeasonalWindow[];
  upcoming: SeasonalWindow[];
  nextEpicDrop: number;
  nextHumbleChoice: number;
  liveEpic: { record: HistoryRecord; status: 'current' | 'upcoming'; wishlisted?: boolean }[];
  liveBundles?: LiveBundleOverviewItem[];
}
