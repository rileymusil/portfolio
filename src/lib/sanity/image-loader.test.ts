import { describe, expect, it } from "vitest";
import sanityImageLoader from "@/lib/sanity/image-loader";

const SANITY_SRC =
  "https://cdn.sanity.io/images/abc123/production/photo-6000x4000.jpg";

describe("sanity image loader", () => {
  it("requests only the width the slot renders at", () => {
    const url = new URL(sanityImageLoader({ src: SANITY_SRC, width: 640 }));

    expect(url.searchParams.get("w")).toBe("640");
    expect(url.searchParams.get("auto")).toBe("format");
    expect(url.searchParams.get("fit")).toBe("max");
    expect(url.origin + url.pathname).toBe(SANITY_SRC);
  });

  it("defaults quality but honours an explicit one", () => {
    expect(
      new URL(
        sanityImageLoader({ src: SANITY_SRC, width: 640 }),
      ).searchParams.get("q"),
    ).toBe("75");
    expect(
      new URL(
        sanityImageLoader({ src: SANITY_SRC, width: 640, quality: 90 }),
      ).searchParams.get("q"),
    ).toBe("90");
  });

  it("keeps existing transform params on the asset url", () => {
    const url = new URL(
      sanityImageLoader({ src: `${SANITY_SRC}?rect=0,0,100,100`, width: 320 }),
    );

    expect(url.searchParams.get("rect")).toBe("0,0,100,100");
    expect(url.searchParams.get("w")).toBe("320");
  });

  it("passes through sources Sanity cannot transform", () => {
    expect(sanityImageLoader({ src: "/MarkRM.png", width: 800 })).toBe(
      "/MarkRM.png",
    );
    expect(
      sanityImageLoader({
        src: "https://img.youtube.com/vi/abc/hqdefault.jpg",
        width: 800,
      }),
    ).toBe("https://img.youtube.com/vi/abc/hqdefault.jpg");
  });
});
