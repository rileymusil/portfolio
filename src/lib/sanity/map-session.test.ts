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
  it("maps a Sanity document into a gallery session with sized image URLs", () => {
    const session = mapPhotoSession(validDoc);

    expect(session).toMatchObject({
      id: "session-1",
      title: "Creative Sessions",
      description: "Editorial and conceptual work.",
      category: "creative",
      cover: {
        alt: "Cover",
      },
      photos: [
        {
          alt: "Photo one",
        },
      ],
    });
    expect(session?.cover.coverUrl).toContain("cover.jpg");
    expect(session?.cover.coverUrl).toContain("w=900");
    expect(session?.photos[0]?.thumbUrl).toContain("one.jpg");
    expect(session?.photos[0]?.thumbUrl).toContain("w=400");
    expect(session?.photos[0]?.fullUrl).toContain("w=1600");
    expect(session?.photos[0]?.fullUrl).toContain("auto=format");
  });

  it("passes through low-quality image placeholders", () => {
    const session = mapPhotoSession({
      ...validDoc,
      coverLqip: "data:image/jpeg;base64,cover",
      photos: [
        {
          url: "https://cdn.sanity.io/images/proj/production/one.jpg",
          alt: "Photo one",
          lqip: "data:image/jpeg;base64,one",
        },
      ],
    });

    expect(session?.cover.lqip).toBe("data:image/jpeg;base64,cover");
    expect(session?.photos[0]?.lqip).toBe("data:image/jpeg;base64,one");
  });

  it("returns null for incomplete documents", () => {
    expect(mapPhotoSession({ title: "Missing id" })).toBeNull();
  });

  it("filters invalid documents from a list", () => {
    expect(mapPhotoSessions([validDoc, { title: "bad" }])).toHaveLength(1);
  });
});
