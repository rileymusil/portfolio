import { describe, expect, it, vi } from "vitest";
import { extractOgImage, resolveVideoThumbnail } from "@/lib/og-thumbnail";

const REEL = "https://www.facebook.com/reel/2146730069387806";

function htmlWith(...tags: string[]): string {
  return `<!doctype html><html><head>${tags.join("")}</head><body></body></html>`;
}

function respondWith(
  html: string,
  init: { ok?: boolean; status?: number } = {},
) {
  return vi.fn(
    async () =>
      ({
        ok: init.ok ?? true,
        status: init.status ?? 200,
        text: async () => html,
      }) as unknown as Response,
  );
}

describe("extractOgImage", () => {
  it("reads a standard og:image tag", () => {
    expect(
      extractOgImage(
        htmlWith(
          '<meta property="og:image" content="https://cdn.fb.com/a.jpg">',
        ),
      ),
    ).toBe("https://cdn.fb.com/a.jpg");
  });

  it("copes with the attributes in the other order, which Facebook emits", () => {
    expect(
      extractOgImage(
        htmlWith(
          '<meta content="https://cdn.fb.com/a.jpg" property="og:image"/>',
        ),
      ),
    ).toBe("https://cdn.fb.com/a.jpg");
  });

  it("handles single quotes and unquoted values", () => {
    expect(
      extractOgImage(
        htmlWith("<meta property='og:image' content='https://a.com/b.jpg'>"),
      ),
    ).toBe("https://a.com/b.jpg");
    expect(
      extractOgImage(
        htmlWith("<meta property=og:image content=https://a.com/c.jpg>"),
      ),
    ).toBe("https://a.com/c.jpg");
  });

  it("decodes the escaped ampersands a signed CDN URL is full of", () => {
    expect(
      extractOgImage(
        htmlWith(
          '<meta property="og:image" content="https://cdn.fb.com/a.jpg?stp=x&amp;_nc_cat=1&amp;oh=y">',
        ),
      ),
    ).toBe("https://cdn.fb.com/a.jpg?stp=x&_nc_cat=1&oh=y");
  });

  it("prefers the secure URL, then og:image, then Twitter's", () => {
    expect(
      extractOgImage(
        htmlWith(
          '<meta name="twitter:image" content="https://a.com/twitter.jpg">',
          '<meta property="og:image" content="https://a.com/og.jpg">',
          '<meta property="og:image:secure_url" content="https://a.com/secure.jpg">',
        ),
      ),
    ).toBe("https://a.com/secure.jpg");

    expect(
      extractOgImage(
        htmlWith(
          '<meta name="twitter:image" content="https://a.com/twitter.jpg">',
          '<meta property="og:image" content="https://a.com/og.jpg">',
        ),
      ),
    ).toBe("https://a.com/og.jpg");

    expect(
      extractOgImage(
        htmlWith(
          '<meta name="twitter:image" content="https://a.com/twitter.jpg">',
        ),
      ),
    ).toBe("https://a.com/twitter.jpg");
  });

  it("returns null for a login wall, which carries no image tag", () => {
    expect(
      extractOgImage(
        htmlWith('<meta property="og:title" content="Log in to Facebook">'),
      ),
    ).toBeNull();
  });

  it("ignores a non-https or malformed image URL", () => {
    expect(
      extractOgImage(
        htmlWith('<meta property="og:image" content="http://a.com/a.jpg">'),
      ),
    ).toBeNull();
    expect(
      extractOgImage(
        htmlWith('<meta property="og:image" content="not a url">'),
      ),
    ).toBeNull();
    expect(
      extractOgImage(htmlWith('<meta property="og:image" content="">')),
    ).toBeNull();
  });

  it("finds nothing in an empty document rather than throwing", () => {
    expect(extractOgImage("")).toBeNull();
    expect(extractOgImage("<html></html>")).toBeNull();
  });
});

describe("resolveVideoThumbnail", () => {
  it("returns the poster from a Facebook reel page", async () => {
    const fetchImpl = respondWith(
      htmlWith(
        '<meta property="og:image" content="https://cdn.fb.com/reel.jpg">',
      ),
    );
    await expect(resolveVideoThumbnail(REEL, fetchImpl)).resolves.toEqual({
      ok: true,
      thumbnailUrl: "https://cdn.fb.com/reel.jpg",
    });
  });

  it("identifies as a browser, since Facebook strips the page otherwise", async () => {
    const fetchImpl = respondWith(
      htmlWith('<meta property="og:image" content="https://cdn.fb.com/a.jpg">'),
    );
    await resolveVideoThumbnail(REEL, fetchImpl);
    const [, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)["user-agent"]).toMatch(
      /Mozilla\/5\.0/,
    );
  });

  it("fetches the canonical watch URL rather than whatever was pasted", async () => {
    const fetchImpl = respondWith(
      htmlWith(
        '<meta property="og:image" content="https://i.vimeocdn.com/a.jpg">',
      ),
    );
    await resolveVideoThumbnail(
      "https://player.vimeo.com/video/824804225",
      fetchImpl,
    );
    expect(fetchImpl.mock.calls[0][0]).toBe("https://vimeo.com/824804225");
  });

  describe("refuses to be an open proxy", () => {
    it.each([
      ["an internal address", "http://169.254.169.254/latest/meta-data/"],
      ["localhost", "http://localhost:3000/admin"],
      ["a private host", "https://192.168.1.1/"],
      ["an arbitrary site", "https://example.com/secret"],
      ["a file URL", "file:///etc/passwd"],
      ["nothing at all", ""],
      ["a non-string", 42],
    ])("rejects %s without fetching it", async (_label, input) => {
      const fetchImpl = vi.fn();
      const result = await resolveVideoThumbnail(input, fetchImpl as never);
      expect(result).toMatchObject({ ok: false, status: 400 });
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  it("reports a page that answered but carried no image", async () => {
    const fetchImpl = respondWith(htmlWith("<title>Log in</title>"));
    const result = await resolveVideoThumbnail(REEL, fetchImpl);
    expect(result).toMatchObject({ ok: false, status: 404 });
  });

  it("reports an upstream failure rather than throwing", async () => {
    const fetchImpl = respondWith("", { ok: false, status: 404 });
    const result = await resolveVideoThumbnail(REEL, fetchImpl);
    expect(result).toMatchObject({ ok: false, status: 502 });
  });

  it("reports a network error rather than throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("ECONNREFUSED");
    });
    const result = await resolveVideoThumbnail(REEL, fetchImpl as never);
    expect(result).toMatchObject({ ok: false, status: 504 });
  });
});
