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

/**
 * Turns an arbitrary library export (Playnite, GOG Galaxy, Legendary `--csv`,
 * or a hand-made list with one title per line) into owned entries.
 */
export function extractLibraryEntries(text: string, source: LibrarySource): { entries: OwnedEntry[]; skipped: number } {
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
    const title = (r[titleCol] ?? '').trim();
    if (!title) {
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
