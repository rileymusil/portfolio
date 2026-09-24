import { describe, expect, it } from "vitest";
import {
  candidateTimes,
  formatTimecode,
  frameFileName,
  isVideoFile,
  pickBestFrame,
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

describe("candidateTimes", () => {
  it("samples the middle of the clip, avoiding the opening and the tail", () => {
    const times = candidateTimes(100, 5);
    expect(times).toEqual([15, 32.5, 50, 67.5, 85]);
  });

  it("never samples the very first frame, which is usually black", () => {
    expect(candidateTimes(60).every((time) => time > 0)).toBe(true);
  });

  it("falls back to the start for a clip with no usable duration", () => {
    expect(candidateTimes(0)).toEqual([0]);
    expect(candidateTimes(Number.NaN)).toEqual([0]);
    expect(candidateTimes(Number.POSITIVE_INFINITY)).toEqual([0]);
  });

  it("takes the midpoint when only one sample is wanted", () => {
    expect(candidateTimes(100, 1)).toEqual([50]);
  });
});

describe("pickBestFrame", () => {
  it("skips a black opening in favour of a frame with detail", () => {
    expect(
      pickBestFrame([
        { time: 1, mean: 2, variance: 900 },
        { time: 5, mean: 120, variance: 400 },
      ]),
    ).toBe(5);
  });

  it("skips a blown-out frame the same way", () => {
    expect(
      pickBestFrame([
        { time: 1, mean: 250, variance: 800 },
        { time: 5, mean: 110, variance: 300 },
      ]),
    ).toBe(5);
  });

  it("prefers the most detailed frame among usable ones", () => {
    expect(
      pickBestFrame([
        { time: 1, mean: 120, variance: 100 },
        { time: 5, mean: 130, variance: 950 },
        { time: 9, mean: 125, variance: 500 },
      ]),
    ).toBe(5);
  });

  it("still returns something when every frame is dark, rather than nothing", () => {
    expect(
      pickBestFrame([
        { time: 1, mean: 3, variance: 10 },
        { time: 5, mean: 4, variance: 90 },
      ]),
    ).toBe(5);
  });

  it("returns null when there is nothing to choose from", () => {
    expect(pickBestFrame([])).toBeNull();
  });
});
