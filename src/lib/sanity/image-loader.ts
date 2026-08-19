import type { ImageLoaderProps } from "next/image";

const SANITY_CDN_ORIGIN = "https://cdn.sanity.io/";

/**
 * next/image loader that resizes through Sanity's image CDN.
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
  url.searchParams.set("w", String(width));
  // 65 is a deliberate default for photography at grid sizes; the full-size
  // viewer opts up explicitly.
  url.searchParams.set("q", String(quality ?? 65));
  // Serve AVIF/WebP by Accept header, and never upscale past the original.
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
