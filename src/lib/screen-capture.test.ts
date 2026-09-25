import { describe, expect, it } from "vitest";
import {
  cropRectToPixels,
  isUsableCrop,
  normalizeCropRect,
} from "@/lib/screen-capture";

describe("normalizeCropRect", () => {
  it("builds the same rect whichever way the drag went", () => {
    const forward = normalizeCropRect(0.2, 0.3, 0.6, 0.8);
    const backward = normalizeCropRect(0.6, 0.8, 0.2, 0.3);
    expect(forward).toEqual(backward);
    /* Fractions, so compared approximately; they are rounded to whole pixels
       by cropRectToPixels before anything is drawn. */
    expect(forward.x).toBeCloseTo(0.2);
    expect(forward.y).toBeCloseTo(0.3);
    expect(forward.width).toBeCloseTo(0.4);
    expect(forward.height).toBeCloseTo(0.5);
  });

  it("clamps a drag that left the frame", () => {
    expect(normalizeCropRect(-0.5, -0.2, 1.4, 1.9)).toEqual({
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    });
  });

  it("treats nonsense coordinates as the origin rather than throwing", () => {
    expect(normalizeCropRect(Number.NaN, 0, 0.5, 0.5)).toEqual({
      x: 0,
      y: 0,
      width: 0.5,
      height: 0.5,
    });
  });
});

describe("isUsableCrop", () => {
  it("accepts a real selection", () => {
    expect(isUsableCrop({ x: 0.1, y: 0.1, width: 0.5, height: 0.4 })).toBe(
      true,
    );
  });

  it("rejects a stray click, so it falls back to the whole frame", () => {
    expect(isUsableCrop({ x: 0.5, y: 0.5, width: 0, height: 0 })).toBe(false);
    expect(isUsableCrop({ x: 0.5, y: 0.5, width: 0.3, height: 0.001 })).toBe(
      false,
    );
    expect(isUsableCrop(null)).toBe(false);
  });
});

describe("cropRectToPixels", () => {
  it("scales a fractional rect onto the frame", () => {
    expect(
      cropRectToPixels(
        { x: 0.25, y: 0.5, width: 0.5, height: 0.25 },
        1920,
        1080,
      ),
    ).toEqual({ x: 480, y: 540, width: 960, height: 270 });
  });

  it("keeps a selection dragged to the edge inside the frame", () => {
    const rect = cropRectToPixels(
      { x: 0.9, y: 0.9, width: 0.5, height: 0.5 },
      1000,
      1000,
    );
    expect(rect.x + rect.width).toBeLessThanOrEqual(1000);
    expect(rect.y + rect.height).toBeLessThanOrEqual(1000);
  });

  it("never produces a zero-sized region, which would fail to encode", () => {
    const rect = cropRectToPixels(
      { x: 0, y: 0, width: 0.0001, height: 0.0001 },
      1920,
      1080,
    );
    expect(rect.width).toBeGreaterThanOrEqual(1);
    expect(rect.height).toBeGreaterThanOrEqual(1);
  });

  it("returns the whole frame for a full-size rect", () => {
    expect(
      cropRectToPixels({ x: 0, y: 0, width: 1, height: 1 }, 800, 600),
    ).toEqual({
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    });
  });
});
