import { describe, expect, it, vi } from "vitest";
import { handleThumbnailRequest } from "@/lib/thumbnail-endpoint";

const REEL = "https://www.facebook.com/reel/2146730069387806";
const ENDPOINT = "https://api.example.com/api/video-thumbnail";

function pageWith(image: string) {
  return vi.fn(
    async () =>
      ({
        ok: true,
        status: 200,
        text: async () =>
          `<html><head><meta property="og:image" content="${image}"></head></html>`,
      }) as unknown as Response,
  );
}

function get(url: string): Request {
  return new Request(url, { method: "GET" });
}

describe("handleThumbnailRequest", () => {
  it("returns the thumbnail for a video link", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?url=${encodeURIComponent(REEL)}`),
      pageWith("https://cdn.fb.com/reel.jpg"),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      thumbnailUrl: "https://cdn.fb.com/reel.jpg",
    });
  });

  it("allows the Studio to call it from another origin", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?url=${encodeURIComponent(REEL)}`),
      pageWith("https://cdn.fb.com/reel.jpg"),
    );
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("lets a poster be cached, since it does not change", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?url=${encodeURIComponent(REEL)}`),
      pageWith("https://cdn.fb.com/reel.jpg"),
    );
    expect(response.headers.get("cache-control")).toContain("max-age=86400");
  });

  it("answers a preflight without doing any work", async () => {
    const fetchImpl = vi.fn();
    const response = await handleThumbnailRequest(
      new Request(ENDPOINT, { method: "OPTIONS" }),
      fetchImpl as never,
    );
    expect(response.status).toBe(204);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("refuses anything but GET", async () => {
    const response = await handleThumbnailRequest(
      new Request(ENDPOINT, { method: "POST" }),
      vi.fn() as never,
    );
    expect(response.status).toBe(405);
  });

  it("asks for the url parameter when it is missing", async () => {
    const response = await handleThumbnailRequest(
      get(ENDPOINT),
      vi.fn() as never,
    );
    expect(response.status).toBe(400);
  });

  it("will not fetch a host that is not a supported video platform", async () => {
    const fetchImpl = vi.fn();
    const response = await handleThumbnailRequest(
      get(
        `${ENDPOINT}?url=${encodeURIComponent("http://169.254.169.254/latest/")}`,
      ),
      fetchImpl as never,
    );
    expect(response.status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("passes an upstream failure through as a readable message", async () => {
    const fetchImpl = vi.fn(
      async () =>
        ({
          ok: false,
          status: 404,
          text: async () => "",
        }) as unknown as Response,
    );
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?url=${encodeURIComponent(REEL)}`),
      fetchImpl,
    );
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("Facebook"),
    });
  });
});

describe("relaying the image bytes", () => {
  const page = `<html><head><meta property="og:image" content="https://cdn.fb.com/reel.jpg"></head></html>`;

  function twoStep(imageInit: {
    ok?: boolean;
    status?: number;
    contentType?: string;
    body?: ArrayBuffer;
  }) {
    return vi.fn(async (url: string) => {
      if (url.includes("facebook.com")) {
        return {
          ok: true,
          status: 200,
          text: async () => page,
        } as unknown as Response;
      }
      return {
        ok: imageInit.ok ?? true,
        status: imageInit.status ?? 200,
        headers: new Headers({
          "content-type": imageInit.contentType ?? "image/jpeg",
        }),
        arrayBuffer: async () => imageInit.body ?? new ArrayBuffer(128),
      } as unknown as Response;
    });
  }

  it("returns the bytes, because the platform CDN sends no CORS headers", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?image=1&url=${encodeURIComponent(REEL)}`),
      twoStep({}) as never,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/jpeg");
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect((await response.arrayBuffer()).byteLength).toBe(128);
  });

  it("downloads the poster the page advertised", async () => {
    const fetchImpl = twoStep({});
    await handleThumbnailRequest(
      get(`${ENDPOINT}?image=1&url=${encodeURIComponent(REEL)}`),
      fetchImpl as never,
    );
    expect(fetchImpl.mock.calls[1][0]).toBe("https://cdn.fb.com/reel.jpg");
  });

  it("refuses to relay something that is not an image", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?image=1&url=${encodeURIComponent(REEL)}`),
      twoStep({ contentType: "text/html" }) as never,
    );
    expect(response.status).toBe(502);
  });

  it("refuses to relay an oversized file", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?image=1&url=${encodeURIComponent(REEL)}`),
      twoStep({ body: new ArrayBuffer(11_000_000) }) as never,
    );
    expect(response.status).toBe(502);
  });

  it("reports a poster that could not be downloaded", async () => {
    const response = await handleThumbnailRequest(
      get(`${ENDPOINT}?image=1&url=${encodeURIComponent(REEL)}`),
      twoStep({ ok: false, status: 403 }) as never,
    );
    expect(response.status).toBe(502);
  });
});
