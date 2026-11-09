import { lookupHumblePredictionWatchlist } from '../data/humblePredictions';
import type { GameFacts, HistoryRecord, Signal } from '../shared/types';
import { BUNDLE_SERVICES, GIVEAWAY_SERVICES, SERVICE_LABEL, SUBSCRIPTION_SERVICES, lookupPublisher } from './history';
import { activeWindows } from './seasonal';
import { normalizeTitle } from './titles';

const DAY = 86_400_000;
const MONTH = 30.44 * DAY;
const YEAR = 365.25 * DAY;

export const fmtUsd = (n: number): string => `$${n.toFixed(2)}`;

export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  BRL: 'R$',
  PLN: 'zł',
  JPY: '¥',
};

const APPROX_USD_RATE: Record<string, number> = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  CAD: 0.73,
  AUD: 0.66,
  BRL: 0.18,
  PLN: 0.25,
  JPY: 0.0067,
};

export function toUsdApprox(amount: number, currency = 'USD'): number {
  const rate = APPROX_USD_RATE[currency.toUpperCase()] ?? 1;
  return amount * rate;
}

export function fmtMoney(n: number, currencyOrSymbol?: string): string {
  const code = (currencyOrSymbol ?? 'USD').toUpperCase();
  const sym = CURRENCY_SYMBOL_MAP[code] ?? currencyOrSymbol ?? '$';
  if (code === 'JPY' || sym === '¥') {
    return `¥${Math.round(n).toLocaleString('en-US')}`;
  }
  if (code === 'PLN' || sym === 'zł') {
    return `${n.toFixed(2)} zł`;
  }
  return `${sym}${n.toFixed(2)}`;
}

const fmtMonth = (ts: number): string =>
  new Date(ts).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

export function ageYears(facts: GameFacts, now: number): number | null {
  return facts.releaseDate ? (now - facts.releaseDate) / YEAR : null;
}

function signal(partial: Omit<Signal, 'active'> & { active?: boolean }): Signal {
  return { ...partial, active: partial.active ?? (Math.abs(partial.weight) >= 0.5 || Math.abs(partial.bundleWeight) >= 0.5) };
}

/** Signal 1: "Last Gasp" deep discount — a fresh 80-90% low or a sub-$5 price. */
export function lastGaspSignal(facts: GameFacts, now: number): Signal {
  const base = { id: 'last_gasp', label: '"Last Gasp" deep discount' } as const;
  const { current, retail, historicalLow, historicalLowDate, currency } = facts.price;
  if (current == null || historicalLow == null) {
    return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'No price history available.', active: false });
  }
  const discount = retail && retail > 0 ? 1 - current / retail : 0;
  const lowRatio = retail && retail > 0 ? historicalLow / retail : 1;
  const atLow = current <= historicalLow * 1.03 + 0.01;
  const lowUsd = toUsdApprox(historicalLow, currency);
  const currentUsd = toUsdApprox(current, currency);
  const lowDeep = lowRatio <= 0.2 || (lowUsd < 5 && lowRatio <= 0.5);
  const daysSinceLow = historicalLowDate ? (now - historicalLowDate) / DAY : null;
  const lowRecent = daysSinceLow != null && daysSinceLow >= 0 && daysSinceLow <= 150;
  const pct = (x: number) => `${Math.round(x * 100)}%`;

  if (atLow && (discount >= 0.8 || (currentUsd < 5 && discount >= 0.5))) {
    return signal({
      ...base,
      weight: 1.6,
      bundleWeight: 0.9,
      detail: `At its all-time low right now (${fmtMoney(current, currency)}, −${pct(discount)}). Publishers often squeeze out a final deep sale 1–4 months before a giveaway or subscription deal.`,
    });
  }
  if (lowRecent && lowDeep) {
    return signal({
      ...base,
      weight: 1.3,
      bundleWeight: 0.8,
      detail: `Hit a deep all-time low of ${fmtMoney(historicalLow, currency)} ${Math.round(daysSinceLow!)} days ago (−${pct(1 - lowRatio)}). Fresh deep lows often precede giveaways.`,
    });
  }
  if (lowDeep) {
    return signal({
      ...base,
      weight: 0.4,
      bundleWeight: 0.6,
      detail: `Has been as low as ${fmtMoney(historicalLow, currency)} before (−${pct(1 - lowRatio)}), so it's already in deep-discount territory.`,
    });
  }
  if (discount >= 0.7) {
    return signal({ ...base, weight: 0.5, bundleWeight: 0.4, detail: `Currently −${pct(discount)} off, a deep cut.` });
  }
  return signal({
    ...base,
    weight: 0,
    bundleWeight: 0,
    detail: `All-time low is ${fmtMoney(historicalLow, currency)} (−${pct(1 - lowRatio)}); no last-gasp pattern.`,
    active: false,
  });
}

/** Signal 2: DLC & sequel cycles — upsell giveaways for base games 2+ years old. */
export function dlcSequelSignal(facts: GameFacts, now: number): Signal {
  const base = { id: 'dlc_sequel', label: 'DLC & sequel cycle' } as const;
  const age = ageYears(facts, now);
  const mature = age != null && age >= 2;
  let sequelW = 0;
  let dlcW = 0;
  const parts: string[] = [];

  const s = facts.sequel;
  if (s) {
    const recent = s.releaseDate != null && now - s.releaseDate <= 120 * DAY && now >= s.releaseDate;
    if (s.comingSoon || recent) {
      sequelW = mature ? 1.3 : 0.4;
      parts.push(`${s.name} is ${s.comingSoon ? 'on the way' : 'freshly released'}.`);
    }
  }
  const dlc = facts.upcomingDlc.find(
    (d) => d.comingSoon || (d.releaseDate != null && d.releaseDate - now <= 60 * DAY && now - d.releaseDate <= 30 * DAY),
  );
  if (dlc) {
    dlcW = mature ? 0.9 : 0.3;
    parts.push(`DLC "${dlc.name}" is ${dlc.comingSoon ? 'coming soon' : 'launching around now'}.`);
  }
  if (parts.length === 0) {
    return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'No upcoming sequel or major DLC detected.', active: false });
  }
  if (!mature) parts.push('The base game is under 2 years old, so the upsell effect is weaker.');
  else parts.push('Publishers often give away 2+ year-old base games to sell the new content.');
  const weight = Math.max(sequelW, dlcW) + 0.3 * Math.min(sequelW, dlcW);
  return signal({ ...base, weight, bundleWeight: sequelW > 0 ? 0.5 : 0.2, detail: parts.join(' ') });
}

/** Signal 3: publisher habits. */
export function publisherSignal(facts: GameFacts): Signal {
  const base = { id: 'publisher', label: 'Publisher habits' } as const;
  const p = lookupPublisher([...facts.publishers, ...facts.developers]);
  if (!p) {
    const who = facts.publishers[0] ?? facts.developers[0];
    return signal({
      ...base,
      weight: 0,
      bundleWeight: 0,
      detail: who ? `No known giveaway pattern for ${who}.` : 'Publisher unknown.',
      active: false,
    });
  }
  return signal({
    ...base,
    weight: (p.giveaway - 0.35) * 3.2,
    bundleWeight: (p.bundle - 0.35) * 2.5,
    detail: `${p.display}: ${p.note}`,
  });
}

/** Signal 4: cross-platform echoes — Game Pass / PS Plus Extra appearances. */
export function crossPlatformSignal(matched: HistoryRecord[], now: number): Signal {
  const base = { id: 'cross_platform', label: 'Cross-platform echo' } as const;
  const subs = matched.filter((r) => SUBSCRIPTION_SERVICES.includes(r.service) && Date.parse(r.start) <= now);
  if (subs.length === 0) {
    return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'No Game Pass / PS Plus Extra history on record.', active: false });
  }
  const latest = subs.reduce((a, b) => (Date.parse(b.start) > Date.parse(a.start) ? b : a));
  const months = (now - Date.parse(latest.start)) / MONTH;
  const weight = months <= 6 ? 0.7 : months <= 12 ? 1.1 : months <= 24 ? 0.5 : 0.2;
  const window = months > 6 && months <= 12 ? ' That puts it in the 6–12 month window where Humble Choice / Epic pickups spike.' : '';
  return signal({
    ...base,
    weight,
    bundleWeight: 0.3,
    detail: `Joined ${SERVICE_LABEL[latest.service]} in ${fmtMonth(Date.parse(latest.start))} (${Math.round(months)} months ago).${window}`,
  });
}

/** Signal 5: seasonal giveaway windows (Epic holiday / Mega Sale — PC only). */
export function seasonalSignal(facts: GameFacts, now: number): Signal {
  const base = { id: 'seasonal', label: 'Seasonal giveaway window' } as const;
  if (facts.platform === 'console') {
    return signal({
      ...base,
      weight: 0,
      bundleWeight: 0,
      detail: `Viewing ${facts.platformLabel ?? 'console'} edition — PC-only Epic Games Store giveaway seasons are muted.`,
      active: false,
    });
  }
  const windows = activeWindows(now).filter((w) => w.kind === 'giveaway');
  if (windows.length === 0) {
    return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'No Epic giveaway season is near.', active: false });
  }
  const w = windows[0]!;
  const age = ageYears(facts, now) ?? 0;
  const rawRetail = facts.price.retail ?? facts.price.current ?? 0;
  const retail = toUsdApprox(rawRetail, facts.price.currency);
  const midTierIndie = retail > 0 && retail <= 30 && age >= 1;
  const olderAaa = retail >= 40 && age >= 3;
  const inWindow = now >= w.start;
  const starts = inWindow ? 'is running now' : `starts around ${new Date(w.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
  if (!midTierIndie && !olderAaa) {
    return signal({
      ...base,
      weight: 0.15,
      bundleWeight: 0,
      detail: `${w.name} ${starts}, but this game doesn't fit the usual tier (mid-tier indie or 3+ year-old AAA).`,
      active: false,
    });
  }
  const weight = (w.id.startsWith('epic_holiday') ? 0.8 : 0.6) + (inWindow ? 0.2 : 0);
  return signal({
    ...base,
    weight,
    bundleWeight: 0,
    detail: `${w.name} ${starts}. ${olderAaa ? '3+ year-old AAA titles' : 'Mid-tier indies'} are the typical picks.`,
  });
}

/** Track record: prior giveaways prove willingness; prior bundles predict more bundles. */
export function trackRecordSignal(matched: HistoryRecord[], now: number): Signal {
  const base = { id: 'track_record', label: 'Giveaway & bundle track record' } as const;
  const past = matched.filter((r) => Date.parse(r.start) <= now);
  const gives = past.filter((r) => GIVEAWAY_SERVICES.includes(r.service));
  const bundles = past.filter((r) => BUNDLE_SERVICES.includes(r.service));
  if (gives.length === 0 && bundles.length === 0) {
    return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'Never given away or bundled (as far as our data knows).', active: false });
  }
  const parts: string[] = [];
  if (gives.length) {
    const g = gives[0]!;
    parts.push(`Already given away on ${SERVICE_LABEL[g.service]} (${fmtMonth(Date.parse(g.start))}). You might already own it there.`);
  }
  if (bundles.length) parts.push(`Bundled ${bundles.length}× before (latest: ${SERVICE_LABEL[bundles[0]!.service]}).`);
  return signal({
    ...base,
    weight: Math.min(0.5, gives.length * 0.25),
    bundleWeight: Math.min(1.2, bundles.length * 0.6),
    detail: parts.join(' '),
  });
}

/**
 * Signal 5: Humble Choice & community bundle predictor — combines r/humblebundles
 * Prediction League consensus, live subreddit mentions, publisher bundle cadence,
 * and the Game Pass -> Humble Choice sweet-spot pipeline.
 */
export function humbleBundlePredictionSignal(
  facts: GameFacts,
  matched: HistoryRecord[],
  allHistory: HistoryRecord[],
  now: number,
): Signal {
  const base = { id: 'humble_prediction', label: 'Humble Choice & bundle predictor' } as const;
  if (facts.platform === 'console') {
    return signal({
      ...base,
      weight: 0,
      bundleWeight: 0,
      detail: 'PC Humble Choice & Fanatical bundle predictions are muted on console pages.',
      active: false,
    });
  }

  const past = matched.filter((r) => Date.parse(r.start) <= now);
  const pastChoice = past.find((r) => r.service === 'humble_choice');

  let bundleW = 0;
  let freeW = 0;
  const parts: string[] = [];

  if (pastChoice) {
    bundleW += 0.25;
    parts.push(
      `Previously featured in Humble Choice (${fmtMonth(Date.parse(pastChoice.start))}); past Choice games frequently return in Humble Encore or publisher bundles.`,
    );
  }

  // 1. Curated r/humblebundles Prediction League watchlist
  const watchlistHit = lookupHumblePredictionWatchlist(facts.title, facts.steamAppId);
  if (watchlistHit) {
    bundleW += watchlistHit.tier === 'headliner' ? 0.85 : 0.65;
    freeW += 0.2;
    parts.push(watchlistHit.reason);
  }

  // 2. Live r/humblebundles subreddit prediction/leak thread mentions
  const redditCount = facts.humbleCommunityMentions?.count ?? 0;
  if (redditCount > 0) {
    bundleW += Math.min(0.75, 0.35 + redditCount * 0.15);
    const postNote = facts.humbleCommunityMentions?.latestPostTitle
      ? ` (latest: "${facts.humbleCommunityMentions.latestPostTitle}")`
      : '';
    parts.push(
      `Mentioned in ${redditCount} recent r/humblebundles prediction/bundle thread${redditCount > 1 ? 's' : ''}${postNote}.`,
    );
  }

  // 3. Publisher's historical Humble / Fanatical bundle count in our dataset
  const pubNamesNorm = [...facts.publishers, ...facts.developers]
    .map((n) => normalizeTitle(n))
    .filter((n) => n.length >= 3);
  if (pubNamesNorm.length > 0 && allHistory.length > 0) {
    const pubBundleRecords = allHistory.filter((r) => {
      if (!BUNDLE_SERVICES.includes(r.service) || !r.publisher) return false;
      const rn = normalizeTitle(r.publisher);
      return pubNamesNorm.some((pn) => rn.includes(pn) || pn.includes(rn));
    });
    if (pubBundleRecords.length >= 3) {
      bundleW += Math.min(0.45, pubBundleRecords.length * 0.05);
      parts.push(
        `${facts.publishers[0] ?? facts.developers[0]} has ${pubBundleRecords.length} past Humble/Fanatical bundle appearances in our archive.`,
      );
    }
  }

  // 4. Game Pass / PS Plus Extra -> Humble Choice 5–18 month pipeline
  const subRecord = past.find((r) => SUBSCRIPTION_SERVICES.includes(r.service));
  if (subRecord) {
    const monthsSinceSub = (now - Date.parse(subRecord.start)) / MONTH;
    if (monthsSinceSub >= 5 && monthsSinceSub <= 18) {
      bundleW += 0.45;
      parts.push(
        `Entered ${SERVICE_LABEL[subRecord.service]} ${Math.round(monthsSinceSub)} months ago — the prime r/humblebundles window for a Humble Choice pickup.`,
      );
    }
  }

  // 5. AA / Indie Humble Choice discount & age sweet spot (1–4.5 yrs old, $15–$60 retail, 45–80% max cut)
  const age = ageYears(facts, now);
  const { retail, historicalLow, currency } = facts.price;
  const retailUsd = retail != null ? toUsdApprox(retail, currency) : null;
  const maxDiscount = retail && retail > 0 && historicalLow != null ? 1 - historicalLow / retail : null;
  const pubProfile = lookupPublisher([...facts.publishers, ...facts.developers]);
  if (
    age != null &&
    age >= 1.0 &&
    age <= 4.5 &&
    retailUsd != null &&
    retailUsd >= 15 &&
    retailUsd <= 60 &&
    maxDiscount != null &&
    maxDiscount >= 0.45 &&
    maxDiscount <= 0.82 &&
    (!pubProfile || !pubProfile.veto)
  ) {
    bundleW += 0.35;
    if (parts.length === 0) {
      parts.push(
        `Fits the classic Humble Choice sweet spot (${age.toFixed(1)} yrs old, −${Math.round(maxDiscount * 100)}% max discount ceiling).`,
      );
    }
  }

  if (parts.length === 0) {
    return signal({
      ...base,
      weight: 0,
      bundleWeight: 0,
      detail: 'No strong r/humblebundles prediction match or Humble Choice sweet-spot pattern.',
      active: false,
    });
  }

  return signal({
    ...base,
    weight: Math.min(0.45, freeW),
    bundleWeight: Math.min(1.45, bundleW),
    detail: parts.join(' '),
  });
}

export function ageSignal(facts: GameFacts, now: number): Signal {
  const base = { id: 'age', label: 'Game age' } as const;
  const age = ageYears(facts, now);
  if (age == null) return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'Release date unknown.', active: false });
  const yrs = age < 1 ? `${Math.max(0, Math.round(age * 12))} months` : `${age.toFixed(1)} years`;
  if (age < 0.5) return signal({ ...base, weight: -1.8, bundleWeight: -1.4, detail: `Only ${yrs} old. New releases almost never go free.` });
  if (age < 1) return signal({ ...base, weight: -1.2, bundleWeight: -1.0, detail: `${yrs} old. Still early in its sales life.` });
  if (age < 2) return signal({ ...base, weight: -0.5, bundleWeight: -0.3, detail: `${yrs} old. Giveaways become common after year two.` });
  if (age < 5) return signal({ ...base, weight: 0.2, bundleWeight: 0.4, detail: `${yrs} old. Prime age for giveaways and bundles.`, active: false });
  return signal({ ...base, weight: 0.4, bundleWeight: 0.6, detail: `${yrs} old. Catalog title.` });
}

export function priceTierSignal(facts: GameFacts, now: number): Signal {
  const base = { id: 'price_tier', label: 'Price tier' } as const;
  const { retail, currency } = facts.price;
  const age = ageYears(facts, now) ?? 0;
  if (retail == null) return signal({ ...base, weight: 0, bundleWeight: 0, detail: 'Price unknown.', active: false });
  const retailUsd = toUsdApprox(retail, currency);
  if (retailUsd >= 50 && age < 2) {
    return signal({ ...base, weight: -0.6, bundleWeight: -0.4, detail: `Full-price AAA (${fmtMoney(retail, currency)}) that's still recent.` });
  }
  if (retailUsd <= 20) {
    return signal({ ...base, weight: 0.1, bundleWeight: 0.3, detail: `Budget/indie tier (${fmtMoney(retail, currency)}), the usual bundle fodder.`, active: false });
  }
  return signal({ ...base, weight: 0, bundleWeight: 0, detail: `Retail ${fmtMoney(retail, currency)}.`, active: false });
}

export function computeSignals(
  facts: GameFacts,
  matched: HistoryRecord[],
  now: number,
  allHistory: HistoryRecord[] = matched,
): Signal[] {
  const list = [
    lastGaspSignal(facts, now),
    dlcSequelSignal(facts, now),
    publisherSignal(facts),
    crossPlatformSignal(matched, now),
    humbleBundlePredictionSignal(facts, matched, allHistory, now),
    seasonalSignal(facts, now),
    trackRecordSignal(matched, now),
    ageSignal(facts, now),
    priceTierSignal(facts, now),
  ];
  if (facts.platform === 'console') {
    return list.map((s) => ({ ...s, bundleWeight: 0 }));
  }
  return list;
}
