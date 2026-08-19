import { groq } from "next-sanity";
import type { PhotoCategory } from "@/lib/photography";
import { sanityClient } from "@/lib/sanity/client";
import { mapPhotoSessions } from "@/lib/sanity/map-session";
import type { PhotoSession } from "@/lib/sanity/types";

export const photoSessionsQuery = groq`
  *[_type == "photoSession" && category == $category] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    category,
    "coverUrl": cover.asset->url,
    "coverAlt": cover.alt,
    "photos": photos[] {
      "url": asset->url,
      "alt": alt
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
    // This now runs at build time. Swallowing the error would publish a gallery
    // that is silently empty until the next build, so fail the build instead and
    // leave the previous deploy serving.
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(
      `Failed to load ${category} photo sessions from Sanity: ${message}`,
      { cause: error },
    );
  }
}
