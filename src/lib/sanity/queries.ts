import { groq } from "next-sanity";
import type { PhotoCategory } from "@/lib/photography";
import { sanityClient } from "@/lib/sanity/client";
import { mapPhotoSessions } from "@/lib/sanity/map-session";
import { mapVideoProjects } from "@/lib/sanity/map-video";
import type { PhotoSession, VideoProject } from "@/lib/sanity/types";
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

export const videoProjectsQuery = groq`
  *[_type == "videoProject" && category == $category] | order(order asc, _createdAt desc) {
    _id,
    title,
    category,
    youtubeId,
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
