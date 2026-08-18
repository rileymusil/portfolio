import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "@/lib/sanity/client";

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: SanityImageSource): string | null {
  if (!builder) {
    return null;
  }

  return builder.image(source).auto("format").quality(85).url();
}
