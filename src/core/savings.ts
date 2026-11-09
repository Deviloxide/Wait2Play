import type { GameFacts, SavingsEstimate } from '../shared/types';
import { ageYears } from './signals';

/** Scale a 90-day probability to another horizon assuming a constant hazard. */
export function scaleProbability(p90: number, months: number): number {
  const k = months / 3;
  return 1 - Math.pow(1 - Math.min(Math.max(p90, 0), 0.999), k);
}

/** Probability the game returns to (near) its all-time low within `months`. */
export function saleProbability(facts: GameFacts, months: number, now: number): number {
  const age = ageYears(facts, now) ?? 2;
  // Four big Steam sales a year: most discounted catalog titles revisit their low.
  const base = 1 - Math.exp(-months / 3);
  const ageFactor = age < 1 ? 0.6 : age < 2 ? 0.8 : 0.9;
  return Math.min(0.92, base * ageFactor);
}

/** Typical effective cost per game when acquired via a bundle or Humble Choice. */
export const BUNDLE_EFFECTIVE_PRICE = 3;

/**
 * Expected price if you wait `horizonMonths` instead of buying now:
 * E = P(free)·0 + P(¬free)·[P(bundle)·~$3 + P(¬bundle)·(P(sale)·low + P(¬sale)·current)].
 */
export function estimateSavings(
  facts: GameFacts,
  pFree90: number,
  pBundle90: number,
  now: number,
  horizonMonths = 6,
): SavingsEstimate | null {
  const current = facts.price.current;
  if (current == null || current <= 0) return null;
  const pFree = scaleProbability(pFree90, horizonMonths);
  const pBundle = scaleProbability(pBundle90, horizonMonths);
  const low = facts.price.historicalLow;
  const saleTarget = low != null && low < current * 0.9 ? Math.round(low * 1.05 * 100) / 100 : null;
  const pSale = saleTarget != null ? saleProbability(facts, horizonMonths, now) : 0;
  const bundlePrice = Math.min(current, BUNDLE_EFFECTIVE_PRICE);
  const paid = saleTarget != null ? pSale * saleTarget + (1 - pSale) * current : current;
  const expectedPrice = (1 - pFree) * (pBundle * bundlePrice + (1 - pBundle) * paid);
  return {
    horizonMonths,
    currentPrice: current,
    expectedPrice: Math.round(expectedPrice * 100) / 100,
    expectedSavings: Math.max(0, Math.round((current - expectedPrice) * 100) / 100),
    pFree,
    pBundle,
    pSale,
    saleTarget,
  };
}
