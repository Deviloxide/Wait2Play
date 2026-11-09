import { SERVICE_LABEL } from '../core/history';
import { send } from '../shared/messages';
import type { HistoryService, LibrarySource } from '../shared/types';
import { escapeHtml } from '../shared/verdictUi';

const toast = document.getElementById('status-toast') as HTMLDivElement;
let toastTimer: number | undefined;

function notify(msg: string, isError = false): void {
  window.clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.className = isError ? 'toast err' : 'toast';
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 4500);
}

function wireDropzone(
  zone: HTMLElement,
  input: HTMLInputElement,
  onFile: (file: File) => Promise<void>,
): void {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) void onFile(file);
  });
  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) void onFile(file);
  });
}

// 1. Multi-Launcher CSV Import
const csvSource = document.getElementById('csv-source') as HTMLSelectElement;
const csvFile = document.getElementById('csv-file') as HTMLInputElement;
const csvDropzone = document.getElementById('csv-dropzone') as HTMLLabelElement;
const csvDropLabel = document.getElementById('csv-drop-label') as HTMLSpanElement;
const csvText = document.getElementById('csv-text') as HTMLTextAreaElement;
const csvImportBtn = document.getElementById('csv-import-btn') as HTMLButtonElement;
const libraryStatsEl = document.getElementById('library-stats') as HTMLDivElement;

wireDropzone(csvDropzone, csvFile, async (file) => {
  csvDropLabel.textContent = file.name;
  csvText.value = await file.text();
});

csvImportBtn.addEventListener('click', async () => {
  const text = csvText.value.trim();
  if (!text) {
    notify('Paste or drop a CSV / title list first.', true);
    return;
  }
  try {
    const res = await send({
      type: 'importLibraryCsv',
      source: csvSource.value as LibrarySource,
      csv: text,
    });
    csvText.value = '';
    csvFile.value = '';
    csvDropLabel.textContent = 'Click or drag CSV / TXT here';
    notify(`Imported ${res.imported} titles (${res.skipped} skipped).`);
    await refreshLibraryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

const syncGogBtn = document.getElementById('sync-gog-btn') as HTMLButtonElement;
syncGogBtn.addEventListener('click', async () => {
  syncGogBtn.disabled = true;
  syncGogBtn.textContent = 'Syncing GOG…';
  try {
    const res = await send({ type: 'syncGog' });
    notify(`Synced ${res.count} owned GOG games from your browser session.`);
    await refreshLibraryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  } finally {
    syncGogBtn.disabled = false;
    syncGogBtn.textContent = 'One-Click Sync GOG Library (logged-in session)';
  }
});

async function refreshLibraryStats(): Promise<void> {
  const stats = await send({ type: 'getLibraryStats' });
  const entries = Object.entries(stats.bySource).filter(([, c]) => (c ?? 0) > 0);
  if (entries.length === 0) {
    libraryStatsEl.innerHTML = `<span class="muted">No libraries imported yet.</span>`;
  } else {
    libraryStatsEl.innerHTML = entries
      .map(
        ([src, count]) => `
        <span class="lib-pill">
          <b>${escapeHtml(src.toUpperCase())}</b>: ${count} games
          <button data-clear="${escapeHtml(src)}" title="Remove ${escapeHtml(src)} library">×</button>
        </span>
      `,
      )
      .join('');
    libraryStatsEl.querySelectorAll<HTMLButtonElement>('button[data-clear]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const src = btn.dataset.clear as LibrarySource;
        await send({ type: 'clearLibrary', source: src });
        notify(`Cleared ${src.toUpperCase()} library.`);
        await refreshLibraryStats();
      });
    });
  }

  const syncStatus = document.getElementById('steam-sync-status') as HTMLDivElement;
  if (stats.steamSync) {
    const dt = new Date(stats.steamSync.syncedAt).toLocaleString();
    const modeLabel = stats.steamSync.mode === 'session' ? 'Browser session' : 'Steam Web API';
    const wishStr =
      stats.steamSync.wishlistCount != null ? `, ${stats.steamSync.wishlistCount} wishlisted` : '';
    syncStatus.innerHTML =
      `Synced <b>${stats.steamSync.count}</b> Steam games (${stats.steamSync.unplayed} unplayed${wishStr}, ` +
      `~${stats.steamSync.weeklyHours} h/week) via <b>${modeLabel}</b> on ${escapeHtml(dt)}. ` +
      `Genre index: <b>${stats.genreIndex.indexed}/${stats.genreIndex.total}</b> unplayed games indexed.`;
  } else {
    syncStatus.textContent = 'Not synced yet.';
  }
}

// 2. Steam Backlog Tax Calculator
const steamKeyInput = document.getElementById('steam-key') as HTMLInputElement;
const steamIdInput = document.getElementById('steam-id') as HTMLInputElement;
const unplayedMinsInput = document.getElementById('unplayed-mins') as HTMLInputElement;
const weeklyHoursInput = document.getElementById('weekly-hours') as HTMLInputElement;
const saveSteamBtn = document.getElementById('save-steam-btn') as HTMLButtonElement;
const syncSteamBtn = document.getElementById('sync-steam-btn') as HTMLButtonElement;
const syncSteamSessionBtn = document.getElementById('sync-steam-session-btn') as HTMLButtonElement;

async function saveSteamSettings(): Promise<void> {
  const wh = weeklyHoursInput.value.trim() ? Number(weeklyHoursInput.value) : null;
  await send({
    type: 'saveSettings',
    settings: {
      steamApiKey: steamKeyInput.value.trim(),
      steamId: steamIdInput.value.trim(),
      unplayedThresholdMinutes: Math.max(1, Number(unplayedMinsInput.value) || 60),
      weeklyHoursOverride: wh && wh > 0 ? wh : null,
    },
  });
}

saveSteamBtn.addEventListener('click', async () => {
  try {
    await saveSteamSettings();
    notify('Saved Steam settings.');
    await refreshLibraryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

syncSteamSessionBtn.addEventListener('click', async () => {
  syncSteamSessionBtn.disabled = true;
  syncSteamSessionBtn.textContent = 'Syncing from Steam session…';
  try {
    await saveSteamSettings();
    const res = await send({ type: 'syncSteamSession' });
    notify(`Synced ${res.count} owned Steam games (${res.wishlistCount} wishlisted) from your browser session!`);
    await refreshLibraryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  } finally {
    syncSteamSessionBtn.disabled = false;
    syncSteamSessionBtn.textContent = 'One-Click Sync from Logged-in Steam Session';
  }
});

syncSteamBtn.addEventListener('click', async () => {
  syncSteamBtn.disabled = true;
  syncSteamBtn.textContent = 'Syncing…';
  try {
    await saveSteamSettings();
    const res = await send({ type: 'syncSteam' });
    notify(`Synced ${res.count} Steam games (${res.unplayed} unplayed) via Web API.`);
    await refreshLibraryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  } finally {
    syncSteamBtn.disabled = false;
    syncSteamBtn.textContent = 'Sync via Web API Key';
  }
});

// 3. Giveaway & Subscription History
const historyStatsEl = document.getElementById('history-stats') as HTMLDivElement;
const refreshEpicBtn = document.getElementById('refresh-epic-btn') as HTMLButtonElement;
const exportHistoryBtn = document.getElementById('export-history-btn') as HTMLButtonElement;
const historyFile = document.getElementById('history-file') as HTMLInputElement;
const historyDropzone = document.getElementById('history-dropzone') as HTMLLabelElement;
const historyDropLabel = document.getElementById('history-drop-label') as HTMLSpanElement;
const historyUrl = document.getElementById('history-url') as HTMLInputElement;
const fetchHistoryBtn = document.getElementById('fetch-history-btn') as HTMLButtonElement;

async function refreshHistoryStats(): Promise<void> {
  const st = await send({ type: 'getHistoryStats' });
  const total = st.bySource.seed + st.bySource.live + st.bySource.import;
  const svcParts = Object.entries(st.byService)
    .map(([k, v]) => `${SERVICE_LABEL[k as HistoryService] ?? k}: <b>${v}</b>`)
    .join(' · ');
  const epicStr = st.lastEpicRefresh
    ? `Last Epic feed check: ${new Date(st.lastEpicRefresh).toLocaleString()}`
    : 'Epic feed not polled yet';
  historyStatsEl.innerHTML =
    `Total records: <b>${total}</b> (seed ${st.bySource.seed}, live ${st.bySource.live}, imported ${st.bySource.import})<br/>` +
    `${svcParts}<br/><span style="color:#8f98a0;font-size:11.5px">${escapeHtml(epicStr)}</span>`;
}

refreshEpicBtn.addEventListener('click', async () => {
  try {
    const r = await send({ type: 'refreshEpic' });
    notify(`Polled Epic free games feed (+${r.added} new records).`);
    await refreshHistoryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

function downloadJsonFile(filename: string, jsonContent: string): void {
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

exportHistoryBtn.addEventListener('click', async () => {
  const json = await send({ type: 'exportHistory' });
  downloadJsonFile('wait2play-history.json', json);
});

wireDropzone(historyDropzone, historyFile, async (f) => {
  try {
    historyDropLabel.textContent = f.name;
    const text = await f.text();
    const r = await send({ type: 'importHistory', json: text });
    notify(`Imported ${r.imported} history records.`);
    historyFile.value = '';
    await refreshHistoryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

fetchHistoryBtn.addEventListener('click', async () => {
  const url = historyUrl.value.trim();
  if (!url) return;
  try {
    const u = new URL(url);
    const granted = await chrome.permissions.request({ origins: [`${u.origin}/*`] }).catch(() => false);
    if (!granted) {
      notify(`Host permission for ${u.origin} was declined.`, true);
      return;
    }
    const r = await send({ type: 'fetchHistoryUrl', url });
    await send({ type: 'saveSettings', settings: { historyUrl: url } });
    notify(`Fetched and imported ${r.imported} records.`);
    await refreshHistoryStats();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

// 4. Storefront Badges, Thresholds & Full Backup
const siteSteam = document.getElementById('site-steam') as HTMLInputElement;
const siteGog = document.getElementById('site-gog') as HTMLInputElement;
const siteEpic = document.getElementById('site-epic') as HTMLInputElement;
const siteHumble = document.getElementById('site-humble') as HTMLInputElement;
const siteGgdeals = document.getElementById('site-ggdeals') as HTMLInputElement;
const siteItad = document.getElementById('site-itad') as HTMLInputElement;
const subGamepass = document.getElementById('sub-gamepass') as HTMLInputElement;
const subPsplus = document.getElementById('sub-psplus') as HTMLInputElement;
const threshGiveaway = document.getElementById('thresh-giveaway') as HTMLInputElement;
const threshBundle = document.getElementById('thresh-bundle') as HTMLInputElement;
const savePrefsBtn = document.getElementById('save-prefs-btn') as HTMLButtonElement;
const clearCacheBtn = document.getElementById('clear-cache-btn') as HTMLButtonElement;
const exportBackupBtn = document.getElementById('export-backup-btn') as HTMLButtonElement;
const importBackupFile = document.getElementById('import-backup-file') as HTMLInputElement;

savePrefsBtn.addEventListener('click', async () => {
  try {
    await send({
      type: 'saveSettings',
      settings: {
        sites: {
          steam: siteSteam.checked,
          gog: siteGog.checked,
          epic: siteEpic.checked,
          humble: siteHumble.checked,
          ggdeals: siteGgdeals.checked,
          itad: siteItad.checked,
        },
        subscriptions: {
          gamepass: subGamepass.checked,
          psplus: subPsplus.checked,
        },
        giveawayThreshold: Math.min(0.9, Math.max(0.1, (Number(threshGiveaway.value) || 35) / 100)),
        bundleThreshold: Math.min(0.9, Math.max(0.1, (Number(threshBundle.value) || 40) / 100)),
      },
    });
    notify('Preferences saved.');
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

clearCacheBtn.addEventListener('click', async () => {
  await send({ type: 'clearCache' });
  notify('Cleared cached API responses.');
});

exportBackupBtn.addEventListener('click', async () => {
  try {
    const json = await send({ type: 'exportBackup' });
    const datePart = new Date().toISOString().slice(0, 10);
    downloadJsonFile(`wait2play-backup-${datePart}.json`, json);
    notify('Exported full backup JSON.');
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

importBackupFile.addEventListener('change', async () => {
  const file = importBackupFile.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const res = await send({ type: 'importBackup', json: text });
    importBackupFile.value = '';
    notify(
      `Restored backup (${res.libraries} launcher items, ${res.steamGames} Steam games, ${res.history} history records).`,
    );
    await init();
  } catch (err) {
    notify(err instanceof Error ? err.message : String(err), true);
  }
});

async function init(): Promise<void> {
  const s = await send({ type: 'getSettings' });
  steamKeyInput.value = s.steamApiKey;
  steamIdInput.value = s.steamId;
  unplayedMinsInput.value = String(s.unplayedThresholdMinutes);
  weeklyHoursInput.value = s.weeklyHoursOverride != null ? String(s.weeklyHoursOverride) : '';
  historyUrl.value = s.historyUrl;
  siteSteam.checked = s.sites.steam;
  siteGog.checked = s.sites.gog;
  siteEpic.checked = s.sites.epic;
  siteHumble.checked = s.sites.humble;
  siteGgdeals.checked = s.sites.ggdeals;
  siteItad.checked = s.sites.itad;
  subGamepass.checked = !!s.subscriptions?.gamepass;
  subPsplus.checked = !!s.subscriptions?.psplus;
  threshGiveaway.value = String(Math.round(s.giveawayThreshold * 100));
  threshBundle.value = String(Math.round(s.bundleThreshold * 100));

  await Promise.all([refreshLibraryStats(), refreshHistoryStats()]);
}

void init();
