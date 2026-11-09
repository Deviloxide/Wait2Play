# Wait2Play — Giveaway Risk & Patience Index

**Wait2Play** is a Manifest V3 browser extension (Chrome / Edge, portable to Firefox) that answers the question price trackers skip:

> *"What is the probability this game becomes free or enters a bundle in the next 90 days, and should I wait?"*

Instead of raw tables and charts, Wait2Play synthesizes pricing history, giveaway/subscription archives, publisher habits, and your own library into a single verdict (**Buy Now**, **Wait for Sale**, **Hold for Bundle**, **High Giveaway Risk**, **Free Now / Soon**, or **Stop! Already Owned**) plus a **0–100% Freebie Probability Score**.

---

## Features

1. **Inline Wait/Buy Badge on Storefronts**
   - Automatically augments **Steam** (`store.steampowered.com/app/*`), **Humble Store** (`humblebundle.com/store/*`), **GG.deals** (`gg.deals/game/*`), and **IsThereAnyDeal** (`isthereanydeal.com/game/*`) via an isolated Shadow DOM card.
2. **5-Pattern Predictive Signal Engine** (`src/core/signals.ts`)
   - **The "Last Gasp" Deep Discount**: Detects games at or freshly off an 80–90% all-time low (or sub-$5 cut), a common 1–4 month precursor to Epic / Prime Gaming / Humble Choice buyouts.
   - **DLC & Sequel Cycles**: Detects upcoming or freshly launched sequels and major DLC on 2+ year-old base games.
   - **Publisher Habits**: Profiles frequent cyclers (Devolver Digital, 505 Games, Focus Entertainment, Team17, Paradox, THQ Nordic, Raw Fury, tinyBuild, etc.) and applies vetoes for "never-free" studios (Nintendo, FromSoftware, Wube Software / Factorio, Valve, ConcernedApe).
   - **Cross-Platform Echoes**: Flags titles that entered Xbox Game Pass or PlayStation Plus Extra within the last 6–12 months.
   - **Seasonal Giveaway Windows**: Warns ahead of Epic's May/June Mega Sale Mystery Vault and late-December Holiday Daily Mystery Giveaways, plus major Steam seasonal sales.
3. **"Will I Play It Tonight?" Toggle & Expected Savings** (`src/core/savings.ts`)
   - Calculates the expected 6-month price and dollar savings of waiting vs. buying today, and flips borderline verdicts to **Buy Now** when you're playing immediately and expected savings are minor.
4. **The Backlog Tax Calculator** (`src/core/backlog.ts`)
   - Optional Steam Web API integration: counts your unplayed games in the same genre, estimates hours via genre heuristics, and computes the probability the game drops or hits a bundle before you finish two of your existing backlog titles.
5. **Multi-Launcher Duplicate Guard** (`src/core/csv.ts`)
   - Import CSVs (Playnite, GOG Galaxy, Legendary, or a plain one-title-per-line list) for Epic, GOG, Amazon Prime Gaming, EA, Ubisoft, or Steam to warn: *"Stop! You claimed this on Epic in 2018."*
6. **Popup Lookup & Giveaway Radar** (`src/popup/`)
   - Search any PC game from the toolbar popup, inspect the full 5-signal log-odds breakdown, and see live/upcoming Epic freebies alongside countdowns to the next Thursday Epic drop and first-Tuesday Humble Choice.

---

## Quick Start

```bash
npm install
npm test
npm run build
```

To load in Chrome or Edge:
1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the generated `dist/` folder.
