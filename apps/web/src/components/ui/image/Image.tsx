"use client";

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  imageDimensions,
  isResolvedImageSource,
  urlImageFor,
} from "@/sanity/sections/sanityImageUrl";
import { SanityImageField } from "@/sanity/types";
import { useDefaultImage } from "@/providers";

/**
 * Every image the site renders, through `next/image`.
 *
 * This used to be `<Box component="img">`, which is a plain `<img>`: no
 * `width`/`height`, so every image reserved zero space until it arrived and
 * then pushed the page around; no `srcset`, so a phone downloaded the same
 * 1920px file as a desktop; and no `loading="lazy"`, so images far below the
 * fold competed with the ones on screen.
 *
 * Two things make the swap possible without annotating every call site:
 *
 * 1. **Dimensions come from the asset id.** Sanity encodes them in the ref and
 *    the URL, so `imageDimensions` recovers them with no query change - see
 *    the note there. Call sites only pass sizes when they want to override.
 * 2. **`styled(NextImage)` keeps `sx` working.** The call sites style images
 *    with MUI's `sx`, and re-expressing all of that as `style` would have been
 *    a much larger and riskier diff than this one.
 */
// MUI's default `shouldForwardProp` for a component target already withholds
// `sx`, `as`, `theme` and `ownerState`, which is exactly what `next/image`
// must not receive.
const StyledNextImage = styled(NextImage)({});

/**
 * Sanity's CDN resizes and re-encodes on its own, so `next/image` is pointed
 * at it rather than at Next's optimizer.
 *
 * The alternative - letting `/_next/image` fetch and re-encode - means the
 * deployment does work Sanity has already done, pays for the transfer twice,
 * and needs a warm cache to be fast. `auto=format` gives the browser AVIF or
 * WebP exactly as the built-in optimizer would.
 *
 * Only Sanity URLs take this path. A local file like `/og-default.png` has no
 * `cdn.sanity.io` in it and falls through to Next's own loader, which is the
 * right thing for a file the deployment already serves.
 */
const sanityLoader: NextImageProps["loader"] = ({ src, width, quality }) => {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 75));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
};

export type ImageProps = Omit<NextImageProps, "src" | "alt" | "loader"> & {
  src?: string | SanityImageField | null;
  /**
   * Defaulted to `""` rather than required: an image with no caption is
   * decorative, and an `<img>` with no `alt` at all is an accessibility
   * failure the crawler fails the build over.
   */
  alt?: string;
  sx?: SxProps<Theme>;
};

const Image = ({
  src,
  alt = "",
  width,
  height,
  fill,
  sizes,
  sx,
  ...otherProps
}: ImageProps) => {
  const defaultImageUrl = useDefaultImage();
  const source = src || defaultImageUrl;

  if (!source) return null;

  // A string that is already a URL or a path is used as it stands. Anything
  // else is a Sanity reference and goes through the builder.
  const resolved = isResolvedImageSource(source)
    ? source
    : urlImageFor(source as SanityImageField);

  if (!resolved) return null;

  const intrinsic = imageDimensions(source) ?? imageDimensions(resolved);
  const isSanity = resolved.includes("cdn.sanity.io");

  const sizing = resolveSizing({ width, height, fill, sizes, intrinsic });

  return (
    <StyledNextImage
      src={resolved}
      alt={alt}
      {...(isSanity ? { loader: sanityLoader } : {})}
      {...sizing}
      /*
       * The base below is what keeps a sized image from being stretched by its
       * own attributes.
       *
       * `next/image` writes the asset's intrinsic `width` and `height` onto the
       * element - that is how it reserves space - and CSS that constrains only
       * one axis leaves the other at the attribute value. A header logo styled
       * `width: 120px` from a 1600x900 asset therefore rendered 120px wide and
       * *900px tall*, which is not a subtle bug.
       *
       * `height: auto` restores the aspect ratio, `maxWidth: 100%` keeps a
       * large asset inside its container, and the call site's own `sx` is
       * merged after this one so anything that sizes both axes still wins.
       */
      sx={[
        !fill && { maxWidth: "100%", height: "auto" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...otherProps}
    />
  );
};

/**
 * Turns whatever the call site supplied into a sizing `next/image` accepts.
 *
 * `next/image` needs either both dimensions or `fill`, and there is no fourth
 * option - so the last branch is what stops an asset with an unreadable id
 * from throwing at render. `width={0} height={0}` with `sizes="100vw"` is
 * Next's documented shape for "responsive, intrinsic size unknown": the
 * browser sizes it from CSS and picks a srcset entry from the viewport.
 */
function resolveSizing({
  width,
  height,
  fill,
  sizes,
  intrinsic,
}: {
  width?: NextImageProps["width"];
  height?: NextImageProps["height"];
  fill?: boolean;
  sizes?: string;
  intrinsic: { width: number; height: number } | null;
}) {
  if (fill) {
    // Without `sizes` a filled image always downloads a viewport-wide file.
    return { fill: true as const, sizes: sizes ?? "100vw" };
  }

  if (width !== undefined && height !== undefined) {
    return { width, height, ...(sizes ? { sizes } : {}) };
  }

  if (intrinsic) {
    // One dimension given: keep the asset's aspect ratio rather than letting
    // the other default to the intrinsic value and distort the image.
    const ratio = intrinsic.width / intrinsic.height;
    if (width !== undefined) {
      return {
        width,
        height: Math.round(Number(width) / ratio),
        ...(sizes ? { sizes } : {}),
      };
    }
    if (height !== undefined) {
      return {
        width: Math.round(Number(height) * ratio),
        height,
        ...(sizes ? { sizes } : {}),
      };
    }
    return { ...intrinsic, ...(sizes ? { sizes } : {}) };
  }

  return {
    width: 0,
    height: 0,
    sizes: sizes ?? "100vw",
    style: { width: "100%", height: "auto" },
  };
}

export default Image;
