import { describe, expect, it } from "vitest";
import {
  compressImageFile,
  shouldCompressUpload,
  UPLOAD_MAX_EDGE_PX,
  uploadTargetSize,
} from "@/lib/sanity/compress-image";

describe("shouldCompressUpload", () => {
  it("compresses camera originals that exceed the long-edge cap", () => {
    expect(
      shouldCompressUpload({ width: 6000, height: 4000, byteSize: 200_000 }),
    ).toBe(true);
  });

  it("compresses already-small-dimension files that are still huge on disk", () => {
    expect(
      shouldCompressUpload({ width: 1200, height: 800, byteSize: 4_000_000 }),
    ).toBe(true);
  });

  it("leaves modest web images alone", () => {
    expect(
      shouldCompressUpload({ width: 1200, height: 800, byteSize: 200_000 }),
    ).toBe(false);
  });
});

describe("uploadTargetSize", () => {
  it("scales the long edge down to the upload cap", () => {
    expect(uploadTargetSize(6000, 4000)).toEqual({
      width: UPLOAD_MAX_EDGE_PX,
      height: Math.round((4000 / 6000) * UPLOAD_MAX_EDGE_PX),
    });
  });

  it("does not upscale smaller photos", () => {
    expect(uploadTargetSize(1200, 800)).toEqual({ width: 1200, height: 800 });
  });
});

describe("compressImageFile", () => {
  it("returns the original file when the browser cannot decode it", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.jpg", {
      type: "image/jpeg",
    });

    await expect(compressImageFile(file)).resolves.toBe(file);
  });

  it("skips gifs so animation is preserved", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "loop.gif", {
      type: "image/gif",
    });

    await expect(compressImageFile(file)).resolves.toBe(file);
  });
});
