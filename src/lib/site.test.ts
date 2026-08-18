import { describe, expect, it } from "vitest";
import { navLinks, site } from "@/lib/site";

describe("site content", () => {
  it("identifies Riley Musil's business details", () => {
    expect(site.name).toBe("Riley Musil");
    expect(site.email).toBe("rileymusil2006@gmail.com");
    expect(site.phoneDisplay).toBe("(832) 303-3162");
    expect(site.phoneHref).toBe("tel:+18323033162");
    expect(site.location).toBe("Houston, TX");
    expect(site.bookNowUrl).toBe("http://rileymusil.square.site/");
  });

  it("exposes the primary navigation in order", () => {
    expect(navLinks.map((link) => link.href)).toEqual([
      "/video",
      "/photography",
      "/about",
      "/contact",
    ]);
  });
});
