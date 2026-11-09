import { fmtMoney } from '../core/signals';
import { normalizeTitle } from '../core/titles';
import { KNOWN_GAME_HOURS } from '../data/genres';
import { send } from '../shared/messages';
import type { LibrarySource, Settings, VerdictResult } from '../shared/types';
import {
  ICONS,
  SITE_THEMES,
  VERDICT_META,
  escapeHtml,
  formatVerdictSummary,
  renderSignalMeter,
} from '../shared/verdictUi';

const HOST_ID = 'wait2play-host';

const STYLES = `
:host {
  all: initial;
  display: block;
  margin: 12px 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Motiva Sans', 'Segoe UI', Roboto, system-ui, sans-serif;
  color: var(--w2p-text, #c6d4df);
  line-height: 1.45;
}
* {
  box-sizing: border-box;
}
.w2p-card {
  position: relative;
  background: var(--w2p-bg, #101720);
  border: 1px solid var(--w2p-grid-strong, rgba(102, 192, 244, 0.28));
  border-left: 6px solid var(--accent, #ffb800);
  border-radius: var(--w2p-radius, 0px);
  clip-path: var(--w2p-clip, polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%));
  padding: 13px 16px 12px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.45);
  font-size: 13px;
}
.w2p-card::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: repeating-linear-gradient(
    -45deg,
    var(--accent, #ffb800),
    var(--accent, #ffb800) 4px,
    rgba(11, 16, 22, 0.45) 4px,
    rgba(11, 16, 22, 0.45) 8px
  );
  pointer-events: none;
}

/* Header Stamp */
.w2p-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.w2p-brand-group {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.w2p-stamp {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--w2p-ink, #66c0f4);
}
.w2p-verdict-badge {
  background: var(--accent, #ffb800);
  color: var(--accent-ink, #0b1016);
  font-weight: 700;
  font-size: 11.5px;
  letter-spacing: 0.03em;
  padding: 3px 12px;
  clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
}
.w2p-wishlist-tag {
  font-size: 11px;
  font-weight: 600;
  color: #66c0f4;
  background: rgba(102, 192, 244, 0.12);
  padding: 2px 7px;
}
.w2p-sys-id {
  font-size: 11px;
  color: var(--w2p-muted, #8f98a0);
}

/* Exposed 3-Column Telemetry Grid + Action Cell */
.w2p-stat-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  border-top: 1px solid var(--w2p-grid, rgba(102, 192, 244, 0.18));
  border-bottom: 1px solid var(--w2p-grid, rgba(102, 192, 244, 0.18));
  margin: 10px 0 9px;
}
.w2p-stat-grid::before,
.w2p-stat-grid::after {
  content: '+';
  position: absolute;
  font-family: ui-monospace, monospace;
  font-size: 10px;
  line-height: 1;
  color: var(--w2p-ink, #66c0f4);
  opacity: 0.55;
  pointer-events: none;
}
.w2p-stat-grid::before {
  top: -6px;
  left: -2px;
}
.w2p-stat-grid::after {
  bottom: -6px;
  right: -2px;
}
.w2p-stat-cell {
  padding: 7px 12px 6px 0;
  border-right: 1px solid var(--w2p-grid, rgba(102, 192, 244, 0.18));
  min-width: 0;
}
.w2p-stat-cell:not(:first-child) {
  padding-left: 12px;
}
.w2p-stat-label {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--w2p-ink, #66c0f4);
  display: block;
  margin-bottom: 2px;
  white-space: nowrap;
}
.w2p-stat-value {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
  display: block;
}
.w2p-best-price-sub {
  display: block;
  white-space: nowrap;
  font-size: 11px;
  color: var(--w2p-muted, #8f98a0);
  margin-top: 2px;
}
.w2p-expand-cell {
  display: flex;
  align-items: center;
  padding-left: 12px;
}
.w2p-expand-btn {
  all: unset;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--w2p-ink, #66c0f4);
  padding: 6px 8px;
  white-space: nowrap;
  transition: color 0.12s, background 0.12s;
}
.w2p-expand-btn:hover {
  color: #ffffff;
  background: rgba(102, 192, 244, 0.12);
}

/* Headline & Compact Strips */
.w2p-headline {
  color: #e8f0f7;
  font-size: 13px;
  margin: 4px 0 6px;
}
.w2p-seasonal-strip {
  background: var(--w2p-recessed, #16202d);
  border-left: 12px solid transparent;
  border-image: repeating-linear-gradient(
    -45deg,
    var(--w2p-ink, #66c0f4),
    var(--w2p-ink, #66c0f4) 4px,
    var(--w2p-bg, #101720) 4px,
    var(--w2p-bg, #101720) 8px
  ) 12;
  padding: 6px 10px;
  margin-top: 7px;
  font-size: 12px;
  color: var(--w2p-text, #c6d4df);
}
.w2p-backlog-strip {
  background: var(--w2p-recessed, #16202d);
  border-left: 12px solid transparent;
  border-image: repeating-linear-gradient(
    -45deg,
    #ffb800,
    #ffb800 4px,
    var(--w2p-bg, #101720) 4px,
    var(--w2p-bg, #101720) 8px
  ) 12;
  padding: 6px 10px;
  margin-top: 7px;
  font-size: 12px;
  color: #f4e3b2;
}
.w2p-strip-tag {
  font-weight: 700;
  color: var(--w2p-ink, #66c0f4);
  margin-right: 6px;
}
.w2p-backlog-strip .w2p-strip-tag {
  color: #ffb800;
}
.w2p-bundle-strip {
  background: var(--w2p-recessed, #16202d);
  border-left: 12px solid transparent;
  border-image: repeating-linear-gradient(
    -45deg,
    #c084fc,
    #c084fc 4px,
    var(--w2p-bg, #101720) 4px,
    var(--w2p-bg, #101720) 8px
  ) 12;
  padding: 6px 10px;
  margin-top: 7px;
  font-size: 12px;
  color: #f3e8ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}
.w2p-bundle-strip .w2p-strip-tag {
  color: #c084fc;
}
.w2p-bundle-link {
  color: #c084fc;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}
.w2p-bundle-link:hover {
  color: #ffffff;
  text-decoration: underline;
}
.w2p-seasonal-hint {
  margin-top: 5px;
  font-size: 11.5px;
  color: var(--w2p-muted, #8f98a0);
  display: flex;
  align-items: center;
  gap: 6px;
}
.w2p-seasonal-hint b {
  color: var(--w2p-ink, #66c0f4);
  font-weight: 600;
}

/* Interactive "Playing tonight" Switch Bar (dimmed when unchecked) */
.w2p-tonight-bar {
  margin-top: 8px;
  padding-top: 7px;
  border-top: 1px solid rgba(102, 192, 244, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.w2p-toggle-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  user-select: none;
}
.w2p-switch-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.w2p-switch-track {
  position: relative;
  width: 32px;
  height: 15px;
  background: var(--w2p-recessed, #16202d);
  border: 1px solid var(--w2p-grid-strong, rgba(102, 192, 244, 0.35));
  clip-path: polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%);
  transition: background 0.15s, border-color 0.15s;
}
.w2p-switch-thumb {
  position: absolute;
  top: 2px;
  left: 3px;
  width: 11px;
  height: 9px;
  background: #677480;
  transform: skewX(-12deg);
  transition: transform 0.15s, background 0.15s;
}
.w2p-toggle-label {
  font-size: 12px;
  font-weight: 600;
  color: #677480;
  transition: color 0.15s ease;
}
.w2p-toggle-wrapper.is-checked .w2p-switch-track {
  background: rgba(164, 208, 7, 0.2);
  border-color: #a4d007;
}
.w2p-toggle-wrapper.is-checked .w2p-switch-thumb {
  transform: translateX(14px) skewX(-12deg);
  background: #a4d007;
}
.w2p-toggle-wrapper.is-checked .w2p-toggle-label {
  color: #a4d007;
}
.w2p-tonight-readout {
  font-size: 12px;
  color: var(--w2p-muted, #8f98a0);
}
.w2p-tonight-readout b {
  color: #ffffff;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

/* Quick Action Bar (+ Mark owned & Copy summary) */
.w2p-util-row {
  margin-top: 7px;
  padding-top: 6px;
  border-top: 1px solid rgba(102, 192, 244, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.w2p-util-left {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.w2p-util-btn {
  all: unset;
  cursor: pointer;
  font-size: 11.5px;
  color: var(--w2p-muted, #8f98a0);
  transition: color 0.12s;
}
.w2p-util-btn:hover {
  color: #ffffff;
}
.w2p-owned-picker {
  display: none;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}
.w2p-owned-picker.open {
  display: inline-flex;
}
.w2p-src-chip {
  all: unset;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: var(--w2p-ink, #66c0f4);
  background: rgba(102, 192, 244, 0.12);
  padding: 2px 7px;
  transition: background 0.12s, color 0.12s;
}
.w2p-src-chip:hover {
  background: var(--w2p-ink, #66c0f4);
  color: #0b1016;
}

/* Flattened Signals List & Quiet Footer Links */
.w2p-details {
  margin-top: 9px;
  border-top: 1px solid var(--w2p-grid, rgba(102, 192, 244, 0.18));
  display: none;
}
.w2p-details.open {
  display: block;
}
.w2p-sig-table {
  list-style: none;
  margin: 0;
  padding: 0;
}
.w2p-sig-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;
  border-bottom: 1px solid rgba(102, 192, 244, 0.1);
  font-size: 12px;
}
.w2p-sig-row:nth-child(odd) {
  background: rgba(255, 255, 255, 0.02);
}
.w2p-sig-name {
  font-weight: 600;
  color: #e8f0f7;
}
.w2p-sig-desc {
  color: var(--w2p-muted, #8f98a0);
  margin-left: 6px;
}

/* 5-Block Skewed Signal Meter with Risk / Safe tag */
.sig-meter {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  white-space: nowrap;
}
.sig-meter .sig-tag {
  font-size: 10.5px;
  font-weight: 600;
  margin-right: 5px;
  color: var(--w2p-muted, #8f98a0);
}
.sig-meter.high .sig-tag {
  color: #ff2a54;
}
.sig-meter.mid .sig-tag {
  color: #ffb800;
}
.sig-meter.safe .sig-tag {
  color: #a4d007;
}
.sig-meter .seg {
  display: inline-block;
  width: 6px;
  height: 10px;
  transform: skewX(-15deg);
  background: rgba(143, 152, 160, 0.22);
}
.sig-meter.high .seg.on {
  background: #ff2a54;
}
.sig-meter.mid .seg.on {
  background: #ffb800;
}

.w2p-footer-links {
  display: inline-flex;
  justify-content: flex-end;
  align-items: center;
  gap: 11px;
  flex-wrap: wrap;
}
.w2p-footer-links a {
  color: var(--w2p-muted, #8f98a0);
  text-decoration: none;
  font-size: 11.5px;
  transition: color 0.12s;
}
.w2p-footer-links a .arr {
  color: var(--w2p-ink, #66c0f4);
  margin-left: 2px;
}
.w2p-footer-links a:hover {
  color: #ffffff;
}
`;

function ensureHost(anchor: { parent: Element; before: Node | null }): ShadowRoot {
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    host.attachShadow({ mode: 'open' });
    anchor.parent.insertBefore(host, anchor.before);
  }
  return host.shadowRoot!;
}

function themeStyleVars(siteKey: keyof Settings['sites']): string {
  const t = SITE_THEMES[siteKey] ?? SITE_THEMES.steam;
  return `--w2p-bg:${t.bg};--w2p-recessed:${t.recessed};--w2p-grid:${t.grid};--w2p-grid-strong:${t.gridStrong};--w2p-ink:${t.ink};--w2p-text:${t.text};--w2p-muted:${t.muted};--w2p-radius:${t.radius};--w2p-clip:${t.clipCard};`;
}

export function renderLoadingBadge(
  anchor: { parent: Element; before: Node | null },
  siteKey: keyof Settings['sites'],
  title?: string,
): void {
  const root = ensureHost(anchor);
  const t = SITE_THEMES[siteKey] ?? SITE_THEMES.steam;
  root.innerHTML = `
    <style>${STYLES}</style>
    <div class="w2p-card" style="${themeStyleVars(siteKey)}--accent:#66c0f4">
      <div class="w2p-header">
        <div class="w2p-brand-group">
          <span class="w2p-stamp">${ICONS.hourglass} Wait2Play</span>
          <span style="color:var(--w2p-muted);font-size:12px;">Checking prices &amp; giveaway risk for ${escapeHtml(title ?? 'this game')}…</span>
        </div>
        <span class="w2p-sys-id">${escapeHtml(t.tag)}</span>
      </div>
    </div>
  `;
}

export function renderVerdictBadge(
  anchor: { parent: Element; before: Node | null },
  siteKey: keyof Settings['sites'],
  result: VerdictResult,
): void {
  const root = ensureHost(anchor);
  const meta = VERDICT_META[result.verdict];
  const t = SITE_THEMES[siteKey] ?? SITE_THEMES.steam;
  const freePct = Math.round(result.freebieProbability * 100);
  const bundlePct = Math.round(result.bundleProbability * 100);
  const isConsole = result.facts.platform === 'console';
  const curr = result.facts.price.currency;
  const fmt = (n: number) => fmtMoney(n, curr);
  const priceStr = result.facts.price.current != null ? fmt(result.facts.price.current) : '—';
  const lowStr =
    result.facts.price.historicalLow != null ? `All-time low ${fmt(result.facts.price.historicalLow)}` : '';
  const hltbHours =
    result.facts.hltbMainHours ?? KNOWN_GAME_HOURS[normalizeTitle(result.facts.title)] ?? null;
  const hltbTag = hltbHours != null && hltbHours > 0 ? ` · ~${hltbHours}h to beat` : '';
  const sourceLabel =
    (isConsole
      ? `${result.facts.platformLabel ?? 'Console'} · ${t.tag}`
      : result.facts.steamAppId
        ? `${t.tag} · Steam #${result.facts.steamAppId}`
        : t.tag) + hltbTag;

  const seasonalSignalActive = result.signals.find((s) => s.id === 'seasonal')?.active ?? false;
  const seasonalGiveaway = result.seasonal.find((w) => w.kind === 'giveaway');

  const signalsHtml = result.signals
    .map(
      (s) => `
      <li class="w2p-sig-row">
        <div>
          <span class="w2p-sig-name">${escapeHtml(s.label)}</span>
          <span class="w2p-sig-desc">${escapeHtml(s.detail)}</span>
        </div>
        ${renderSignalMeter(s.weight, s.bundleWeight)}
      </li>
    `,
    )
    .join('');

  const linksHtml = result.links
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}<span class="arr">↗</span></a>`,
    )
    .join('');

  const sv = result.savings;
  const tonightReadout = sv
    ? result.playTonight
      ? `Playing tonight — waiting ${sv.horizonMonths} mo only saves ~<b>${fmt(sv.expectedSavings)}</b>`
      : `Backlog buy — waiting ${sv.horizonMonths} mo saves ~<b>${fmt(sv.expectedSavings)}</b> (est. price <b>${fmt(sv.expectedPrice)}</b>)`
    : '';

  const liveBundle = !isConsole ? result.facts.liveBundles?.[0] : undefined;
  const liveBundlePriceStr =
    liveBundle?.price != null ? ` · ${fmtMoney(liveBundle.price, liveBundle.currency ?? curr)} tier` : '';
  const liveBundleGamesStr =
    liveBundle?.gamesCount != null && liveBundle.gamesCount > 1 ? ` · ${liveBundle.gamesCount} games` : '';

  root.innerHTML = `
    <style>${STYLES}</style>
    <div class="w2p-card" style="${themeStyleVars(siteKey)}--accent:${meta.accent};--accent-ink:${meta.ink}">
      <div class="w2p-header">
        <div class="w2p-brand-group">
          <span class="w2p-stamp">${ICONS.hourglass} Wait2Play</span>
          <span class="w2p-verdict-badge">${escapeHtml(meta.shortLabel)}</span>
          ${result.wishlisted ? `<span class="w2p-wishlist-tag" title="This game is on your synced Steam Wishlist">★ Wishlisted</span>` : ''}
        </div>
        <span class="w2p-sys-id">${escapeHtml(sourceLabel)}</span>
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
          ${lowStr ? `<span class="w2p-best-price-sub">${escapeHtml(lowStr)}</span>` : ''}
        </div>
        <div class="w2p-expand-cell">
          <button class="w2p-expand-btn" id="w2p-expand">Signals ▾</button>
        </div>
      </div>

      <div class="w2p-headline">${escapeHtml(result.headline)}</div>

      ${
        liveBundle
          ? `<div class="w2p-bundle-strip">
              <span><span class="w2p-strip-tag">Live Bundle:</span><b>${escapeHtml(liveBundle.title)}</b> on ${escapeHtml(liveBundle.store)}${escapeHtml(liveBundlePriceStr)}${escapeHtml(liveBundleGamesStr)}</span>
              <a class="w2p-bundle-link" href="${escapeHtml(liveBundle.url)}" target="_blank" rel="noopener noreferrer">Open bundle ↗</a>
            </div>`
          : ''
      }

      ${
        result.backlog
          ? `<div class="w2p-backlog-strip"><span class="w2p-strip-tag">Backlog Tax:</span>${escapeHtml(result.backlog.message)}</div>`
          : ''
      }

      ${
        seasonalGiveaway && seasonalSignalActive
          ? `<div class="w2p-seasonal-strip"><span class="w2p-strip-tag">Seasonal Alert:</span><b>${escapeHtml(seasonalGiveaway.name)}</b> — ${escapeHtml(seasonalGiveaway.advice)}</div>`
          : seasonalGiveaway
            ? `<div class="w2p-seasonal-hint" title="${escapeHtml(seasonalGiveaway.advice)}"><b>Seasonal note:</b> ${escapeHtml(seasonalGiveaway.name)} is coming up (low tier match for this game)</div>`
            : ''
      }

      ${
        sv
          ? `
        <div class="w2p-tonight-bar">
          <label class="w2p-toggle-wrapper ${result.playTonight ? 'is-checked' : ''}">
            <input type="checkbox" class="w2p-switch-input" id="w2p-tonight" ${result.playTonight ? 'checked' : ''} />
            <span class="w2p-switch-track"><span class="w2p-switch-thumb"></span></span>
            <span class="w2p-toggle-label">Playing tonight</span>
          </label>
          <span class="w2p-tonight-readout">${tonightReadout}</span>
        </div>
      `
          : ''
      }

      <div class="w2p-util-row">
        <div class="w2p-util-left">
          <button class="w2p-util-btn" id="w2p-mark-owned-btn" title="Mark this game as already owned on Epic, GOG, Prime, or Steam">+ Mark owned</button>
          <span class="w2p-owned-picker" id="w2p-owned-picker">
            <button class="w2p-src-chip" data-src="epic">Epic</button>
            <button class="w2p-src-chip" data-src="gog">GOG</button>
            <button class="w2p-src-chip" data-src="amazon">Prime</button>
            <button class="w2p-src-chip" data-src="steam">Steam</button>
            <button class="w2p-src-chip" data-src="ea">EA</button>
            <button class="w2p-src-chip" data-src="ubisoft">Ubisoft</button>
          </span>
          <span style="color:var(--w2p-muted);opacity:0.4">·</span>
          <button class="w2p-util-btn" id="w2p-copy-btn" title="Copy one-line Wait2Play summary to clipboard">Copy summary</button>
        </div>
        <div class="w2p-footer-links">${linksHtml}</div>
      </div>

      <div class="w2p-details" id="w2p-details">
        <ul class="w2p-sig-table">${signalsHtml}</ul>
      </div>
    </div>
  `;

  const expandBtn = root.getElementById('w2p-expand');
  const details = root.getElementById('w2p-details');
  expandBtn?.addEventListener('click', () => {
    const open = details?.classList.toggle('open');
    if (expandBtn) expandBtn.textContent = open ? 'Signals ▴' : 'Signals ▾';
  });

  const markOwnedBtn = root.getElementById('w2p-mark-owned-btn');
  const ownedPicker = root.getElementById('w2p-owned-picker');
  markOwnedBtn?.addEventListener('click', () => {
    ownedPicker?.classList.toggle('open');
  });

  root.querySelectorAll<HTMLButtonElement>('.w2p-src-chip').forEach((chip) => {
    chip.addEventListener('click', async () => {
      const source = (chip.dataset.src ?? 'epic') as LibrarySource;
      try {
        const updated = await send({
          type: 'markOwned',
          source,
          title: result.facts.title,
          steamAppId: result.facts.steamAppId ?? undefined,
          key: result.key,
        });
        if (updated) {
          renderVerdictBadge(anchor, siteKey, updated);
          void send({
            type: 'setBadge',
            verdict: updated.verdict,
            freebieProbability: updated.freebieProbability,
          });
        }
      } catch {
        // ignore
      }
    });
  });

  const copyBtn = root.getElementById('w2p-copy-btn');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(formatVerdictSummary(result));
      if (copyBtn) {
        copyBtn.textContent = 'Copied ✓';
        window.setTimeout(() => {
          copyBtn.textContent = 'Copy summary';
        }, 1600);
      }
    } catch {
      // ignore clipboard errors
    }
  });

  const tonightInput = root.getElementById('w2p-tonight') as HTMLInputElement | null;
  tonightInput?.addEventListener('change', async () => {
    try {
      const updated = await send({ type: 'setPlayTonight', key: result.key, value: tonightInput.checked });
      if (updated) {
        renderVerdictBadge(anchor, siteKey, updated);
        void send({
          type: 'setBadge',
          verdict: updated.verdict,
          freebieProbability: updated.freebieProbability,
        });
      }
    } catch {
      // ignore transient messaging error
    }
  });
}
