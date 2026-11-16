import { send, type PageGameRequest } from '../shared/messages';
import {
  isHumbleBundlePage,
  isSteamBundlePage,
  isSteamCartPage,
  isSteamSearchOrSalePage,
  isSteamWishlistPage,
  runHumbleBundleGuard,
  runSteamBundleGuard,
  runSteamCartGuard,
  runSteamWishlistGuard,
} from './cartGuard';
import { detectCurrentPage } from './detectors';
import { removeVerdictBadge, renderLoadingBadge, renderVerdictBadge } from './widget';

let currentUrl = '';
let lastPriceSignature = '';
let retryTimer1: number | undefined;
let retryTimer2: number | undefined;

async function evaluateAndRender(isRetry = false): Promise<void> {
  const urlAtStart = location.href;

  if (isSteamCartPage(urlAtStart)) {
    document.getElementById('wait2play-host')?.remove();
    void runSteamCartGuard().catch(() => {});
    return;
  }
  if (isSteamBundlePage(urlAtStart)) {
    document.getElementById('wait2play-host')?.remove();
    void runSteamBundleGuard().catch(() => {});
    return;
  }
  if (isSteamWishlistPage(urlAtStart) || isSteamSearchOrSalePage(urlAtStart)) {
    removeVerdictBadge();
    void runSteamWishlistGuard().catch(() => {});
    return;
  }
  if (isHumbleBundlePage(urlAtStart)) {
    document.getElementById('wait2play-host')?.remove();
    void runHumbleBundleGuard().catch(() => {});
    return;
  }

  const detected = detectCurrentPage(urlAtStart);
  if (!detected) {
    removeVerdictBadge();
    void send({ type: 'setBadge', verdict: null }).catch(() => {});
    return;
  }
  const sig = `${detected.query.pageCurrentPrice ?? ''}|${detected.query.pageHistoricalLow ?? ''}|${detected.query.pageCurrency ?? ''}|${detected.query.platform ?? ''}`;
  const hasHost = !!document.getElementById('wait2play-host');
  if (isRetry && hasHost && sig === lastPriceSignature) return;
  lastPriceSignature = sig;

  try {
    const settings = await send({ type: 'getSettings' });
    if (location.href !== urlAtStart) return;
    if (!settings.sites[detected.siteKey]) {
      removeVerdictBadge();
      return;
    }

    const anchor = detected.findAnchor();
    if (anchor && !isRetry) renderLoadingBadge(anchor, detected.siteKey, detected.query.title);

    const verdict = await send({ type: 'evaluate', query: detected.query });
    if (location.href !== urlAtStart) return;
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
  } else if (isSteamBundlePage(location.href)) {
    void runSteamBundleGuard().catch(() => {});
  } else if (isSteamWishlistPage(location.href) || isSteamSearchOrSalePage(location.href)) {
    void runSteamWishlistGuard().catch(() => {});
  } else if (isHumbleBundlePage(location.href)) {
    void runHumbleBundleGuard().catch(() => {});
  }
  if (location.href === currentUrl) return;
  currentUrl = location.href;
  lastPriceSignature = '';
  window.clearTimeout(retryTimer1);
  window.clearTimeout(retryTimer2);
  removeVerdictBadge();
  void send({ type: 'setBadge', verdict: null }).catch(() => {});
  void evaluateAndRender(false);
  // Re-check after 900ms and 2200ms in case slow SPAs (Epic, Humble, ITAD, Steam Cart) finish hydrating later.
  retryTimer1 = window.setTimeout(() => {
    void evaluateAndRender(true);
  }, 900);
  retryTimer2 = window.setTimeout(() => {
    void evaluateAndRender(true);
  }, 2200);
}

// Listen for popup queries asking what game the active tab is showing.
chrome.runtime.onMessage.addListener((msg: PageGameRequest, _sender, sendResponse) => {
  if (msg?.type === 'getPageGame') {
    const det = detectCurrentPage(location.href);
    sendResponse(det?.query ?? null);
  }
  return false;
});

checkUrlChange();
window.addEventListener('popstate', () => checkUrlChange());
window.setInterval(() => checkUrlChange(), 600);
// Handle SPA navigation on Humble / ITAD / Steam Cart.
const observer = new MutationObserver(() => checkUrlChange());
observer.observe(document.documentElement, { childList: true, subtree: true });
