import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  assetUrl,
  DEFAULT_SITE_ORIGIN,
  getSiteOrigin,
} from "@/lib/site-url";

describe("getSiteOrigin", () => {
  it("falls back to the custom domain when the env var is unset", () => {
    expect(getSiteOrigin({})).toBe(DEFAULT_SITE_ORIGIN);
  });

  it("ignores a blank env var rather than producing a relative URL", () => {
    expect(getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "   " })).toBe(
      DEFAULT_SITE_ORIGIN,
    );
  });

  it("strips a trailing slash so callers can append paths safely", () => {
    expect(
      getSiteOrigin({ NEXT_PUBLIC_SITE_URL: "https://example.com/" }),
    ).toBe("https://example.com");
  });
});

describe("absoluteUrl", () => {
  it("keeps the trailing slash the export actually serves", () => {
    expect(absoluteUrl("/about", {})).toBe(`${DEFAULT_SITE_ORIGIN}/about/`);
  });

  it("maps the home path to the bare origin with one slash", () => {
    expect(absoluteUrl("/", {})).toBe(`${DEFAULT_SITE_ORIGIN}/`);
  });

  it("applies the base path for a project site", () => {
    expect(
      absoluteUrl("/video/narrative", { NEXT_PUBLIC_BASE_PATH: "repo" }),
    ).toBe(`${DEFAULT_SITE_ORIGIN}/repo/video/narrative/`);
  });

  it("normalises paths given without a leading slash", () => {
    expect(absoluteUrl("contact", {})).toBe(`${DEFAULT_SITE_ORIGIN}/contact/`);
  });
});

describe("assetUrl", () => {
  it("does not add a trailing slash to a file", () => {
    expect(assetUrl("/og-image.png", {})).toBe(
      `${DEFAULT_SITE_ORIGIN}/og-image.png`,
    );
  });

  it("includes the base path so the file resolves on a project site", () => {
    expect(assetUrl("/og-image.png", { NEXT_PUBLIC_BASE_PATH: "/repo/" })).toBe(
      `${DEFAULT_SITE_ORIGIN}/repo/og-image.png`,
    );
  });
});
