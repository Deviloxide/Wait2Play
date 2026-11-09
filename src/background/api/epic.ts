import type { HistoryRecord } from '../../shared/types';
import { getJson } from './http';

/** Epic's public free-games promotions feed (current + next week's free games). */
const URL_ = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';

interface PromoOffer {
  startDate: string;
  endDate: string;
  discountSetting?: { discountType?: string; discountPercentage?: number };
}

interface EpicElement {
  title: string;
  seller?: { name?: string };
  promotions?: {
    promotionalOffers?: { promotionalOffers?: PromoOffer[] }[];
    upcomingPromotionalOffers?: { promotionalOffers?: PromoOffer[] }[];
  } | null;
}

interface EpicResponse {
  data?: { Catalog?: { searchStore?: { elements?: EpicElement[] } } };
}

export function parseEpicFreeGames(json: EpicResponse): HistoryRecord[] {
  const elements = json.data?.Catalog?.searchStore?.elements ?? [];
  const out: HistoryRecord[] = [];
  for (const el of elements) {
    const groups = [
      ...(el.promotions?.promotionalOffers ?? []),
      ...(el.promotions?.upcomingPromotionalOffers ?? []),
    ];
    for (const g of groups) {
      for (const offer of g.promotionalOffers ?? []) {
        if (offer.discountSetting?.discountPercentage !== 0) continue; // 0% of price = free
        const rec: HistoryRecord = {
          title: el.title,
          service: 'epic',
          start: offer.startDate,
          end: offer.endDate,
          source: 'live',
        };
        if (el.seller?.name) rec.publisher = el.seller.name;
        out.push(rec);
      }
    }
  }
  return out;
}

export async function fetchEpicFreeGames(): Promise<HistoryRecord[]> {
  return parseEpicFreeGames(await getJson<EpicResponse>(URL_));
}
