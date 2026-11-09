import { getJson } from './http';

/** Steam Web API (requires the user's own key from https://steamcommunity.com/dev/apikey). */

export interface OwnedGame {
  appid: number;
  name?: string;
  playtime_forever: number;
  playtime_2weeks?: number;
}

/** Accepts a SteamID64, a /profiles/<id> URL, a /id/<vanity> URL or a bare vanity name. */
export async function resolveSteamId(key: string, input: string): Promise<string> {
  const s = input.trim();
  if (/^\d{17}$/.test(s)) return s;
  const prof = s.match(/steamcommunity\.com\/profiles\/(\d{17})/);
  if (prof) return prof[1]!;
  const vanity = s.match(/steamcommunity\.com\/id\/([^/?#]+)/)?.[1] ?? s;
  const r = await getJson<{ response: { success: number; steamid?: string; message?: string } }>(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${encodeURIComponent(key)}&vanityurl=${encodeURIComponent(vanity)}`,
  );
  if (r.response.success !== 1 || !r.response.steamid) {
    throw new Error(`Couldn't resolve Steam profile "${vanity}". Use your 17-digit SteamID64.`);
  }
  return r.response.steamid;
}

export async function getOwnedGames(key: string, steamId: string): Promise<OwnedGame[]> {
  const r = await getJson<{ response: { game_count?: number; games?: OwnedGame[] } }>(
    `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${encodeURIComponent(key)}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&format=json`,
    20_000,
  );
  if (!r.response.games) {
    throw new Error('Steam returned no games. Make sure your profile and "Game details" privacy are set to Public.');
  }
  return r.response.games;
}

export interface SteamDynamicUserdata {
  rgOwnedApps: number[];
  rgWishlist: number[];
  rgOwnedPackages: number[];
}

/**
 * Fetches owned apps and wishlist directly from the user's logged-in store.steampowered.com browser session.
 * Requires zero API keys and works even if the user's Steam community profile is private.
 */
export async function fetchSteamDynamicStoreUserdata(): Promise<SteamDynamicUserdata> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15_000);
  try {
    const res = await fetch(`https://store.steampowered.com/dynamicstore/userdata/?t=${Date.now()}`, {
      signal: ctrl.signal,
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} from Steam store session`);
    }
    const raw = (await res.json()) as Partial<SteamDynamicUserdata>;
    const rgOwnedApps = Array.isArray(raw.rgOwnedApps)
      ? raw.rgOwnedApps.filter((n): n is number => typeof n === 'number' && n > 0)
      : [];
    const rgWishlist = Array.isArray(raw.rgWishlist)
      ? raw.rgWishlist.filter((n): n is number => typeof n === 'number' && n > 0)
      : [];
    const rgOwnedPackages = Array.isArray(raw.rgOwnedPackages)
      ? raw.rgOwnedPackages.filter((n): n is number => typeof n === 'number' && n > 0)
      : [];
    return { rgOwnedApps, rgWishlist, rgOwnedPackages };
  } finally {
    clearTimeout(timer);
  }
}
