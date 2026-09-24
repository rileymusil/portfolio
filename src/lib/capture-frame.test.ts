import { describe, expect, it } from "vitest";
import {
  formatTimecode,
  frameFileName,
  isVideoFile,
} from "@/lib/capture-frame";

describe("isVideoFile", () => {
  it("accepts a video file", () => {
    expect(isVideoFile(new File([], "a.mp4", { type: "video/mp4" }))).toBe(
      true,
    );
  });

  it("rejects an image, and nothing at all", () => {
    expect(isVideoFile(new File([], "a.jpg", { type: "image/jpeg" }))).toBe(
      false,
    );
    expect(isVideoFile(undefined)).toBe(false);
    expect(isVideoFile(null)).toBe(false);
  });
});

describe("formatTimecode", () => {
  it.each([
    [0, "0:00"],
    [7, "0:07"],
    [7.9, "0:07"],
    [83, "1:23"],
    [725, "12:05"],
  ])("formats %s seconds as %s", (input, expected) => {
    expect(formatTimecode(input)).toBe(expected);
  });

  it("treats a missing or nonsensical time as the start", () => {
    expect(formatTimecode(Number.NaN)).toBe("0:00");
    expect(formatTimecode(-4)).toBe("0:00");
    expect(formatTimecode(Number.POSITIVE_INFINITY)).toBe("0:00");
  });
});

describe("frameFileName", () => {
  it("names the frame after its source and timestamp", () => {
    expect(frameFileName("The Man in the Woods.mov", 83)).toBe(
      "the-man-in-the-woods-frame-1m23s.jpg",
    );
  });

  it("collapses punctuation a filename may carry", () => {
    expect(frameFileName("A_Reel — final (v2).MP4", 7)).toBe(
      "a-reel-final-v2-frame-0m07s.jpg",
    );
  });

  it("falls back to a usable name when nothing survives", () => {
    expect(frameFileName("___.mp4", 0)).toBe("video-frame-0m00s.jpg");
  });
});
