import { describe, expect, it } from "vitest";
import { mapPhotoSession, mapPhotoSessions } from "@/lib/sanity/map-session";

const validDoc = {
  _id: "session-1",
  title: "Creative Sessions",
  description: "Editorial and conceptual work.",
  category: "creative",
  coverUrl: "https://cdn.sanity.io/images/proj/production/cover.jpg",
  coverAlt: "Cover",
  photos: [
    {
      url: "https://cdn.sanity.io/images/proj/production/one.jpg",
      alt: "Photo one",
    },
  ],
};

describe("mapPhotoSession", () => {
  it("maps a Sanity document into a gallery session", () => {
    expect(mapPhotoSession(validDoc)).toEqual({
      id: "session-1",
      title: "Creative Sessions",
      description: "Editorial and conceptual work.",
      category: "creative",
      cover: {
        url: "https://cdn.sanity.io/images/proj/production/cover.jpg",
        alt: "Cover",
      },
      photos: [
        {
          url: "https://cdn.sanity.io/images/proj/production/one.jpg",
          alt: "Photo one",
        },
      ],
    });
  });

  it("returns null for incomplete documents", () => {
    expect(mapPhotoSession({ title: "Missing id" })).toBeNull();
  });

  it("filters invalid documents from a list", () => {
    expect(mapPhotoSessions([validDoc, { title: "bad" }])).toHaveLength(1);
  });
});
