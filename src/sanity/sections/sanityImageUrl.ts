// sanityImageUrl.ts
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

// Create an image URL builder using the client
const builder = imageUrlBuilder(client);

export function urlImageFor(source?: SanityImageSource) {
  if (!source) {
    return "";
  }

  return builder.image(source).url();
}
