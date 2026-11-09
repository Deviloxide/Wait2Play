export class HttpError extends Error {
  constructor(
    public status: number,
    public url: string,
  ) {
    super(`HTTP ${status} for ${new URL(url).host}${status === 429 ? ' (rate limited, try again in a minute)' : ''}`);
  }
}

export async function getJson<T>(url: string, timeoutMs = 12_000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, credentials: 'omit' });
    if (!res.ok) throw new HttpError(res.status, url);
    return (await res.json()) as T;
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw new Error(`Request timed out: ${new URL(url).host}`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
