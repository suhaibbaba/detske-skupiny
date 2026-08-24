"use client";

import {
  Box,
  BoxProps,
  SxProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC, useState } from "react";
import { School } from "@/types";
import { urlImageFor } from "@/lib/sanity/imageUrl";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import useTranslate from "@/hooks/useTranslate";
import Image, { type ImageProps } from "@/components/ui/image";

const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

interface SchoolGalleryProps {
  gallery?: School["primaryImages"];
  logo?: School["logo"];
  /** Base64 thumbnail for the first image, which is this page's LCP element. */
  mainImageLqip?: string | null;
  name?: School["name"];
  extendedStyles?: SchoolGalleryStyles;
}

export interface SchoolGalleryStyles {
  container?: BoxProps;
  imageContainer?: BoxProps;
  imageBox?: BoxProps;
  img?: ImageProps;
  logo?: ImageProps;
}

const styles: SchoolGalleryStyles = {
  container: {
    sx: {
      mt: "80px",
    },
  },
  imageContainer: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      gap: 2,
      height: { md: 524 },
    },
  },
  imageBox: {
    sx: {
      width: "100%",
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      cursor: "pointer",
    },
  },
  img: {
    sx: {
      objectFit: "cover",
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      display: "block",
    },
  },
  logo: {
    sx: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: { xs: "100px", md: "160px" },
      height: { xs: "100px", md: "160px" },
      padding: "8px",
      background: "white",
      borderTopLeftRadius: "8px",
    },
  },
};

const SchoolGallery: FC<SchoolGalleryProps> = ({
  gallery,
  logo,
  name,
  mainImageLqip,
  extendedStyles,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setOpen((prevState) => !prevState);
  };

  const closeImage = () => setOpen(false);

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
    <>
      <Box
        sx={
          {
            ...styles?.container?.sx,
            ...extendedStyles?.container?.sx,
          } as SxProps
        }
        data-test-selector="SchoolGallery"
      >
        <Box {...styles.imageContainer}>
          {/* Left main */}
          {main && (
            <Box {...styles.imageBox} onClick={() => openImage(0)}>
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
                {...styles.img}
              />
              {logo && (
                <Image src={logo} alt={name} sizes="64px" {...styles.logo} />
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
              <Box
                key={idx}
                {...styles.imageBox}
                onClick={() => openImage(idx + 1)}
              >
                <Image
                  src={img}
                  alt={name}
                  sizes="(max-width: 900px) 50vw, 20vw"
                  {...styles.img}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      <Lightbox
        plugins={[Zoom]}
        open={open}
        close={closeImage}
        index={selectedIndex}
        slides={gallerySlides}
        controller={{
          closeOnPullDown: true,
          closeOnBackdropClick: true,
        }}
        carousel={{
          preload: 0,
        }}
        animation={{ zoom: 500 }}
        zoom={{
          maxZoomPixelRatio: 1,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: false,
        }}
      />
    </>
  );
};

export default SchoolGallery;
