import { describe, expect, it } from "vitest";
import {
  getVideoSourceLabel,
  parseVideoUrl,
  VIDEO_SOURCES,
  withAutoplay,
} from "@/lib/video-embed";

function parsed(input: string) {
  const embed = parseVideoUrl(input);
  if (!embed) {
    throw new Error(`expected ${input} to parse`);
  }
  return embed;
}

describe("YouTube", () => {
  it.each([
    "https://www.youtube.com/watch?v=YqYoziZZlg8",
    "https://youtu.be/YqYoziZZlg8",
    "https://m.youtube.com/watch?v=YqYoziZZlg8",
    "https://www.youtube.com/embed/YqYoziZZlg8",
    "https://www.youtube.com/live/YqYoziZZlg8",
    "youtube.com/watch?v=YqYoziZZlg8",
  ])("reads the ID out of %s", (input) => {
    expect(parsed(input).embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/YqYoziZZlg8",
    );
  });

  it("keeps extra query parameters out of the embed URL", () => {
    const embed = parsed("https://www.youtube.com/watch?v=YqYoziZZlg8&t=42s");
    expect(embed.embedUrl).toBe(
      "https://www.youtube-nocookie.com/embed/YqYoziZZlg8",
    );
  });

  it("still accepts a bare ID, which is what older documents store", () => {
    expect(parsed("YqYoziZZlg8").source).toBe("youtube");
  });

  it("serves a thumbnail without an upload", () => {
    expect(parsed("https://youtu.be/YqYoziZZlg8").thumbnailUrl).toBe(
      "https://img.youtube.com/vi/YqYoziZZlg8/hqdefault.jpg",
    );
  });

  it("treats a Short as portrait", () => {
    expect(
      parsed("https://www.youtube.com/shorts/YqYoziZZlg8").orientation,
    ).toBe("portrait");
  });

  it("rejects an ID that is not 11 characters", () => {
    expect(
      parseVideoUrl("https://www.youtube.com/watch?v=tooshort"),
    ).toBeNull();
  });
});

describe("Vimeo", () => {
  it.each([
    "https://vimeo.com/824804225",
    "https://vimeo.com/channels/staffpicks/824804225",
    "https://player.vimeo.com/video/824804225",
  ])("finds the numeric ID in %s", (input) => {
    expect(parsed(input).embedUrl).toBe(
      "https://player.vimeo.com/video/824804225",
    );
  });

  it("carries the privacy hash of an unlisted video, which the player requires", () => {
    const embed = parsed("https://vimeo.com/824804225/a1b2c3d4e5");
    expect(embed.embedUrl).toBe(
      "https://player.vimeo.com/video/824804225?h=a1b2c3d4e5",
    );
    expect(embed.watchUrl).toBe("https://vimeo.com/824804225/a1b2c3d4e5");
  });

  it("reads the hash from ?h= as well", () => {
    expect(parsed("https://vimeo.com/824804225?h=a1b2c3d4e5").embedUrl).toBe(
      "https://player.vimeo.com/video/824804225?h=a1b2c3d4e5",
    );
  });

  it("has no automatic thumbnail, so a cover image has to be uploaded", () => {
    expect(parsed("https://vimeo.com/824804225").thumbnailUrl).toBeNull();
  });

  it("rejects a Vimeo page with no video ID", () => {
    expect(parseVideoUrl("https://vimeo.com/rileymusil")).toBeNull();
  });
});

describe("Facebook", () => {
  it("passes the whole post URL to the video plugin", () => {
    const embed = parsed(
      "https://www.facebook.com/somepage/videos/1234567890/",
    );
    expect(embed.embedUrl).toContain("facebook.com/plugins/video.php?href=");
    expect(embed.embedUrl).toContain(
      encodeURIComponent(
        "https://www.facebook.com/somepage/videos/1234567890/",
      ),
    );
  });

  it("accepts an fb.watch short link without resolving it first", () => {
    expect(parsed("https://fb.watch/abc123XYZ/").source).toBe("facebook");
  });

  it("accepts the /watch?v= form", () => {
    expect(parsed("https://www.facebook.com/watch/?v=1234567890").source).toBe(
      "facebook",
    );
  });

  it("treats a Reel as portrait", () => {
    expect(parsed("https://www.facebook.com/reel/1234567890").orientation).toBe(
      "portrait",
    );
  });

  it("rejects a plain profile URL that holds no video", () => {
    expect(parseVideoUrl("https://www.facebook.com/rileymusil")).toBeNull();
  });
});

describe("Google Drive", () => {
  it.each([
    "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/view?usp=sharing",
    "https://drive.google.com/open?id=1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd",
    "https://docs.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/edit",
  ])("pulls the file ID out of %s", (input) => {
    expect(parsed(input).embedUrl).toBe(
      "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/preview",
    );
  });

  it("gets a poster from Drive for link-shared files", () => {
    expect(
      parsed(
        "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/view",
      ).thumbnailUrl,
    ).toBe(
      "https://drive.google.com/thumbnail?id=1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd&sz=w1000",
    );
  });

  it("rejects a Drive folder, which has nothing to play", () => {
    expect(parseVideoUrl("https://drive.google.com/drive/my-drive")).toBeNull();
  });
});

describe("Instagram", () => {
  it.each(["p", "reel", "tv"])("embeds a /%s/ link", (kind) => {
    expect(
      parsed(`https://www.instagram.com/${kind}/CxYz-123_ab/`).embedUrl,
    ).toBe(`https://www.instagram.com/${kind}/CxYz-123_ab/embed/`);
  });

  it("normalises the plural /reels/ form Instagram also hands out", () => {
    expect(
      parsed("https://www.instagram.com/reels/CxYz-123_ab/").embedUrl,
    ).toBe("https://www.instagram.com/reel/CxYz-123_ab/embed/");
  });

  it("is portrait, because the embed is a post card rather than a bare player", () => {
    expect(parsed("https://www.instagram.com/p/CxYz-123_ab/").orientation).toBe(
      "portrait",
    );
  });

  it("rejects a profile URL", () => {
    expect(parseVideoUrl("https://www.instagram.com/rileymusil")).toBeNull();
  });
});

describe("TikTok", () => {
  it("embeds the numeric video ID", () => {
    const embed = parsed(
      "https://www.tiktok.com/@rileymusil/video/7234567890123456789",
    );
    expect(embed.embedUrl).toBe(
      "https://www.tiktok.com/embed/v2/7234567890123456789",
    );
    expect(embed.watchUrl).toBe(
      "https://www.tiktok.com/@rileymusil/video/7234567890123456789",
    );
    expect(embed.orientation).toBe("portrait");
  });

  it("rejects a vm.tiktok.com short link, which carries no ID to embed", () => {
    expect(parseVideoUrl("https://vm.tiktok.com/ZMabcdef/")).toBeNull();
  });
});

describe("parseVideoUrl", () => {
  it.each([
    ["an empty string", ""],
    ["whitespace", "   "],
    ["a non-string", 42],
    ["a sentence", "ask me for the link"],
    ["an unsupported host", "https://dailymotion.com/video/x8abcde"],
    ["a javascript: URL", "javascript:alert(1)"],
  ])("returns null for %s", (_label, input) => {
    expect(parseVideoUrl(input)).toBeNull();
  });

  it("tolerates a URL pasted without its scheme", () => {
    expect(parsed("vimeo.com/824804225").source).toBe("vimeo");
  });

  it("trims surrounding whitespace from a paste", () => {
    expect(parsed("  https://youtu.be/YqYoziZZlg8  ").source).toBe("youtube");
  });

  it("only ever builds https embed URLs", () => {
    const inputs = [
      "https://youtu.be/YqYoziZZlg8",
      "https://vimeo.com/824804225",
      "https://fb.watch/abc123XYZ/",
      "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/view",
      "https://www.instagram.com/p/CxYz-123_ab/",
      "https://www.tiktok.com/@a/video/7234567890123456789",
    ];
    for (const input of inputs) {
      expect(parsed(input).embedUrl.startsWith("https://")).toBe(true);
    }
  });
});

describe("getVideoSourceLabel", () => {
  it("names every supported source", () => {
    for (const source of VIDEO_SOURCES) {
      expect(getVideoSourceLabel(source)).toBeTruthy();
    }
  });
});

describe("withAutoplay", () => {
  it("autoplays YouTube", () => {
    expect(withAutoplay(parsed("https://youtu.be/YqYoziZZlg8"))).toBe(
      "https://www.youtube-nocookie.com/embed/YqYoziZZlg8?autoplay=1",
    );
  });

  it("keeps Vimeo's privacy hash when adding autoplay", () => {
    const url = withAutoplay(parsed("https://vimeo.com/824804225/a1b2c3d4e5"));
    expect(url).toContain("h=a1b2c3d4e5");
    expect(url).toContain("autoplay=1");
  });

  it("leaves platforms that ignore the parameter untouched", () => {
    for (const input of [
      "https://fb.watch/abc123XYZ/",
      "https://drive.google.com/file/d/1qyKpHzOBAEuwsj0gfhm9iafWd5cBGbZd/view",
      "https://www.instagram.com/p/CxYz-123_ab/",
      "https://www.tiktok.com/@a/video/7234567890123456789",
    ]) {
      const embed = parsed(input);
      expect(withAutoplay(embed)).toBe(embed.embedUrl);
    }
  });
});
