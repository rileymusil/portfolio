import { describe, expect, it } from "vitest";
import { videoProjectType } from "@/sanity/schemaTypes/videoProject";

interface FieldLike {
  name: string;
  type: string;
  hidden?: unknown;
  readOnly?: unknown;
}

const fields = videoProjectType.fields as unknown as FieldLike[];

function field(name: string): FieldLike {
  const found = fields.find((entry) => entry.name === name);
  if (!found) {
    throw new Error(`no ${name} field on videoProject`);
  }
  return found;
}

describe("videoProject ordering", () => {
  it("carries the rank field the draggable lists write to", () => {
    expect(field("orderRank")).toBeTruthy();
  });

  it("keeps the old numeric field out of the form but still on the document", () => {
    /* Removing it outright would drop the ordering of every project nobody has
       dragged yet; hiding it stops anyone maintaining two orderings at once. */
    const legacy = field("order");
    expect(legacy.hidden).toBe(true);
    expect(legacy.readOnly).toBe(true);
  });

  it("sorts the Studio list by rank rather than by the old number", () => {
    const orderings = videoProjectType.orderings ?? [];
    expect(orderings).toHaveLength(1);
    expect(JSON.stringify(orderings)).toContain("orderRank");
  });
});
