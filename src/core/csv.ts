import type { LibrarySource, OwnedEntry } from '../shared/types';

/** Minimal RFC 4180 CSV parser with delimiter auto-detection (comma, semicolon, tab). */
export function parseCsv(text: string): string[][] {
  const clean = text.replace(/^\uFEFF/, '');
  const firstLine = clean.split(/\r?\n/, 1)[0] ?? '';
  const counts = { ',': 0, ';': 0, '\t': 0 } as Record<string, number>;
  let inQ = false;
  for (const ch of firstLine) {
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch in counts) counts[ch]!++;
  }
  const delim = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0) > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0]![0]
    : ',';

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i]!;
    if (quoted) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === delim) {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && clean[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows.map((r) => r.map((f) => f.trim()));
}

const TITLE_COLS = ['title', 'name', 'game', 'game name', 'game title', 'app title', 'product', 'product name'];
const SOURCE_COLS = ['source', 'platform', 'platforms', 'platformlist', 'store', 'launcher', 'library'];
const DATE_COLS = ['date', 'claimed', 'claimed at', 'claim date', 'added', 'date added', 'acquired', 'purchase date', 'redeemed', 'purchased'];
const DLC_COLS = ['is dlc', 'dlc', 'isdlc', 'type'];

function findCol(header: string[], names: string[]): number {
  const h = header.map((c) => c.toLowerCase().replace(/[_-]/g, ' ').trim());
  for (const n of names) {
    const i = h.indexOf(n);
    if (i >= 0) return i;
  }
  return -1;
}

export function detectSource(value: string, fallback: LibrarySource): LibrarySource {
  const v = value.toLowerCase();
  if (v.includes('epic')) return 'epic';
  if (v.includes('gog')) return 'gog';
  if (v.includes('amazon') || v.includes('prime') || v.includes('luna')) return 'amazon';
  if (v.includes('steam')) return 'steam';
  if (v.includes('ubisoft') || v.includes('uplay')) return 'ubisoft';
  if (v.includes('ea app') || v.includes('origin') || v === 'ea') return 'ea';
  return fallback;
}

const EPIC_TX_NOISE_RE =
  /^(?:transactions|purchase history|payment history|code redemption history|v-bucks card history|description|date|price|status|marketplace|order id|id|purchased|refunded|completed|active|cancelled|show more|epic games store|account|subscriptions?|need help\??|loading\.{0,3}|next|previous|filter by.*|showing \d+.*|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}-\d{2}-\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{1,2},? \d{4}|[-+]?(?:US|CA|A|R|CDN)?[$€£¥]\s*\d+[.,]?\d*|\d+[.,]\d{2}\s*(?:€|£|zł|PLN|EUR|USD|GBP|CAD|AUD|BRL)|[AFU]\d{7,20}|#[0-9A-F]{6,})$/i;

function isNoiseLine(title: string): boolean {
  if (title.length < 2 || title.length > 140) return true;
  if (EPIC_TX_NOISE_RE.test(title.trim())) return true;
  if (/^https?:\/\//i.test(title)) return true;
  return false;
}

function extractFromJson(raw: string, fallbackSource: LibrarySource): { entries: OwnedEntry[]; skipped: number } | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  const entries: OwnedEntry[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  const pushCandidate = (obj: Record<string, unknown>) => {
    if (obj.is_dlc === true || obj.isDlc === true || obj.type === 'DLC') {
      skipped++;
      return;
    }
    const rawTitle =
      obj.title ?? obj.app_title ?? obj.name ?? obj.game_title ?? obj.product_name ?? obj.description ?? null;
    const title = typeof rawTitle === 'string' ? rawTitle.trim() : '';
    if (!title || isNoiseLine(title)) {
      skipped++;
      return;
    }
    const rawSrc = String(obj.source ?? obj.runner ?? obj.store ?? obj.platform ?? '');
    const src = rawSrc ? detectSource(rawSrc, fallbackSource) : fallbackSource;
    const key = `${src}|${title.toLowerCase()}`;
    if (seen.has(key)) {
      skipped++;
      return;
    }
    seen.add(key);
    const entry: OwnedEntry = { title, source: src };
    const rawDate = obj.date ?? obj.createdAt ?? obj.purchase_date ?? null;
    if (typeof rawDate === 'string' && rawDate.trim()) {
      entry.date = rawDate.trim().slice(0, 10);
    }
    entries.push(entry);
  };

  if (Array.isArray(parsed)) {
    for (const item of parsed) {
      if (typeof item === 'string') {
        pushCandidate({ title: item });
      } else if (item && typeof item === 'object') {
        const rec = item as Record<string, unknown>;
        if (Array.isArray(rec.items)) {
          for (const sub of rec.items) {
            if (sub && typeof sub === 'object') pushCandidate(sub as Record<string, unknown>);
          }
        } else {
          pushCandidate(rec);
        }
      }
    }
    return { entries, skipped };
  }

  if (parsed && typeof parsed === 'object') {
    const obj = parsed as Record<string, unknown>;
    const listCandidates = [obj.library, obj.products, obj.games, obj.orders, obj.transactions, obj.records, obj.items];
    for (const list of listCandidates) {
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item && typeof item === 'object') pushCandidate(item as Record<string, unknown>);
        }
        return { entries, skipped };
      }
    }
    // Legendary installed.json maps app_name -> { title, is_dlc, ... }
    for (const val of Object.values(obj)) {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        pushCandidate(val as Record<string, unknown>);
      }
    }
    return { entries, skipped };
  }

  return null;
}

/**
 * Turns an arbitrary library export (Playnite, GOG Galaxy, Legendary `--csv` / `installed.json`,
 * Heroic `library.json`, copy-pasted text from `epicgames.com/account/transactions`,
 * or a hand-made list with one title per line) into owned entries.
 */
export function extractLibraryEntries(text: string, source: LibrarySource): { entries: OwnedEntry[]; skipped: number } {
  const trimmed = text.replace(/^\uFEFF/, '').trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const jsonRes = extractFromJson(trimmed, source);
    if (jsonRes && jsonRes.entries.length > 0) return jsonRes;
  }

  const rows = parseCsv(text);
  if (rows.length === 0) return { entries: [], skipped: 0 };
  const header = rows[0]!;
  let titleCol = findCol(header, TITLE_COLS);
  const hasHeader = titleCol >= 0;
  if (!hasHeader) titleCol = 0;
  const sourceCol = hasHeader ? findCol(header, SOURCE_COLS) : -1;
  const dateCol = hasHeader ? findCol(header, DATE_COLS) : -1;
  const dlcCol = hasHeader ? findCol(header, DLC_COLS) : -1;

  const entries: OwnedEntry[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const r of rows.slice(hasHeader ? 1 : 0)) {
    // Handle multi-column TSV pasted from Epic Transactions (Date \t Title \t Price \t Status)
    let title = (r[titleCol] ?? '').trim();
    if (!hasHeader && title.includes('\t')) {
      const tabPart = title
        .split('\t')
        .map((s) => s.trim())
        .find((col) => col && !isNoiseLine(col));
      if (tabPart) title = tabPart;
    } else if (!hasHeader && r.length >= 2 && isNoiseLine(title)) {
      const nonNoise = r.find((col) => col.trim() && !isNoiseLine(col.trim()));
      if (nonNoise) title = nonNoise.trim();
    }
    if (!title || (!hasHeader && isNoiseLine(title))) {
      skipped++;
      continue;
    }
    if (dlcCol >= 0) {
      const d = (r[dlcCol] ?? '').toLowerCase();
      if (d === 'true' || d === 'yes' || d === '1' || d === 'dlc') {
        skipped++;
        continue;
      }
    }
    const src = sourceCol >= 0 ? detectSource(r[sourceCol] ?? '', source) : source;
    const key = `${src}|${title.toLowerCase()}`;
    if (seen.has(key)) {
      skipped++;
      continue;
    }
    seen.add(key);
    const entry: OwnedEntry = { title, source: src };
    const date = dateCol >= 0 ? (r[dateCol] ?? '').trim() : '';
    if (date) entry.date = date;
    entries.push(entry);
  }
  return { entries, skipped };
}
