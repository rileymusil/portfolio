/* ==========================================================================
   html-to-blocks.ts

   One-way converter from the hand-written HTML descriptions that used to live
   in src/lib/video-projects.ts into Portable Text, so the Studio can edit them.

   Only the tags those descriptions actually use are supported: <p>, <em>/<i>,
   <strong>/<b>, <a>, <ul>/<ol>/<li>, <br>. Anything else contributes its text
   and drops its formatting, which is loud enough to spot in review and safer
   than silently inventing block types the page has no styles for.

   This exists for the migration only — delete it once the projects are in
   Sanity and video-projects.ts is gone.
   ========================================================================== */

import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

export type HtmlParser = (html: string) => Document;

const DECORATOR_TAGS: Record<string, string> = {
  EM: "em",
  I: "em",
  STRONG: "strong",
  B: "strong",
};

const BLOCK_TAGS = new Set(["P", "DIV", "UL", "OL", "BLOCKQUOTE"]);

function defaultParser(html: string): Document {
  return new DOMParser().parseFromString(html, "text/html");
}

/* Keys only need to be unique inside the document, and a counter keeps the
   output identical between runs so re-running the migration produces no diff. */
function keyFactory(prefix: string): () => string {
  let n = 0;
  return () => {
    n += 1;
    return `${prefix}${n}`;
  };
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ");
}

interface BlockBuilder {
  children: PortableTextSpan[];
  markDefs: NonNullable<PortableTextBlock["markDefs"]>;
}

export function htmlToBlocks(
  html: string,
  parse: HtmlParser = defaultParser,
): PortableTextBlock[] {
  const doc = parse(`<body>${html}</body>`);
  const nextBlockKey = keyFactory("b");
  const nextSpanKey = keyFactory("s");
  const nextMarkKey = keyFactory("m");
  const blocks: PortableTextBlock[] = [];

  function buildBlock(
    node: Node,
    style: string,
    listItem?: "bullet" | "number",
  ): void {
    const builder: BlockBuilder = { children: [], markDefs: [] };
    walkInline(node, [], builder);

    /* Trim the edges only: interior spacing carries meaning between spans. */
    const spans = builder.children;
    if (spans.length) {
      spans[0].text = spans[0].text.replace(/^\s+/, "");
      spans[spans.length - 1].text = spans[spans.length - 1].text.replace(
        /\s+$/,
        "",
      );
    }
    const kept = spans.filter((span) => span.text.length > 0);
    if (!kept.length) {
      return;
    }

    blocks.push({
      _type: "block",
      _key: nextBlockKey(),
      style,
      markDefs: builder.markDefs,
      children: kept,
      ...(listItem ? { listItem, level: 1 } : {}),
    });
  }

  function walkInline(node: Node, marks: string[], builder: BlockBuilder): void {
    node.childNodes.forEach((child) => {
      if (child.nodeType === 3 /* text */) {
        const text = collapseWhitespace(child.textContent ?? "");
        if (!text) {
          return;
        }
        const last = builder.children[builder.children.length - 1];
        /* Merge into the previous span when the marks match, so "a <em>b</em>"
           doesn't fragment into more spans than the editor needs. */
        if (last && sameMarks(last.marks ?? [], marks)) {
          last.text += text;
          return;
        }
        builder.children.push({
          _type: "span",
          _key: nextSpanKey(),
          text,
          marks: [...marks],
        });
        return;
      }

      if (child.nodeType !== 1 /* element */) {
        return;
      }

      const element = child as Element;
      const tag = element.tagName.toUpperCase();

      if (tag === "BR") {
        const last = builder.children[builder.children.length - 1];
        if (last) {
          last.text += "\n";
        }
        return;
      }

      if (tag === "A") {
        const href = element.getAttribute("href");
        if (!href) {
          walkInline(element, marks, builder);
          return;
        }
        const markKey = nextMarkKey();
        builder.markDefs.push({
          _type: "link",
          _key: markKey,
          href,
          /* The old markup opened every link in a new tab. Honour an explicit
             target when one is present, default to true otherwise. */
          openInNewTab: (element.getAttribute("target") ?? "_blank") === "_blank",
        });
        walkInline(element, [...marks, markKey], builder);
        return;
      }

      const decorator = DECORATOR_TAGS[tag];
      if (decorator) {
        walkInline(element, [...marks, decorator], builder);
        return;
      }

      walkInline(element, marks, builder);
    });
  }

  function walkBlocks(parent: Node): void {
    const inlineRun: Node[] = [];

    const flushInline = (): void => {
      if (!inlineRun.length) {
        return;
      }
      /* Bare inline content at the top level still deserves a paragraph. */
      const holder = doc.createElement("p");
      inlineRun.forEach((node) => holder.appendChild(node.cloneNode(true)));
      inlineRun.length = 0;
      buildBlock(holder, "normal");
    };

    parent.childNodes.forEach((child) => {
      const tag =
        child.nodeType === 1 ? (child as Element).tagName.toUpperCase() : "";

      if (!BLOCK_TAGS.has(tag)) {
        if (child.nodeType === 3 && !collapseWhitespace(child.textContent ?? "").trim()) {
          return;
        }
        inlineRun.push(child);
        return;
      }

      flushInline();

      if (tag === "UL" || tag === "OL") {
        const listItem = tag === "UL" ? "bullet" : "number";
        Array.from(child.childNodes).forEach((item) => {
          if (item.nodeType === 1 && (item as Element).tagName.toUpperCase() === "LI") {
            buildBlock(item, "normal", listItem);
          }
        });
        return;
      }

      if (tag === "DIV") {
        walkBlocks(child);
        return;
      }

      buildBlock(child, "normal");
    });

    flushInline();
  }

  walkBlocks(doc.body);
  return blocks;
}

function sameMarks(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((mark, i) => mark === b[i]);
}
