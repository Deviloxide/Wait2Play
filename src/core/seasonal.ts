import type { SeasonalWindow } from '../shared/types';

const DAY = 86_400_000;

/** UTC date of the n-th weekday (0=Sun) of a month; n = -1 means the last one. */
export function nthWeekday(year: number, month: number, weekday: number, n: number): number {
  if (n > 0) {
    const first = new Date(Date.UTC(year, month, 1));
    const offset = (weekday - first.getUTCDay() + 7) % 7;
    return Date.UTC(year, month, 1 + offset + (n - 1) * 7);
  }
  const last = new Date(Date.UTC(year, month + 1, 0));
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  return Date.UTC(year, month, last.getUTCDate() - offset);
}

/**
 * Recurring windows that matter for buy/wait decisions. Dates are approximations of
 * historical patterns, not announcements — they're flagged `approximate: true`.
 */
export function windowsForYear(y: number): SeasonalWindow[] {
  const thanksgiving = nthWeekday(y, 10, 4, 4);
  const autumnStart = thanksgiving - 2 * DAY;
  const winterStart = nthWeekday(y, 11, 4, 3);
  const summerStart = nthWeekday(y, 5, 4, -1);
  const springStart = nthWeekday(y, 2, 4, 3);
  const holidayStart = Date.UTC(y, 11, 18);
  const megaStart = Date.UTC(y, 4, 15);

  return [
    {
      id: `epic_holiday_${y}`,
      name: 'Epic Holiday Mystery Giveaways',
      kind: 'giveaway',
      start: holidayStart,
      end: Date.UTC(y + 1, 0, 2),
      warnFrom: Date.UTC(y, 10, 1),
      approximate: true,
      advice:
        'Epic usually gives away a mystery game every day from mid-December into early January, often 2-4 year-old AAA games and well-reviewed indies. Hold off on those until January.',
    },
    {
      id: `epic_mega_${y}`,
      name: 'Epic Mega Sale Mystery Games',
      kind: 'giveaway',
      start: megaStart,
      end: Date.UTC(y, 5, 13),
      warnFrom: Date.UTC(y, 3, 15),
      approximate: true,
      advice: "Epic's May-June Mega Sale has historically come with bigger-name weekly mystery giveaways.",
    },
    {
      id: `steam_spring_${y}`,
      name: 'Steam Spring Sale',
      kind: 'sale',
      start: springStart,
      end: springStart + 7 * DAY,
      warnFrom: springStart - 14 * DAY,
      approximate: true,
      advice: 'A seasonal Steam sale is close: most games get close to their all-time low.',
    },
    {
      id: `steam_summer_${y}`,
      name: 'Steam Summer Sale',
      kind: 'sale',
      start: summerStart,
      end: summerStart + 14 * DAY,
      warnFrom: summerStart - 21 * DAY,
      approximate: true,
      advice: 'The biggest Steam sale of the year is close. Avoid paying full price now.',
    },
    {
      id: `steam_autumn_${y}`,
      name: 'Steam Autumn Sale',
      kind: 'sale',
      start: autumnStart,
      end: autumnStart + 7 * DAY,
      warnFrom: autumnStart - 21 * DAY,
      approximate: true,
      advice: 'The Steam Autumn Sale (Thanksgiving week) is close. Most catalog titles get discounted.',
    },
    {
      id: `steam_winter_${y}`,
      name: 'Steam Winter Sale',
      kind: 'sale',
      start: winterStart,
      end: winterStart + 14 * DAY,
      warnFrom: winterStart - 21 * DAY,
      approximate: true,
      advice: 'The Steam Winter Sale runs into early January. Expect lows matching or near all-time lows.',
    },
  ];
}

function allWindowsAround(now: number): SeasonalWindow[] {
  const y = new Date(now).getUTCFullYear();
  return [...windowsForYear(y - 1), ...windowsForYear(y), ...windowsForYear(y + 1)];
}

/** Windows whose warning period or run time includes `now`. */
export function activeWindows(now: number): SeasonalWindow[] {
  return allWindowsAround(now)
    .filter((w) => w.warnFrom <= now && now <= w.end)
    .sort((a, b) => a.start - b.start);
}

/** Windows starting within `days` days that are not yet active. */
export function upcomingWindows(now: number, days = 90): SeasonalWindow[] {
  return allWindowsAround(now)
    .filter((w) => w.warnFrom > now && w.start - now <= days * DAY)
    .sort((a, b) => a.start - b.start);
}

/** Epic's weekly free games rotate Thursdays at 16:00 UTC (11 AM ET). */
export function nextEpicDrop(now: number): number {
  const d = new Date(now);
  let t = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 16);
  const offset = (4 - d.getUTCDay() + 7) % 7;
  t += offset * DAY;
  if (t <= now) t += 7 * DAY;
  return t;
}

/** Humble Choice refreshes on the first Tuesday of each month (~18:00 UTC). */
export function nextHumbleChoice(now: number): number {
  const d = new Date(now);
  const thisMonth = nthWeekday(d.getUTCFullYear(), d.getUTCMonth(), 2, 1) + 18 * 3_600_000;
  if (thisMonth > now) return thisMonth;
  return nthWeekday(d.getUTCFullYear(), d.getUTCMonth() + 1, 2, 1) + 18 * 3_600_000;
}

export function daysUntil(ts: number, now: number): number {
  return Math.max(0, Math.ceil((ts - now) / DAY));
}
