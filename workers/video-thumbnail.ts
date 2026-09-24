import { handleThumbnailRequest } from "../src/lib/thumbnail-endpoint";

/* Cloudflare Worker, for hosting this without moving the site to Vercel:
   `npx wrangler deploy workers/video-thumbnail.ts`. Point
   NEXT_PUBLIC_THUMBNAIL_API at the resulting workers.dev URL. */
export default {
  fetch(request: Request): Promise<Response> {
    return handleThumbnailRequest(request);
  },
};
