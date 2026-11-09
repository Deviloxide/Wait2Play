/**
 * Publisher habit profiles. `giveaway` = tendency to put catalog titles into free
 * giveaways/subscriptions (Epic, Prime, Game Pass, Humble Choice); `bundle` = tendency
 * to appear in paid bundles. 0..1 heuristics from public giveaway/bundle history —
 * tune freely. `veto` profiles override other matches (e.g. a "never" developer
 * published by a frequent bundler).
 */
export interface PublisherProfile {
  display: string;
  patterns: string[];
  giveaway: number;
  bundle: number;
  note: string;
  veto?: boolean;
}

export const PUBLISHERS: PublisherProfile[] = [
  // Frequent cyclers
  { display: 'Devolver Digital', patterns: ['devolver digital', 'devolver'], giveaway: 0.85, bundle: 0.8, note: 'Regularly cycles its catalog through Epic, Prime Gaming and Humble.' },
  { display: '505 Games', patterns: ['505 games'], giveaway: 0.8, bundle: 0.75, note: 'Frequent Epic and Game Pass partner.' },
  { display: 'Focus Entertainment', patterns: ['focus entertainment', 'focus home interactive', 'pullup entertainment'], giveaway: 0.8, bundle: 0.75, note: 'Catalog titles regularly appear in giveaways and Humble Choice.' },
  { display: 'Team17', patterns: ['team17', 'team 17'], giveaway: 0.8, bundle: 0.8, note: 'Long history of Epic giveaways and bundles.' },
  { display: 'Paradox Interactive', patterns: ['paradox interactive'], giveaway: 0.75, bundle: 0.8, note: 'Base games are often given away to sell DLC.' },
  { display: 'THQ Nordic', patterns: ['thq nordic', 'thq'], giveaway: 0.75, bundle: 0.85, note: 'Very frequent bundle and giveaway participant.' },
  { display: 'Plaion / Deep Silver', patterns: ['plaion', 'deep silver', 'koch media', 'prime matter'], giveaway: 0.7, bundle: 0.75, note: 'Regular Epic and Prime Gaming partner.' },
  { display: 'Raw Fury', patterns: ['raw fury'], giveaway: 0.75, bundle: 0.8, note: 'Indie catalog frequently given away and bundled.' },
  { display: 'tinyBuild', patterns: ['tinybuild'], giveaway: 0.75, bundle: 0.85, note: 'Very bundle-friendly publisher.' },
  { display: 'Humble Games', patterns: ['humble games', 'humble bundle'], giveaway: 0.7, bundle: 0.9, note: 'Own titles feature in Humble Choice often.' },
  { display: 'Curve Games', patterns: ['curve games', 'curve digital'], giveaway: 0.7, bundle: 0.85, note: 'Frequent bundle and giveaway participant.' },
  { display: 'Daedalic', patterns: ['daedalic'], giveaway: 0.65, bundle: 0.8, note: 'Back catalog regularly bundled.' },
  { display: 'Kalypso Media', patterns: ['kalypso'], giveaway: 0.6, bundle: 0.75, note: 'Older titles regularly given away.' },
  { display: 'Headup', patterns: ['headup'], giveaway: 0.6, bundle: 0.85, note: 'Very frequent bundle participant.' },
  { display: 'Merge Games', patterns: ['merge games'], giveaway: 0.6, bundle: 0.8, note: 'Frequent bundle participant.' },
  { display: 'Annapurna Interactive', patterns: ['annapurna'], giveaway: 0.65, bundle: 0.6, note: 'Several titles have gone free on Epic or joined subscriptions.' },
  { display: 'Gearbox Publishing', patterns: ['gearbox publishing', 'gearbox software'], giveaway: 0.6, bundle: 0.6, note: 'Borderlands titles have been Epic giveaways.' },
  { display: '2K', patterns: ['2k', '2k games', 'take two', 'take-two'], giveaway: 0.6, bundle: 0.5, note: 'Several Epic Mega Sale giveaways (Civilization, Borderlands).' },
  { display: 'Warner Bros. Games', patterns: ['warner bros', 'wb games'], giveaway: 0.6, bundle: 0.5, note: 'Batman: Arkham titles went free on Epic.' },
  { display: 'Private Division', patterns: ['private division'], giveaway: 0.55, bundle: 0.5, note: 'Catalog has appeared in giveaways.' },
  { display: 'Bethesda', patterns: ['bethesda'], giveaway: 0.55, bundle: 0.5, note: 'Older titles frequently on Prime Gaming and Game Pass.' },
  { display: 'Ubisoft', patterns: ['ubisoft'], giveaway: 0.5, bundle: 0.4, note: 'Periodic giveaways, mostly via its own launcher.' },
  { display: 'Amazon Games', patterns: ['amazon games'], giveaway: 0.5, bundle: 0.3, note: 'Owned titles appear on Prime Gaming.' },
  { display: 'Electronic Arts', patterns: ['electronic arts', 'ea games'], giveaway: 0.45, bundle: 0.35, note: 'Occasional Epic and Prime Gaming giveaways; EA Play subscription.' },
  { display: 'Square Enix', patterns: ['square enix'], giveaway: 0.45, bundle: 0.6, note: 'Back catalog regularly bundled; occasional giveaways.' },
  { display: 'SEGA', patterns: ['sega'], giveaway: 0.45, bundle: 0.65, note: 'Frequent Humble bundles; occasional giveaways.' },
  { display: 'Bandai Namco', patterns: ['bandai namco'], giveaway: 0.35, bundle: 0.6, note: 'Bundles more often than giveaways.' },
  { display: 'Capcom', patterns: ['capcom'], giveaway: 0.25, bundle: 0.5, note: 'Rarely gives games away; occasional bundles.' },
  { display: 'Konami', patterns: ['konami'], giveaway: 0.3, bundle: 0.4, note: 'Occasional giveaways of older collections.' },
  { display: 'Xbox Game Studios', patterns: ['xbox game studios', 'microsoft studios', 'microsoft'], giveaway: 0.2, bundle: 0.15, note: 'Subscription-first: titles go to Game Pass, rarely free.' },
  { display: 'Rockstar Games', patterns: ['rockstar games'], giveaway: 0.25, bundle: 0.1, note: 'GTA V was a one-off; giveaways are rare.' },
  { display: 'CD PROJEKT', patterns: ['cd projekt'], giveaway: 0.25, bundle: 0.3, note: 'Occasional older-title giveaways on GOG.' },
  { display: 'Supergiant Games', patterns: ['supergiant'], giveaway: 0.15, bundle: 0.15, note: 'Rarely discounts deeply; occasional giveaways in the past.' },
  { display: 'Klei Entertainment', patterns: ['klei'], giveaway: 0.15, bundle: 0.3, note: 'Rare giveaways.' },
  { display: 'Sony Interactive', patterns: ['sony interactive', 'playstation publishing', 'playstation pc'], giveaway: 0.1, bundle: 0.1, note: 'Uses PS Plus, almost never free on PC.' },
  { display: 'Activision', patterns: ['activision'], giveaway: 0.1, bundle: 0.1, note: 'Very rarely gives games away.' },

  // Virtually never
  { display: 'Nintendo', patterns: ['nintendo'], giveaway: 0, bundle: 0, note: 'Never gives games away.', veto: true },
  { display: 'FromSoftware', patterns: ['fromsoftware', 'from software'], giveaway: 0.03, bundle: 0.1, note: 'Virtually never free or in subscriptions on PC.', veto: true },
  { display: 'Wube Software', patterns: ['wube software'], giveaway: 0, bundle: 0, note: 'Factorio has never been discounted, let alone given away.', veto: true },
  { display: 'Re-Logic', patterns: ['re logic', 're-logic'], giveaway: 0.03, bundle: 0.1, note: 'Terraria is essentially never free.', veto: true },
  { display: 'Valve', patterns: ['valve'], giveaway: 0.02, bundle: 0.05, note: 'Never gives its games away.', veto: true },
  { display: 'ConcernedApe', patterns: ['concernedape'], giveaway: 0.02, bundle: 0.05, note: 'Stardew Valley is effectively never free.', veto: true },
  { display: 'Team Cherry', patterns: ['team cherry'], giveaway: 0.05, bundle: 0.1, note: 'Hollow Knight has never been a giveaway.', veto: true },
  { display: 'Mojang', patterns: ['mojang'], giveaway: 0, bundle: 0, note: 'Never given away.', veto: true },
  { display: 'Blizzard', patterns: ['blizzard'], giveaway: 0.02, bundle: 0.02, note: 'Never given away.', veto: true },
];
