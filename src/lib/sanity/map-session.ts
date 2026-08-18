import { isPhotoCategory } from "@/lib/photography";
import type { PhotoSession, SanityPhotoDoc } from "@/lib/sanity/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

export function mapPhotoSession(doc: unknown): PhotoSession | null {
  if (!isRecord(doc)) {
    return null;
  }

  const id = asString(doc._id);
  const title = asString(doc.title);
  const category = asString(doc.category);
  const coverUrl = asString(doc.coverUrl);

  if (!id || !title || !category || !isPhotoCategory(category) || !coverUrl) {
    return null;
  }

  const photos = Array.isArray(doc.photos)
    ? doc.photos.flatMap((photo) => {
        if (!isRecord(photo)) {
          return [];
        }
        const url = asString(photo.url);
        if (!url) {
          return [];
        }
        return [
          {
            url,
            alt: asString(photo.alt) ?? title,
          },
        ];
      })
    : [];

  return {
    id,
    title,
    description: asString(doc.description) ?? "",
    category,
    cover: {
      url: coverUrl,
      alt: asString(doc.coverAlt) ?? title,
    },
    photos,
  };
}

export function mapPhotoSessions(docs: unknown[]): PhotoSession[] {
  return docs.flatMap((doc) => {
    const session = mapPhotoSession(doc);
    return session ? [session] : [];
  });
}

export function isSanityPhotoDoc(value: unknown): value is SanityPhotoDoc {
  return mapPhotoSession(value) !== null;
}
