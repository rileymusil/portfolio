export const PHOTO_CATEGORIES = ["portraits", "event", "creative"] as const;

export type PhotoCategory = (typeof PHOTO_CATEGORIES)[number];

export interface PhotoCategoryMeta {
  slug: PhotoCategory;
  title: string;
  shortLabel: string;
  description: string;
  href: string;
  coverSrc: string;
}

const CATEGORY_META: Record<PhotoCategory, PhotoCategoryMeta> = {
  portraits: {
    slug: "portraits",
    title: "Portrait Photography",
    shortLabel: "Portraits",
    description: "Personal portrait sessions on location.",
    href: "/photography/portraits",
    coverSrc: "/PORTRAITS.jpg",
  },
  event: {
    slug: "event",
    title: "Event Photography",
    shortLabel: "Event",
    description: "Live coverage for events and celebrations.",
    href: "/photography/event",
    coverSrc: "/EVENT.jpg",
  },
  creative: {
    slug: "creative",
    title: "Creative Photography",
    shortLabel: "Creative",
    description: "Editorial and conceptual photography.",
    href: "/photography/creative",
    coverSrc: "/CREATIVE.jpg",
  },
};

export function isPhotoCategory(value: string): value is PhotoCategory {
  return PHOTO_CATEGORIES.includes(value as PhotoCategory);
}

export function getPhotoCategoryMeta(category: PhotoCategory): PhotoCategoryMeta {
  return CATEGORY_META[category];
}
