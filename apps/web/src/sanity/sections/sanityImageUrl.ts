import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

/**
 * Builds image CDN URLs. Runs in the browser as well as on the server.
 *
 * It deliberately does NOT use the Sanity client from lib/sanity: that client
 * is `server-only` and holds the query configuration. This builder needs
 * nothing but the project and dataset names, and it never issues a request -
 * it only formats `https://cdn.sanity.io/images/<project>/<dataset>/...`.
 *
 * Those two names are inlined into the client bundle by the `env` block in
 * next.config.ts, which is why they can be read here without a NEXT_PUBLIC_
 * prefix. Both already appear in the text of every image URL the page renders,
 * so there is nothing to hide - but they are exposed by one reviewable line of
 * config rather than by a naming convention.
 */
const builder = imageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
});

export function urlImageFor(source?: SanityImageSource) {
  if (!source) {
    return "";
  }

  return builder.image(source).url();
}
