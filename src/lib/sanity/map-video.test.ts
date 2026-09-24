import { describe, expect, it } from "vitest";
import { mapVideoProject, mapVideoProjects } from "@/lib/sanity/map-video";

const linkedDescription = [
  {
    _type: "block",
    _key: "b1",
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: "l1",
        href: "https://global.canon/en/c-museum/product/cesc900.html",
        openInNewTab: true,
      },
    ],
    children: [
      { _type: "span", _key: "s1", text: "Shot on the ", marks: [] },
      { _type: "span", _key: "s2", text: "Canon R5 C", marks: ["l1"] },
      { _type: "span", _key: "s3", text: ".", marks: [] },
    ],
  },
];

const validDoc = {
  _id: "videoProject.the-man-in-the-woods",
  title: "The Man in the Woods",
  category: "narrative",
  youtubeId: "YqYoziZZlg8",
  badges: ["Camera Operator", "Director"],
  description: linkedDescription,
  stills: [
    {
      url: "https://cdn.sanity.io/images/proj/production/scout.jpg",
      alt: "Early location scouting",
      caption: "Early Location Scouting",
    },
  ],
};

describe("mapVideoProject", () => {
  it("maps a Sanity document into a video project with sized still URLs", () => {
    const project = mapVideoProject(validDoc, 0);

    expect(project).toMatchObject({
      id: "videoProject.the-man-in-the-woods",
      number: "01",
      title: "The Man in the Woods",
      category: "narrative",
      badges: ["Camera Operator", "Director"],
      stills: [
        {
          alt: "Early location scouting",
          caption: "Early Location Scouting",
        },
      ],
    });
    expect(project?.embed).toMatchObject({
      source: "youtube",
      embedUrl: "https://www.youtube-nocookie.com/embed/YqYoziZZlg8",
    });
    expect(project?.stills[0]?.thumbUrl).toContain("scout.jpg");
    expect(project?.stills[0]?.thumbUrl).toContain("w=900");
    expect(project?.stills[0]?.fullUrl).toContain("w=1600");
  });

  it("keeps link annotations intact so embedded links survive the mapping", () => {
    const project = mapVideoProject(validDoc, 0);
    const block = project?.description[0] as (typeof linkedDescription)[number];

    expect(block.markDefs[0]).toMatchObject({
      _type: "link",
      _key: "l1",
      href: "https://global.canon/en/c-museum/product/cesc900.html",
    });
    expect(block.children[1]?.marks).toEqual(["l1"]);
  });

  it("numbers projects from their position in the list", () => {
    expect(mapVideoProject(validDoc, 4)?.number).toBe("05");
  });

  it("falls back to the project title when a still has no alt text", () => {
    const project = mapVideoProject(
      { ...validDoc, stills: [{ url: "https://cdn.sanity.io/a.jpg" }] },
      0,
    );

    expect(project?.stills[0]?.alt).toBe("The Man in the Woods");
    expect(project?.stills[0]?.caption).toBe("");
  });

  it("rejects documents that would render a dead embed or an unknown category", () => {
    expect(
      mapVideoProject({ ...validDoc, youtubeId: undefined }, 0),
    ).toBeNull();
    expect(
      mapVideoProject({ ...validDoc, youtubeId: "not-a-link" }, 0),
    ).toBeNull();
    expect(
      mapVideoProject({ ...validDoc, category: "portraits" }, 0),
    ).toBeNull();
    expect(mapVideoProject({ ...validDoc, title: "" }, 0)).toBeNull();
    expect(mapVideoProject(null, 0)).toBeNull();
  });

  it("reads videoUrl for any supported platform", () => {
    const { youtubeId: _legacy, ...doc } = validDoc;

    expect(
      mapVideoProject({ ...doc, videoUrl: "https://vimeo.com/824804225" }, 0)
        ?.embed,
    ).toMatchObject({
      source: "vimeo",
      embedUrl: "https://player.vimeo.com/video/824804225",
    });
    expect(
      mapVideoProject(
        {
          ...doc,
          videoUrl: "https://www.tiktok.com/@a/video/7234567890123456789",
        },
        0,
      )?.embed,
    ).toMatchObject({ source: "tiktok", orientation: "portrait" });
  });

  it("keeps a legacy youtubeId document playing with no migration", () => {
    const project = mapVideoProject(validDoc, 0);
    expect(project?.embed.source).toBe("youtube");
    expect(project?.thumbnailUrl).toBe(
      "https://img.youtube.com/vi/YqYoziZZlg8/hqdefault.jpg",
    );
  });

  it("prefers videoUrl over a legacy youtubeId when both are present", () => {
    const project = mapVideoProject(
      { ...validDoc, videoUrl: "https://vimeo.com/824804225" },
      0,
    );
    expect(project?.embed.source).toBe("vimeo");
  });

  it("uses an uploaded cover in place of the platform thumbnail", () => {
    const project = mapVideoProject(
      {
        ...validDoc,
        thumbnail: {
          url: "https://cdn.sanity.io/images/proj/production/cover.jpg",
          lqip: "data:image/jpeg;base64,abc",
        },
      },
      0,
    );

    expect(project?.thumbnailUrl).toContain("cover.jpg");
    expect(project?.thumbnailUrl).toContain("w=900");
    expect(project?.thumbnailLqip).toBe("data:image/jpeg;base64,abc");
  });

  it("leaves the thumbnail null when the platform serves none and none was uploaded", () => {
    const { youtubeId: _legacy, ...doc } = validDoc;
    const project = mapVideoProject(
      { ...doc, videoUrl: "https://vimeo.com/824804225" },
      0,
    );

    expect(project?.thumbnailUrl).toBeNull();
  });

  it("defaults badges, description, and stills to empty lists", () => {
    const project = mapVideoProject(
      {
        _id: "videoProject.bare",
        title: "Bare",
        category: "commercial",
        youtubeId: "abcdefghijk",
      },
      0,
    );

    expect(project).toMatchObject({
      badges: [],
      description: [],
      stills: [],
    });
  });
});

describe("mapVideoProjects", () => {
  it("skips malformed documents without leaving a gap in the numbering", () => {
    const projects = mapVideoProjects([
      validDoc,
      { ...validDoc, _id: "broken", youtubeId: "nope" },
      { ...validDoc, _id: "videoProject.second", title: "Second" },
    ]);

    expect(projects).toHaveLength(2);
    expect(projects.map((project) => project.number)).toEqual(["01", "02"]);
    expect(projects[1]?.title).toBe("Second");
  });
});
