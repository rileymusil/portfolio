import { describe, expect, it } from "vitest";
import { site } from "@/lib/site";
import {
  buildStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

interface GraphNode {
  "@type": string;
  "@id"?: string;
  [key: string]: unknown;
}

function graphOf(data: Record<string, unknown>): GraphNode[] {
  return data["@graph"] as GraphNode[];
}

function nodeOfType(data: Record<string, unknown>, type: string): GraphNode {
  const node = graphOf(data).find((entry) => entry["@type"] === type);
  if (!node) {
    throw new Error(`no ${type} node in the graph`);
  }
  return node;
}

describe("buildStructuredData", () => {
  it("describes the site, the person, and the business", () => {
    const types = graphOf(buildStructuredData()).map((node) => node["@type"]);
    expect(types).toEqual(["WebSite", "Person", "ProfessionalService"]);
  });

  it("publishes the contact details Google shows for a local business", () => {
    const business = nodeOfType(buildStructuredData(), "ProfessionalService");
    expect(business.telephone).toBe("+18323033162");
    expect(business.email).toBe(`mailto:${site.email}`);
    expect(business.address).toMatchObject({
      addressLocality: "Houston",
      addressRegion: "TX",
    });
  });

  it("cross-references the person and the business by id", () => {
    const data = buildStructuredData();
    const person = nodeOfType(data, "Person");
    const business = nodeOfType(data, "ProfessionalService");
    expect(person.worksFor).toEqual({ "@id": business["@id"] });
    expect(business.founder).toEqual({ "@id": person["@id"] });
  });

  it("links the social profiles so they can be matched to the business", () => {
    const business = nodeOfType(buildStructuredData(), "ProfessionalService");
    expect(business.sameAs).toEqual([site.linkedinUrl, site.instagramUrl]);
  });
});

describe("serializeStructuredData", () => {
  it("escapes angle brackets so the payload cannot close the script tag", () => {
    const json = serializeStructuredData({ name: "</script><img>" });
    expect(json).not.toContain("</script>");
    expect(JSON.parse(json)).toEqual({ name: "</script><img>" });
  });
});
