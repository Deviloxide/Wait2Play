import { send } from '../shared/messages';
import type { VerdictResult } from '../shared/types';
import { ICONS, VERDICT_META, escapeHtml } from '../shared/verdictUi';
import { parsePriceWithCurrency } from './detectors';

const CART_SUMMARY_ID = 'wait2play-cart-guard';

export function isSteamCartPage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'store.steampowered.com' && u.pathname.startsWith('/cart');
  } catch {
    return false;
  }
}

export function isSteamWishlistPage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === 'store.steampowered.com' && u.pathname.startsWith('/wishlist');
  } catch {
    return false;
  }
}

export function isSteamSearchOrSalePage(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'store.steampowered.com' &&
      (u.pathname.startsWith('/search') ||
        u.pathname.startsWith('/specials') ||
        u.pathname.startsWith('/sale/') ||
        u.pathname.startsWith('/category/'))
    );
  } catch {
    return false;
  }
}

export function isSteamBundlePage(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'store.steampowered.com' &&
      (u.pathname.startsWith('/bundle/') || u.pathname.startsWith('/sub/'))
    );
  } catch {
    return false;
  }
}

export function isFanaticalBundlePage(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    return (
      host === 'fanatical.com' &&
      (/^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?bundle\/[^/]+/i.test(u.pathname) ||
        /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/)?pick-and-mix\/[^/]+/i.test(u.pathname))
    );
  } catch {
    return false;
  }
}

export function isHumbleBundlePage(url: string): boolean {
  if (isFanaticalBundlePage(url)) return true;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    return (
      host === 'humblebundle.com' &&
      ((u.pathname.startsWith('/games/') && u.pathname.length > '/games/'.length) ||
        u.pathname.startsWith('/membership'))
    );
  } catch {
    return false;
  }
}

function findCartAppLinks(): Map<number, HTMLElement> {
  const map = new Map<number, HTMLElement>();
  const root =
    document.querySelector(
      '.page_content_ctn, .page_content, #cart_status_data, #wishlist_ctn, #search_resultsRows, main, [role="main"]',
    ) ?? document.body;

  // 1. Steam Search rows (<a class="search_result_row" data-ds-appid="1145360">) — attach pill to span.title
  const searchRows = root.querySelectorAll<HTMLAnchorElement>('a.search_result_row[data-ds-appid]');
  for (const row of searchRows) {
    const rawId = row.getAttribute('data-ds-appid')?.split(',')[0];
    const appId = rawId ? Number(rawId) : NaN;
    const titleEl = row.querySelector<HTMLElement>('span.title');
    if (Number.isFinite(appId) && appId > 0 && titleEl) {
      map.set(appId, titleEl);
    }
  }

  // 2. General /app/<id> links
  const anchors = root.querySelectorAll<HTMLAnchorElement>('a[href*="/app/"]');
  for (const a of anchors) {
    if (a.closest('#global_header, #footer, .supernav_content, #store_nav_area')) continue;
    const m = a.href.match(/\/app\/(\d+)/);
    if (!m) continue;
    const appId = Number(m[1]);
    if (map.has(appId) && map.get(appId)?.tagName === 'SPAN') continue;
    const text = (a.textContent ?? '').trim();
    if (!text) continue;
    if (!map.has(appId) || text.length > (map.get(appId)?.textContent?.trim().length ?? 0)) {
      map.set(appId, a);
    }
  }
  return map;
}

function injectInlineCartPill(anchor: HTMLElement, res: VerdictResult): void {
  const pillKey = String(res.facts.steamAppId ?? res.key);
  const existing = anchor.parentElement?.querySelector(`[data-w2p-cart-app="${CSS.escape(pillKey)}"]`);
  if (existing) existing.remove();

  const meta = VERDICT_META[res.verdict];
  const freePct = Math.round(res.freebieProbability * 100);
  const bundlePct = Math.round(res.bundleProbability * 100);
  const label =
    res.verdict === 'HIGH_GIVEAWAY_RISK'
      ? `${meta.shortLabel} · ${freePct}%`
      : res.verdict === 'BUNDLE_NOW'
        ? `${meta.shortLabel}${res.facts.liveBundles?.[0] ? ` (${res.facts.liveBundles[0].store})` : ''}`
        : res.verdict === 'IN_SUBSCRIPTION'
          ? meta.shortLabel
          : res.verdict === 'HOLD_FOR_BUNDLE'
            ? `${meta.shortLabel} · ${bundlePct}%`
            : res.verdict === 'OWNED' && res.owned[0]
              ? `Owned on ${res.owned[0].source.toUpperCase()}`
              : `${meta.shortLabel} · ${freePct}% risk`;

  const pill = document.createElement('span');
  pill.setAttribute('data-w2p-cart-app', pillKey);
  pill.title = `Wait2Play: ${res.headline}`;
  pill.style.cssText = [
    'display:inline-flex',
    'align-items:center',
    'gap:5px',
    'margin-left:8px',
    'padding:2px 8px',
    `background:${meta.accent}`,
    `color:${meta.ink}`,
    'font-size:11px',
    'font-weight:700',
    'letter-spacing:0.02em',
    'clip-path:polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
    'vertical-align:middle',
    'white-space:nowrap',
  ].join(';');
  pill.textContent = `Wait2Play: ${label}`;
  anchor.insertAdjacentElement('afterend', pill);
}

function renderCartSummaryBanner(results: VerdictResult[]): void {
  if (results.length === 0) return;
  const firstLink = findCartAppLinks().values().next().value as HTMLElement | undefined;
  const container =
    document.querySelector('.page_content, .cart_area_body, #cart_status_data') ??
    firstLink?.closest('div')?.parentElement ??
    null;
  if (!container) return;

  let host = document.getElementById(CART_SUMMARY_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = CART_SUMMARY_ID;
    host.attachShadow({ mode: 'open' });
    container.insertBefore(host, container.firstChild);
  }

  const ownedItems = results.filter((r) => r.verdict === 'OWNED' || r.verdict === 'IN_SUBSCRIPTION');
  const riskyItems = results.filter(
    (r) =>
      r.verdict === 'BUNDLE_NOW' ||
      r.verdict === 'HIGH_GIVEAWAY_RISK' ||
      r.verdict === 'FREE_NOW' ||
      r.verdict === 'FREE_SOON' ||
      r.verdict === 'HOLD_FOR_BUNDLE',
  );
  const waitItems = results.filter((r) => r.verdict === 'WAIT_FOR_SALE');

  const hasWarning = ownedItems.length > 0 || riskyItems.length > 0;
  const accent = ownedItems.length > 0 ? '#ff4da6' : riskyItems.length > 0 ? '#ff2a54' : waitItems.length > 0 ? '#ffb800' : '#a4d007';
  const badgeText =
    ownedItems.length > 0
      ? `${ownedItems.length} Owned / In Subscription`
      : riskyItems.length > 0
        ? `${riskyItems.length} High Giveaway/Bundle Risk`
        : waitItems.length > 0
          ? `${waitItems.length} Wait for Deeper Sale`
          : 'Cart Looks Safe to Buy';

  const detailItems = [...ownedItems, ...riskyItems, ...waitItems].slice(0, 4);
  const rowsHtml =
    detailItems.length > 0
      ? detailItems
          .map((r) => {
            const m = VERDICT_META[r.verdict];
            return `<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-top:1px solid rgba(102,192,244,0.12);font-size:12px;">
              <span><b style="color:#fff">${escapeHtml(r.facts.title)}</b> — <span style="color:#8f98a0">${escapeHtml(r.headline)}</span></span>
              <span style="color:${m.accent};font-weight:700;white-space:nowrap">${escapeHtml(m.shortLabel)}</span>
            </div>`;
          })
          .join('')
      : `<div style="font-size:12px;color:#8f98a0;margin-top:4px;">Checked ${results.length} cart item${results.length > 1 ? 's' : ''} — no duplicate ownership or high giveaway risk detected.</div>`;

  host.shadowRoot!.innerHTML = `
    <div style="
      background:#101720;
      border:1px solid rgba(102,192,244,0.28);
      border-left:6px solid ${accent};
      clip-path:polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
      padding:11px 15px;
      margin:10px 0 14px;
      font-family:-apple-system,BlinkMacSystemFont,'Motiva Sans','Segoe UI',Roboto,sans-serif;
      color:#c6d4df;
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:${hasWarning ? '6px' : '2px'}">
        <span style="display:inline-flex;align-items:center;gap:8px;font-weight:700;color:#66c0f4;font-size:12.5px">
          ${ICONS.hourglass} Wait2Play Cart Guard
          <span style="background:${accent};color:#0b1016;padding:2px 10px;font-size:11px;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)">${escapeHtml(badgeText)}</span>
        </span>
        <span style="font-size:11px;color:#8f98a0">${results.length} item${results.length > 1 ? 's' : ''} scanned</span>
      </div>
      ${rowsHtml}
    </div>
  `;
}

let lastCartSignature = '';

export async function runSteamCartGuard(): Promise<void> {
  if (!isSteamCartPage(location.href)) return;
  const appLinks = findCartAppLinks();
  if (appLinks.size === 0) return;

  const sig = [...appLinks.keys()].sort((a, b) => a - b).join(',');
  if (sig === lastCartSignature) return;
  lastCartSignature = sig;

  const settings = await send({ type: 'getSettings' });
  if (!settings.sites.steam) return;

  const results: VerdictResult[] = [];
  for (const [appId, anchor] of [...appLinks.entries()].slice(0, 12)) {
    try {
      const res = await send({ type: 'evaluate', query: { steamAppId: appId } });
      if (res) {
        results.push(res);
        injectInlineCartPill(anchor, res);
      }
    } catch {
      // ignore individual item failure
    }
  }
  renderCartSummaryBanner(results);
}

const wishlistVerdictCache = new Map<number, VerdictResult>();
const wishlistInFlight = new Set<number>();
let wishlistQueueRunning = false;

export async function runSteamWishlistGuard(): Promise<void> {
  if (!isSteamWishlistPage(location.href) && !isSteamSearchOrSalePage(location.href)) return;
  const appLinks = findCartAppLinks();
  if (appLinks.size === 0) return;

  const unbadged: Array<[number, HTMLElement]> = [];
  for (const [appId, anchor] of appLinks.entries()) {
    const hasBadge = anchor.parentElement?.querySelector(`[data-w2p-cart-app="${appId}"]`);
    if (hasBadge) continue;
    const cached = wishlistVerdictCache.get(appId);
    if (cached) {
      injectInlineCartPill(anchor, cached);
      continue;
    }
    if (!wishlistInFlight.has(appId)) {
      unbadged.push([appId, anchor]);
    }
  }
  if (unbadged.length === 0 || wishlistQueueRunning) return;

  const settings = await send({ type: 'getSettings' });
  if (!settings.sites.steam) return;

  wishlistQueueRunning = true;
  try {
    // Throttle evaluations (4 per pass, 150ms apart) to avoid Steam/ITAD 429 rate limits.
    for (const [appId, anchor] of unbadged.slice(0, 4)) {
      wishlistInFlight.add(appId);
      const title = (anchor.textContent ?? '').trim() || undefined;
      try {
        const res = await send({ type: 'evaluate', query: { steamAppId: appId, title } });
        if (res) {
          wishlistVerdictCache.set(appId, res);
          const freshAnchor = findCartAppLinks().get(appId) ?? anchor;
          injectInlineCartPill(freshAnchor, res);
        }
      } catch {
        // ignore individual item failure
      } finally {
        wishlistInFlight.delete(appId);
      }
      await new Promise((r) => window.setTimeout(r, 150));
    }
  } finally {
    wishlistQueueRunning = false;
  }
}

export const runSteamSearchGuard = runSteamWishlistGuard;

export interface PickAndMixTier {
  minItems: number;
  perItemPrice: number;
  totalPrice: number;
  currency: string;
}

export function parsePickAndMixTiers(root: ParentNode = document): PickAndMixTier[] {
  const tiers: PickAndMixTier[] = [];
  const seenMin = new Set<number>();

  // 1. Fanatical Pick & Mix tier boxes (.PickAndMixTierBox)
  const boxes = root.querySelectorAll<HTMLElement>('.PickAndMixTierBox');
  for (const box of boxes) {
    const qtyText = box.querySelector('.PickAndMixTierBox__quantity')?.textContent ?? box.textContent ?? '';
    const priceText = box.querySelector('.PickAndMixTierBox__price')?.textContent ?? box.textContent ?? '';
    const qtyMatch = qtyText.match(/(\d+)\s*\+?\s*(?:games?|items?)/i);
    const parsedPrice = parsePriceWithCurrency(priceText);
    if (!qtyMatch || !parsedPrice || parsedPrice.value <= 0) continue;
    const minItems = Number(qtyMatch[1]);
    if (!Number.isFinite(minItems) || minItems < 1 || seenMin.has(minItems)) continue;
    seenMin.add(minItems);
    const isPerItem = /per\s*item|each|\/\s*game/i.test(priceText);
    const perItemPrice = isPerItem
      ? parsedPrice.value
      : Number((parsedPrice.value / minItems).toFixed(2));
    const totalPrice = isPerItem
      ? Number((parsedPrice.value * minItems).toFixed(2))
      : parsedPrice.value;
    tiers.push({
      minItems,
      perItemPrice,
      totalPrice,
      currency: parsedPrice.currency,
    });
  }

  return tiers.sort((a, b) => a.minItems - b.minItems);
}

interface BundleCardEntry {
  title: string;
  anchor: HTMLElement;
  card: HTMLElement;
}

const bundleTitleCache = new Map<string, VerdictResult>();
let bundleGuardRunning = false;
let dimOwnedActive = false;
let dimFillerActive = false;

function applyCardDimming(): void {
  const allCards = document.querySelectorAll<HTMLElement>('[data-w2p-card-state]');
  for (const card of allCards) {
    const st = card.getAttribute('data-w2p-card-state');
    const shouldDim = (st === 'owned' && dimOwnedActive) || (st === 'filler' && dimFillerActive);
    card.style.opacity = shouldDim ? '0.28' : '';
    card.style.filter = shouldDim ? 'grayscale(0.85)' : '';
    card.style.transition = 'opacity 0.18s ease, filter 0.18s ease';
  }
}

function findHumbleBundleCards(): Map<string, BundleCardEntry> {
  const map = new Map<string, BundleCardEntry>();
  // 1. New Humble Next.js bundle item cards
  const cards = document.querySelectorAll<HTMLElement>('[data-testid="bundle-item-card"]');
  for (const card of cards) {
    const titleEl =
      card.querySelector<HTMLElement>('.font-extrabold, h3, h4') ??
      card.querySelector<HTMLElement>('[data-state]');
    const imgAlt = card.querySelector<HTMLImageElement>('[data-testid="product-thumbnail"] img')?.alt?.trim();
    const title = (titleEl?.textContent?.trim() || imgAlt || '').replace(/Wait2Play:.*$/, '').replace(/\s+/g, ' ').trim();
    if (!title || title.length < 2 || /%\s*off|coupon|soundtrack\b/i.test(title)) continue;
    if (titleEl && !map.has(title.toLowerCase())) {
      map.set(title.toLowerCase(), { title, anchor: titleEl, card });
    }
  }
  // 2. Fanatical Pick-and-Mix cards (article.PickAndMixCard) — inject into always-visible .PickAndMixCard__cardContent
  if (map.size === 0) {
    const pnmCards = document.querySelectorAll<HTMLElement>('article.PickAndMixCard, .PickAndMixCard');
    for (const card of pnmCards) {
      const nameEl = card.querySelector<HTMLElement>('.card-product-name');
      const imgAlt = card.querySelector<HTMLImageElement>('img[alt]')?.alt?.trim();
      const title = (nameEl?.textContent?.trim() || imgAlt || '').replace(/Wait2Play:.*$/, '').replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2 || /%\s*off|coupon|soundtrack\b/i.test(title)) continue;
      const anchor =
        card.querySelector<HTMLElement>('.PickAndMixCard__topRowIcons') ??
        card.querySelector<HTMLElement>('.PickAndMixCard__cardContent') ??
        nameEl;
      if (anchor && !map.has(title.toLowerCase())) {
        map.set(title.toLowerCase(), { title, anchor, card });
      }
    }
  }
  // 3. Standard Fanatical Bundle cards (.bundle-game-card)
  if (map.size === 0) {
    const fanaticalCards = document.querySelectorAll<HTMLElement>(
      '.bundle-game-card .card-product-name, .card-product-name',
    );
    for (const el of fanaticalCards) {
      const title = (el.textContent ?? '').replace(/Wait2Play:.*$/, '').replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2 || /%\s*off|coupon|soundtrack\b/i.test(title)) continue;
      const card = el.closest<HTMLElement>('.bundle-game-card, article, .card') ?? el;
      if (!map.has(title.toLowerCase())) {
        map.set(title.toLowerCase(), { title, anchor: el, card });
      }
    }
  }
  // 4. Fallback for legacy Humble Bundle / Humble Choice markup
  if (map.size === 0) {
    const legacy = document.querySelectorAll<HTMLElement>(
      '.tier-item-view .item-title, .dd-image-box-caption, .content-choice-title',
    );
    for (const el of legacy) {
      const title = (el.textContent ?? '').replace(/Wait2Play:.*$/, '').replace(/\s+/g, ' ').trim();
      if (!title || title.length < 2 || /%\s*off|coupon/i.test(title)) continue;
      const card = el.closest<HTMLElement>('.tier-item-view, .dd-game-row, .content-choice') ?? el;
      if (!map.has(title.toLowerCase())) {
        map.set(title.toLowerCase(), { title, anchor: el, card });
      }
    }
  }
  return map;
}

function injectBundleCardPill(
  anchor: HTMLElement,
  res: VerdictResult,
  slotPrice: number | null = null,
  cardEl?: HTMLElement,
): void {
  const pillKey = String(res.facts.steamAppId ?? res.key);
  const existing = (cardEl ?? anchor.parentElement)?.querySelector(`[data-w2p-cart-app="${CSS.escape(pillKey)}"]`);
  if (existing) existing.remove();

  const freePct = Math.round(res.freebieProbability * 100);
  const low = res.facts.price.historicalLow ?? res.facts.price.current;
  const lowStr = low != null ? `Low $${low.toFixed(2)}` : '';
  const hltbStr = res.facts.hltbMainHours != null && res.facts.hltbMainHours > 0 ? `~${res.facts.hltbMainHours}h` : '';

  let label: string;
  let bg: string;
  const ink = '#0b1016';
  let cardState: 'owned' | 'filler' | 'top' | 'ok' = 'ok';

  if (res.verdict === 'OWNED' && res.owned[0]) {
    label = `Owned on ${res.owned[0].source.toUpperCase()}`;
    bg = '#ff4da6';
    cardState = 'owned';
  } else if (res.verdict === 'IN_SUBSCRIPTION') {
    label = 'In Subscription';
    bg = '#22c55e';
    cardState = 'owned';
  } else if (res.verdict === 'FREE_NOW' || res.verdict === 'FREE_SOON') {
    label = 'Free Right Now';
    bg = '#00e5ff';
    cardState = 'owned';
  } else if (slotPrice != null && slotPrice > 0 && low != null) {
    const diff = Number((low - slotPrice).toFixed(2));
    if (low <= slotPrice) {
      label = `⚠ Filler · Low $${low.toFixed(2)} (< $${slotPrice.toFixed(2)}/slot)`;
      bg = '#ffb800';
      cardState = 'filler';
    } else if (res.wishlisted) {
      label = `★ Wishlist Pick · Low $${low.toFixed(2)} (Saves $${diff.toFixed(2)})`;
      bg = '#a4d007';
      cardState = 'top';
    } else if (low >= slotPrice * 1.6 && freePct < 45) {
      label = `★ Top Pick · Low $${low.toFixed(2)} (Saves $${diff.toFixed(2)})`;
      bg = '#a4d007';
      cardState = 'top';
    } else {
      label = ['Worth Slot', lowStr, hltbStr].filter(Boolean).join(' · ');
      bg = '#38bdf8';
      cardState = 'ok';
    }
  } else if (res.wishlisted) {
    label = ['★ On Wishlist', lowStr, hltbStr].filter(Boolean).join(' · ');
    bg = '#a4d007';
    cardState = 'top';
  } else if (freePct >= 35) {
    label = ['Not Owned', lowStr, `${freePct}% freebie risk`].filter(Boolean).join(' · ');
    bg = '#ffb800';
  } else {
    label = ['Not Owned', lowStr || `${freePct}% freebie risk`, hltbStr].filter(Boolean).join(' · ');
    bg = '#38bdf8';
  }

  if (cardEl) {
    cardEl.setAttribute('data-w2p-card-state', cardState);
  }

  const pill = document.createElement('span');
  pill.setAttribute('data-w2p-cart-app', pillKey);
  pill.title = `Wait2Play: ${res.headline}`;
  pill.style.cssText = [
    'display:inline-flex',
    'align-items:center',
    'gap:5px',
    'margin:4px 0',
    'padding:2px 8px',
    `background:${bg}`,
    `color:${ink}`,
    'font-size:11px',
    'font-weight:700',
    'letter-spacing:0.02em',
    'clip-path:polygon(5px 0, 100% 0, calc(100% - 5px) 100%, 0 100%)',
    'vertical-align:middle',
    'white-space:nowrap',
    'max-width:100%',
    'overflow:hidden',
    'text-overflow:ellipsis',
  ].join(';');
  pill.textContent = `Wait2Play: ${label}`;
  anchor.insertAdjacentElement('afterend', pill);
}

function renderHumbleBundleSummaryBanner(
  results: VerdictResult[],
  totalDetected: number,
  tiers: PickAndMixTier[] = [],
): void {
  if (results.length === 0) return;
  const section =
    document.querySelector('[data-testid="bundle-item-section-games"]') ??
    document.querySelector(
      '.PickAndMixHits, .PickAndMixProductPage__tab__filters, .BundlePoints, .bundle-tiers-container, .pick-and-mix-container, .bundle-page .container, #game_area_purchase, .page_content, #main-content section, #main-content, main',
    );
  if (!section || !section.parentElement) return;

  let host = document.getElementById(CART_SUMMARY_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = CART_SUMMARY_ID;
    host.attachShadow({ mode: 'open' });
    section.parentElement.insertBefore(host, section);
  }

  const slotPrice = tiers[0]?.perItemPrice ?? null;
  const isByo = slotPrice != null && slotPrice > 0;

  const owned = results.filter((r) => r.verdict === 'OWNED');
  const inSub = results.filter((r) => r.verdict === 'IN_SUBSCRIPTION');
  const wishlisted = results.filter((r) => r.wishlisted && r.verdict !== 'OWNED');
  const unowned = results.filter((r) => r.verdict !== 'OWNED' && r.verdict !== 'IN_SUBSCRIPTION');
  const unownedHours = unowned.reduce((sum, r) => sum + (r.facts.hltbMainHours ?? 0), 0);
  const unownedLowTotal = unowned.reduce(
    (sum, r) => sum + (r.facts.price.historicalLow ?? r.facts.price.current ?? 0),
    0,
  );

  const fillerGames = isByo
    ? unowned.filter((r) => {
        const low = r.facts.price.historicalLow ?? r.facts.price.current;
        return low != null && low <= slotPrice!;
      })
    : [];

  const worthwhilePicks = isByo
    ? [...unowned]
        .filter((r) => {
          const low = r.facts.price.historicalLow ?? r.facts.price.current;
          return low == null || low > slotPrice!;
        })
        .sort((a, b) => {
          if (!!a.wishlisted !== !!b.wishlisted) return a.wishlisted ? -1 : 1;
          const lowA = a.facts.price.historicalLow ?? a.facts.price.current ?? 0;
          const lowB = b.facts.price.historicalLow ?? b.facts.price.current ?? 0;
          return lowB - lowA;
        })
    : [];

  let byoCalloutHtml = '';
  if (isByo && tiers.length > 0) {
    // Find best recommended tier where user has enough worthwhile unowned games
    const viableTiers = tiers.filter((t) => worthwhilePicks.length >= t.minItems);
    const bestTier = viableTiers[viableTiers.length - 1] ?? null;
    if (bestTier) {
      const topN = worthwhilePicks.slice(0, bestTier.minItems);
      const topNLows = topN.reduce(
        (s, r) => s + (r.facts.price.historicalLow ?? r.facts.price.current ?? bestTier.perItemPrice),
        0,
      );
      const saved = Math.max(0, Number((topNLows - bestTier.totalPrice).toFixed(2)));
      const picksList = topN
        .map((r, i) => {
          const low = r.facts.price.historicalLow ?? r.facts.price.current;
          return `${i + 1}. ${r.wishlisted ? '★ ' : ''}${r.facts.title}${low != null ? ` (Low $${low.toFixed(2)})` : ''}`;
        })
        .join(' · ');
      byoCalloutHtml = `
        <div style="background:#16202d;border-left:3px solid #a4d007;padding:7px 10px;margin:6px 0;font-size:12px;">
          <div><b style="color:#a4d007">Best Tier Call:</b> <b>${bestTier.minItems}+ Games Tier ($${bestTier.totalPrice.toFixed(2)} — $${bestTier.perItemPrice.toFixed(2)}/slot)</b> · Top ${bestTier.minItems} unowned picks total <b>$${topNLows.toFixed(2)}</b> at all-time lows (saves <b>$${saved.toFixed(2)}</b>).</div>
          <div style="color:#8f98a0;margin-top:3px;font-size:11.5px;"><b style="color:#c6d4df">Suggested slots:</b> ${escapeHtml(picksList)}</div>
        </div>
      `;
    } else if (results.length >= tiers[0]!.minItems) {
      byoCalloutHtml = `
        <div style="background:#16202d;border-left:3px solid #ffb800;padding:7px 10px;margin:6px 0;font-size:12px;">
          <b style="color:#ffb800">Tier Call:</b> Only <b>${worthwhilePicks.length}</b> unowned game(s) beat the <b>$${slotPrice!.toFixed(2)}/slot</b> entry price (${fillerGames.length} filler, ${owned.length + inSub.length} owned). Buying solo on sale is cheaper than filling a ${tiers[0]!.minItems}-game tier.
        </div>
      `;
    }
  }

  const accent =
    owned.length >= Math.ceil(results.length / 2)
      ? '#ff4da6'
      : wishlisted.length > 0 || worthwhilePicks.length >= (tiers[0]?.minItems ?? 99)
        ? '#a4d007'
        : '#c084fc';

  const summaryPills = [
    `${owned.length} of ${totalDetected} Already Owned`,
    ...(inSub.length > 0 ? [`${inSub.length} in Subscription`] : []),
    `${wishlisted.length} on Wishlist`,
    ...(isByo
      ? [`${worthwhilePicks.length} Worth Slot (>${`$${slotPrice!.toFixed(2)}`})`, `${fillerGames.length} Filler`]
      : unownedLowTotal > 0
        ? [`Unowned Lows Total: $${unownedLowTotal.toFixed(2)}`]
        : []),
    ...(unownedHours > 0 ? [`~${Math.round(unownedHours)}h new playtime`] : []),
  ].join(' · ');

  const highlightRows = [
    ...owned.map((r) => ({
      title: r.facts.title,
      tag: `Owned on ${(r.owned[0]?.source ?? 'Launcher').toUpperCase()}`,
      color: '#ff4da6',
    })),
    ...inSub.map((r) => ({
      title: r.facts.title,
      tag: 'In Your Subscription',
      color: '#22c55e',
    })),
    ...wishlisted.map((r) => ({
      title: r.facts.title,
      tag: '★ On Your Wishlist',
      color: '#a4d007',
    })),
  ].slice(0, 6);

  const rowsHtml =
    highlightRows.length > 0
      ? highlightRows
          .map(
            (item) =>
              `<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0;border-top:1px solid rgba(102,192,244,0.12);font-size:12px;">
                <span style="color:#fff;font-weight:600">${escapeHtml(item.title)}</span>
                <span style="color:${item.color};font-weight:700;white-space:nowrap">${escapeHtml(item.tag)}</span>
              </div>`,
          )
          .join('')
      : `<div style="font-size:12px;color:#8f98a0;margin-top:4px;">None of the ${results.length} scanned games in this bundle are marked as owned in your synced libraries.</div>`;

  const filterBtnsHtml = `
    <span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap">
      <button id="w2p-dim-owned-btn" style="background:${dimOwnedActive ? '#ff4da6' : '#16202d'};color:${dimOwnedActive ? '#0b1016' : '#c6d4df'};border:1px solid rgba(102,192,244,0.3);padding:2px 8px;font-size:11px;font-weight:600;cursor:pointer;">
        Dim Owned (${owned.length + inSub.length})
      </button>
      ${
        isByo
          ? `<button id="w2p-dim-filler-btn" style="background:${dimFillerActive ? '#ffb800' : '#16202d'};color:${dimFillerActive ? '#0b1016' : '#c6d4df'};border:1px solid rgba(102,192,244,0.3);padding:2px 8px;font-size:11px;font-weight:600;cursor:pointer;">
              Dim Filler &lt;$${slotPrice!.toFixed(2)} (${fillerGames.length})
            </button>`
          : ''
      }
      <span style="font-size:11px;color:#8f98a0">${results.length}/${totalDetected} analyzed</span>
    </span>
  `;

  host.shadowRoot!.innerHTML = `
    <div style="
      background:#101720;
      border:1px solid rgba(102,192,244,0.28);
      border-left:6px solid ${accent};
      clip-path:polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%);
      padding:12px 16px;
      margin:10px 0 16px;
      font-family:-apple-system,BlinkMacSystemFont,'Motiva Sans','Segoe UI',Roboto,sans-serif;
      color:#c6d4df;
    ">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:6px">
        <span style="display:inline-flex;align-items:center;gap:8px;font-weight:700;color:#66c0f4;font-size:13px;flex-wrap:wrap">
          ${ICONS.hourglass} ${isByo ? 'Wait2Play BYO Bundle Optimizer' : 'Wait2Play Bundle Analyzer'}
          <span style="background:${accent};color:#0b1016;padding:2px 10px;font-size:11px;clip-path:polygon(5px 0,100% 0,calc(100% - 5px) 100%,0 100%)">${escapeHtml(summaryPills)}</span>
        </span>
        ${filterBtnsHtml}
      </div>
      ${byoCalloutHtml}
      ${rowsHtml}
    </div>
  `;

  host.shadowRoot!.getElementById('w2p-dim-owned-btn')?.addEventListener('click', () => {
    dimOwnedActive = !dimOwnedActive;
    applyCardDimming();
    renderHumbleBundleSummaryBanner(results, totalDetected, tiers);
  });
  host.shadowRoot!.getElementById('w2p-dim-filler-btn')?.addEventListener('click', () => {
    dimFillerActive = !dimFillerActive;
    applyCardDimming();
    renderHumbleBundleSummaryBanner(results, totalDetected, tiers);
  });
}

export async function runHumbleBundleGuard(): Promise<void> {
  if (!isHumbleBundlePage(location.href) || bundleGuardRunning) return;
  const cards = findHumbleBundleCards();
  if (cards.size === 0) return;

  const settings = await send({ type: 'getSettings' });
  if (!settings.sites.humble) return;

  bundleGuardRunning = true;
  try {
    const isFanatical = isFanaticalBundlePage(location.href);
    const storeName = isFanatical ? 'Fanatical' : 'Humble Bundle';
    const tiers = parsePickAndMixTiers();
    const slotPrice = tiers[0]?.perItemPrice ?? null;

    const bundleHeading =
      document
        .querySelector(
          '[data-testid="bundle-pdp-right-rail"] h1, [data-testid="bundle-pdp-right-rail"] h2, h1.PickAndMixProductPage__content__title, h1.product-name, h1',
        )
        ?.textContent?.trim() ||
      document.title.replace(/\s*[|–-]\s*(Humble Bundle|Fanatical).*$/i, '').trim() ||
      storeName;
    const rawGamesList = [...cards.values()].map((c) => c.title).filter(Boolean);
    void send({
      type: 'recordLiveBundle',
      bundleTitle: bundleHeading,
      bundleUrl: location.href.split('?')[0] ?? location.href,
      store: storeName,
      price: tiers[0]?.totalPrice ?? null,
      games: rawGamesList,
    }).catch(() => {});

    const results: VerdictResult[] = [];
    const entries = [...cards.entries()].slice(0, 24);
    for (let i = 0; i < entries.length; i++) {
      const [normTitle, item] = entries[i]!;
      if (!isHumbleBundlePage(location.href)) return;
      let res = bundleTitleCache.get(normTitle) ?? null;
      if (!res) {
        try {
          res = await send({ type: 'evaluate', query: { title: item.title, platform: 'pc' } });
          if (res) bundleTitleCache.set(normTitle, res);
        } catch {
          // ignore
        }
        await new Promise((r) => window.setTimeout(r, 110));
      }
      if (res) {
        results.push(res);
        const fresh = findHumbleBundleCards().get(normTitle) ?? item;
        injectBundleCardPill(fresh.anchor, res, slotPrice, fresh.card);
      }
      if ((i + 1) % 4 === 0 || i === entries.length - 1) {
        if (isHumbleBundlePage(location.href)) {
          renderHumbleBundleSummaryBanner(results, cards.size, tiers);
          applyCardDimming();
        }
      }
    }
  } finally {
    bundleGuardRunning = false;
  }
}

let lastSteamBundleSig = '';

export async function runSteamBundleGuard(): Promise<void> {
  if (!isSteamBundlePage(location.href)) return;
  const appLinks = findCartAppLinks();
  if (appLinks.size === 0) return;

  const sig = [...appLinks.keys()].sort((a, b) => a - b).join(',');
  if (sig === lastSteamBundleSig) return;
  lastSteamBundleSig = sig;

  const settings = await send({ type: 'getSettings' });
  if (!settings.sites.steam) return;

  const results: VerdictResult[] = [];
  for (const [appId, anchor] of [...appLinks.entries()].slice(0, 12)) {
    try {
      const res = await send({ type: 'evaluate', query: { steamAppId: appId } });
      if (res) {
        results.push(res);
        injectBundleCardPill(anchor, res);
      }
    } catch {
      // ignore
    }
    await new Promise((r) => window.setTimeout(r, 120));
  }
  renderHumbleBundleSummaryBanner(results, appLinks.size);
}
