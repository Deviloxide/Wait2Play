# Wait2Play Privacy Policy & Store Review Disclosures

**Last updated:** November 8, 2026

## 1. Overview
**Wait2Play** is a client-side browser extension. Wait2Play does **not** operate any backend server, analytics tracker, or telemetry service. All user data remains locally on your device inside your browser's `chrome.storage.local` storage.

## 2. Data Stored Locally on Your Device
Wait2Play stores the following data solely in `chrome.storage.local` on your device:
- **Imported Game Libraries:** Game titles, launcher names, and claim dates that you voluntarily import via CSV/text files or mark as owned for the **Multi-Launcher Duplicate Guard**.
- **Steam Library Metadata (Optional):**
  - If you click **One-Click Sync from Logged-in Steam Session**, Wait2Play reads your owned AppIDs (`rgOwnedApps`) and wishlist AppIDs (`rgWishlist`) from `https://store.steampowered.com/dynamicstore/userdata/` using your active browser session and stores the AppID list locally on your device.
  - If you click **One-Click Sync GOG Library**, Wait2Play reads your owned game titles from `https://www.gog.com/account/getFilteredProducts` using your active gog.com browser session and stores the titles locally on your device only.
  - If you optionally provide a **Steam Web API Key** and **SteamID64**, those credentials and your owned game list (`IPlayerService/GetOwnedGames`) are stored locally on your device and are only sent directly from your browser to Valve's official `https://api.steampowered.com` endpoint.
- **Extension Preferences & Cache:** Storefront badge toggles, risk thresholds, "Playing tonight" toggles, and a temporary 12-hour cache of public store pricing and giveaway metadata.

## 3. External Network Requests
Wait2Play only communicates with the following public APIs directly from your browser:
1. **CheapShark API (`https://www.cheapshark.com/api/1.0/*`):** Queries public PC game deal prices and historical lows by title or Steam AppID.
2. **Steam Store & Web API (`https://store.steampowered.com/*`, `https://api.steampowered.com/*`):** Queries public game details (release date, publisher, genres, DLCs) and, only when initiated by you, syncs your owned Steam games and wishlist.
3. **Epic Games Store & GamerPower Free Games Feeds (`https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions`, `https://www.gamerpower.com/api/giveaways?type=game`):** Polls public free-game feeds to flag current and upcoming giveaways across Epic, Steam, GOG, Prime Gaming, and Humble.
4. **IsThereAnyDeal Bundles & Game Info (`https://isthereanydeal.com/*`):** Queries public active game bundles, historical bundle appearances, cross-store low prices, and HowLongToBeat main-story completion times.
5. **Community Giveaway Dataset & Humble Predictions (`https://raw.githubusercontent.com/*`, `https://www.reddit.com/r/humblebundles/search.json`):** Fetches an automatically updated GitHub JSON list of historical giveaways/bundles and queries public `r/humblebundles` prediction threads.

## 4. Data Sharing & Third Parties
- Wait2Play **never** sells, rents, transfers, or transmits your personal data, browsing history, Steam ID, API key, or owned game libraries to the developer or any third party.
- No analytics, ad networks, or tracking scripts are included in the extension.

---

## Chrome Web Store Permission Justifications (Copy/Paste for Developer Dashboard)

- **`storage` & `unlimitedStorage`:** Stores the user's imported game libraries (CSV), giveaway/subscription history dataset, user preferences, and temporary API response cache locally on the device.
- **`alarms`:** Schedules a periodic background check (every 6 hours) of public free-games JSON endpoints and prunes expired API cache entries.
- **`declarativeNetRequestWithHostAccess`:** Sets a descriptive `User-Agent` header on requests to `https://www.cheapshark.com/api/*` as required by CheapShark's API guidelines.
- **`host_permissions` (`store.steampowered.com`, `api.steampowered.com`, `cheapshark.com`, `isthereanydeal.com`, `store-site-backend-static.ak.epicgames.com`, `raw.githubusercontent.com`, `gamerpower.com`, `reddit.com`):** Required to read public game pricing, historical lows, active and past game bundles, publisher/release metadata, active free-game promotions, and public `r/humblebundles` prediction threads, and to inject the inline Wait2Play verdict card on supported game store pages (`Steam`, `GOG`, `Epic Games Store`, `Humble Store`, `GG.deals`, `IsThereAnyDeal`).
- **`optional_host_permissions` (`https://*/*`):** Requested at runtime only when a user enters a custom third-party URL in the Options page to fetch a community giveaway JSON dataset.
