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

/**
 * The intrinsic size of a Sanity image, without asking Sanity for it.
 *
 * Every Sanity asset carries its dimensions in its own identifier - a ref is
 * `image-<hash>-1600x900-png` and the CDN URL it produces is
 * `.../<hash>-1600x900.png`. So the numbers `next/image` needs to reserve
 * space are already in hand at render time, with no extra field on any query
 * and no extra round trip.
 *
 * That matters more than it sounds: the alternative was projecting
 * `asset->metadata.dimensions` into every image field in every query, which
 * changes the shape each consumer receives and invalidates every cached
 * response for a number that was already encoded in the string next to it.
 *
 * Returns `null` for anything it cannot read - a local path like
 * `/og-default.png`, or an asset whose id does not carry a size. Callers treat
 * that as "unknown" rather than guessing.
 */
export function imageDimensions(
  source?: SanityImageSource | null,
): { width: number; height: number } | null {
  if (!source) return null;

  // A dereferenced asset may carry the real metadata; prefer it when present.
  const metadata = (source as { metadata?: { dimensions?: unknown } })?.metadata
    ?.dimensions as { width?: number; height?: number } | undefined;
  if (
    typeof metadata?.width === "number" &&
    typeof metadata?.height === "number"
  ) {
    return { width: metadata.width, height: metadata.height };
  }

  const identifier = imageIdentifier(source);
  if (!identifier) return null;

  // `-1600x900-png` on a ref, `-1600x900.png` on a URL. Query strings and
  // fragments are stripped first so a transformed URL still matches.
  const match = identifier
    .split("?")[0]
    .split("#")[0]
    .match(/-(\d+)x(\d+)(?:[-.][A-Za-z0-9]+)?$/);

  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);

  return width > 0 && height > 0 ? { width, height } : null;
}

/** The id-or-URL string buried in whichever shape a caller passed. */
function imageIdentifier(source: SanityImageSource): string | null {
  if (typeof source === "string") return source;

  const candidate = source as {
    _ref?: string;
    _id?: string;
    url?: string;
    asset?: { _ref?: string; _id?: string; url?: string };
  };

  return (
    candidate.asset?.url ??
    candidate.asset?._ref ??
    candidate.asset?._id ??
    candidate.url ??
    candidate._ref ??
    candidate._id ??
    null
  );
}

/** True when a string is already a URL or a path the browser can request. */
export const isResolvedImageSource = (source: unknown): source is string =>
  typeof source === "string" &&
  (source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("/") ||
    source.startsWith("data:") ||
    source.startsWith("blob:"));
