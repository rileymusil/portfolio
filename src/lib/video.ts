export const VIDEO_CATEGORIES = ["narrative", "commercial"] as const;

export type VideoCategory = (typeof VIDEO_CATEGORIES)[number];

export interface VideoCategoryMeta {
  slug: VideoCategory;
  title: string;
  shortLabel: string;
  description: string;
  subtitle: string;
  href: string;
  coverSrc: string;
}

const CATEGORY_META: Record<VideoCategory, VideoCategoryMeta> = {
  narrative: {
    slug: "narrative",
    title: "Narrative Video",
    shortLabel: "Narrative",
    description: "Narrative films and story-driven projects by Riley Musil.",
    subtitle: "Narrative films and story-driven projects.",
    href: "/video/narrative",
    coverSrc: "/Narrative.jpg",
  },
  commercial: {
    slug: "commercial",
    title: "Commercial Video",
    shortLabel: "Commercial",
    description: "Commercial and promotional video work by Riley Musil.",
    subtitle: "Commercial and promotional work.",
    href: "/video/commercial",
    coverSrc: "/Commercial.jpg",
  },
};

export function isVideoCategory(value: string): value is VideoCategory {
  return VIDEO_CATEGORIES.includes(value as VideoCategory);
}

export function getVideoCategoryMeta(
  category: VideoCategory,
): VideoCategoryMeta {
  return CATEGORY_META[category];
}

/* Display numbers are derived from list position rather than stored on the
   document, so reordering projects in the Studio can't leave a project
   labelled "03" sitting in the second slot. */
export function displayNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
