import { fmtMoney } from '../core/signals';
import type { Settings, Verdict, VerdictResult } from './types';

export interface VerdictMeta {
  label: string;
  shortLabel: string;
  /** High-contrast Vectorheart solid fill color. */
  accent: string;
  /** Dark ink used on top of solid verdict fills. */
  ink: string;
  bgSoft: string;
  border: string;
}

export const VERDICT_META: Record<Verdict, VerdictMeta> = {
  BUY_NOW: {
    label: 'Buy Now',
    shortLabel: 'Buy Now',
    accent: '#a4d007',
    ink: '#0b1016',
    bgSoft: 'rgba(164, 208, 7, 0.14)',
    border: 'rgba(164, 208, 7, 0.45)',
  },
  WAIT_FOR_SALE: {
    label: 'Wait for Sale',
    shortLabel: 'Wait for Sale',
    accent: '#ffb800',
    ink: '#0b1016',
    bgSoft: 'rgba(255, 184, 0, 0.14)',
    border: 'rgba(255, 184, 0, 0.45)',
  },
  HOLD_FOR_BUNDLE: {
    label: 'Hold for Bundle',
    shortLabel: 'Hold for Bundle',
    accent: '#b464ff',
    ink: '#0b1016',
    bgSoft: 'rgba(180, 100, 255, 0.15)',
    border: 'rgba(180, 100, 255, 0.45)',
  },
  BUNDLE_NOW: {
    label: 'In a Bundle Now',
    shortLabel: 'In Bundle Now',
    accent: '#c084fc',
    ink: '#0b1016',
    bgSoft: 'rgba(192, 132, 252, 0.18)',
    border: 'rgba(192, 132, 252, 0.55)',
  },
  IN_SUBSCRIPTION: {
    label: 'In Your Subscription',
    shortLabel: 'In Subscription',
    accent: '#22c55e',
    ink: '#0b1016',
    bgSoft: 'rgba(34, 197, 94, 0.16)',
    border: 'rgba(34, 197, 94, 0.5)',
  },
  HIGH_GIVEAWAY_RISK: {
    label: 'High Giveaway Risk',
    shortLabel: 'High Giveaway Risk',
    accent: '#ff2a54',
    ink: '#0b1016',
    bgSoft: 'rgba(255, 42, 84, 0.16)',
    border: 'rgba(255, 42, 84, 0.5)',
  },
  FREE_NOW: {
    label: 'Free Right Now',
    shortLabel: 'Free Now',
    accent: '#00e5ff',
    ink: '#0b1016',
    bgSoft: 'rgba(0, 229, 255, 0.16)',
    border: 'rgba(0, 229, 255, 0.5)',
  },
  FREE_SOON: {
    label: 'Free Next Week',
    shortLabel: 'Free Soon',
    accent: '#00e5ff',
    ink: '#0b1016',
    bgSoft: 'rgba(0, 229, 255, 0.16)',
    border: 'rgba(0, 229, 255, 0.5)',
  },
  FREE_TO_PLAY: {
    label: 'Free to Play',
    shortLabel: 'Free to Play',
    accent: '#8f98a0',
    ink: '#0b1016',
    bgSoft: 'rgba(143, 152, 160, 0.14)',
    border: 'rgba(143, 152, 160, 0.4)',
  },
  OWNED: {
    label: 'Already Owned',
    shortLabel: 'Already Owned',
    accent: '#ff4da6',
    ink: '#0b1016',
    bgSoft: 'rgba(255, 77, 166, 0.16)',
    border: 'rgba(255, 77, 166, 0.5)',
  },
  UNRELEASED: {
    label: 'Unreleased',
    shortLabel: 'Unreleased',
    accent: '#8f98a0',
    ink: '#0b1016',
    bgSoft: 'rgba(143, 152, 160, 0.14)',
    border: 'rgba(143, 152, 160, 0.4)',
  },
};

export interface SiteTheme {
  bg: string;
  recessed: string;
  grid: string;
  gridStrong: string;
  ink: string;
  text: string;
  muted: string;
  radius: string;
  clipCard: string;
  tag: string;
}

/** Per-storefront chameleon theme tokens so the widget blends into its host page. */
export const SITE_THEMES: Record<keyof Settings['sites'], SiteTheme> = {
  steam: {
    bg: '#101720',
    recessed: '#16202d',
    grid: 'rgba(102, 192, 244, 0.18)',
    gridStrong: 'rgba(102, 192, 244, 0.28)',
    ink: '#66c0f4',
    text: '#c6d4df',
    muted: '#8f98a0',
    radius: '0px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
    tag: 'Steam',
  },
  ggdeals: {
    bg: '#181820',
    recessed: '#1e1e26',
    grid: 'rgba(148, 163, 184, 0.18)',
    gridStrong: 'rgba(102, 192, 244, 0.26)',
    ink: '#66c0f4',
    text: '#e2e8f0',
    muted: '#94a3b8',
    radius: '4px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    tag: 'GG.deals',
  },
  humble: {
    bg: '#161922',
    recessed: '#1d212d',
    grid: 'rgba(148, 163, 184, 0.18)',
    gridStrong: 'rgba(239, 68, 68, 0.28)',
    ink: '#66c0f4',
    text: '#e2e8f0',
    muted: '#94a3b8',
    radius: '3px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    tag: 'Humble Store',
  },
  itad: {
    bg: '#12161f',
    recessed: '#181e29',
    grid: 'rgba(102, 192, 244, 0.18)',
    gridStrong: 'rgba(102, 192, 244, 0.26)',
    ink: '#66c0f4',
    text: '#d8e2ec',
    muted: '#8f98a0',
    radius: '2px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    tag: 'IsThereAnyDeal',
  },
  gog: {
    bg: '#1a1823',
    recessed: '#221f2e',
    grid: 'rgba(180, 100, 255, 0.2)',
    gridStrong: 'rgba(180, 100, 255, 0.34)',
    ink: '#c084fc',
    text: '#e9e4f5',
    muted: '#9e96b2',
    radius: '3px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    tag: 'GOG',
  },
  epic: {
    bg: '#141418',
    recessed: '#1c1c22',
    grid: 'rgba(148, 163, 184, 0.18)',
    gridStrong: 'rgba(0, 229, 255, 0.28)',
    ink: '#26bbff',
    text: '#f1f5f9',
    muted: '#94a3b8',
    radius: '4px',
    clipCard: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
    tag: 'Epic Store',
  },
};

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Renders a 5-segment skewed geometric risk meter.
 * Bars strictly measure risk weight (0/5 lit for safe or neutral signals; 1..5 lit for risk-increasing signals),
 * paired with a clear micro-tag ("Safe", "Risk", or "—") so bar length is never ambiguous.
 */
export function renderSignalMeter(weight: number, bundleWeight = 0): string {
  const effective = Math.abs(weight) >= Math.abs(bundleWeight) ? weight : bundleWeight * 0.85;
  const isRisk = effective >= 0.12;
  const isSafe = effective <= -0.12;

  const lit = isRisk
    ? effective < 0.35
      ? 1
      : effective < 0.7
        ? 2
        : effective < 1.1
          ? 3
          : effective < 1.5
            ? 4
            : 5
    : 0;

  const tone = isRisk ? (lit >= 3 ? 'high' : 'mid') : isSafe ? 'safe' : 'neutral';
  const tagText = isRisk ? 'Risk' : isSafe ? 'Safe' : '—';
  const tooltip = isRisk
    ? `Increases giveaway/bundle risk (${lit}/5)`
    : isSafe
      ? 'Lowers giveaway risk (safe to buy)'
      : 'Neutral impact';

  const cells = Array.from({ length: 5 }, (_, i) => `<i class="seg ${i < lit ? 'on' : ''}"></i>`).join('');
  return `<span class="sig-meter ${tone}" title="${tooltip}" aria-label="${tooltip}"><span class="sig-tag">${tagText}</span>${cells}</span>`;
}

/** Sharp 16px geometric SVG icons (replaces all OS emojis). */
export const ICONS = {
  hourglass: `<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="miter"><path d="M3 2h10M3 14h10M4 2l4 5.5L12 2M4 14l4-5.5L12 14"/></svg>`,
  settings: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="8,1.5 13.6,4.75 13.6,11.25 8,14.5 2.4,11.25 2.4,4.75"/><circle cx="8" cy="8" r="2.3"/></svg>`,
  gift: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="6" width="12" height="8"/><path d="M1.5 6h13M8 3v11M8 6c-1.8 0-3-1.1-3-2.2S6.3 2 8 3.8C9.7 2 11 2.7 11 3.8S9.8 6 8 6Z"/></svg>`,
  tag: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2h6l6 6-6 6-6-6V2Z"/><circle cx="5.5" cy="5.5" r="1" fill="currentColor"/></svg>`,
  calendar: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="11"/><path d="M2 6.5h12M5 1.5v3M11 1.5v3"/></svg>`,
  upload: `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 11V3M4.5 6.5L8 3l3.5 3.5M2.5 13h11"/></svg>`,
  alert: `<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="8,2 14.5,13.5 1.5,13.5"/><path d="M8 6v4M8 11.8v.4"/></svg>`,
} as const;

/** Formats a clean one-line Wait2Play summary suitable for pasting into Discord, Reddit, or chat. */
export function formatVerdictSummary(res: VerdictResult): string {
  const meta = VERDICT_META[res.verdict];
  const curr = res.facts.price.currency;
  const fmt = (n: number) => fmtMoney(n, curr);
  const pricePart = res.facts.price.current != null ? fmt(res.facts.price.current) : 'N/A';
  const lowPart = res.facts.price.historicalLow != null ? `, all-time low ${fmt(res.facts.price.historicalLow)}` : '';
  const freePct = Math.round(res.freebieProbability * 100);
  const bundlePct = Math.round(res.bundleProbability * 100);
  const oddsPart =
    res.facts.platform === 'console'
      ? `${freePct}% 90d giveaway risk score`
      : `${freePct}% 90d giveaway risk · ${bundlePct}% bundle risk`;
  return `Wait2Play: ${res.facts.title} — ${meta.shortLabel} (${pricePart}${lowPart} · ${oddsPart})`;
}

