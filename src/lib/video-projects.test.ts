import { describe, expect, it } from "vitest";
import {
  commercialProjects,
  getYoutubeThumbnailUrl,
  narrativeProjects,
} from "@/lib/video-projects";

describe("video projects", () => {
  it("builds YouTube thumbnail URLs", () => {
    expect(getYoutubeThumbnailUrl("YqYoziZZlg8")).toBe(
      "https://img.youtube.com/vi/YqYoziZZlg8/hqdefault.jpg",
    );
  });

  it("includes the commercial and narrative reels from the original site", () => {
    expect(commercialProjects[0]?.title).toBe("NC Church Youth Camp Video");
    expect(commercialProjects[0]?.youtubeId).toBe("9wd2dRwnwMc");
    expect(narrativeProjects[0]?.title).toBe("The Man in the Woods");
    expect(narrativeProjects).toHaveLength(5);
    expect(commercialProjects).toHaveLength(7);
  });
});
