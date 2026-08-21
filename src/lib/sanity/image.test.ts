import { describe, expect, it } from "vitest";
import {
  GALLERY_IMAGE,
  sizedSanityImageUrl,
} from "@/lib/sanity/image";

describe("sizedSanityImageUrl", () => {
  const original = "https://cdn.sanity.io/images/proj/production/cover.jpg";

  it("asks Sanity for a bounded, auto-formatted image", () => {
    const url = sizedSanityImageUrl(original, "thumb");

    expect(url).toContain("cover.jpg");
    expect(url).toContain(`w=${GALLERY_IMAGE.thumb.width}`);
    expect(url).toContain(`q=${GALLERY_IMAGE.thumb.quality}`);
    expect(url).toContain("auto=format");
    expect(url).toContain("fit=max");
  });

  it("uses a larger width for covers than for thumbs", () => {
    const thumb = sizedSanityImageUrl(original, "thumb");
    const cover = sizedSanityImageUrl(original, "cover");
    const lightbox = sizedSanityImageUrl(original, "lightbox");

    expect(thumb).toContain(`w=${GALLERY_IMAGE.thumb.width}`);
    expect(cover).toContain(`w=${GALLERY_IMAGE.cover.width}`);
    expect(lightbox).toContain(`w=${GALLERY_IMAGE.lightbox.width}`);
    expect(GALLERY_IMAGE.thumb.width).toBeLessThan(GALLERY_IMAGE.cover.width);
    expect(GALLERY_IMAGE.cover.width).toBeLessThan(GALLERY_IMAGE.lightbox.width);
  });

  it("leaves local and relative paths unchanged", () => {
    expect(sizedSanityImageUrl("/PORTRAITS.jpg", "cover")).toBe("/PORTRAITS.jpg");
    expect(sizedSanityImageUrl("PORTRAITS.jpg", "thumb")).toBe("PORTRAITS.jpg");
  });
});
