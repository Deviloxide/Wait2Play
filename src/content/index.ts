import { send, type PageGameRequest } from '../shared/messages';
import type { GameQuery } from '../shared/types';
import { isSteamCartPage, isSteamWishlistPage, runSteamCartGuard, runSteamWishlistGuard } from './cartGuard';
import { detectCurrentPage } from './detectors';
import { renderLoadingBadge, renderVerdictBadge } from './widget';

let currentUrl = '';
let currentQuery: GameQuery | null = null;
let lastPriceSignature = '';

async function evaluateAndRender(isRetry = false): Promise<void> {
  if (isSteamCartPage(location.href)) {
    void runSteamCartGuard().catch(() => {});
    return;
  }
  if (isSteamWishlistPage(location.href)) {
    void runSteamWishlistGuard().catch(() => {});
    return;
  }

  const detected = detectCurrentPage(location.href);
  if (!detected) {
    currentQuery = null;
    void send({ type: 'setBadge', verdict: null }).catch(() => {});
    return;
  }
  currentQuery = detected.query;
  const sig = `${detected.query.pageCurrentPrice ?? ''}|${detected.query.pageHistoricalLow ?? ''}|${detected.query.pageCurrency ?? ''}|${detected.query.platform ?? ''}`;
  if (isRetry && sig === lastPriceSignature) return;
  lastPriceSignature = sig;

  try {
    const settings = await send({ type: 'getSettings' });
    if (!settings.sites[detected.siteKey]) return;

    const anchor = detected.findAnchor();
    if (anchor && !isRetry) renderLoadingBadge(anchor, detected.siteKey, detected.query.title);

    const verdict = await send({ type: 'evaluate', query: detected.query });
    if (!verdict) return;

    const freshAnchor = detected.findAnchor() ?? anchor;
    if (freshAnchor) renderVerdictBadge(freshAnchor, detected.siteKey, verdict);
    void send({
      type: 'setBadge',
      verdict: verdict.verdict,
      freebieProbability: verdict.freebieProbability,
    }).catch(() => {});
  } catch {
    // Fail quietly on store pages if offline or extension reloaded.
  }
}

function checkUrlChange(): void {
  if (isSteamCartPage(location.href)) {
    void runSteamCartGuard().catch(() => {});
  } else if (isSteamWishlistPage(location.href)) {
    void runSteamWishlistGuard().catch(() => {});
  }
  if (location.href === currentUrl) return;
  currentUrl = location.href;
  lastPriceSignature = '';
  void evaluateAndRender(false);
  // Re-check once after 900ms in case an SPA (like ITAD or Steam React Cart) rendered its DOM asynchronously.
  window.setTimeout(() => {
    void evaluateAndRender(true);
  }, 900);
}

// Listen for popup queries asking what game the active tab is showing.
chrome.runtime.onMessage.addListener((msg: PageGameRequest, _sender, sendResponse) => {
  if (msg?.type === 'getPageGame') {
    const det = detectCurrentPage(location.href);
    sendResponse(det?.query ?? currentQuery ?? null);
  }
  return false;
});

checkUrlChange();
// Handle SPA navigation on Humble / ITAD / Steam Cart.
const observer = new MutationObserver(() => checkUrlChange());
observer.observe(document.documentElement, { childList: true, subtree: true });
