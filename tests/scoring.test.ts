import { describe, expect, it } from 'vitest';
import { parseEpicFreeGames } from '../src/background/api/epic';
import { parseItadBundlesRss } from '../src/background/api/itad';
import { coerceHistoryRecord } from '../src/background/storage';
import { parsePriceWithCurrency } from '../src/content/detectors';
import { computeBacklogTax } from '../src/core/backlog';
import { extractLibraryEntries } from '../src/core/csv';
import { evaluate } from '../src/core/scoring';
import { activeWindows } from '../src/core/seasonal';
import { fmtMoney } from '../src/core/signals';
import { looksLikeSequel, titlesMatch } from '../src/core/titles';
import { SEED_HISTORY } from '../src/data/seedHistory';
import type { GameFacts, HistoryRecord } from '../src/shared/types';
import { formatVerdictSummary, renderSignalMeter } from '../src/shared/verdictUi';

const NOV_2026 = Date.UTC(2026, 10, 8, 18, 0, 0);

function baseFacts(overrides: Partial<GameFacts> = {}): GameFacts {
  return {
    title: 'Sample Indie Game',
    steamAppId: 999999,
    cheapSharkId: '100',
    publishers: ['Generic Studio'],
    developers: ['Generic Studio'],
    genres: ['Action', 'Indie', 'RPG'],
    releaseDate: Date.UTC(2022, 5, 1),
    comingSoon: false,
    isFree: false,
    price: {
      current: 19.99,
      retail: 19.99,
      currentStore: 'Steam',
      historicalLow: 9.99,
      historicalLowDate: Date.UTC(2025, 11, 20),
      dealUrl: 'https://www.cheapshark.com/redirect?dealID=abc',
    },
    upcomingDlc: [],
    sequel: null,
    thumb: null,
    ...overrides,
  };
}

describe('Title normalization & sequel detection', () => {
  it('matches titles across Roman numerals and edition suffixes', () => {
    expect(titlesMatch('Sid Meier’s Civilization® VI', 'Sid Meiers Civilization 6')).toBe(true);
    expect(
      titlesMatch('The Witcher 3: Wild Hunt - Game of the Year Edition', 'Witcher 3: Wild Hunt'),
    ).toBe(true);
  });

  it('identifies numbered and subtitled sequels while ignoring DLC/soundtracks', () => {
    expect(looksLikeSequel('Hades II', 'hades', 'Hades')).toBe(true);
    expect(looksLikeSequel('Hades Original Soundtrack', 'hades', 'Hades')).toBe(false);
    expect(looksLikeSequel('Hollow Knight: Silksong', 'hollow knight', 'Hollow Knight')).toBe(true);
  });
});

describe('5 Predictive Signals & Verdict Engine', () => {
  it('flags HIGH_GIVEAWAY_RISK when multiple giveaway signals align (Last Gasp + Devolver + Sequel + Nov Holiday window)', () => {
    const facts = baseFacts({
      title: 'Cult Action Game',
      publishers: ['Devolver Digital'],
      price: {
        current: 2.99,
        retail: 24.99,
        currentStore: 'Steam',
        historicalLow: 2.99,
        historicalLowDate: NOV_2026 - 3 * 86_400_000,
        dealUrl: null,
      },
      sequel: {
        name: 'Cult Action Game 2',
        steamAppId: 999998,
        releaseDate: NOV_2026 + 30 * 86_400_000,
        comingSoon: true,
      },
    });
    const history: HistoryRecord[] = [
      { title: 'Cult Action Game', service: 'gamepass', start: '2026-02-01' },
    ];

    const res = evaluate(facts, {
      now: NOV_2026,
      history,
      owned: [],
      playTonight: false,
    });

    expect(res.verdict).toBe('HIGH_GIVEAWAY_RISK');
    expect(res.freebieProbability).toBeGreaterThan(0.65);
    expect(res.signals.find((s) => s.id === 'last_gasp')?.active).toBe(true);
    expect(res.signals.find((s) => s.id === 'dlc_sequel')?.active).toBe(true);
    expect(res.signals.find((s) => s.id === 'publisher')?.active).toBe(true);
    expect(res.signals.find((s) => s.id === 'cross_platform')?.active).toBe(true);
    expect(res.signals.find((s) => s.id === 'seasonal')?.active).toBe(true);
  });

  it('applies publisher veto for never-free studios (Wube Software / Factorio) and recommends BUY_NOW near low', () => {
    const facts = baseFacts({
      title: 'Factorio',
      steamAppId: 427520,
      publishers: ['Wube Software'],
      developers: ['Wube Software'],
      price: {
        current: 35.0,
        retail: 35.0,
        currentStore: 'Steam',
        historicalLow: 35.0,
        historicalLowDate: Date.UTC(2024, 0, 1),
        dealUrl: null,
      },
    });

    const res = evaluate(facts, {
      now: NOV_2026,
      history: [],
      owned: [],
      playTonight: false,
    });

    expect(res.verdict).toBe('BUY_NOW');
    expect(res.freebieProbability).toBeLessThan(0.08);
  });

  it('triggers Multi-Launcher Duplicate Guard when the game was imported from Epic CSV', () => {
    const { entries } = extractLibraryEntries(
      'Title,Source,Claimed\nSubnautica,Epic Games,2018-12-14\nControl,Epic,2021-06-10',
      'epic',
    );
    expect(entries).toHaveLength(2);

    const facts = baseFacts({ title: 'Subnautica', steamAppId: 264710 });
    const res = evaluate(facts, {
      now: NOV_2026,
      history: [],
      owned: entries.filter((e) => e.title === 'Subnautica'),
      playTonight: false,
    });

    expect(res.verdict).toBe('OWNED');
    expect(res.headline).toContain('Stop! You claimed this on Epic in 2018');
  });

  it('computes Backlog Tax by comparing played time against estimated time-to-beat', () => {
    const facts = baseFacts({
      title: 'New Fantasy RPG',
      genres: ['RPG'],
      price: {
        current: 15,
        retail: 29.99,
        currentStore: 'Steam',
        historicalLow: 7.49,
        historicalLowDate: Date.UTC(2026, 5, 1),
        dealUrl: null,
      },
    });

    const tax = computeBacklogTax(
      facts,
      {
        unplayed: [
          // 5 completely unplayed RPGs (40h each = 200h)
          ...Array.from({ length: 5 }, (_, i) => ({
            title: `Unplayed RPG #${i + 1}`,
            steamAppId: 1000 + i,
            genres: ['RPG'],
            playtimeMinutes: 0,
          })),
          // 1 RPG played for 180 minutes (3h out of 40h = 7.5% < 25% cutoff -> still unfinished, 37h remaining!)
          {
            title: 'Barely Started RPG',
            steamAppId: 1009,
            genres: ['RPG'],
            playtimeMinutes: 180,
          },
          // 1 RPG played for 2100 minutes (35h out of 40h = 87.5% -> beaten, excluded from unfinished backlog)
          {
            title: 'Completed RPG',
            steamAppId: 1010,
            genres: ['RPG'],
            playtimeMinutes: 2100,
          },
        ],
        weeklyHours: 5,
        indexed: 7,
        total: 7,
      },
      0.25,
      0.3,
      NOV_2026,
    );

    expect(tax).not.toBeNull();
    expect(tax!.unplayedCount).toBe(6);
    expect(tax!.unplayedHours).toBe(237);
    expect(tax!.message).toContain('You already own 6 unplayed or unfinished RPGs (~237 hours left to beat)');
    expect(tax!.message).toContain('drop/bundle score');
  });

  it('warns about Epic Holiday Mystery Giveaways during November', () => {
    const wins = activeWindows(NOV_2026);
    expect(wins.some((w) => w.id === 'epic_holiday_2026')).toBe(true);
  });

  it('mutes PC-only Epic seasonal giveaway signals and PC bundle odds on console pages', () => {
    const facts = baseFacts({
      title: 'Console Action Game',
      platform: 'console',
      platformLabel: 'Xbox',
      price: {
        current: 29.99,
        retail: 59.99,
        currentStore: 'Xbox Store',
        historicalLow: 24.99,
        historicalLowDate: NOV_2026 - 30 * 86_400_000,
        dealUrl: null,
      },
    });

    const res = evaluate(facts, {
      now: NOV_2026,
      history: [],
      owned: [],
      playTonight: false,
    });

    const seasonal = res.signals.find((s) => s.id === 'seasonal');
    expect(seasonal?.active).toBe(false);
    expect(seasonal?.detail).toContain('PC-only Epic Games Store giveaway seasons are muted');
    expect(res.bundleProbability).toBe(0);
    expect(res.seasonal).toHaveLength(0);
  });

  it('renders signal meter bars strictly for risk weight and 0 lit bars with Safe tag for safe signals', () => {
    const safeHtml = renderSignalMeter(-1.8);
    expect(safeHtml).toContain('>Safe<');
    expect(safeHtml).not.toContain('seg on');

    const riskHtml = renderSignalMeter(1.4);
    expect(riskHtml).toContain('>Risk<');
    expect(riskHtml.match(/seg on/g)?.length).toBe(4);
  });

  it('parses and formats multi-currency prices (EUR, GBP, CAD, PLN, JPY, USD)', () => {
    expect(parsePriceWithCurrency('Historical low: 32,70 €')).toEqual({ value: 32.7, currency: 'EUR' });
    expect(parsePriceWithCurrency('Best price £24.99')).toEqual({ value: 24.99, currency: 'GBP' });
    expect(parsePriceWithCurrency('CDN$ 39.99')).toEqual({ value: 39.99, currency: 'CAD' });
    expect(parsePriceWithCurrency('119,99 zł')).toEqual({ value: 119.99, currency: 'PLN' });
    expect(parsePriceWithCurrency('¥3,500')).toEqual({ value: 3500, currency: 'JPY' });

    expect(fmtMoney(32.7, 'EUR')).toBe('€32.70');
    expect(fmtMoney(119.99, 'PLN')).toBe('119.99 zł');
    expect(fmtMoney(3500, 'JPY')).toBe('¥3,500');

    const euroFacts = baseFacts({
      price: {
        current: 19.99,
        retail: 29.99,
        currentStore: 'Steam',
        historicalLow: 9.99,
        historicalLowDate: Date.UTC(2025, 11, 20),
        dealUrl: null,
        currency: 'EUR',
        currencySymbol: '€',
      },
    });
    const res = evaluate(euroFacts, { now: NOV_2026, history: [], owned: [], playTonight: false });
    expect(res.headline).toContain('€19.99');
    expect(res.headline).toContain('€9.99');
  });

  it('parses current and upcoming free games from the Epic promotions payload', () => {
    const records = parseEpicFreeGames({
      data: {
        Catalog: {
          searchStore: {
            elements: [
              {
                title: 'Flotsam',
                seller: { name: 'Pajama Llama Games' },
                promotions: {
                  promotionalOffers: [
                    {
                      promotionalOffers: [
                        {
                          startDate: '2026-11-05T16:00:00.000Z',
                          endDate: '2026-11-12T16:00:00.000Z',
                          discountSetting: { discountPercentage: 0 },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    });
    expect(records).toHaveLength(1);
    expect(records[0]?.title).toBe('Flotsam');
    expect(records[0]?.service).toBe('epic');
  });

  it('ships with a comprehensive 1,400+ historical dataset across Epic, Prime, Steam, GOG, Humble & subscriptions', () => {
    expect(SEED_HISTORY.length).toBeGreaterThan(1400);
    const services = new Set(SEED_HISTORY.map((r) => r.service));
    expect(services.has('epic')).toBe(true);
    expect(services.has('prime')).toBe(true);
    expect(services.has('gog')).toBe(true);
    expect(services.has('steam_free')).toBe(true);
    expect(services.has('humble_choice')).toBe(true);
    expect(services.has('humble_bundle')).toBe(true);
    expect(services.has('fanatical_bundle')).toBe(true);
    expect(services.has('gamepass')).toBe(true);
    expect(services.has('psplus_extra')).toBe(true);
  });

  it('coerces GitHub EpicFreeGamesList and GamerPower live feed records into HistoryRecord entries', () => {
    const ghRow = coerceHistoryRecord({
      gameTitle: 'Sifu',
      freeDate: '2024-12-31T16:00:00.000Z',
      steamUrl: 'https://store.steampowered.com/app/2138710',
    });
    expect(ghRow).toEqual({
      title: 'Sifu',
      service: 'epic',
      start: '2024-12-31T16:00:00.000Z',
      steamAppId: 2138710,
      source: 'import',
    });

    const gpSteam = coerceHistoryRecord(
      {
        title: 'Metro 2033 Redux (Steam) Key Giveaway',
        published_date: '2025-04-14 15:00:00',
        end_date: '2025-04-16 15:00:00',
        platforms: 'PC, Steam',
        type: 'Game',
      },
      'live',
    );
    expect(gpSteam).toEqual({
      title: 'Metro 2033 Redux',
      service: 'steam_free',
      start: '2025-04-14',
      end: '2025-04-16',
      source: 'live',
    });

    // Mobile-only giveaways should be ignored
    const gpAndroid = coerceHistoryRecord({
      title: 'Some Mobile App (Android) Giveaway',
      published_date: '2026-04-01 12:00:00',
      platforms: 'Android, iOS',
      type: 'Game',
    });
    expect(gpAndroid).toBeNull();
  });

  it('formats a clean one-line Wait2Play summary for clipboard sharing', () => {
    const res = evaluate(baseFacts(), { now: NOV_2026, history: [], owned: [], playTonight: false });
    const summary = formatVerdictSummary(res);
    expect(summary).toContain('Wait2Play: Sample Indie Game —');
    expect(summary).toContain('$19.99, all-time low $9.99');
    expect(summary).toContain('90d giveaway risk');
  });

  it('boosts bundle risk score using r/humblebundles predictions, subreddit mentions, and publisher bundle history', () => {
    const facts = baseFacts({
      title: 'Atlas Fallen',
      steamAppId: 1230530,
      publishers: ['Focus Entertainment'],
      releaseDate: Date.UTC(2023, 7, 10),
      price: {
        current: 19.99,
        retail: 49.99,
        currentStore: 'Steam',
        historicalLow: 16.99,
        historicalLowDate: Date.UTC(2026, 8, 1),
        dealUrl: null,
      },
      humbleCommunityMentions: {
        count: 3,
        latestPostTitle: 'November 2026 Humble Choice Prediction League',
      },
    });

    const res = evaluate(facts, {
      now: NOV_2026,
      history: SEED_HISTORY,
      owned: [],
      playTonight: false,
    });

    const hbSig = res.signals.find((s) => s.id === 'humble_prediction');
    expect(hbSig).toBeDefined();
    expect(hbSig!.active).toBe(true);
    expect(hbSig!.bundleWeight).toBeGreaterThan(1.0);
    expect(hbSig!.detail).toContain('r/humblebundles');
    expect(hbSig!.detail).toContain('Focus Entertainment');
    expect(res.bundleProbability).toBeGreaterThan(0.5);
  });

  it('detects active IsThereAnyDeal bundles (e.g. Wobbledogs) and returns BUNDLE_NOW with 100% bundle score', () => {
    const sampleRss = `<?xml version="1.0" encoding="UTF-8" ?>
      <rss version="2.0"><channel>
        <item>
          <title>Phunkier Physics Bundle by Humble Bundle</title>
          <link>https://isthereanydeal.com/bundles/16704/</link>
          <pubDate>Fri, 23 Oct 2026 20:34:28 +0200</pubDate>
          <description><![CDATA[
            <b>Tier 1</b><br />
            <div style="color:#999999;font-size:11px;">Price: $6.00</div>
            <a href="https://isthereanydeal.com/game/exo-one/info/">EXO ONE</a><br />
            <b>Tier 2</b><br />
            <div style="color:#999999;font-size:11px;">Price: $12.00</div>
            <a href="https://isthereanydeal.com/game/wobbledogs/info/">Wobbledogs</a><br />
            expires on Sat, 14 Nov 2026 06:00:00 +0100
            | <a href=https://www.humblebundle.com/games/phunkier-physics>go to bundle</a>
          ]]></description>
        </item>
      </channel></rss>`;

    const parsed = parseItadBundlesRss(sampleRss, NOV_2026);
    const wobbleEntry = parsed.find((e) => e.gameSlug === 'wobbledogs');
    expect(wobbleEntry).toBeDefined();
    expect(wobbleEntry!.bundle.title).toBe('Phunkier Physics Bundle');
    expect(wobbleEntry!.bundle.store).toBe('Humble Bundle');
    expect(wobbleEntry!.bundle.price).toBe(12);
    expect(wobbleEntry!.bundle.url).toBe('https://www.humblebundle.com/games/phunkier-physics');

    const wobbledogsFacts = baseFacts({
      title: 'Wobbledogs',
      steamAppId: 1424330,
      publishers: ['Secret Mode'],
      liveBundles: [wobbleEntry!.bundle],
      itadBundlesHistory: [
        {
          title: 'Wobbledogs',
          service: 'humble_bundle',
          start: '2024-02-19',
          end: '2024-03-07',
          steamAppId: 1424330,
          source: 'live',
          note: 'IGN Fan Fest Bundle (2024) (Humble Bundle)',
        },
      ],
    });

    const res = evaluate(wobbledogsFacts, {
      now: NOV_2026,
      history: [],
      owned: [],
      playTonight: false,
    });

    expect(res.verdict).toBe('BUNDLE_NOW');
    expect(res.bundleProbability).toBe(1);
    expect(res.headline).toContain('In a bundle right now: Phunkier Physics Bundle on Humble Bundle ($12.00 tier)');
    expect(res.signals[0]?.id).toBe('live_bundle');
    expect(res.links[0]?.url).toBe('https://www.humblebundle.com/games/phunkier-physics');
    expect(res.priorAppearances).toHaveLength(1);
    expect(res.priorAppearances[0]?.note).toContain('IGN Fan Fest Bundle (2024)');
  });

  it('triggers IN_SUBSCRIPTION when a game is in the user active Game Pass or PS Plus Extra subscription', () => {
    const gpFacts = baseFacts({
      title: 'Starfield',
      steamAppId: 1716740,
      publishers: ['Bethesda Softworks'],
      hltbMainHours: 23,
    });

    const withGamePass = evaluate(gpFacts, {
      now: NOV_2026,
      history: SEED_HISTORY,
      owned: [],
      playTonight: false,
      subscriptions: { gamepass: true, psplus: false },
    });
    expect(withGamePass.verdict).toBe('IN_SUBSCRIPTION');
    expect(withGamePass.headline).toContain('Included in your Xbox Game Pass subscription');

    const withoutGamePass = evaluate(gpFacts, {
      now: NOV_2026,
      history: SEED_HISTORY,
      owned: [],
      playTonight: false,
      subscriptions: { gamepass: false, psplus: false },
    });
    expect(withoutGamePass.verdict).not.toBe('IN_SUBSCRIPTION');
  });
});


