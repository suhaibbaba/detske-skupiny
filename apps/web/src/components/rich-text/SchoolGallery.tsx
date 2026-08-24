import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { FC } from "react";
import { School } from "@/types";
import { urlImageFor } from "@/lib/sanity/imageUrl";
import GalleryLightbox from "@/components/rich-text/GalleryLightbox";
import Image from "@/components/ui/image";

const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

interface SchoolGalleryProps {
  gallery?: School["primaryImages"];
  logo?: School["logo"];
  /** Base64 thumbnail for the first image, which is this page's LCP element. */
  mainImageLqip?: string | null;
  name?: School["name"];
  /**
   * Extra styles for the outer box.
   *
   * Was `extendedStyles?: SchoolGalleryStyles` - a bag of whole MUI props
   * objects - of which exactly one slot, `container.sx`, was ever set, by one
   * caller.
   */
  sx?: SxProps<Theme>;
}

const styles = {
  container: {
    mt: "80px",
  },
  imageContainer: {
    display: "flex",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    gap: 2,
    height: { md: 524 },
  },
  imageBox: {
    width: "100%",
    position: "relative",
    borderRadius: 2,
    overflow: "hidden",
    cursor: "pointer",
  },
  img: {
    objectFit: "cover",
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    display: "block",
  },
  logo: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: { xs: "100px", md: "160px" },
    height: { xs: "100px", md: "160px" },
    padding: "8px",
    background: "white",
    borderTopLeftRadius: "8px",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The school page's image grid.
 *
 * A Server Component: it renders `<Image>` tiles, including this page's LCP
 * element, and the only interaction is "open the lightbox on the image I
 * clicked" - which `GalleryLightbox` handles by reading `data-gallery-index`
 * off the click, so no tile needs a handler of its own.
 */
const SchoolGallery: FC<SchoolGalleryProps> = ({
  gallery,
  logo,
  name,
  mainImageLqip,
  sx,
}) => {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  // first image is always the big/left
  const main = gallery[0];
  const rights = gallery.slice(1, 5); // max 4 right images

  const gallerySlides = gallery.map((g) => ({
    src: urlImageFor(g),
    width: 3840,
    height: 2272,
    srcSet: breakpoints.map((breakpoint) => ({
      src: urlImageFor(g),
      width: breakpoint,
      height: Math.round((2272 / 3840) * breakpoint),
    })),
  }));

  return (
    <GalleryLightbox slides={gallerySlides}>
      <Box
        sx={[styles.container, ...(Array.isArray(sx) ? sx : [sx])]}
        data-test-selector="SchoolGallery"
      >
        <Box sx={styles.imageContainer}>
          {/* Left main */}
          {main && (
            <Box sx={styles.imageBox} data-gallery-index={0}>
              {/*
               * The first gallery image is the school page's LCP element, so
               * it is fetched eagerly. The four thumbnails beside it stay
               * lazy - they are the same size on screen but not the thing a
               * visitor is waiting for.
               */}
              <Image
                src={main}
                alt={name}
                priority
                sizes="(max-width: 900px) 100vw, 60vw"
                {...(mainImageLqip
                  ? {
                      placeholder: "blur" as const,
                      blurDataURL: mainImageLqip,
                    }
                  : {})}
                sx={styles.img}
              />
              {logo && (
                <Image src={logo} alt={name} sizes="64px" sx={styles.logo} />
              )}
            </Box>
          )}

          {/* Right column */}
          <Box
            sx={{
              display: "grid",
              gridAutoRows: "1fr",
              gridTemplateColumns: {
                xs: "1fr 1fr",
                sm: "1fr",
              },
              gap: 2,
            }}
          >
            {rights.map((img, idx) => (
              <Box key={idx} sx={styles.imageBox} data-gallery-index={idx + 1}>
                <Image
                  src={img}
                  alt={name}
                  sizes="(max-width: 900px) 50vw, 20vw"
                  sx={styles.img}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </GalleryLightbox>
  );
};

export default SchoolGallery;
