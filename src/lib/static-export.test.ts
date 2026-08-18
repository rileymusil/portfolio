import { describe, expect, it } from "vitest";
import { getBasePath, getStaticExportOptions } from "@/lib/static-export";

describe("static export for GitHub Pages", () => {
  it("writes a static HTML site instead of a Node server", () => {
    expect(getStaticExportOptions({}).output).toBe("export");
  });

  it("uses trailing slashes so Pages can serve nested routes as index.html", () => {
    expect(getStaticExportOptions({}).trailingSlash).toBe(true);
  });

  it("disables the image optimizer, which needs a Next.js server", () => {
    expect(getStaticExportOptions({}).images).toEqual({ unoptimized: true });
  });

  it("has no base path on a custom domain or user site", () => {
    expect(getBasePath({})).toBe("");
    expect(getStaticExportOptions({}).basePath).toBe("");
  });

  it("prefixes project-site deploys from NEXT_PUBLIC_BASE_PATH", () => {
    expect(
      getBasePath({ NEXT_PUBLIC_BASE_PATH: "business-template-react-ts" }),
    ).toBe("/business-template-react-ts");
  });

  it("normalizes slashes on NEXT_PUBLIC_BASE_PATH", () => {
    expect(getBasePath({ NEXT_PUBLIC_BASE_PATH: "/my-repo/" })).toBe(
      "/my-repo",
    );
  });
});
