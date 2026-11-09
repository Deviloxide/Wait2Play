import { normalizeTitle } from '../core/titles';

/**
 * Rough "main story" hours by Steam genre, used by the Backlog Tax calculator when
 * a game isn't in KNOWN_GAME_HOURS.
 */
export const GENRE_HOURS: Record<string, number> = {
  RPG: 40,
  Strategy: 30,
  Simulation: 25,
  'Massively Multiplayer': 40,
  Adventure: 12,
  Action: 12,
  Racing: 12,
  Sports: 15,
  Casual: 6,
  Indie: 10,
};

export const DEFAULT_GAME_HOURS = 12;

/**
 * Curated HowLongToBeat (Main Story / Main + Sides) completion hours for popular PC games
 * so completion-based backlog detection knows the true length of major titles.
 */
const RAW_KNOWN_GAME_HOURS: Record<string, number> = {
  'Baldur\'s Gate 3': 75,
  'The Witcher 3: Wild Hunt': 51,
  'Elden Ring': 60,
  'Persona 5 Royal': 101,
  'Persona 4 Golden': 68,
  'Persona 3 Reload': 70,
  'Metaphor: ReFantazio': 65,
  'Cyberpunk 2077': 26,
  'Red Dead Redemption 2': 50,
  'The Elder Scrolls V: Skyrim': 34,
  'The Elder Scrolls IV: Oblivion': 30,
  'Fallout 4': 27,
  'Fallout: New Vegas': 28,
  'Starfield': 33,
  'Divinity: Original Sin 2': 60,
  'Pathfinder: Wrath of the Righteous': 75,
  'Warhammer 40,000: Rogue Trader': 65,
  'Pillars of Eternity II: Deadfire': 42,
  'Dragon Age: Origins': 40,
  'Dragon Age: Inquisition': 47,
  'Mass Effect Legendary Edition': 85,
  'Kingdom Come: Deliverance': 41,
  'Monster Hunter: World': 47,
  'Monster Hunter Rise': 22,
  'Dragon\'s Dogma 2': 38,
  'Yakuza: Like a Dragon': 45,
  'Like a Dragon: Infinite Wealth': 57,
  'Yakuza 0': 31,
  'Final Fantasy VII Remake Intergrade': 33,
  'Final Fantasy XV': 28,
  'Final Fantasy XVI': 38,
  'Octopath Traveler II': 60,
  'Dragon Quest XI S: Echoes of an Elusive Age': 58,
  'Tales of Arise': 41,
  'NieR:Automata': 21,
  'Dark Souls III': 32,
  'Dark Souls Remastered': 29,
  'Sekiro: Shadows Die Twice': 30,
  'Lies of P': 29,
  'Lords of the Fallen': 30,
  'Remnant II': 20,
  'Nioh 2': 44,
  'Horizon Zero Dawn': 30,
  'Horizon Forbidden West': 29,
  'God of War': 21,
  'God of War Ragnarök': 26,
  'Ghost of Tsushima': 25,
  'Marvel\'s Spider-Man Remastered': 17,
  'Days Gone': 36,
  'Death Stranding': 40,
  'Star Wars Jedi: Fallen Order': 17,
  'Star Wars Jedi: Survivor': 20,
  'Hogwarts Legacy': 26,
  'Assassin\'s Creed Valhalla': 61,
  'Assassin\'s Creed Odyssey': 45,
  'Assassin\'s Creed Origins': 30,
  'Far Cry 6': 23,
  'Far Cry 5': 18,
  'Dying Light 2 Stay Human': 24,
  'Dying Light': 18,
  'Dead Island 2': 16,
  'Metro Exodus': 16,
  'Control': 12,
  'Alan Wake 2': 18,
  'Resident Evil 4': 16,
  'Resident Evil Village': 10,
  'Resident Evil 2': 9,
  'Silent Hill 2': 16,
  'DOOM Eternal': 14,
  'DOOM': 11,
  'Prey': 16,
  'Dishonored 2': 12,
  'BioShock Infinite': 12,
  'Grand Theft Auto V': 32,
  'Subnautica': 30,
  'No Man\'s Sky': 31,
  'Terraria': 52,
  'Stardew Valley': 53,
  'Factorio': 49,
  'Satisfactory': 65,
  'RimWorld': 62,
  'Sid Meier\'s Civilization VI': 23,
  'Crusader Kings III': 45,
  'Stellaris': 38,
  'Total War: WARHAMMER III': 35,
  'Age of Wonders 4': 25,
  'XCOM 2': 33,
  'Marvel\'s Midnight Suns': 39,
  'Hades': 22,
  'Hades II': 25,
  'Hollow Knight': 27,
  'Disco Elysium': 24,
  'Outer Wilds': 17,
  'Tunic': 12,
  'Sea of Stars': 28,
  'Dave the Diver': 24,
  'Dredge': 9,
  'Cult of the Lamb': 14,
  'Dead Cells': 14,
  'Slay the Spire': 13,
  'Balatro': 12,
  'Celeste': 8,
  'Ori and the Will of the Wisps': 12,
  'Blasphemous': 14,
  'Blasphemous 2': 16,
  'Hi-Fi RUSH': 11,
  'Sifu': 10,
  'Stray': 5,
  'It Takes Two': 12,
};

export const KNOWN_GAME_HOURS: Record<string, number> = Object.fromEntries(
  Object.entries(RAW_KNOWN_GAME_HOURS).map(([k, v]) => [normalizeTitle(k), v]),
);

/** Most specific first: an "Action, Indie, RPG" game counts as an RPG. */
export const GENRE_PRIORITY = ['RPG', 'Strategy', 'Simulation', 'Racing', 'Sports', 'Adventure', 'Action', 'Casual', 'Indie'];

/** Plural display names for messages like "6 unfinished RPGs". */
export const GENRE_PLURAL: Record<string, string> = {
  RPG: 'RPGs',
  Strategy: 'strategy games',
  Simulation: 'simulation games',
  Racing: 'racing games',
  Sports: 'sports games',
  Adventure: 'adventure games',
  Action: 'action games',
  Casual: 'casual games',
  Indie: 'indie games',
};

export function primaryGenre(genres: string[]): string | null {
  for (const g of GENRE_PRIORITY) if (genres.includes(g)) return g;
  return genres[0] ?? null;
}

export function estimateHours(genres: string[] | undefined): number {
  if (!genres || genres.length === 0) return DEFAULT_GAME_HOURS;
  const g = primaryGenre(genres);
  const base = (g && GENRE_HOURS[g]) || DEFAULT_GAME_HOURS;
  // Indie titles in long genres tend to be shorter than their AAA counterparts.
  return genres.includes('Indie') && g !== 'Indie' ? Math.round(base * 0.6) : base;
}

export function registerKnownGameHours(title: string | undefined, hours: number | null | undefined): void {
  if (!title || hours == null || hours <= 0 || Number.isNaN(hours)) return;
  const norm = normalizeTitle(title);
  if (norm) {
    KNOWN_GAME_HOURS[norm] = Math.max(1, Math.round(hours * 10) / 10);
  }
}

/**
 * Estimates main-story hours to beat a game using live ITAD HLTB hours or curated HLTB averages when known,
 * falling back to genre heuristics.
 */
export function estimateGameHours(
  title?: string,
  genres?: string[],
  hltbMainHours?: number | null,
): number {
  if (hltbMainHours != null && hltbMainHours > 0) {
    registerKnownGameHours(title, hltbMainHours);
    return hltbMainHours;
  }
  if (title) {
    const norm = normalizeTitle(title);
    if (norm && KNOWN_GAME_HOURS[norm] != null) {
      return KNOWN_GAME_HOURS[norm]!;
    }
  }
  return estimateHours(genres);
}

/**
 * Evaluates whether a library game is still unfinished by comparing its played time
 * against its estimated time-to-beat.
 * A game counts as unfinished if:
 *  - playtime is below `minThresholdMinutes` (e.g. barely launched for a few minutes), OR
 *  - played hours are under `completionCutoff` (default 25%) of the time usually taken to beat it.
 */
export function evaluateGameCompletion(
  game: { title?: string; genres?: string[]; playtimeMinutes?: number },
  minThresholdMinutes = 60,
  completionCutoff = 0.25,
): {
  isUnfinished: boolean;
  estHours: number;
  playedHours: number;
  remainingHours: number;
  completionRatio: number;
} {
  const estHours = estimateGameHours(game.title, game.genres);
  const mins = Math.max(0, game.playtimeMinutes ?? 0);
  const playedHours = mins / 60;
  const completionRatio = estHours > 0 ? playedHours / estHours : 0;
  const isUnfinished = mins < minThresholdMinutes || completionRatio < completionCutoff;
  const remainingHours = Math.max(1, Math.round((estHours - playedHours) * 10) / 10);
  return {
    isUnfinished,
    estHours,
    playedHours,
    remainingHours,
    completionRatio,
  };
}
