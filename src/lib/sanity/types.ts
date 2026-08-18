import type { PhotoCategory } from "@/lib/photography";

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface PhotoSession {
  id: string;
  title: string;
  description: string;
  category: PhotoCategory;
  cover: GalleryImage;
  photos: GalleryImage[];
}

export interface SanityPhotoDoc {
  _id: string;
  title: string;
  description?: string;
  category: PhotoCategory;
  coverUrl: string | null;
  coverAlt?: string | null;
  photos: Array<{
    url: string | null;
    alt?: string | null;
  }>;
}
