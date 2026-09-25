import { parseVideoUrl } from "./video-embed";

/* Facebook and Instagram publish a poster in their page's Open Graph tags —
   that is what makes a link pasted into Slack or iMessage show a preview. A
   browser cannot read it, because the fetch is cross-origin, but a server can.
   This is the logic behind that endpoint, kept separate from any runtime so it
   can be tested and deployed to Vercel or a Worker unchanged. */

export const THUMBNAIL_TIMEOUT_MS = 8000;

/* Facebook serves a stripped page to unrecognised clients, so identify as a
   browser exactly as every link unfurler does. */
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const META_TAG = /<meta\b[^>]*>/gi;

function readAttribute(tag: string, name: string): string | null {
  const pattern = new RegExp(
    `\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i",
  );
  const match = tag.match(pattern);
  if (!match) {
    return null;
  }
  return match[1] ?? match[2] ?? match[3] ?? null;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&(?:amp|#38|#x26);/gi, "&")
    .replace(/&(?:quot|#34|#x22);/gi, '"')
    .replace(/&(?:apos|#39|#x27);/gi, "'")
    .replace(/&(?:lt|#60|#x3c);/gi, "<")
    .replace(/&(?:gt|#62|#x3e);/gi, ">");
}

/* Ordered by preference: the secure URL first, then the plain one, then
   Twitter's, which Facebook also emits and which sometimes survives when
   og:image does not. */
const IMAGE_KEYS = ["og:image:secure_url", "og:image", "twitter:image"];

export function extractOgImage(html: string): string | null {
  const found = new Map<string, string>();

  for (const tag of html.match(META_TAG) ?? []) {
    const key = (
      readAttribute(tag, "property") ??
      readAttribute(tag, "name") ??
      ""
    ).toLowerCase();
    if (!IMAGE_KEYS.includes(key) || found.has(key)) {
      continue;
    }
    const content = readAttribute(tag, "content");
    if (content?.trim()) {
      found.set(key, decodeEntities(content.trim()));
    }
  }

  for (const key of IMAGE_KEYS) {
    const value = found.get(key);
    if (!value) {
      continue;
    }
    try {
      const url = new URL(value);
      if (url.protocol === "https:") {
        return url.toString();
      }
    } catch {
      /* Not a URL; try the next key. */
    }
  }

  return null;
}

export type ThumbnailResult =
  | { ok: true; thumbnailUrl: string }
  | { ok: false; status: number; error: string };

export async function resolveVideoThumbnail(
  rawUrl: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<ThumbnailResult> {
  /* The guard that keeps this from being an open proxy: only a URL that parses
     as one of the supported video platforms is ever fetched, so it cannot be
     pointed at an internal address or an arbitrary host. */
  const embed = parseVideoUrl(rawUrl);
  if (!embed) {
    return {
      ok: false,
      status: 400,
      error: "Not a video link this site can embed.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), THUMBNAIL_TIMEOUT_MS);

  try {
    const response = await fetchImpl(embed.watchUrl, {
      headers: {
        "user-agent": BROWSER_USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        error: `${embed.label} answered ${response.status}.`,
      };
    }

    const thumbnailUrl = extractOgImage(await response.text());
    if (!thumbnailUrl) {
      return {
        ok: false,
        status: 404,
        error: `${embed.label} published no thumbnail for that link. It may be private.`,
      };
    }

    return { ok: true, thumbnailUrl };
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      status: 504,
      error: aborted
        ? `${embed.label} did not answer in time.`
        : `Could not reach ${embed.label}.`,
    };
  } finally {
    clearTimeout(timeout);
  }
}
