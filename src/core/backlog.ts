import type { BacklogInput, BacklogTax, GameFacts } from '../shared/types';
import { GENRE_PLURAL, evaluateGameCompletion, primaryGenre, registerKnownGameHours } from '../data/genres';
import { saleProbability, scaleProbability } from './savings';
import { CURRENCY_SYMBOL_MAP } from './signals';

const WEEKS_PER_MONTH = 4.345;

/**
 * Compares each owned game's playtime against the time usually taken to beat it (HLTB / genre average).
 * Games played for just a few minutes—or under 25% of their estimated completion length—count as unfinished
 * with their remaining hours (`estHours - playedHours`) contributing to the Backlog Tax.
 */
export function computeBacklogTax(
  facts: GameFacts,
  input: BacklogInput,
  pFree90: number,
  pBundle90: number,
  now: number,
): BacklogTax | null {
  registerKnownGameHours(facts.title, facts.hltbMainHours);
  const genre = primaryGenre(facts.genres);
  const current = facts.price.current;
  if (!genre || current == null || current <= 0) return null;

  const evaluated = input.unplayed
    .filter((g) => g.genres?.includes(genre) && (g.steamAppId == null || g.steamAppId !== facts.steamAppId))
    .map((g) => ({
      game: g,
      comp: evaluateGameCompletion(g),
    }))
    .filter((item) => item.comp.isUnfinished);

  if (evaluated.length < 2) return null;

  const unplayedHours = evaluated.reduce((sum, item) => sum + item.comp.remainingHours, 0);
  const avg = unplayedHours / evaluated.length;
  const weeklyHours = Math.max(1, input.weeklyHours);
  const monthsToFinishTwo = Math.max(0.5, (avg * 2) / (weeklyHours * WEEKS_PER_MONTH));

  const targetPrice = Math.max(1, Math.ceil(current * 0.55));
  const low = facts.price.historicalLow;
  const pFree = scaleProbability(pFree90, monthsToFinishTwo);
  const pBundle = scaleProbability(pBundle90, monthsToFinishTwo);
  // Only count a sale if the game has actually been that cheap before.
  const pSale = low != null && low <= targetPrice ? saleProbability(facts, monthsToFinishTwo, now) : 0.05;
  const probability = 1 - (1 - pFree) * (1 - pBundle) * (1 - pSale);

  const sym = CURRENCY_SYMBOL_MAP[(facts.price.currency ?? 'USD').toUpperCase()] ?? '$';
  const targetStr = sym === 'zł' ? `${targetPrice} zł` : `${sym}${targetPrice}`;
  const plural = GENRE_PLURAL[genre] ?? `${genre} games`;
  const timeStr =
    monthsToFinishTwo < 1.5
      ? 'about a month'
      : monthsToFinishTwo > 24
        ? 'over two years'
        : `about ${Math.round(monthsToFinishTwo)} months`;
  const message =
    `You already own ${evaluated.length} unplayed or unfinished ${plural} (~${Math.round(unplayedHours)} hours left to beat). ` +
    `By the time you finish two of them (${timeStr} at ~${Math.round(weeklyHours)} h/week), this game has a ` +
    `${Math.round(probability * 100)}% drop/bundle score for falling under ${targetStr} or entering a bundle.`;

  return {
    genre,
    unplayedCount: evaluated.length,
    unplayedHours: Math.round(unplayedHours),
    monthsToFinishTwo,
    weeklyHours,
    targetPrice,
    probability,
    sampleTitles: evaluated.slice(0, 5).map((item) => item.game.title),
    message,
    partialIndex: input.indexed < input.total,
  };
}
