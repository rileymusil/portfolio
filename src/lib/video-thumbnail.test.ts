import { describe, expect, it } from "vitest";
import { parseVideoUrl, VIDEO_SOURCES } from "@/lib/video-embed";
import {
  canFetchAutomatically,
  getThumbnailApiUrl,
  getThumbnailStrategy,
  oembedRequestUrl,
  parseOembedThumbnail,
  thumbnailApiImageUrl,
} from "@/lib/video-thumbnail";

function embedFor(url: string) {
  const embed = parseVideoUrl(url);
  if (!embed) {
    throw new Error(`expected ${url} to parse`);
  }
  return embed;
}

describe("getThumbnailStrategy", () => {
  it("classifies every supported source", () => {
    for (const source of VIDEO_SOURCES) {
      expect(["embedded", "oembed", "manual"]).toContain(
        getThumbnailStrategy(source),
      );
    }
  });

  it("marks the two platforms that serve a thumbnail from the embed itself", () => {
    expect(getThumbnailStrategy("youtube")).toBe("embedded");
    expect(getThumbnailStrategy("googleDrive")).toBe("embedded");
  });

  it("marks Facebook and Instagram manual, since their oEmbed needs a token", () => {
    expect(getThumbnailStrategy("facebook")).toBe("manual");
    expect(getThumbnailStrategy("instagram")).toBe("manual");
  });
});

describe("oembedRequestUrl", () => {
  it("asks Vimeo for a card-sized thumbnail rather than its 295px default", () => {
    const url = new URL(
      oembedRequestUrl(embedFor("https://vimeo.com/824804225"))!,
    );
    expect(url.origin + url.pathname).toBe("https://vimeo.com/api/oembed.json");
    expect(url.searchParams.get("url")).toBe("https://vimeo.com/824804225");
    expect(url.searchParams.get("width")).toBe("1280");
  });

  it("passes an unlisted Vimeo link with its privacy hash intact", () => {
    const url = new URL(
      oembedRequestUrl(embedFor("https://vimeo.com/824804225/a1b2c3d4e5"))!,
    );
    expect(url.searchParams.get("url")).toBe(
      "https://vimeo.com/824804225/a1b2c3d4e5",
    );
  });

  it("builds a TikTok request from the canonical video page", () => {
    const url = new URL(
      oembedRequestUrl(
        embedFor(
          "https://www.tiktok.com/@rileymusil/video/7234567890123456789",
        ),
      )!,
    );
    expect(url.origin + url.pathname).toBe("https://www.tiktok.com/oembed");
    expect(url.searchParams.get("url")).toBe(
      "https://www.tiktok.com/@rileymusil/video/7234567890123456789",
    );
  });

  it("offers nothing for platforms with no public endpoint", () => {
    expect(
      oembedRequestUrl(embedFor("https://youtu.be/YqYoziZZlg8")),
    ).toBeNull();
    expect(
      oembedRequestUrl(embedFor("https://www.instagram.com/p/CxYz-123_ab/")),
    ).toBeNull();
    expect(
      oembedRequestUrl(embedFor("https://fb.watch/abc123XYZ/")),
    ).toBeNull();
  });
});

describe("parseOembedThumbnail", () => {
  it("reads the thumbnail out of a well-formed response", () => {
    expect(
      parseOembedThumbnail({
        type: "video",
        thumbnail_url: "https://i.vimeocdn.com/video/1234_1280x720.jpg",
      }),
    ).toBe("https://i.vimeocdn.com/video/1234_1280x720.jpg");
  });

  it.each([
    ["null", null],
    ["a string", "https://example.com/a.jpg"],
    ["an empty object", {}],
    ["a blank thumbnail_url", { thumbnail_url: "   " }],
    ["a non-string thumbnail_url", { thumbnail_url: 42 }],
    ["a value that is not a URL", { thumbnail_url: "not a url" }],
  ])("returns null for %s", (_label, payload) => {
    expect(parseOembedThumbnail(payload)).toBeNull();
  });

  it("refuses a non-https thumbnail rather than fetching it", () => {
    expect(
      parseOembedThumbnail({ thumbnail_url: "http://example.com/a.jpg" }),
    ).toBeNull();
    expect(
      parseOembedThumbnail({ thumbnail_url: "javascript:alert(1)" }),
    ).toBeNull();
  });
});

describe("getThumbnailApiUrl", () => {
  it("is off when unset, so nothing is called", () => {
    expect(getThumbnailApiUrl({})).toBeNull();
    expect(getThumbnailApiUrl({ NEXT_PUBLIC_THUMBNAIL_API: "  " })).toBeNull();
  });

  it("rejects a value that is not a usable https endpoint", () => {
    expect(
      getThumbnailApiUrl({ NEXT_PUBLIC_THUMBNAIL_API: "nonsense" }),
    ).toBeNull();
    expect(
      getThumbnailApiUrl({
        NEXT_PUBLIC_THUMBNAIL_API: "http://example.com/api",
      }),
    ).toBeNull();
  });

  it("accepts an https endpoint and trims a trailing slash", () => {
    expect(
      getThumbnailApiUrl({
        NEXT_PUBLIC_THUMBNAIL_API: "https://x.vercel.app/api/video-thumbnail/",
      }),
    ).toBe("https://x.vercel.app/api/video-thumbnail");
  });

  it("allows localhost so the endpoint can be tried in development", () => {
    expect(
      getThumbnailApiUrl({
        NEXT_PUBLIC_THUMBNAIL_API: "http://localhost:3001/api",
      }),
    ).toBe("http://localhost:3001/api");
  });
});

describe("thumbnailApiImageUrl", () => {
  it("asks the relay for the bytes rather than the JSON", () => {
    const url = new URL(
      thumbnailApiImageUrl(
        "https://x.vercel.app/api/video-thumbnail",
        "https://www.facebook.com/reel/123",
      ),
    );
    expect(url.searchParams.get("url")).toBe(
      "https://www.facebook.com/reel/123",
    );
    expect(url.searchParams.get("image")).toBe("1");
  });
});

describe("canFetchAutomatically", () => {
  it("covers Vimeo and TikTok with no relay deployed", () => {
    expect(canFetchAutomatically("vimeo", false)).toBe(true);
    expect(canFetchAutomatically("tiktok", false)).toBe(true);
  });

  it("covers Facebook and Instagram only once a relay is deployed", () => {
    expect(canFetchAutomatically("facebook", false)).toBe(false);
    expect(canFetchAutomatically("instagram", false)).toBe(false);
    expect(canFetchAutomatically("facebook", true)).toBe(true);
    expect(canFetchAutomatically("instagram", true)).toBe(true);
  });

  it("leaves the platforms that already have a thumbnail alone", () => {
    expect(canFetchAutomatically("youtube", true)).toBe(false);
    expect(canFetchAutomatically("googleDrive", true)).toBe(false);
  });
});
