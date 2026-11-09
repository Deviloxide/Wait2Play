import { send } from '../shared/messages';
import type { VerdictResult } from '../shared/types';
import { ICONS, VERDICT_META, escapeHtml } from '../shared/verdictUi';

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

function findCartAppLinks(): Map<number, HTMLAnchorElement> {
  const map = new Map<number, HTMLAnchorElement>();
  const root =
    document.querySelector('.page_content_ctn, .page_content, #cart_status_data, #wishlist_ctn, main, [role="main"]') ??
    document.body;
  const anchors = root.querySelectorAll<HTMLAnchorElement>('a[href*="/app/"]');
  for (const a of anchors) {
    // Skip global nav / footer / hover menus
    if (a.closest('#global_header, #footer, .supernav_content, #store_nav_area')) continue;
    const m = a.href.match(/\/app\/(\d+)/);
    if (!m) continue;
    const appId = Number(m[1]);
    const text = (a.textContent ?? '').trim();
    if (!text) continue;
    // Prefer the anchor that actually contains the game's title text
    if (!map.has(appId) || text.length > (map.get(appId)?.textContent?.trim().length ?? 0)) {
      map.set(appId, a);
    }
  }
  return map;
}

function injectInlineCartPill(anchor: HTMLAnchorElement, res: VerdictResult): void {
  const existing = anchor.parentElement?.querySelector(`[data-w2p-cart-app="${res.facts.steamAppId}"]`);
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
  pill.setAttribute('data-w2p-cart-app', String(res.facts.steamAppId ?? ''));
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
  const firstLink = findCartAppLinks().values().next().value as HTMLAnchorElement | undefined;
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

export async function runSteamWishlistGuard(): Promise<void> {
  if (!isSteamWishlistPage(location.href)) return;
  const appLinks = findCartAppLinks();
  if (appLinks.size === 0) return;

  const unbadged: Array<[number, HTMLAnchorElement]> = [];
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
  if (unbadged.length === 0) return;

  const settings = await send({ type: 'getSettings' });
  if (!settings.sites.steam) return;

  for (const [appId, anchor] of unbadged.slice(0, 8)) {
    wishlistInFlight.add(appId);
    const title = (anchor.textContent ?? '').trim() || undefined;
    void send({ type: 'evaluate', query: { steamAppId: appId, title } })
      .then((res) => {
        if (res) {
          wishlistVerdictCache.set(appId, res);
          const freshAnchor = findCartAppLinks().get(appId) ?? anchor;
          injectInlineCartPill(freshAnchor, res);
        }
      })
      .catch(() => {})
      .finally(() => {
        wishlistInFlight.delete(appId);
      });
  }
}
