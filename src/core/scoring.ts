import type {
  ActiveBundleInfo,
  BacklogInput,
  GameFacts,
  HistoryRecord,
  Link,
  OwnedEntry,
  Signal,
  Verdict,
  VerdictResult,
} from '../shared/types';
import { computeBacklogTax } from './backlog';
import { BUNDLE_SERVICES, SERVICE_LABEL, dedupeHistory, liveGiveaway, matchHistory } from './history';
import { estimateSavings } from './savings';
import { activeWindows, daysUntil } from './seasonal';
import { computeSignals, fmtMoney, toUsdApprox } from './signals';
import { gameKey } from './titles';

/** Baseline log-odds: ~4.7% of games go free/subscription in a random 90-day window. */
export const BASE_FREE_LOGIT = -3.0;
/** Baseline log-odds: ~10% chance of entering a bundle in a random 90-day window. */
export const BASE_BUNDLE_LOGIT = -2.2;

const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const clamp = (x: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, x));

export function combineSignals(signals: Signal[], isConsole = false): { freebie: number; bundle: number } {
  const f = signals.reduce((s, x) => s + x.weight, BASE_FREE_LOGIT);
  const b = signals.reduce((s, x) => s + x.bundleWeight, BASE_BUNDLE_LOGIT);
  return {
    freebie: clamp(sigmoid(f), 0.01, 0.92),
    bundle: isConsole ? 0 : clamp(sigmoid(b), 0.01, 0.9),
  };
}

export interface EvalContext {
  now: number;
  history: HistoryRecord[];
  /** Owned entries already matched to this game. */
  owned: OwnedEntry[];
  playTonight: boolean;
  backlog?: BacklogInput | null;
  thresholds?: { giveaway: number; bundle: number };
  subscriptions?: { gamepass: boolean; psplus: boolean };
}

const SOURCE_LABEL: Record<OwnedEntry['source'], string> = {
  steam: 'Steam',
  epic: 'Epic',
  gog: 'GOG',
  amazon: 'Amazon Prime Gaming',
  ea: 'the EA app',
  ubisoft: 'Ubisoft Connect',
  other: 'another launcher',
};

function yearOf(date: string | undefined): string | null {
  if (!date) return null;
  const m = date.match(/\b(19|20)\d{2}\b/);
  if (m) return m[0];
  const t = Date.parse(date);
  return Number.isNaN(t) ? null : String(new Date(t).getUTCFullYear());
}

const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function buildLinks(facts: GameFacts): Link[] {
  const q = encodeURIComponent(facts.title);
  const links: Link[] = [];
  if (facts.platform !== 'console' && facts.liveBundles && facts.liveBundles.length > 0) {
    const b0 = facts.liveBundles[0]!;
    links.push({ label: `${b0.store}: ${b0.title}`, url: b0.url });
  }
  if (facts.price.dealUrl) links.push({ label: 'Best deal (CheapShark)', url: facts.price.dealUrl });
  links.push({ label: 'IsThereAnyDeal', url: `https://isthereanydeal.com/search/?q=${q}` });
  links.push({ label: 'GG.deals', url: `https://gg.deals/search/?title=${q}` });
  if (facts.steamAppId && facts.platform !== 'console') {
    links.push({ label: 'Steam', url: `https://store.steampowered.com/app/${facts.steamAppId}/` });
  }
  links.push({ label: 'HowLongToBeat', url: `https://howlongtobeat.com/?q=${q}` });
  return links;
}

function getActiveBundles(facts: GameFacts, matched: HistoryRecord[], now: number): ActiveBundleInfo[] {
  if (facts.platform === 'console') return [];
  const out: ActiveBundleInfo[] = [];
  for (const b of facts.liveBundles ?? []) {
    const expMs = b.expiry ? Date.parse(b.expiry) : NaN;
    if (Number.isNaN(expMs) || expMs > now) {
      out.push(b);
    }
  }
  if (out.length === 0) {
    for (const r of matched) {
      if (!BUNDLE_SERVICES.includes(r.service)) continue;
      const start = Date.parse(r.start);
      const end = r.end ? Date.parse(r.end) : NaN;
      if (start <= now && !Number.isNaN(end) && now < end) {
        out.push({
          title: r.note ?? SERVICE_LABEL[r.service],
          store: SERVICE_LABEL[r.service],
          price: null,
          url: r.url ?? `https://isthereanydeal.com/search/?q=${encodeURIComponent(facts.title)}`,
          expiry: r.end ?? null,
        });
      }
    }
  }
  return out;
}

function findActiveUserSubscription(
  matched: HistoryRecord[],
  subs: { gamepass: boolean; psplus: boolean } | undefined,
  now: number,
): HistoryRecord | null {
  if (!subs || (!subs.gamepass && !subs.psplus)) return null;
  for (const r of matched) {
    if (r.service === 'gamepass' && !subs.gamepass) continue;
    if (r.service === 'psplus_extra' && !subs.psplus) continue;
    if (r.service !== 'gamepass' && r.service !== 'psplus_extra') continue;
    const end = r.end ? Date.parse(r.end) : NaN;
    if (!Number.isNaN(end) && end <= now) continue;
    return r;
  }
  return null;
}

export function evaluate(facts: GameFacts, ctx: EvalContext): VerdictResult {
  const { now } = ctx;
  const isConsole = facts.platform === 'console';
  const thresholds = ctx.thresholds ?? { giveaway: 0.35, bundle: 0.4 };
  const combinedHistory =
    facts.itadBundlesHistory && facts.itadBundlesHistory.length > 0
      ? dedupeHistory([...ctx.history, ...facts.itadBundlesHistory])
      : ctx.history;
  const matched = matchHistory(combinedHistory, facts);
  const live = isConsole ? null : liveGiveaway(matched, now);
  const activeBundles = getActiveBundles(facts, matched, now);
  const activeSub = findActiveUserSubscription(matched, ctx.subscriptions, now);
  const signals = computeSignals(facts, matched, now, combinedHistory);
  let { freebie, bundle } = combineSignals(signals, isConsole);

  const { current, historicalLow, currency } = facts.price;
  const fmt = (n: number) => fmtMoney(n, currency);

  if (live) {
    const label = SERVICE_LABEL[live.record.service];
    signals.unshift({
      id: 'live_epic',
      label: `Live ${label} giveaway`,
      weight: 0,
      bundleWeight: 0,
      active: true,
      detail:
        live.status === 'current'
          ? `Free on ${label} right now${live.record.end ? ` until ${fmtDate(live.record.end)}` : ''}.`
          : `Announced as free on ${label} starting ${fmtDate(live.record.start)}.`,
    });
    freebie = live.status === 'current' ? 1 : 0.99;
  }

  if (activeBundles.length > 0) {
    const b0 = activeBundles[0]!;
    const priceStr = b0.price != null ? ` (${fmtMoney(b0.price, b0.currency ?? currency)} tier)` : '';
    const expStr = b0.expiry ? ` until ${fmtDate(b0.expiry)}` : '';
    signals.unshift({
      id: 'live_bundle',
      label: `Active ${b0.store} bundle`,
      weight: 0,
      bundleWeight: 2.5,
      active: true,
      detail: `In "${b0.title}" on ${b0.store} right now${priceStr}${expStr}.`,
    });
    bundle = 1;
  }

  const savings = facts.isFree ? null : estimateSavings(facts, freebie, bundle, now);
  const backlog = ctx.backlog && !facts.isFree ? computeBacklogTax(facts, ctx.backlog, freebie, bundle, now) : null;
  const seasonal = isConsole ? [] : activeWindows(now);
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  const nearLow = current != null && historicalLow != null && current <= historicalLow * 1.1 + 0.5;
  const upcomingSale = seasonal.find((w) => w.kind === 'sale' && now < w.end);

  let verdict: Verdict;
  let headline: string;
  if (facts.isFree) {
    verdict = 'FREE_TO_PLAY';
    headline = 'Free to play. Nothing to wait for.';
  } else if (live?.status === 'current') {
    verdict = 'FREE_NOW';
    headline = `Free right now on ${SERVICE_LABEL[live.record.service]}! Claim it instead of buying.`;
  } else if (live?.status === 'upcoming') {
    verdict = 'FREE_SOON';
    headline = `Don't buy! It goes free on ${SERVICE_LABEL[live.record.service]} on ${fmtDate(live.record.start)}.`;
  } else if (ctx.owned.length > 0) {
    verdict = 'OWNED';
    const o = ctx.owned[0]!;
    const yr = yearOf(o.date);
    headline = `Stop! You ${o.source === 'steam' ? 'already own this on' : 'claimed this on'} ${SOURCE_LABEL[o.source]}${yr ? ` in ${yr}` : ''}.`;
  } else if (activeSub) {
    verdict = 'IN_SUBSCRIPTION';
    const svcName = SERVICE_LABEL[activeSub.service];
    headline = `Included in your ${svcName} subscription! Play it via ${svcName} instead of buying.`;
  } else if (activeBundles.length > 0) {
    verdict = 'BUNDLE_NOW';
    const b0 = activeBundles[0]!;
    const priceStr = b0.price != null ? ` (${fmtMoney(b0.price, b0.currency ?? currency)} tier)` : '';
    const expStr = b0.expiry ? ` until ${fmtDate(b0.expiry)}` : '';
    headline = `In a bundle right now: ${b0.title} on ${b0.store}${priceStr}${expStr}. Get the bundle instead of buying solo!`;
  } else if (facts.comingSoon) {
    verdict = 'UNRELEASED';
    headline = 'Not released yet. Launch-window discounts usually beat pre-orders.';
  } else if (freebie >= thresholds.giveaway) {
    verdict = 'HIGH_GIVEAWAY_RISK';
    headline = `High giveaway risk (${pct(freebie)} risk score): strong signals suggest it could go free or join a subscription in the next 90 days.`;
  } else if (!isConsole && bundle >= thresholds.bundle) {
    verdict = 'HOLD_FOR_BUNDLE';
    headline = `Hold for a bundle (${pct(bundle)} bundle score): strong signals suggest it could land in Humble Choice or a bundle within 90 days.`;
  } else if (current == null) {
    verdict = 'WAIT_FOR_SALE';
    headline = 'No reliable price data on this page. Compare store prices before buying.';
  } else if (nearLow) {
    verdict = 'BUY_NOW';
    headline = `Good time to buy: ${fmt(current)} is at or near the all-time low of ${fmt(historicalLow!)}, and giveaway risk is low.`;
  } else {
    verdict = 'WAIT_FOR_SALE';
    const lowStr = historicalLow != null ? ` It has been ${fmt(historicalLow)} before.` : '';
    const saleStr = upcomingSale
      ? now >= upcomingSale.start
        ? ` ${upcomingSale.name} is on now, so check whether it's discounted.`
        : ` ${upcomingSale.name} starts in ~${daysUntil(upcomingSale.start, now)} days.`
      : '';
    headline = `Wait for a sale: ${fmt(current)} now.${lowStr}${saleStr}`;
  }

  // "Will I play it tonight?" — waiting is only worth it if the expected savings are real.
  let playTonightNote: string | null = null;
  if (
    savings &&
    ![
      'FREE_NOW',
      'FREE_SOON',
      'FREE_TO_PLAY',
      'OWNED',
      'IN_SUBSCRIPTION',
      'UNRELEASED',
      'BUNDLE_NOW',
    ].includes(verdict)
  ) {
    const s = fmt(savings.expectedSavings);
    if (!ctx.playTonight) {
      playTonightNote = `Not playing tonight? Waiting ${savings.horizonMonths} months saves you an expected ${s} (expected price ${fmt(savings.expectedPrice)}).`;
    } else {
      const savingsUsd = toUsdApprox(savings.expectedSavings, currency);
      const currentUsd = toUsdApprox(savings.currentPrice, currency);
      const minor = savingsUsd < Math.max(3, currentUsd * 0.25);
      if (minor && freebie < thresholds.giveaway) {
        verdict = 'BUY_NOW';
        headline = `Go for it: you'll play it tonight, and waiting only saves an expected ${s}.`;
        playTonightNote = `Playing right away is worth more than the ~${s} you'd expect to save by waiting.`;
      } else {
        playTonightNote = `Buying tonight costs you an expected ${s} versus waiting ${savings.horizonMonths} months. Your call.`;
      }
    }
  }

  return {
    key: gameKey(facts.steamAppId, facts.title),
    facts,
    verdict,
    headline,
    freebieProbability: freebie,
    bundleProbability: bundle,
    signals,
    savings,
    playTonight: ctx.playTonight,
    playTonightNote,
    owned: ctx.owned,
    priorAppearances: matched.filter((r) => Date.parse(r.start) <= now),
    liveFreebie: live,
    seasonal,
    backlog,
    links: buildLinks(facts),
    computedAt: now,
  };
}
