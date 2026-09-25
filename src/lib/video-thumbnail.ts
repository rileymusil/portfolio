import type { VideoEmbed, VideoSource } from "@/lib/video-embed";

/* How a project's cover image can be obtained, per platform:
   - "embedded": the platform serves one from a predictable URL, already built
     into the embed (YouTube, Google Drive).
   - "oembed": a public, credential-free oEmbed endpoint returns one.
   - "manual": nothing public. Facebook and Instagram retired their token-free
     oEmbed in 2020, so these need a captured frame or an uploaded file. */
export type ThumbnailStrategy = "embedded" | "oembed" | "manual";

const STRATEGIES: Record<VideoSource, ThumbnailStrategy> = {
  youtube: "embedded",
  googleDrive: "embedded",
  vimeo: "oembed",
  tiktok: "oembed",
  facebook: "manual",
  instagram: "manual",
};

export function getThumbnailStrategy(source: VideoSource): ThumbnailStrategy {
  return STRATEGIES[source];
}

/* Endpoint that takes the canonical watch URL and returns JSON holding a
   thumbnail_url. Both are public and need no API key. */
const OEMBED_ENDPOINTS: Partial<Record<VideoSource, string>> = {
  vimeo: "https://vimeo.com/api/oembed.json",
  tiktok: "https://www.tiktok.com/oembed",
};

export function oembedRequestUrl(embed: VideoEmbed): string | null {
  const endpoint = OEMBED_ENDPOINTS[embed.source];
  if (!endpoint) {
    return null;
  }

  /* A TikTok link without the @user segment leaves watchUrl pointing at the
     embed, which oEmbed will not resolve. Better to offer nothing than a
     button that always fails. */
  if (embed.source === "tiktok" && !embed.watchUrl.includes("/@")) {
    return null;
  }

  const url = new URL(endpoint);
  url.searchParams.set("url", embed.watchUrl);
  if (embed.source === "vimeo") {
    /* Vimeo returns a thumbnail near the requested width; without this it
       hands back a 295px one, too small for a card. */
    url.searchParams.set("width", "1280");
  }
  return url.toString();
}

/* The response is third-party JSON, so nothing is trusted: the field must be
   present, a string, and an https URL before it is fetched as an image. */
export function parseOembedThumbnail(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) {
    return null;
  }

  const value = (payload as Record<string, unknown>).thumbnail_url;
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/* Next replaces NEXT_PUBLIC_* only where it is written as a literal, so the
   value is read here at module scope. Reading it through the env object the
   helper below takes would leave it undefined in the browser, and the whole
   feature would quietly never run. */
export const thumbnailApiEnv = {
  NEXT_PUBLIC_THUMBNAIL_API: process.env.NEXT_PUBLIC_THUMBNAIL_API,
};

/* The relay endpoint from api/video-thumbnail.ts or workers/video-thumbnail.ts,
   if one is deployed. Without it, Facebook and Instagram fall back to
   generating a cover from the source video. */
export function getThumbnailApiUrl(
  env: Record<string, string | undefined> = process.env,
): string | null {
  const raw = (env.NEXT_PUBLIC_THUMBNAIL_API ?? "").trim();
  if (!raw) {
    return null;
  }
  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.hostname === "localhost"
      ? raw.replace(/\/+$/, "")
      : null;
  } catch {
    return null;
  }
}

export function thumbnailApiImageUrl(
  apiBase: string,
  watchUrl: string,
): string {
  const url = new URL(apiBase);
  url.searchParams.set("url", watchUrl);
  url.searchParams.set("image", "1");
  return url.toString();
}

/* Whether a cover can be obtained without the editor supplying anything: either
   the platform publishes one, or the relay can read it from the page. */
export function canFetchAutomatically(
  source: VideoSource,
  hasRelay: boolean,
): boolean {
  const strategy = getThumbnailStrategy(source);
  return strategy === "oembed" || (strategy === "manual" && hasRelay);
}
