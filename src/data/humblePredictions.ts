import { normalizeTitle, titlesMatch } from '../core/titles';

export interface HumblePredictionEntry {
  title: string;
  steamAppId?: number;
  tier: 'headliner' | 'choice_pick';
  reason: string;
}

/**
 * High-consensus Humble Choice & Bundle candidates frequently predicted in
 * r/humblebundles Monthly Prediction League threads based on publisher pipelines,
 * Game Pass / PS Plus Extra exit timing, and AA/indie discount curves.
 */
export const HUMBLE_PREDICTION_WATCHLIST: HumblePredictionEntry[] = [
  // AA Headliner Candidates (Focus, 505, Plaion, THQ Nordic, Bandai Namco, SEGA, Ubisoft, etc.)
  { title: 'Banishers: Ghosts of New Eden', steamAppId: 1493640, tier: 'headliner', reason: 'Frequent r/humblebundles Choice headliner pick (Focus Entertainment AA cycle).' },
  { title: 'Atlas Fallen', steamAppId: 1230530, tier: 'headliner', reason: 'Focus Entertainment AA action RPG in the prime Humble Choice headliner window.' },
  { title: 'Lords of the Fallen', steamAppId: 1501750, tier: 'headliner', reason: 'Popular r/humblebundles headliner prediction after Game Pass run and deep Steam sales.' },
  { title: 'System Shock', steamAppId: 482400, tier: 'headliner', reason: 'Plaion / Prime Matter sci-fi remake frequently predicted for Humble Choice.' },
  { title: 'Outcast - A New Beginning', steamAppId: 1013140, tier: 'headliner', reason: 'THQ Nordic AA open-world title fitting the classic Humble Choice headliner slot.' },
  { title: 'Alone in the Dark', steamAppId: 1310410, tier: 'headliner', reason: 'THQ Nordic survival horror regularly cited in r/humblebundles prediction threads.' },
  { title: 'Flintlock: The Siege of Dawn', steamAppId: 1832040, tier: 'headliner', reason: 'Kepler Interactive AA action RPG following the Game Pass-to-Humble Choice pipeline.' },
  { title: 'Pacific Drive', steamAppId: 1458140, tier: 'headliner', reason: 'Kepler Interactive survival driving hit frequently picked in r/humblebundles Choice leagues.' },
  { title: 'The Talos Principle 2', steamAppId: 835960, tier: 'headliner', reason: 'Devolver Digital flagship puzzle sequel in prime Humble Choice territory.' },
  { title: 'Prince of Persia The Lost Crown', steamAppId: 2751000, tier: 'headliner', reason: 'Deeply discounted metroidvania frequently predicted for subscription & Choice drops.' },
  { title: 'Dead Island 2', steamAppId: 934700, tier: 'headliner', reason: 'Plaion / Deep Silver catalog title after Game Pass & PS Plus Extra appearances.' },
  { title: 'Sniper Elite: Resistance', steamAppId: 2169200, tier: 'headliner', reason: 'Rebellion titles routinely cycle from Game Pass into Humble Choice.' },
  { title: 'Evil West', steamAppId: 1065310, tier: 'headliner', reason: 'Focus Entertainment action brawler with high bundle & giveaway recurrence.' },
  { title: 'Warhammer 40,000: Rogue Trader', steamAppId: 2186680, tier: 'headliner', reason: 'Owlcat Games CRPG — both Pathfinder titles previously headlined Humble Choice.' },
  { title: 'Wartales', steamAppId: 1527950, tier: 'headliner', reason: 'Shiro Games tactical RPG following Northgard & Dune: Spice Wars Choice pattern.' },
  { title: 'Against the Storm', steamAppId: 1336490, tier: 'headliner', reason: 'Hooded Horse roguelite city-builder after Game Pass run.' },
  { title: 'Manor Lords', steamAppId: 1363080, tier: 'headliner', reason: 'Hooded Horse strategy hit frequently watched by bundle trackers.' },
  { title: 'Frostpunk 2', steamAppId: 1601580, tier: 'headliner', reason: '11 bit studios sequel — original Frostpunk headlined Humble Choice & Epic freebies.' },
  { title: 'The Thaumaturge', steamAppId: 1684350, tier: 'choice_pick', reason: '11 bit studios AA RPG regularly featured in r/humblebundles prediction threads.' },
  { title: 'Indika', steamAppId: 1373960, tier: 'choice_pick', reason: '11 bit studios narrative indie frequently predicted for Humble Choice.' },
  { title: 'Creatures of Ava', steamAppId: 2304440, tier: 'choice_pick', reason: '11 bit studios Game Pass title fitting the 6–12 month Choice echo window.' },
  { title: 'Dungeons of Hinterberg', steamAppId: 1983260, tier: 'choice_pick', reason: 'Curve Games + Game Pass day-one release — classic r/humblebundles Choice pick.' },
  { title: 'Still Wakes the Deep', steamAppId: 1622910, tier: 'choice_pick', reason: 'Secret Mode horror narrative following the Game Pass-to-Humble Choice pipeline.' },
  { title: 'Harold Halibut', steamAppId: 924750, tier: 'choice_pick', reason: 'Game Pass narrative adventure frequently predicted for Humble Choice.' },
  { title: 'Chants of Sennaar', steamAppId: 1931770, tier: 'choice_pick', reason: 'Focus Entertainment puzzle indie in the prime Humble Choice & giveaway window.' },
  { title: 'Cocoon', steamAppId: 1497440, tier: 'choice_pick', reason: 'Annapurna Interactive puzzle adventure following Game Pass rotation.' },
  { title: 'Viewfinder', steamAppId: 1382070, tier: 'choice_pick', reason: 'Thunderful puzzle indie frequently predicted in r/humblebundles monthly threads.' },
  { title: 'American Arcadia', steamAppId: 1249040, tier: 'choice_pick', reason: 'Raw Fury narrative platformer — Raw Fury is a top Humble Choice partner.' },
  { title: 'Snufkin: Melody of Moominvalley', steamAppId: 1808680, tier: 'choice_pick', reason: 'Raw Fury cozy adventure fitting the Humble Choice indie slot.' },
  { title: 'Star Trucker', steamAppId: 2380050, tier: 'choice_pick', reason: 'Raw Fury + Game Pass sim in the 6–12 month Humble Choice echo window.' },
  { title: 'Tunic', steamAppId: 553420, tier: 'headliner', reason: 'Finji action-adventure after Game Pass & PS Plus runs, perennial Choice prediction.' },
  { title: 'Sea of Stars', steamAppId: 1244090, tier: 'headliner', reason: 'Indie RPG hit after Game Pass & PS Plus Extra catalog runs.' },
  { title: 'Cult of the Lamb', steamAppId: 1313140, tier: 'headliner', reason: 'Devolver Digital hit with DLC upsell potential for Humble Choice.' },
  { title: 'Anger Foot', steamAppId: 1978590, tier: 'choice_pick', reason: 'Devolver Digital action FPS fitting the mid-tier Humble Choice slot.' },
  { title: 'Children of the Sun', steamAppId: 1309950, tier: 'choice_pick', reason: 'Devolver Digital tactical puzzle shooter frequently predicted for Choice.' },
  { title: 'Pepper Grinder', steamAppId: 2076580, tier: 'choice_pick', reason: 'Devolver Digital platformer fitting the Humble Choice indie tier.' },
  { title: 'The Plucky Squire', steamAppId: 1627570, tier: 'choice_pick', reason: 'Devolver Digital + PS Plus Extra title in the cross-platform echo window.' },
  { title: 'Neva', steamAppId: 2428980, tier: 'choice_pick', reason: 'Devolver Digital platformer from the creators of GRIS (which hit Humble Choice).' },
  { title: 'Blasphemous 2', steamAppId: 2114740, tier: 'headliner', reason: 'Team17 metroidvania — original Blasphemous headlined Humble Choice.' },
  { title: 'Killer Frequency', steamAppId: 1903620, tier: 'choice_pick', reason: 'Team17 horror-comedy adventure frequently bundled.' },
  { title: 'Conscript', steamAppId: 1286990, tier: 'choice_pick', reason: 'Team17 survival horror indie fitting the Humble Choice catalog pattern.' },
  { title: 'Classified: France \'44', steamAppId: 2085370, tier: 'choice_pick', reason: 'Team17 turn-based tactics game with DLC upsell potential.' },
  { title: 'Trepang2', steamAppId: 1164940, tier: 'choice_pick', reason: 'Team17 action shooter frequently predicted in r/humblebundles threads.' },
  { title: 'Dredge', steamAppId: 1562430, tier: 'headliner', reason: 'Team17 fishing horror hit with multiple DLCs to upsell via Humble Choice.' },
  { title: 'Shadow Gambit: The Cursed Crew', steamAppId: 1545560, tier: 'headliner', reason: 'Mimimi stealth tactics — Desperados III & Shadow Tactics both hit Choice/giveaways.' },
  { title: 'IXION', steamAppId: 1113120, tier: 'choice_pick', reason: 'Kasedo Games sci-fi survival builder frequently predicted for Humble Choice.' },
  { title: 'Crown Wars: The Black Prince', steamAppId: 1658920, tier: 'choice_pick', reason: 'Nacon tactical RPG fitting the mid-tier Humble Choice slot.' },
  { title: 'RoboCop: Rogue City', steamAppId: 1681430, tier: 'headliner', reason: 'Nacon AA shooter — prime Humble Choice & Fanatical Platinum bundle staple.' },
  { title: 'Terminator: Resistance', steamAppId: 954740, tier: 'choice_pick', reason: 'Teyon AA shooter frequently predicted alongside RoboCop.' },
  { title: 'The Last Faith', steamAppId: 1274600, tier: 'choice_pick', reason: 'Playstack metroidvania soulslike regularly predicted in r/humblebundles.' },
  { title: 'Balatro', steamAppId: 2379780, tier: 'headliner', reason: 'Playstack indie hit on Game Pass — high-demand Choice headliner candidate.' },
  { title: 'Laika: Aged Through Blood', steamAppId: 1796220, tier: 'choice_pick', reason: 'Headup Games motorvania — Headup is a frequent Humble & Fanatical bundler.' },
  { title: 'SANABI', steamAppId: 1562700, tier: 'choice_pick', reason: 'NEOWIZ action platformer — Skul: The Hero Slayer previously hit Humble Choice.' },
  { title: 'Lies of P', steamAppId: 1627720, tier: 'headliner', reason: 'NEOWIZ soulslike after Game Pass run & upcoming DLC upsell window.' },
  { title: 'Ultros', steamAppId: 2386310, tier: 'choice_pick', reason: 'Kepler Interactive psychedelic metroidvania frequently predicted for Choice.' },
  { title: 'En Garde!', steamAppId: 1654660, tier: 'choice_pick', reason: 'Kepler Interactive swashbuckling action indie fitting the Choice filler slot.' },
  { title: 'Penny\'s Big Breakaway', steamAppId: 1955230, tier: 'choice_pick', reason: 'Private Division 3D platformer regularly cited in r/humblebundles predictions.' },
  { title: 'Monster Hunter Rise', steamAppId: 1446780, tier: 'headliner', reason: 'Capcom catalog title — frequently featured in Capcom Humble Bundles & Choice.' },
  { title: 'Resident Evil Village', steamAppId: 1196590, tier: 'headliner', reason: 'Capcom survival horror — Resident Evil 2, 3 & 7 all cycled through Humble Bundles.' },
];

export function lookupHumblePredictionWatchlist(
  title: string,
  steamAppId?: number | null,
): HumblePredictionEntry | null {
  if (steamAppId) {
    const byId = HUMBLE_PREDICTION_WATCHLIST.find((e) => e.steamAppId === steamAppId);
    if (byId) return byId;
  }
  const norm = normalizeTitle(title);
  if (!norm) return null;
  return HUMBLE_PREDICTION_WATCHLIST.find((e) => titlesMatch(e.title, title)) ?? null;
}
