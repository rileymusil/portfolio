import type { MetadataRoute } from "next";
import { assetUrl } from "@/lib/site-url";
import { getBasePath } from "@/lib/static-export";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const basePath = getBasePath();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* The Sanity editor is not content; keep it out of the index. */
      disallow: [`${basePath}/studio/`],
    },
    sitemap: assetUrl("/sitemap.xml"),
  };
}
