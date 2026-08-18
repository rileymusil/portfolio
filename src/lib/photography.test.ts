import { describe, expect, it } from "vitest";
import {
  getPhotoCategoryMeta,
  isPhotoCategory,
  PHOTO_CATEGORIES,
} from "@/lib/photography";

describe("photography categories", () => {
  it("lists portraits, event, and creative in the homepage card order", () => {
    expect(PHOTO_CATEGORIES).toEqual(["portraits", "event", "creative"]);
  });

  it("accepts only known category slugs", () => {
    expect(isPhotoCategory("creative")).toBe(true);
    expect(isPhotoCategory("video")).toBe(false);
  });

  it("returns page copy for each gallery", () => {
    expect(getPhotoCategoryMeta("portraits").title).toBe("Portrait Photography");
    expect(getPhotoCategoryMeta("event").href).toBe("/photography/event");
    expect(getPhotoCategoryMeta("creative").coverSrc).toBe("/CREATIVE.jpg");
  });
});
