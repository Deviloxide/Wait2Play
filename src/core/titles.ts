/** Title normalization and fuzzy matching shared by search, duplicate guard and history matching. */

const ROMAN: Record<string, string> = {
  ii: '2',
  iii: '3',
  iv: '4',
  v: '5',
  vi: '6',
  vii: '7',
  viii: '8',
  ix: '9',
  x: '10',
};

/** Lowercase, strip marks/punctuation, unify roman numerals: "Hades™ II" -> "hades 2". */
export function normalizeTitle(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((w) => ROMAN[w] ?? w)
    .join(' ');
}

const EDITION_WORDS =
  '(game of the year|goty|definitive|complete|deluxe|digital deluxe|ultimate|gold|standard|special|enhanced|anniversary|premium|collectors|legendary|celebration|royal|platinum|founders|launch)';

/**
 * Looser key that ignores edition suffixes and a leading "the", so
 * "The Witcher 3: Wild Hunt - Game of the Year Edition" ~ "Witcher 3 Wild Hunt".
 */
export function looseKey(raw: string): string {
  let s = normalizeTitle(raw);
  s = s.replace(/^the /, '');
  s = s.replace(new RegExp(`\\s${EDITION_WORDS}( edition)?$`), '');
  s = s.replace(/\s(directors cut|final cut)$/, '');
  s = s.replace(/(\s[a-z0-9]+){0,2}\sedition$/, '');
  s = s.replace(/\s(pc|windows|steam)$/, '');
  return s.trim() || normalizeTitle(raw);
}

export function titlesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return true;
  return looseKey(a) === looseKey(b);
}

function bigrams(s: string): Map<string, number> {
  const m = new Map<string, number>();
  const t = s.replace(/\s+/g, ' ');
  for (let i = 0; i < t.length - 1; i++) {
    const g = t.slice(i, i + 2);
    m.set(g, (m.get(g) ?? 0) + 1);
  }
  return m;
}

/** Sørensen–Dice similarity on character bigrams of normalized titles (0..1). */
export function similarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return 1;
  if (na.length < 2 || nb.length < 2) return 0;
  const A = bigrams(na);
  const B = bigrams(nb);
  let inter = 0;
  let total = 0;
  for (const [g, c] of A) {
    inter += Math.min(c, B.get(g) ?? 0);
    total += c;
  }
  for (const c of B.values()) total += c;
  return (2 * inter) / total;
}

export function bestMatch<T>(query: string, items: T[], getTitle: (t: T) => string, minScore = 0.72): T | null {
  let best: T | null = null;
  let bestScore = 0;
  for (const it of items) {
    const t = getTitle(it);
    const score = titlesMatch(query, t) ? 1 : similarity(query, t);
    if (score > bestScore) {
      best = it;
      bestScore = score;
    }
  }
  return bestScore >= minScore ? best : null;
}

/** "Borderlands 2" -> "borderlands", "Hades" -> "hades", "Dishonored: Death of the Outsider" -> "dishonored". */
export function sequelBase(raw: string): string {
  const head = raw.split(/:|\s[-–—]\s/)[0] ?? raw;
  const tokens = normalizeTitle(head).split(' ');
  while (tokens.length > 1 && /^\d+$/.test(tokens[tokens.length - 1]!)) tokens.pop();
  return tokens.join(' ');
}

const NON_GAME_RE =
  /\b(soundtrack|ost|dlc|pack|season pass|expansion|demo|playtest|bundle|artbook|art book|upgrade|costume|skin|cosmetic|wallpaper|dedicated server|sdk|editor|prologue|beta)\b/i;

/** True if `candidate` looks like a numbered/subtitled follow-up to `baseNormalized`. */
export function looksLikeSequel(candidate: string, baseNormalized: string, originalTitle: string): boolean {
  if (NON_GAME_RE.test(candidate)) return false;
  const nc = normalizeTitle(candidate);
  if (nc === normalizeTitle(originalTitle)) return false;
  if (!nc.startsWith(baseNormalized + ' ')) return false;
  const rest = nc.slice(baseNormalized.length + 1);
  const firstToken = rest.split(' ')[0] ?? '';
  const origNumber = Number(normalizeTitle(originalTitle).split(' ').find((t) => /^\d+$/.test(t)) ?? 1);
  if (/^\d+$/.test(firstToken)) return Number(firstToken) > origNumber && Number(firstToken) < 30;
  // Subtitled follow-up ("Hollow Knight: Silksong") — only when the original had no subtitle.
  return /:/.test(candidate) && !/:/.test(originalTitle);
}

export function gameKey(steamAppId: number | null | undefined, title: string): string {
  return steamAppId ? `steam:${steamAppId}` : `t:${looseKey(title)}`;
}
