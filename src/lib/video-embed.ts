export const VIDEO_SOURCES = [
  "youtube",
  "vimeo",
  "facebook",
  "googleDrive",
  "instagram",
  "tiktok",
] as const;

export type VideoSource = (typeof VIDEO_SOURCES)[number];

/* Portrait platforms get a 9:16 player. Grid thumbnails stay 16:9 either way so
   the card layout does not go ragged. */
export type VideoOrientation = "landscape" | "portrait";

export interface VideoEmbed {
  source: VideoSource;
  label: string;
  /** src for the player iframe. */
  embedUrl: string;
  /** Canonical page on the platform, for a "Watch on …" link. */
  watchUrl: string;
  /** Only where the platform serves one without an API key; null otherwise. */
  thumbnailUrl: string | null;
  orientation: VideoOrientation;
}

const SOURCE_LABELS: Record<VideoSource, string> = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  facebook: "Facebook",
  googleDrive: "Google Drive",
  instagram: "Instagram",
  tiktok: "TikTok",
};

export function getVideoSourceLabel(source: VideoSource): string {
  return SOURCE_LABELS[source];
}

export const VIDEO_URL_HELP =
  "Paste the video's URL. YouTube, Vimeo, Facebook, Google Drive, Instagram, and TikTok are supported. " +
  "TikTok needs the full tiktok.com/@user/video/... link rather than a vm.tiktok.com short link, " +
  "and a Google Drive file must be shared with “anyone with the link”.";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const DIGITS = /^\d+$/;
const VIMEO_HASH = /^[A-Za-z0-9]+$/;
const DRIVE_FILE_ID = /^[A-Za-z0-9_-]{10,}$/;
const INSTAGRAM_CODE = /^[A-Za-z0-9_-]+$/;

function normalizeHost(host: string): string {
  return host.toLowerCase().replace(/^(?:www|m|web|mobile)\./, "");
}

function segments(url: URL): string[] {
  return url.pathname.split("/").filter(Boolean);
}

function toUrl(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  /* Editors paste "vimeo.com/123" as often as the full link. */
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    return new URL(withScheme);
  } catch {
    return null;
  }
}

function youtubeEmbed(id: string, orientation: VideoOrientation): VideoEmbed {
  return {
    source: "youtube",
    label: SOURCE_LABELS.youtube,
    /* nocookie matches the reel embed on the home page. */
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    orientation,
  };
}

function parseYoutube(url: URL, host: string): VideoEmbed | null {
  if (host === "youtu.be") {
    const [id] = segments(url);
    return id && YOUTUBE_ID.test(id) ? youtubeEmbed(id, "landscape") : null;
  }

  if (host !== "youtube.com" && host !== "youtube-nocookie.com") {
    return null;
  }

  const [first, second] = segments(url);

  if (first === "watch") {
    const id = url.searchParams.get("v") ?? "";
    return YOUTUBE_ID.test(id) ? youtubeEmbed(id, "landscape") : null;
  }

  if (first === "shorts" && second && YOUTUBE_ID.test(second)) {
    return youtubeEmbed(second, "portrait");
  }

  if (
    (first === "embed" || first === "live" || first === "v") &&
    second &&
    YOUTUBE_ID.test(second)
  ) {
    return youtubeEmbed(second, "landscape");
  }

  return null;
}

function parseVimeo(url: URL, host: string): VideoEmbed | null {
  if (host !== "vimeo.com" && host !== "player.vimeo.com") {
    return null;
  }

  const parts = segments(url);
  /* Covers vimeo.com/123, /channels/staffpicks/123, /groups/x/videos/123, and
     player.vimeo.com/video/123. */
  const index = parts.findIndex((part) => DIGITS.test(part));
  if (index === -1) {
    return null;
  }

  const id = parts[index];
  /* Unlisted videos carry a privacy hash, either as the next path segment or as
     ?h=. Without it the player returns a 403. */
  const next = parts[index + 1];
  const hash =
    url.searchParams.get("h") ??
    (next && next !== "video" && VIMEO_HASH.test(next) ? next : null);

  const query = hash ? `?h=${encodeURIComponent(hash)}` : "";
  return {
    source: "vimeo",
    label: SOURCE_LABELS.vimeo,
    embedUrl: `https://player.vimeo.com/video/${id}${query}`,
    watchUrl: `https://vimeo.com/${id}${hash ? `/${hash}` : ""}`,
    /* Vimeo only exposes thumbnails through its oEmbed API, so the cover image
       has to be uploaded alongside the project. */
    thumbnailUrl: null,
    orientation: "landscape",
  };
}

function parseFacebook(url: URL, host: string): VideoEmbed | null {
  const isWatchLink = host === "fb.watch";
  if (!isWatchLink && host !== "facebook.com") {
    return null;
  }

  const parts = segments(url);
  const isVideo =
    isWatchLink ||
    parts.includes("videos") ||
    parts[0] === "reel" ||
    parts[0] === "watch" ||
    parts[0] === "video.php" ||
    url.searchParams.has("v");

  if (!isVideo || (!isWatchLink && parts.length === 0)) {
    return null;
  }

  /* The video plugin takes the whole post URL rather than an ID, which is also
     what makes fb.watch short links work without resolving them first. */
  const watchUrl = url.toString();
  const href = encodeURIComponent(watchUrl);

  return {
    source: "facebook",
    label: SOURCE_LABELS.facebook,
    embedUrl: `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false`,
    watchUrl,
    thumbnailUrl: null,
    orientation: parts[0] === "reel" ? "portrait" : "landscape",
  };
}

function parseGoogleDrive(url: URL, host: string): VideoEmbed | null {
  if (host !== "drive.google.com" && host !== "docs.google.com") {
    return null;
  }

  const parts = segments(url);
  const fileIndex = parts.indexOf("d");
  const id =
    fileIndex !== -1 && parts[fileIndex + 1]
      ? parts[fileIndex + 1]
      : (url.searchParams.get("id") ?? "");

  if (!id || !DRIVE_FILE_ID.test(id)) {
    return null;
  }

  return {
    source: "googleDrive",
    label: SOURCE_LABELS.googleDrive,
    embedUrl: `https://drive.google.com/file/d/${id}/preview`,
    watchUrl: `https://drive.google.com/file/d/${id}/view`,
    /* Serves a poster for anything shared with "anyone with the link". */
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w1000`,
    orientation: "landscape",
  };
}

function parseInstagram(url: URL, host: string): VideoEmbed | null {
  if (host !== "instagram.com") {
    return null;
  }

  const [kind, code] = segments(url);
  const known =
    kind === "p" || kind === "reel" || kind === "reels" || kind === "tv";
  if (!known || !code || !INSTAGRAM_CODE.test(code)) {
    return null;
  }

  const path = kind === "reels" ? "reel" : kind;

  return {
    source: "instagram",
    label: SOURCE_LABELS.instagram,
    embedUrl: `https://www.instagram.com/${path}/${code}/embed/`,
    watchUrl: `https://www.instagram.com/${path}/${code}/`,
    thumbnailUrl: null,
    /* The embed is a post card — caption and header included — so it is taller
       than it is wide whatever the video's own aspect. */
    orientation: "portrait",
  };
}

function parseTiktok(url: URL, host: string): VideoEmbed | null {
  if (host !== "tiktok.com") {
    return null;
  }

  const parts = segments(url);
  const videoIndex = parts.indexOf("video");
  const id = videoIndex !== -1 ? parts[videoIndex + 1] : undefined;

  /* vm.tiktok.com short links carry no ID to embed and would need a network
     round trip to resolve, so they are rejected with guidance instead. */
  if (!id || !DIGITS.test(id)) {
    return null;
  }

  const user = parts[0]?.startsWith("@") ? parts[0] : null;

  return {
    source: "tiktok",
    label: SOURCE_LABELS.tiktok,
    embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
    watchUrl: user
      ? `https://www.tiktok.com/${user}/video/${id}`
      : `https://www.tiktok.com/embed/v2/${id}`,
    thumbnailUrl: null,
    orientation: "portrait",
  };
}

/* Returns null for anything unrecognised so a bad paste drops the project
   rather than rendering an iframe pointing at nothing. */
export function parseVideoUrl(input: unknown): VideoEmbed | null {
  if (typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  /* Documents created before multi-platform support stored a bare YouTube ID.
     Check it before URL parsing, which would read the ID as a hostname. */
  if (YOUTUBE_ID.test(trimmed)) {
    return youtubeEmbed(trimmed, "landscape");
  }

  const url = toUrl(trimmed);
  if (!url || (url.protocol !== "https:" && url.protocol !== "http:")) {
    return null;
  }

  const host = normalizeHost(url.hostname);

  return (
    parseYoutube(url, host) ??
    parseVimeo(url, host) ??
    parseFacebook(url, host) ??
    parseGoogleDrive(url, host) ??
    parseInstagram(url, host) ??
    parseTiktok(url, host)
  );
}

/* Only YouTube and Vimeo autoplay reliably from a URL parameter. The rest are
   left alone rather than given a parameter they ignore, so the visitor gets a
   player showing its own poster instead of a frame that looks broken. */
export function withAutoplay(embed: VideoEmbed): string {
  if (embed.source !== "youtube" && embed.source !== "vimeo") {
    return embed.embedUrl;
  }

  try {
    const url = new URL(embed.embedUrl);
    url.searchParams.set("autoplay", "1");
    return url.toString();
  } catch {
    return embed.embedUrl;
  }
}
