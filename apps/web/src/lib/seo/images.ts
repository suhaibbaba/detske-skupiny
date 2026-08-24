import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { absoluteUrl } from "@/lib/seo/site";

/**
 * Open Graph images: one 1200x630 crop per page, with a site-wide fallback.
 *
 * Separate from sanityImageUrl.ts on purpose - that builder is the general
 * one every `<Image>` goes through and deliberately applies no transform,
 * while this one exists to pin the single aspect ratio Facebook, LinkedIn and
 * Twitter all crop to anyway. Doing the crop at the CDN means the share card
 * is composed the same way everywhere instead of being centre-cropped
 * differently by each of them.
 *
 * It shares the project/dataset configuration with sanityImageUrl.ts, which
 * next.config.ts inlines; see the note there for why that is safe.
 */
const builder = imageUrlBuilder({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
});

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/** The static fallback, served from public/. */
export const OG_FALLBACK_PATH = "/og-default.png";

/**
 * A 1200x630 CDN URL for a Sanity image, or `null` if there is no image.
 *
 * The queries project images as `field.asset->url` strings rather than as
 * image objects (see `imageUrl` in lib/sanity/fragments.ts), and
 * @sanity/image-url accepts a CDN URL as a source, so the projected strings
 * can be passed straight in. A malformed one throws rather than returning a
 * broken URL, so it is caught here: a share card without an image is a much
 * smaller problem than a page that fails to render its metadata.
 */
export function ogImageUrl(source?: SanityImageSource | null): string | null {
  if (!source) return null;

  try {
    return builder
      .image(source)
      .width(OG_IMAGE_WIDTH)
      .height(OG_IMAGE_HEIGHT)
      .fit("crop")
      .auto("format")
      .url();
  } catch {
    return null;
  }
}

/**
 * The image a page should share, in preference order: the document's own
 * image, the image set in Sanity settings, then the file in public/.
 *
 * Always absolute - `metadataBase` would resolve a relative path against the
 * current locale's origin, but these URLs are also read by the JSON-LD
 * builders, which have no such base to fall back on.
 */
export function resolveOgImage(
  locale: string,
  ...candidates: (SanityImageSource | null | undefined)[]
): string {
  for (const candidate of candidates) {
    const url = ogImageUrl(candidate);
    if (url) return url;
  }

  return absoluteUrl(locale, OG_FALLBACK_PATH);
}
