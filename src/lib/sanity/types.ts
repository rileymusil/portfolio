import type { PortableTextBlock } from "@portabletext/types";
import type { PhotoCategory } from "@/lib/photography";
import type { VideoCategory } from "@/lib/video";

export interface GalleryImage {
  alt: string;
  thumbUrl: string;
  coverUrl: string;
  fullUrl: string;
  lqip?: string;
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
  coverLqip?: string | null;
  photos: Array<{
    url: string | null;
    alt?: string | null;
    lqip?: string | null;
  }>;
}

export interface AboutImage {
  url: string;
  alt: string;
  lqip?: string;
}

export interface AboutSkillGroup {
  title: string;
  tags: string[];
}

export interface AboutExperienceItem {
  dates: string;
  role: string;
  organization: string;
  bullets: string[];
}

export interface AboutPage {
  bannerTitle: string;
  bannerSubtitle: string;
  role: string;
  headshot: AboutImage;
  intro: PortableTextBlock[];
  skillGroups: AboutSkillGroup[];
  experience: AboutExperienceItem[];
  fieldPhotos: AboutImage[];
  education: { title: string; school: string };
  honors: string[];
  hobbies: string[];
}

export interface VideoStill {
  alt: string;
  caption: string;
  thumbUrl: string;
  fullUrl: string;
  lqip?: string;
}

export interface VideoProject {
  id: string;
  number: string;
  title: string;
  category: VideoCategory;
  youtubeId: string;
  badges: string[];
  description: PortableTextBlock[];
  stills: VideoStill[];
}

export interface SanityVideoDoc {
  _id: string;
  title: string;
  category: VideoCategory;
  youtubeId: string;
  badges?: string[] | null;
  description?: PortableTextBlock[] | null;
  stills: Array<{
    url: string | null;
    alt?: string | null;
    caption?: string | null;
    lqip?: string | null;
  }>;
}
