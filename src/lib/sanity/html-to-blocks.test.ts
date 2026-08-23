import { describe, expect, it } from "vitest";
import { htmlToBlocks } from "@/lib/sanity/html-to-blocks";

describe("htmlToBlocks", () => {
  it("converts a paragraph into a normal block", () => {
    const blocks = htmlToBlocks("<p>A short film.</p>");

    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      _type: "block",
      style: "normal",
      markDefs: [],
    });
    expect(blocks[0]?.children?.[0]).toMatchObject({
      _type: "span",
      text: "A short film.",
      marks: [],
    });
  });

  it("turns an anchor into a link annotation the Studio can edit", () => {
    const blocks = htmlToBlocks(
      `<p>Shot on the <a href="https://global.canon/en/c-museum/product/cesc900.html" target="_blank" rel="noopener">Canon R5 C</a> body.</p>`,
    );

    const [block] = blocks;
    expect(block?.markDefs).toHaveLength(1);
    const markDef = block?.markDefs?.[0] as {
      _type: string;
      _key: string;
      href: string;
      openInNewTab: boolean;
    };
    expect(markDef).toMatchObject({
      _type: "link",
      href: "https://global.canon/en/c-museum/product/cesc900.html",
      openInNewTab: true,
    });

    const linked = block?.children?.find((child) =>
      (child.marks ?? []).includes(markDef._key),
    );
    expect(linked?.text).toBe("Canon R5 C");
  });

  it("keeps every link in a paragraph that has several", () => {
    const blocks = htmlToBlocks(
      `<p>The <a href="https://example.com/one">first</a> and the <a href="https://example.com/two">second</a>.</p>`,
    );

    const hrefs = (blocks[0]?.markDefs ?? []).map(
      (def) => (def as { href: string }).href,
    );
    expect(hrefs).toEqual(["https://example.com/one", "https://example.com/two"]);
  });

  it("preserves emphasis, including inside a link", () => {
    const blocks = htmlToBlocks(
      `<p>Titled <em>Family Dinner</em> by <a href="https://linktr.ee/probablyaves"><em>Avery</em></a>.</p>`,
    );

    const [block] = blocks;
    const emphasised = block?.children?.find((child) => child.text === "Family Dinner");
    expect(emphasised?.marks).toEqual(["em"]);

    const linkKey = (block?.markDefs?.[0] as { _key: string })._key;
    const linkedEm = block?.children?.find((child) => child.text === "Avery");
    expect(linkedEm?.marks).toEqual([linkKey, "em"]);
  });

  it("splits multiple paragraphs into separate blocks", () => {
    const blocks = htmlToBlocks("<p>One.</p><p>Two.</p>");

    expect(blocks).toHaveLength(2);
    expect(blocks[1]?.children?.[0]?.text).toBe("Two.");
  });

  it("collapses the whitespace that source formatting leaves behind", () => {
    const blocks = htmlToBlocks("<p>\n   Lots    of\n   space.\n</p>");

    expect(blocks[0]?.children?.[0]?.text).toBe("Lots of space.");
  });

  it("wraps bare inline content in a paragraph", () => {
    const blocks = htmlToBlocks("No tags at all.");

    expect(blocks).toHaveLength(1);
    expect(blocks[0]?.children?.[0]?.text).toBe("No tags at all.");
  });

  it("maps lists onto list items", () => {
    const blocks = htmlToBlocks("<ul><li>First</li><li>Second</li></ul>");

    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toMatchObject({ listItem: "bullet", level: 1 });
    expect(blocks[1]?.children?.[0]?.text).toBe("Second");
  });

  it("drops blocks that hold no text", () => {
    expect(htmlToBlocks("<p>  </p><p>Real.</p>")).toHaveLength(1);
  });

  it("generates stable keys so re-running the migration produces no diff", () => {
    const html = `<p>Shot on the <a href="https://example.com">Canon</a>.</p>`;
    expect(htmlToBlocks(html)).toEqual(htmlToBlocks(html));
  });
});
