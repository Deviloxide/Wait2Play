import { SERVICE_LABEL } from '../core/history';
import { daysUntil } from '../core/seasonal';
import { fmtMoney, fmtUsd } from '../core/signals';
import { normalizeTitle } from '../core/titles';
import { KNOWN_GAME_HOURS } from '../data/genres';
import { send, type PageGameRequest } from '../shared/messages';
import type { GameQuery, LibrarySource, SearchHit, SeasonalOverview, VerdictResult } from '../shared/types';
import { ICONS, VERDICT_META, escapeHtml, formatVerdictSummary, renderSignalMeter } from '../shared/verdictUi';

const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const searchResults = document.getElementById('search-results') as HTMLUListElement;
const verdictRoot = document.getElementById('verdict-root') as HTMLElement;
const seasonalRoot = document.getElementById('seasonal-root') as HTMLElement;
const steamOnboardRoot = document.getElementById('steam-onboard-root') as HTMLElement;
const openOptionsBtn = document.getElementById('open-options') as HTMLButtonElement;

const KEY_ONBOARD_DISMISSED = 'w2p:onboardDismissed';

openOptionsBtn.addEventListener('click', () => {
  void chrome.runtime.openOptionsPage();
});

function renderVerdict(res: VerdictResult): void {
  const meta = VERDICT_META[res.verdict];
  const freePct = Math.round(res.freebieProbability * 100);
  const bundlePct = Math.round(res.bundleProbability * 100);
  const isConsole = res.facts.platform === 'console';
  const fmt = (n: number) => fmtMoney(n, res.facts.price.currency);
  const priceStr = res.facts.price.current != null ? fmt(res.facts.price.current) : '—';
  const lowStr =
    res.facts.price.historicalLow != null ? `All-time low ${fmt(res.facts.price.historicalLow)}` : 'No low data';
  const pubStr = res.facts.publishers.join(', ') || res.facts.developers.join(', ') || 'Unknown publisher';
  const hltbHours = res.facts.hltbMainHours ?? KNOWN_GAME_HOURS[normalizeTitle(res.facts.title)];
  const hltbTag = hltbHours && hltbHours > 0 ? ` · ~${hltbHours}h to beat` : '';
  const appTag = isConsole
    ? ` · ${res.facts.platformLabel ?? 'Console'}${hltbTag}`
    : res.facts.steamAppId
      ? ` · Steam #${res.facts.steamAppId}${hltbTag}`
      : hltbTag;

  const signalsHtml = res.signals
    .map(
      (s) => `
      <li class="sig-row">
        <div>
          <div class="sig-name">${escapeHtml(s.label)}</div>
          <div class="sig-desc">${escapeHtml(s.detail)}</div>
        </div>
        ${renderSignalMeter(s.weight, s.bundleWeight)}
      </li>
    `,
    )
    .join('');

  const appearancesHtml =
    res.priorAppearances.length > 0
      ? `
        <div class="section-title">Past Giveaways, Bundles &amp; Subscriptions (${res.priorAppearances.length})</div>
        <ul class="sig-list">
          ${res.priorAppearances
            .slice(0, 6)
            .map(
              (a) => `
              <li class="sig-row">
                <span class="sig-name">${escapeHtml(a.note ?? SERVICE_LABEL[a.service])}</span>
                <span style="font-family:ui-monospace,monospace;font-size:11px;color:#8f98a0">${escapeHtml(a.start.slice(0, 10))}</span>
              </li>
            `,
            )
            .join('')}
        </ul>
      `
      : '';

  const linksHtml = res.links
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}<span class="arr">↗</span></a>`,
    )
    .join('');

  const sv = res.savings;
  const tonightReadout = sv
    ? res.playTonight
      ? `Waiting ${sv.horizonMonths} mo only saves ~<b>${fmt(sv.expectedSavings)}</b>`
      : `Waiting ${sv.horizonMonths} mo saves ~<b>${fmt(sv.expectedSavings)}</b> (est. <b>${fmt(sv.expectedPrice)}</b>)`
    : '';

  const liveBundle = !isConsole ? res.facts.liveBundles?.[0] : undefined;
  const liveBundlePriceStr =
    liveBundle?.price != null ? ` · ${fmtMoney(liveBundle.price, liveBundle.currency ?? res.facts.price.currency)} tier` : '';
  const liveBundleGamesStr =
    liveBundle?.gamesCount != null && liveBundle.gamesCount > 1 ? ` · ${liveBundle.gamesCount} games` : '';

  verdictRoot.innerHTML = `
    <div class="w2p-card" style="--accent:${meta.accent};--accent-ink:${meta.ink}">
      <div class="v-header">
        <div>
          <div class="v-title">
            ${escapeHtml(res.facts.title)}
            ${res.wishlisted ? `<span class="wishlist-tag" title="On your synced Steam Wishlist">★ Wishlisted</span>` : ''}
          </div>
          <div class="v-sub">${escapeHtml(pubStr)}${escapeHtml(appTag)}</div>
        </div>
        <span class="w2p-verdict-badge">${escapeHtml(meta.shortLabel)}</span>
      </div>

      <div class="w2p-stat-grid">
        <div class="w2p-stat-cell" title="90-day Giveaway &amp; Subscription Risk Score (0–100%)">
          <span class="w2p-stat-label">90d Giveaway Risk</span>
          <span class="w2p-stat-value">${freePct}%</span>
        </div>
        <div class="w2p-stat-cell" title="${isConsole ? 'PC bundle risk score is muted on console pages' : liveBundle ? `Currently active in ${liveBundle.title} (${liveBundle.store})` : '90-day PC Bundle &amp; Humble Choice Risk Score (0–100%)'}">
          <span class="w2p-stat-label">${liveBundle ? 'Active Bundle' : '90d Bundle Risk'}</span>
          <span class="w2p-stat-value">${isConsole ? '—' : `${bundlePct}%`}</span>
        </div>
        <div class="w2p-stat-cell">
          <span class="w2p-stat-label">Best Price</span>
          <span class="w2p-stat-value">${escapeHtml(priceStr)}</span>
          <span class="w2p-best-price-sub">${escapeHtml(lowStr)}</span>
        </div>
      </div>

      <div class="v-headline">${escapeHtml(res.headline)}</div>

      ${
        liveBundle
          ? `<div class="w2p-backlog-strip" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;color:#f3e8ff;border-image:repeating-linear-gradient(-45deg,#c084fc,#c084fc 4px,#101720 4px,#101720 8px) 12">
              <span><span class="w2p-strip-tag" style="color:#c084fc">Live Bundle:</span><b>${escapeHtml(liveBundle.title)}</b> on ${escapeHtml(liveBundle.store)}${escapeHtml(liveBundlePriceStr)}${escapeHtml(liveBundleGamesStr)}</span>
              <a href="${escapeHtml(liveBundle.url)}" target="_blank" rel="noopener noreferrer" style="color:#c084fc;font-weight:700;text-decoration:none;white-space:nowrap">Open bundle ↗</a>
            </div>`
          : ''
      }

      ${
        res.backlog
          ? `<div class="w2p-backlog-strip"><span class="w2p-strip-tag">Backlog Tax:</span>${escapeHtml(res.backlog.message)}</div>`
          : ''
      }

      ${
        sv
          ? `
        <div class="tonight-bar">
          <label class="w2p-toggle-wrapper ${res.playTonight ? 'is-checked' : ''}">
            <input type="checkbox" class="switch-input" id="tonight-toggle" ${res.playTonight ? 'checked' : ''} />
            <span class="switch-track"><span class="switch-thumb"></span></span>
            <span class="w2p-toggle-label">Playing tonight</span>
          </label>
          <span class="tonight-readout">${tonightReadout}</span>
        </div>
      `
          : ''
      }

      <div class="section-title">Giveaway &amp; Bundle Signals</div>
      <ul class="sig-list">${signalsHtml}</ul>

      ${appearancesHtml}

      <div class="util-row">
        <div class="util-left">
          <button class="util-btn" id="popup-mark-owned-btn">+ Mark owned</button>
          <span class="owned-picker" id="popup-owned-picker">
            <button class="src-chip" data-src="epic">Epic</button>
            <button class="src-chip" data-src="gog">GOG</button>
            <button class="src-chip" data-src="amazon">Prime</button>
            <button class="src-chip" data-src="steam">Steam</button>
            <button class="src-chip" data-src="ea">EA</button>
            <button class="src-chip" data-src="ubisoft">Ubisoft</button>
          </span>
          <span style="color:#8f98a0;opacity:0.4">·</span>
          <button class="util-btn" id="popup-copy-btn">Copy summary</button>
        </div>
        <div class="link-row" style="margin-top:0">${linksHtml}</div>
      </div>
    </div>
  `;

  const toggle = document.getElementById('tonight-toggle') as HTMLInputElement | null;
  toggle?.addEventListener('change', async () => {
    const updated = await send({ type: 'setPlayTonight', key: res.key, value: toggle.checked });
    if (updated) renderVerdict(updated);
  });

  const markOwnedBtn = document.getElementById('popup-mark-owned-btn');
  const ownedPicker = document.getElementById('popup-owned-picker');
  markOwnedBtn?.addEventListener('click', () => {
    ownedPicker?.classList.toggle('open');
  });

  verdictRoot.querySelectorAll<HTMLButtonElement>('.src-chip').forEach((chip) => {
    chip.addEventListener('click', async () => {
      const source = (chip.dataset.src ?? 'epic') as LibrarySource;
      const updated = await send({
        type: 'markOwned',
        source,
        title: res.facts.title,
        steamAppId: res.facts.steamAppId ?? undefined,
        key: res.key,
      });
      if (updated) renderVerdict(updated);
    });
  });

  const copyBtn = document.getElementById('popup-copy-btn');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(formatVerdictSummary(res));
      if (copyBtn) {
        copyBtn.textContent = 'Copied ✓';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy summary';
        }, 1600);
      }
    } catch {
      // ignore
    }
  });
}

function renderEmptyState(): void {
  verdictRoot.innerHTML = `
    <div class="empty-state">
      <div>Search for any game above, or open a product page on Steam, GOG, Epic, Humble, GG.deals, or IsThereAnyDeal.</div>
      <div class="quick-picks">
        <button class="quick-chip" data-app="1145360">Hades</button>
        <button class="quick-chip" data-app="289070">Civilization VI</button>
        <button class="quick-chip" data-app="379430">Kingdom Come: Deliverance</button>
        <button class="quick-chip" data-app="427520">Factorio</button>
      </div>
    </div>
  `;
  verdictRoot.querySelectorAll<HTMLButtonElement>('.quick-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const appId = Number(btn.dataset.app);
      void loadVerdict({ steamAppId: appId, title: btn.textContent ?? undefined });
    });
  });
}

async function loadVerdict(query: GameQuery): Promise<void> {
  searchResults.hidden = true;
  verdictRoot.innerHTML = `<div class="empty-state">Checking prices &amp; giveaway history for <b>${escapeHtml(query.title ?? `Steam #${query.steamAppId}`)}</b>…</div>`;
  try {
    const res = await send({ type: 'evaluate', query });
    if (!res) {
      verdictRoot.innerHTML = `<div class="empty-state">Couldn't find pricing data for "${escapeHtml(query.title ?? '')}".</div>`;
      return;
    }
    renderVerdict(res);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    verdictRoot.innerHTML = `<div class="empty-state">Error: ${escapeHtml(msg)}</div>`;
  }
}

function renderSearchHits(hits: SearchHit[]): void {
  if (hits.length === 0) {
    searchResults.hidden = true;
    return;
  }
  searchResults.innerHTML = hits
    .map(
      (h, idx) => `
      <li data-idx="${idx}">
        <span class="hit-title">${escapeHtml(h.title)}</span>
        <span class="hit-price">${h.cheapest != null ? fmtUsd(h.cheapest) : ''}</span>
      </li>
    `,
    )
    .join('');
  searchResults.hidden = false;

  searchResults.querySelectorAll<HTMLLIElement>('li').forEach((li) => {
    li.addEventListener('click', () => {
      const hit = hits[Number(li.dataset.idx)];
      if (!hit) return;
      searchInput.value = hit.title;
      void loadVerdict({ steamAppId: hit.steamAppId ?? undefined, title: hit.title });
    });
  });
}

let searchTimer: number | undefined;
searchInput.addEventListener('input', () => {
  window.clearTimeout(searchTimer);
  const q = searchInput.value.trim();
  if (q.length < 2) {
    searchResults.hidden = true;
    return;
  }
  searchTimer = window.setTimeout(async () => {
    try {
      const hits = await send({ type: 'search', query: q });
      renderSearchHits(hits);
    } catch {
      searchResults.hidden = true;
    }
  }, 220);
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  void loadVerdict({ title: q });
});

function renderSeasonal(ov: SeasonalOverview): void {
  const now = Date.now();
  const epicDays = daysUntil(ov.nextEpicDrop, now);
  const choiceDays = daysUntil(ov.nextHumbleChoice, now);
  const windows = [...ov.active, ...ov.upcoming.slice(0, 2)];

  const liveHtml =
    ov.liveEpic.length > 0
      ? ov.liveEpic
          .map((l) => {
            const svcLabel = SERVICE_LABEL[l.record.service] ?? 'Store';
            const statusText =
              l.status === 'current' ? `Free now on ${svcLabel}` : `Free ${l.record.start.slice(0, 10)} (${svcLabel})`;
            return `
            <div class="radar-row">
              <span class="radar-left">
                <span class="radar-icon">${ICONS.gift}</span>
                <b>${escapeHtml(l.record.title)}</b>
                ${l.wishlisted ? `<span class="wishlist-tag">★ On your Wishlist</span>` : ''}
              </span>
              <span style="color:#00e5ff;font-size:11px;white-space:nowrap">${escapeHtml(statusText)}</span>
            </div>
          `;
          })
          .join('')
      : '';

  const winHtml = windows
    .map((w) => {
      const active = now >= w.start && now <= w.end;
      const status = active ? 'Active now' : `in ~${daysUntil(w.start, now)}d`;
      const icon = w.kind === 'giveaway' ? ICONS.calendar : ICONS.tag;
      return `
        <div class="radar-row" title="${escapeHtml(w.advice)}">
          <span class="radar-left"><span class="radar-icon">${icon}</span>${escapeHtml(w.name)}</span>
          <span style="color:#8f98a0;font-size:11px">${status}</span>
        </div>
      `;
    })
    .join('');

  const liveBundles = ov.liveBundles ?? [];
  const liveBundlesHtml =
    liveBundles.length > 0
      ? `
        <div class="section-title">Live PC Bundles (${liveBundles.length})</div>
        <div class="radar-card">
          ${liveBundles
            .map((b) => {
              const priceStr = b.minPrice != null ? `from ${fmtMoney(b.minPrice, b.currency)}` : b.store;
              const gamesText = b.sampleGames.slice(0, 3).join(', ');
              const wishlistBadge =
                b.wishlistedGames.length > 0
                  ? `<span class="wishlist-tag" title="Includes wishlisted: ${escapeHtml(b.wishlistedGames.join(', '))}">★ Wishlist: ${escapeHtml(b.wishlistedGames[0])}${b.wishlistedGames.length > 1 ? ` +${b.wishlistedGames.length - 1}` : ''}</span>`
                  : '';
              return `
                <div class="radar-row" title="${escapeHtml(`${b.store} · ${b.gamesCount} games (${gamesText})`)}">
                  <span class="radar-left" style="flex-wrap:wrap">
                    <span class="radar-icon" style="color:#c084fc">${ICONS.tag}</span>
                    <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" style="color:#c6d4df;text-decoration:none;font-weight:600">${escapeHtml(b.title)}</a>
                    <span style="color:#8f98a0;font-size:11px">(${escapeHtml(b.store)} · ${b.gamesCount} games)</span>
                    ${wishlistBadge}
                  </span>
                  <a href="${escapeHtml(b.url)}" target="_blank" rel="noopener noreferrer" style="color:#c084fc;font-size:11px;font-weight:700;text-decoration:none;white-space:nowrap">${escapeHtml(priceStr)} ↗</a>
                </div>
              `;
            })
            .join('')}
        </div>
      `
      : '';

  seasonalRoot.innerHTML = `
    ${liveBundlesHtml}
    <div class="section-title">Upcoming Giveaways &amp; Sales</div>
    <div class="radar-card">
      ${liveHtml}
      <div class="radar-row">
        <span class="radar-left"><span class="radar-icon">${ICONS.calendar}</span>Next Epic Thursday rotation</span>
        <span style="color:#8f98a0;font-size:11px">${epicDays === 0 ? 'Today' : `in ${epicDays}d`}</span>
      </div>
      <div class="radar-row">
        <span class="radar-left"><span class="radar-icon">${ICONS.calendar}</span>Next Humble Choice drop</span>
        <span style="color:#8f98a0;font-size:11px">${choiceDays === 0 ? 'Today' : `in ${choiceDays}d`}</span>
      </div>
      ${winHtml}
    </div>
  `;
}

async function initSteamOnboardingStrip(): Promise<void> {
  try {
    const dismissed = (await chrome.storage.local.get(KEY_ONBOARD_DISMISSED))[KEY_ONBOARD_DISMISSED];
    if (dismissed) return;
    const stats = await send({ type: 'getLibraryStats' });
    if (stats.steamSync) return;

    steamOnboardRoot.hidden = false;
    steamOnboardRoot.innerHTML = `
      <div class="onboard-row">
        <span>Sync your Steam library &amp; wishlist in 1 click (no API key needed)</span>
        <span class="onboard-actions">
          <button class="onboard-sync-btn" id="onboard-sync-btn">Sync Steam</button>
          <button class="onboard-dismiss-btn" id="onboard-dismiss-btn" title="Dismiss">×</button>
        </span>
      </div>
    `;

    const syncBtn = document.getElementById('onboard-sync-btn') as HTMLButtonElement | null;
    const dismissBtn = document.getElementById('onboard-dismiss-btn') as HTMLButtonElement | null;

    syncBtn?.addEventListener('click', async () => {
      syncBtn.disabled = true;
      syncBtn.textContent = 'Syncing…';
      try {
        const res = await send({ type: 'syncSteamSession' });
        steamOnboardRoot.innerHTML = `<div class="onboard-row"><span style="color:#a4d007;font-weight:600">Synced ${res.count} Steam games &amp; ${res.wishlistCount} wishlist items ✓</span></div>`;
        window.setTimeout(() => {
          steamOnboardRoot.hidden = true;
        }, 2500);
      } catch {
        void chrome.runtime.openOptionsPage();
      }
    });

    dismissBtn?.addEventListener('click', () => {
      steamOnboardRoot.hidden = true;
      void chrome.storage.local.set({ [KEY_ONBOARD_DISMISSED]: true });
    });
  } catch {
    // ignore
  }
}

async function detectActiveTabGame(): Promise<GameQuery | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url) return null;
    const resp = (await chrome.tabs.sendMessage(tab.id, { type: 'getPageGame' } satisfies PageGameRequest)) as GameQuery | null;
    if (resp) return resp;
    const m = tab.url.match(/^https:\/\/store\.steampowered\.com\/app\/(\d+)/);
    if (m) return { steamAppId: Number(m[1]) };
    return null;
  } catch {
    return null;
  }
}

async function init(): Promise<void> {
  void initSteamOnboardingStrip();
  send({ type: 'getSeasonal' }).then(renderSeasonal).catch(() => {});
  const pageQuery = await detectActiveTabGame();
  if (pageQuery) {
    await loadVerdict(pageQuery);
  } else {
    renderEmptyState();
  }
}

void init();
