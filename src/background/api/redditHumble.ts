import { normalizeTitle } from '../../core/titles';
import { cached, DAY } from '../cache';
import { getJson } from './http';

export interface HumbleSubredditMentions {
  count: number;
  latestPostTitle: string | null;
}

interface RedditListing {
  data?: {
    children?: {
      data?: {
        title?: string;
        selftext?: string;
        created_utc?: number;
      };
    }[];
  };
}

/**
 * Searches r/humblebundles public JSON feed for recent Humble Choice prediction,
 * leak, or bundle discussion threads mentioning the given game title.
 * Cached for 24 hours so repeated page loads never spam Reddit.
 */
export async function fetchHumbleSubredditMentions(title: string): Promise<HumbleSubredditMentions> {
  const norm = normalizeTitle(title);
  if (!norm || norm.length < 4) return { count: 0, latestPostTitle: null };

  return cached(`reddit:hb:${norm}`, DAY, async () => {
    try {
      const q = encodeURIComponent(`"${title}" (prediction OR choice OR leak OR headliner OR bundle)`);
      const url = `https://www.reddit.com/r/humblebundles/search.json?q=${q}&restrict_sr=1&sort=new&t=year&limit=10`;
      const data = await getJson<RedditListing>(url, 6000);
      const posts = data?.data?.children ?? [];
      let count = 0;
      let latestPostTitle: string | null = null;

      for (const child of posts) {
        const postTitle = child.data?.title ?? '';
        const body = child.data?.selftext ?? '';
        const combinedNorm = normalizeTitle(`${postTitle} ${body}`);
        if (!combinedNorm.includes(norm)) continue;
        const isPredictionOrBundle = /prediction|choice|leak|rumor|headliner|bundle|monthly/i.test(
          `${postTitle} ${body}`,
        );
        if (isPredictionOrBundle) {
          count += 1;
          if (!latestPostTitle && postTitle) {
            latestPostTitle = postTitle.length > 72 ? `${postTitle.slice(0, 69)}…` : postTitle;
          }
        }
      }
      return { count, latestPostTitle };
    } catch {
      return { count: 0, latestPostTitle: null };
    }
  });
}
