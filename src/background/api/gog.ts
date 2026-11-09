import type { OwnedEntry } from '../../shared/types';

interface GogProduct {
  id?: number;
  title?: string;
  isGame?: boolean;
}

interface GogFilteredProductsResponse {
  page?: number;
  totalProducts?: number;
  totalPages?: number;
  products?: GogProduct[];
}

/**
 * Syncs the user's owned GOG games directly from their logged-in `www.gog.com` browser session
 * using GOG's account library endpoint (`/account/getFilteredProducts?mediaType=1`).
 * Requires no API key.
 */
export async function fetchGogSessionLibrary(): Promise<OwnedEntry[]> {
  const fetchPage = async (page: number): Promise<GogFilteredProductsResponse> => {
    const res = await fetch(`https://www.gog.com/account/getFilteredProducts?mediaType=1&page=${page}`, {
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/plain, */*',
      },
    });
    if (!res.ok) {
      throw new Error(
        'Not signed in to GOG in this browser. Sign in at gog.com first, or import a CSV/JSON list below.',
      );
    }
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('json')) {
      throw new Error(
        'Not signed in to GOG in this browser. Sign in at gog.com first, or import a CSV/JSON list below.',
      );
    }
    return (await res.json()) as GogFilteredProductsResponse;
  };

  const first = await fetchPage(1);
  if (!Array.isArray(first.products)) {
    throw new Error(
      'Not signed in to GOG in this browser. Sign in at gog.com first, or import a CSV/JSON list below.',
    );
  }

  const totalPages = Math.min(Math.max(1, first.totalPages ?? 1), 15);
  const allProducts: GogProduct[] = [...first.products];

  for (let p = 2; p <= totalPages; p++) {
    try {
      const next = await fetchPage(p);
      if (Array.isArray(next.products)) {
        allProducts.push(...next.products);
      }
    } catch {
      break;
    }
  }

  const entries: OwnedEntry[] = [];
  const seen = new Set<string>();
  const today = new Date().toISOString().slice(0, 10);

  for (const prod of allProducts) {
    const title = prod.title?.trim();
    if (!title) continue;
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({
      title,
      source: 'gog',
      date: today,
    });
  }

  if (entries.length === 0) {
    throw new Error(
      'No owned GOG games found in your current browser session. Make sure you are signed in at gog.com.',
    );
  }

  return entries;
}
