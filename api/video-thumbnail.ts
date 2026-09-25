import { handleThumbnailRequest } from "../src/lib/thumbnail-endpoint";

/* Vercel Edge Function. Deployed at /api/video-thumbnail; point
   NEXT_PUBLIC_THUMBNAIL_API at it. */
export const config = { runtime: "edge" };

export default function handler(request: Request): Promise<Response> {
  return handleThumbnailRequest(request);
}
