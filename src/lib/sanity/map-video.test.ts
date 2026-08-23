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
      youtubeId: "YqYoziZZlg8",
      badges: ["Camera Operator", "Director"],
      stills: [
        {
          alt: "Early location scouting",
          caption: "Early Location Scouting",
        },
      ],
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
    expect(mapVideoProject({ ...validDoc, youtubeId: undefined }, 0)).toBeNull();
    expect(
      mapVideoProject(
        { ...validDoc, youtubeId: "https://youtu.be/YqYoziZZlg8" },
        0,
      ),
    ).toBeNull();
    expect(mapVideoProject({ ...validDoc, category: "portraits" }, 0)).toBeNull();
    expect(mapVideoProject({ ...validDoc, title: "" }, 0)).toBeNull();
    expect(mapVideoProject(null, 0)).toBeNull();
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
