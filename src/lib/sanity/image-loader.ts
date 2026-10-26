import type { ImageLoaderProps } from "next/image";

const SANITY_CDN_ORIGIN = "https://cdn.sanity.io/";

/**
 * next/image loader that resizes through Sanity's image CDN.
 *
 * Composes with sizedSanityImageUrl in lib/sanity/image.ts: that bakes a role's
 * width and quality into the stored URL, and this replaces the width per srcset
 * candidate so each slot fetches what it renders, keeping the role's quality.
 *
 * A static export cannot run Next's own optimizer, so without this every
 * <Image> falls back to `unoptimized` and ships the untouched original upload.
 * Pointing the loader at Sanity restores real srcset generation: each grid slot
 * requests only the width it renders at, in AVIF/WebP where the browser
 * supports it.
 *
 * Sources Sanity cannot transform (local /public files, YouTube thumbnails) are
 * returned unchanged; those <Image> callers pass `unoptimized` so they never
 * emit a srcset of duplicate URLs.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  if (!src.startsWith(SANITY_CDN_ORIGIN)) {
    return src;
  }

  const url = new URL(src);
  // Width is always ours: generating a srcset is the whole point, and the width
  // sizedSanityImageUrl bakes in is a single fixed guess.
  url.searchParams.set("w", String(width));
  // Quality is not. sizedSanityImageUrl already tuned it per role (thumb 70,
  // cover 75, lightbox 82), so only fill one in when the URL carries none.
  if (quality !== undefined) {
    url.searchParams.set("q", String(quality));
  } else if (!url.searchParams.has("q")) {
    url.searchParams.set("q", "65");
  }
  // Negotiate a modern format (WebP) off the Accept header, and never upscale
  // past the original.
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
