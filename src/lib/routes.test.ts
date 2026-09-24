import { describe, expect, it } from "vitest";
import { PHOTO_CATEGORIES } from "@/lib/photography";
import { getSiteRoutes } from "@/lib/routes";
import { VIDEO_CATEGORIES } from "@/lib/video";

describe("getSiteRoutes", () => {
  const paths = getSiteRoutes().map((route) => route.path);

  it("leads with the home page", () => {
    expect(paths[0]).toBe("/");
  });

  it("covers every photography and video category page", () => {
    for (const category of PHOTO_CATEGORIES) {
      expect(paths).toContain(`/photography/${category}`);
    }
    for (const category of VIDEO_CATEGORIES) {
      expect(paths).toContain(`/video/${category}`);
    }
  });

  it("leaves the Sanity Studio out of the sitemap", () => {
    expect(paths.some((path) => path.startsWith("/studio"))).toBe(false);
  });

  it("has no duplicate entries", () => {
    expect(new Set(paths).size).toBe(paths.length);
  });
});
