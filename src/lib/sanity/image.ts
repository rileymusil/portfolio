export const GALLERY_IMAGE = {
  thumb: { width: 400, quality: 70 },
  cover: { width: 900, quality: 75 },
  lightbox: { width: 1600, quality: 82 },
} as const;

export type GalleryImageRole = keyof typeof GALLERY_IMAGE;

function isHttpUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

export function sizedSanityImageUrl(
  url: string,
  role: GalleryImageRole,
): string {
  if (!isHttpUrl(url)) {
    return url;
  }

  const parsed = new URL(url);
  const options = GALLERY_IMAGE[role];
  parsed.searchParams.set("w", String(options.width));
  parsed.searchParams.set("auto", "format");
  parsed.searchParams.set("q", String(options.quality));
  parsed.searchParams.set("fit", "max");
  return parsed.toString();
}
