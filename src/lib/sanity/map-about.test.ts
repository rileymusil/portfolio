import { describe, expect, it } from "vitest";
import { aboutFallback, mapAboutPage } from "@/lib/sanity/map-about";

describe("mapAboutPage", () => {
  it("falls back to the repo copy when Sanity has no document", () => {
    expect(mapAboutPage(null)).toEqual(aboutFallback);
  });

  it("prefers Sanity values over the fallback", () => {
    const about = mapAboutPage({
      bannerTitle: "About Riley",
      bannerSubtitle: "Camera operator",
      role: "Director",
      honors: ["Dean's list"],
    });

    expect(about.bannerTitle).toBe("About Riley");
    expect(about.role).toBe("Director");
    expect(about.honors).toEqual(["Dean's list"]);
  });

  it("falls back per section, so a half-filled document still renders", () => {
    const about = mapAboutPage({ bannerTitle: "About Riley" });

    expect(about.bannerTitle).toBe("About Riley");
    expect(about.skillGroups).toEqual(aboutFallback.skillGroups);
    expect(about.headshot).toEqual(aboutFallback.headshot);
    expect(about.education).toEqual(aboutFallback.education);
  });

  it("maps images and drops entries with no asset", () => {
    const about = mapAboutPage({
      fieldPhotos: [
        { url: "https://cdn.sanity.io/images/p/production/a.jpg", alt: "On set" },
        { alt: "no asset yet" },
      ],
    });

    expect(about.fieldPhotos).toHaveLength(1);
    expect(about.fieldPhotos[0]?.alt).toBe("On set");
    expect(about.fieldPhotos[0]?.url).toContain("w=900");
  });

  it("keeps only experience entries that have a role", () => {
    const about = mapAboutPage({
      experience: [
        { role: "Editor", organization: "Acme", dates: "2024", bullets: ["Cut"] },
        { organization: "No role" },
      ],
    });

    expect(about.experience).toEqual([
      { role: "Editor", organization: "Acme", dates: "2024", bullets: ["Cut"] },
    ]);
  });
});
