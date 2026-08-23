import { describe, expect, it } from "vitest";
import {
  displayNumber,
  getVideoCategoryMeta,
  getYoutubeThumbnailUrl,
  isVideoCategory,
  VIDEO_CATEGORIES,
} from "@/lib/video";

describe("video categories", () => {
  it("lists narrative and commercial in the landing card order", () => {
    expect(VIDEO_CATEGORIES).toEqual(["narrative", "commercial"]);
  });

  it("accepts only known category slugs", () => {
    expect(isVideoCategory("narrative")).toBe(true);
    expect(isVideoCategory("portraits")).toBe(false);
  });

  it("returns page copy for each category", () => {
    expect(getVideoCategoryMeta("narrative").title).toBe("Narrative Video");
    expect(getVideoCategoryMeta("commercial").href).toBe("/video/commercial");
    expect(getVideoCategoryMeta("commercial").coverSrc).toBe("/Commercial.jpg");
  });

  it("builds YouTube thumbnail URLs", () => {
    expect(getYoutubeThumbnailUrl("YqYoziZZlg8")).toBe(
      "https://img.youtube.com/vi/YqYoziZZlg8/hqdefault.jpg",
    );
  });

  it("numbers projects from their position, padded to two digits", () => {
    expect(displayNumber(0)).toBe("01");
    expect(displayNumber(9)).toBe("10");
  });
});
