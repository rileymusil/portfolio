import { resolveVideoThumbnail } from "./og-thumbnail";

/* Web-standard request handler, so the same code runs on a Vercel Edge Function
   or a Cloudflare Worker with only a few lines of adapter around it. */

const CORS_HEADERS = {
  /* The response carries nothing private — a public page's poster URL — and the
     Studio calls it from a different origin, so it is open. The control that
     matters is in resolveVideoThumbnail: only the supported video hosts can be
     fetched, so this cannot be turned into a general-purpose proxy. */
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(
  body: unknown,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export async function handleThumbnailRequest(
  request: Request,
  fetchImpl: typeof fetch = fetch,
): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "GET") {
    return json({ error: "Use GET." }, 405);
  }

  const params = new URL(request.url).searchParams;
  const target = params.get("url");
  if (!target) {
    return json({ error: "Pass the video link as ?url=" }, 400);
  }
  /* ?image=1 relays the bytes; without it the JSON is handy for debugging. */
  const wantsImage = params.get("image") === "1";

  const result = await resolveVideoThumbnail(target, fetchImpl);
  if (!result.ok) {
    return json({ error: result.error }, result.status);
  }

  /* A given video's poster does not change, so let it be cached for a day. */
  const cache = { "cache-control": "public, max-age=86400" };

  if (!wantsImage) {
    return json({ thumbnailUrl: result.thumbnailUrl }, 200, cache);
  }

  /* The platform CDNs do not send CORS headers, so a browser cannot read the
     bytes from them directly. Relaying the image through here is what makes it
     usable from the Studio at all. */
  return relayImage(result.thumbnailUrl, fetchImpl, cache);
}

const MAX_IMAGE_BYTES = 10_000_000;

async function relayImage(
  thumbnailUrl: string,
  fetchImpl: typeof fetch,
  cache: Record<string, string>,
): Promise<Response> {
  let response: Response;
  try {
    response = await fetchImpl(thumbnailUrl);
  } catch {
    return json({ error: "Could not download the thumbnail." }, 502);
  }

  if (!response.ok) {
    return json({ error: `The thumbnail answered ${response.status}.` }, 502);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return json({ error: "That poster was not an image." }, 502);
  }

  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    return json({ error: "That poster was too large." }, 502);
  }

  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": contentType,
      ...CORS_HEADERS,
      ...cache,
    },
  });
}
