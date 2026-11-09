import type { GamePlatform, GameQuery, Settings } from '../shared/types';

export interface DetectedSite {
  siteKey: keyof Settings['sites'];
  query: GameQuery;
  findAnchor: () => { parent: Element; before: Node | null } | null;
}

export interface ParsedPrice {
  value: number;
  currency: string;
}

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  BRL: 'R$',
  PLN: 'zł',
  JPY: '¥',
};

function cleanStoreTitle(raw: string): string {
  return raw
    .replace(/\s*[-–|•]\s*(Steam|Humble Store|Humble Bundle|GG\.deals|IsThereAnyDeal|GOG\.com|GOG|Epic Games Store|Epic Games).*$/i, '')
    .replace(/^Buy\s+/i, '')
    .replace(/\s+from the Humble Store.*$/i, '')
    .replace(/\s+on (Steam|GOG\.com|GOG|Epic Games).*$/i, '')
    .replace(/\s+(PC|Xbox Series X\|S|Xbox Series|Xbox One|Xbox|PS5|PS4|PlayStation 5|PlayStation 4|Nintendo Switch|Switch)\s+Price\s+Comparison.*$/i, '')
    .replace(/\s+Price\s+Comparison.*$/i, '')
    .replace(/\s+\((PC|Xbox Series X\|S|Xbox One|Xbox|PS5|PS4|PlayStation|Switch|Nintendo Switch)\)\s*$/i, '')
    .trim();
}

/**
 * Extracts a numeric price and ISO 4217 currency code from a string across US, UK, EU, CA, AU, BR, PL, and JP formats.
 */
export function parsePriceWithCurrency(text: string | null | undefined): ParsedPrice | null {
  if (!text) return null;
  if (/\bfree\b/i.test(text) && !/freebie|risk|shipping|trial|account|month|weekend/i.test(text)) {
    return { value: 0, currency: 'USD' };
  }

  const rules: { re: RegExp; currency: string; isInt?: boolean }[] = [
    { re: /(?:CDN|CA|C)\$\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*(?:CAD\b|CA\$|CDN\$)/i, currency: 'CAD' },
    { re: /(?:AU|A)\$\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*(?:AUD\b|A\$)/i, currency: 'AUD' },
    { re: /R\$\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*BRL\b/i, currency: 'BRL' },
    { re: /(?:€|EUR\b)\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*(?:€|EUR\b)/i, currency: 'EUR' },
    { re: /(?:£|GBP\b)\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*(?:£|GBP\b)/i, currency: 'GBP' },
    { re: /\b(\d{1,4}(?:[.,]\d{2}))\s*(?:zł|PLN\b)|(?:PLN\b|zł)\s*(\d{1,4}(?:[.,]\d{2}))/i, currency: 'PLN' },
    { re: /(?:¥|JPY\b)\s*(\d{1,6}(?:,\d{3})*)|\b(\d{3,6})\s*(?:¥|JPY\b)/i, currency: 'JPY', isInt: true },
    { re: /(?:US)?\$\s*(\d{1,4}(?:[.,]\d{2}))|\b(\d{1,4}[.,]\d{2})\s*\$/, currency: 'USD' },
  ];

  for (const r of rules) {
    const m = text.match(r.re);
    if (!m) continue;
    const raw = m[1] ?? m[2] ?? '';
    const cleaned = r.isInt ? raw.replace(/,/g, '') : raw.replace(',', '.');
    const val = Number(cleaned);
    if (Number.isFinite(val) && val >= 0) {
      return { value: val, currency: r.currency };
    }
  }
  return null;
}

/** Scans small DOM containers whose label matches `labelRe` and extracts the first price inside. */
function findLabeledPrice(labelRe: RegExp, root: ParentNode = document): ParsedPrice | null {
  const candidates = root.querySelectorAll(
    'div, span, dt, th, td, li, p, section, a, [class*="price"], [class*="low"], [class*="best"]',
  );
  for (const el of candidates) {
    if (el.id === 'wait2play-host') continue;
    if (el.children.length > 4) continue;
    const txt = el.textContent?.trim() ?? '';
    if (!txt || txt.length > 65 || !labelRe.test(txt)) continue;

    const inline = parsePriceWithCurrency(txt);
    if (inline != null) return inline;

    const next = parsePriceWithCurrency(el.nextElementSibling?.textContent);
    if (next != null) return next;

    const parent = el.parentElement;
    if (parent && parent.id !== 'wait2play-host' && (parent.textContent?.length ?? 0) < 180) {
      const pPrice = parsePriceWithCurrency(parent.textContent);
      if (pPrice != null) return pPrice;
    }
  }
  return null;
}

function extractStructuredPrice(): ParsedPrice | null {
  // 1. Check Schema.org microdata (<meta itemprop="price" content="29.99">) used on Steam & GOG
  const priceMeta = document.querySelector<HTMLMetaElement>('meta[itemprop="price"]')?.content;
  const currMeta = document
    .querySelector<HTMLMetaElement>('meta[itemprop="priceCurrency"]')
    ?.content?.toUpperCase();
  if (priceMeta != null) {
    const n = Number(priceMeta.replace(',', '.'));
    if (Number.isFinite(n) && n >= 0) {
      return { value: n, currency: currMeta && currMeta in CURRENCY_SYMBOLS ? currMeta : 'USD' };
    }
  }

  // 2. Check JSON-LD offers
  const scripts = document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]');
  for (const s of scripts) {
    try {
      const data = JSON.parse(s.textContent ?? '') as Record<string, unknown>;
      const offers = (data.offers ??
        (Array.isArray(data['@graph']) ? (data['@graph'][0] as Record<string, unknown>)?.offers : null)) as
        | Record<string, unknown>
        | undefined;
      if (!offers) continue;
      const currency = String(offers.priceCurrency ?? 'USD').toUpperCase();
      const raw = offers.lowPrice ?? offers.price;
      if (raw != null) {
        const n = Number(String(raw).replace(',', '.'));
        if (Number.isFinite(n) && n >= 0) {
          return { value: n, currency: currency in CURRENCY_SYMBOLS ? currency : 'USD' };
        }
      }
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return null;
}

function scrapeHostPrices(): {
  pageCurrentPrice: number | null;
  pageHistoricalLow: number | null;
  pageCurrency: string;
} {
  const lowParsed = findLabeledPrice(
    /\b(histor(?:y|ical)\s+low|all[- ]time\s+low|lowest\s+price|lowest\s+recorded)\b/i,
  );
  const currentParsed =
    findLabeledPrice(/\b(current\s+best|best\s+price|official\s+stores|current\s+price|buy\s+for)\b/i) ??
    extractStructuredPrice();

  const pageCurrency = currentParsed?.currency ?? lowParsed?.currency ?? 'USD';
  // Only combine historical low and current price if they share the same currency
  const pageCurrentPrice = currentParsed?.value ?? null;
  const pageHistoricalLow =
    lowParsed && (!currentParsed || lowParsed.currency === currentParsed.currency) ? lowParsed.value : null;

  return { pageCurrentPrice, pageHistoricalLow, pageCurrency };
}

function detectConsolePlatform(url: URL): { platform: GamePlatform; platformLabel?: string } {
  const pathAndTitle = `${url.pathname} ${document.title}`;
  const activeTabText =
    document.querySelector(
      '.game-platforms .active, .platform-link.active, .platforms-select .active, [class*="platform"][class*="active"]',
    )?.textContent ?? '';
  const combined = `${pathAndTitle} ${activeTabText}`;

  if (/\b(xbox\s+series|xbox\s+one|xbox)\b/i.test(combined) || /-xbox-(series|one)\b/i.test(url.pathname)) {
    return { platform: 'console', platformLabel: 'Xbox' };
  }
  if (/\b(ps5|ps4|playstation\s*[45]?)\b/i.test(combined) || /-(ps4|ps5|playstation)\b/i.test(url.pathname)) {
    return { platform: 'console', platformLabel: 'PlayStation' };
  }
  if (/\b(nintendo\s+switch|switch)\b/i.test(combined) || /-(nintendo-)?switch\b/i.test(url.pathname)) {
    return { platform: 'console', platformLabel: 'Switch' };
  }
  return { platform: 'pc' };
}

function insertBeforeFirst(selectors: string[]): { parent: Element; before: Node | null } | null {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && el.parentElement) {
      return { parent: el.parentElement, before: el };
    }
  }
  return null;
}

function appendInsideFirst(selectors: string[]): { parent: Element; before: Node | null } | null {
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      return { parent: el, before: el.firstChild };
    }
  }
  return null;
}

export function detectCurrentPage(url = location.href): DetectedSite | null {
  const u = new URL(url);
  const host = u.hostname.replace(/^www\./, '');

  // 1. Steam store page: https://store.steampowered.com/app/<id>/<slug>/
  if (host === 'store.steampowered.com') {
    const m = u.pathname.match(/^\/app\/(\d+)/);
    if (!m) return null;
    const steamAppId = Number(m[1]);
    const titleEl = document.querySelector('#appHubAppName, .apphub_AppName');
    const title = titleEl?.textContent?.trim() || cleanStoreTitle(document.title);
    const { pageCurrentPrice, pageHistoricalLow, pageCurrency } = scrapeHostPrices();
    return {
      siteKey: 'steam',
      query: { steamAppId, title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform: 'pc' },
      findAnchor: () =>
        insertBeforeFirst(['#game_area_purchase', '.game_area_purchase_game_wrapper', '.game_area_purchase']) ??
        appendInsideFirst(['.rightcol.game_meta_data', '#tabletGrid']),
    };
  }

  // 2. Humble Store product page: https://www.humblebundle.com/store/<slug>
  if (host === 'humblebundle.com' && u.pathname.startsWith('/store/') && u.pathname.length > '/store/'.length) {
    if (u.pathname.startsWith('/store/search') || u.pathname.startsWith('/store/promo')) return null;
    const h1 = document.querySelector('h1.human_name-view, h1[data-azan-name], h1');
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content;
    const title = cleanStoreTitle(h1?.textContent?.trim() || og || document.title);
    if (!title) return null;
    const { pageCurrentPrice, pageHistoricalLow, pageCurrency } = scrapeHostPrices();
    const { platform, platformLabel } = detectConsolePlatform(u);
    return {
      siteKey: 'humble',
      query: { title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform, platformLabel },
      findAnchor: () =>
        insertBeforeFirst([
          '.js-Showcase-sidebar .pricing-info-view',
          '.pricing-info-view',
          '.platform-pricing-details',
          '.showcase-info-section',
        ]) ?? appendInsideFirst(['.js-Showcase-sidebar', 'main', 'body']),
    };
  }

  // 3. GG.deals game page: https://gg.deals/game/<slug>/ or /pack/<slug>/
  if (host === 'gg.deals' && /^\/(game|pack)\/[^/]+/.test(u.pathname)) {
    const { platform, platformLabel } = detectConsolePlatform(u);
    const steamLink =
      platform === 'pc'
        ? document.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href
        : undefined;
    const steamAppId = steamLink ? Number(steamLink.match(/\/app\/(\d+)/)?.[1]) || undefined : undefined;
    const h1 = document.querySelector('h1, .game-info-title');
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content;
    const title = cleanStoreTitle(h1?.textContent?.trim() || og || document.title);
    if (!title && !steamAppId) return null;
    const { pageCurrentPrice, pageHistoricalLow, pageCurrency } = scrapeHostPrices();
    return {
      siteKey: 'ggdeals',
      query: { steamAppId, title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform, platformLabel },
      findAnchor: () =>
        insertBeforeFirst(['.game-info-actions', '.game-offers-section', '#offers', '.game-section']) ??
        appendInsideFirst(['.game-info-content', 'main', 'body']),
    };
  }

  // 4. IsThereAnyDeal game page: https://isthereanydeal.com/game/<slug>/info/
  if (host === 'isthereanydeal.com' && /^\/game\/[^/]+/.test(u.pathname)) {
    const steamLink = document.querySelector<HTMLAnchorElement>('a[href*="store.steampowered.com/app/"]')?.href;
    const steamAppId = steamLink ? Number(steamLink.match(/\/app\/(\d+)/)?.[1]) || undefined : undefined;
    const h1 = document.querySelector('h1');
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content;
    const title = cleanStoreTitle(h1?.textContent?.trim() || og || document.title);
    if (!title && !steamAppId) return null;
    const { pageCurrentPrice, pageHistoricalLow, pageCurrency } = scrapeHostPrices();
    return {
      siteKey: 'itad',
      query: { steamAppId, title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform: 'pc' },
      findAnchor: () =>
        insertBeforeFirst(['section', '.page', 'main > div']) ?? appendInsideFirst(['main', '#app', 'body']),
    };
  }

  // 5. GOG game page: https://www.gog.com/en/game/<slug> or https://www.gog.com/game/<slug>
  if (host === 'gog.com' && /^\/(?:[a-z]{2}\/)?game\/[^/]+/i.test(u.pathname)) {
    const h1 = document.querySelector('h1.productcard-basics__title, h1[ selenium-id="productTitle" ], h1');
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content;
    const title = cleanStoreTitle(h1?.textContent?.trim() || og || document.title);
    if (!title) return null;
    const scraped = scrapeHostPrices();
    const gogPrice = parsePriceWithCurrency(
      `$${document.querySelector('.product-actions-price__final-amount')?.textContent?.trim() ?? ''}`,
    );
    const hasGogPrice = !!document.querySelector('.product-actions-price__final-amount') && gogPrice != null;
    const pageCurrentPrice = hasGogPrice ? gogPrice!.value : scraped.pageCurrentPrice;
    const { pageHistoricalLow, pageCurrency } = scraped;
    return {
      siteKey: 'gog',
      query: { title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform: 'pc' },
      findAnchor: () =>
        insertBeforeFirst(['.product-actions', '.productcard-player', '.layout-side-col']) ??
        appendInsideFirst(['.productcard-basics', 'main', 'body']),
    };
  }

  // 6. Epic Games Store product page: https://store.epicgames.com/en-US/p/<slug>
  if (host === 'store.epicgames.com' && /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?p\/[^/]+/i.test(u.pathname)) {
    const h1 = document.querySelector('h1');
    const og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.content;
    const title = cleanStoreTitle(h1?.textContent?.trim() || og || document.title);
    if (!title) return null;
    const { pageCurrentPrice, pageHistoricalLow, pageCurrency } = scrapeHostPrices();
    return {
      siteKey: 'epic',
      query: { title, pageCurrentPrice, pageHistoricalLow, pageCurrency, platform: 'pc' },
      findAnchor: () =>
        insertBeforeFirst(['aside', '[data-testid="purchase-cta-button"]', 'main > div']) ??
        appendInsideFirst(['main', 'body']),
    };
  }

  return null;
}
