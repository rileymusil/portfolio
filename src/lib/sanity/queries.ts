import { groq } from "next-sanity";
import type { PhotoCategory } from "@/lib/photography";
import { sanityClient } from "@/lib/sanity/client";
import { aboutFallback, mapAboutPage } from "@/lib/sanity/map-about";
import { mapPhotoSessions } from "@/lib/sanity/map-session";
import { mapVideoProjects } from "@/lib/sanity/map-video";
import type { AboutPage, PhotoSession, VideoProject } from "@/lib/sanity/types";
import type { VideoCategory } from "@/lib/video";

export const photoSessionsQuery = groq`
  *[_type == "photoSession" && category == $category] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    category,
    "coverUrl": cover.asset->url,
    "coverAlt": cover.alt,
    "coverLqip": cover.asset->metadata.lqip,
    "photos": photos[] {
      "url": asset->url,
      "alt": alt,
      "lqip": asset->metadata.lqip
    }
  }
`;

export async function getPhotoSessions(
  category: PhotoCategory,
): Promise<PhotoSession[]> {
  if (!sanityClient) {
    return [];
  }

  try {
    const docs: unknown = await sanityClient.fetch(photoSessionsQuery, {
      category,
    });
    return mapPhotoSessions(Array.isArray(docs) ? docs : []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to load ${category} sessions: ${message}`);
    return [];
  }
}

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0] {
    bannerTitle,
    bannerSubtitle,
    role,
    "headshot": headshot {
      "url": asset->url,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    intro,
    skillGroups[] { title, tags },
    experience[] { role, organization, dates, bullets },
    "fieldPhotos": fieldPhotos[] {
      "url": asset->url,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    education { title, school },
    honors,
    hobbies
  }
`;

/* Read at build time, not in the browser: the About page is a static export, so
   fetching here keeps the markup, the <title>, and the meta description all
   filled in. A Sanity webhook re-runs the build when the document is published
   — see .github/workflows/pages.yml. */
export async function getAboutPage(): Promise<AboutPage> {
  if (!sanityClient) {
    return aboutFallback;
  }

  try {
    const doc: unknown = await sanityClient.fetch(aboutPageQuery);
    return mapAboutPage(doc);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to load the About page: ${message}`);
    return aboutFallback;
  }
}

export const videoProjectsQuery = groq`
  *[_type == "videoProject" && category == $category] {
    _id,
    _createdAt,
    orderRank,
    order,
    title,
    category,
    videoUrl,
    youtubeId,
    "thumbnail": thumbnail {
      "url": asset->url,
      "alt": alt,
      "lqip": asset->metadata.lqip
    },
    badges,
    description,
    "stills": stills[] {
      "url": asset->url,
      "alt": alt,
      "caption": caption,
      "lqip": asset->metadata.lqip
    }
  }
`;

export async function getVideoProjects(
  category: VideoCategory,
): Promise<VideoProject[]> {
  if (!sanityClient) {
    return [];
  }

  try {
    const docs: unknown = await sanityClient.fetch(videoProjectsQuery, {
      category,
    });
    return mapVideoProjects(Array.isArray(docs) ? docs : []);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Failed to load ${category} video projects: ${message}`);
    return [];
  }
}
