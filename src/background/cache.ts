/** chrome.storage-backed TTL cache with in-memory layer and in-flight request de-duplication. */

interface Entry<T> {
  v: T;
  exp: number;
}

const PREFIX = 'c:';
const memory = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const mem = memory.get(key) as Entry<T> | undefined;
  if (mem && mem.exp > now) return mem.v;

  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const p = (async () => {
    const stored = (await chrome.storage.local.get(PREFIX + key))[PREFIX + key] as Entry<T> | undefined;
    if (stored && stored.exp > Date.now()) {
      memory.set(key, stored);
      return stored.v;
    }
    const v = await fn();
    const entry: Entry<T> = { v, exp: Date.now() + ttlMs };
    memory.set(key, entry);
    await chrome.storage.local.set({ [PREFIX + key]: entry });
    return v;
  })();
  inflight.set(key, p);
  try {
    return await p;
  } finally {
    inflight.delete(key);
  }
}

export async function pruneCache(): Promise<number> {
  const all = await chrome.storage.local.get(null);
  const now = Date.now();
  const stale = Object.entries(all)
    .filter(([k, v]) => k.startsWith(PREFIX) && (v as Entry<unknown>)?.exp < now)
    .map(([k]) => k);
  if (stale.length) await chrome.storage.local.remove(stale);
  return stale.length;
}

export async function clearCache(): Promise<void> {
  memory.clear();
  const all = await chrome.storage.local.get(null);
  const keys = Object.keys(all).filter((k) => k.startsWith(PREFIX));
  if (keys.length) await chrome.storage.local.remove(keys);
}

export const HOUR = 3_600_000;
export const DAY = 24 * HOUR;
