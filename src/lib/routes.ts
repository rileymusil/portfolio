import { PHOTO_CATEGORIES } from "@/lib/photography";
import { VIDEO_CATEGORIES } from "@/lib/video";

export interface SiteRoute {
  path: string;
  /** Relative weight for the sitemap; the home page leads. */
  priority: number;
}

/* Every publicly indexable route. /studio is deliberately absent: it is the
   Sanity editor, not content, and robots.txt disallows it. */
export function getSiteRoutes(): SiteRoute[] {
  return [
    { path: "/", priority: 1 },
    { path: "/photography", priority: 0.9 },
    ...PHOTO_CATEGORIES.map((category) => ({
      path: `/photography/${category}`,
      priority: 0.8,
    })),
    { path: "/video", priority: 0.9 },
    ...VIDEO_CATEGORIES.map((category) => ({
      path: `/video/${category}`,
      priority: 0.8,
    })),
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.7 },
  ];
}
