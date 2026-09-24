import type { Metadata } from "next";
import { site } from "@/lib/site";
import { absoluteUrl, assetUrl } from "@/lib/site-url";

export const TITLE_TEMPLATE_SUFFIX = ` | ${site.name}`;

export const OG_IMAGE_PATH = "/og-image.png";

export function openGraphImage(): NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> {
  return [
    {
      url: assetUrl(OG_IMAGE_PATH),
      width: 1200,
      height: 630,
      alt: `${site.name} — Creative Services`,
    },
  ];
}

interface PageMetadataInput {
  /** Page title without the site suffix; Next applies the template. */
  title: string;
  description: string;
  /** Route path, e.g. "/photography/event". */
  path: string;
}

/* Next replaces `openGraph` wholesale rather than merging it with the layout's,
   so every page builds the full block here instead of relying on inheritance. */
export function pageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = `${title}${TITLE_TEMPLATE_SUFFIX}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      title: fullTitle,
      description,
      url,
      images: openGraphImage(),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: openGraphImage(),
    },
  };
}
