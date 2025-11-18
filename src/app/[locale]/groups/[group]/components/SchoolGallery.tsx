"use client";

import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { FC, useState } from "react";
import { School } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import useTranslate from "@/hooks/useTranslate";

const breakpoints = [3840, 1920, 1080, 640, 384, 256, 128];

interface SchoolGalleryProps {
  gallery?: School["primaryImages"];
  extendedStyles?: SchoolGalleryStyles;
}

export interface SchoolGalleryStyles {
  container?: BoxProps;
  imageContainer?: BoxProps;
  imageBox?: BoxProps;
  img?: BoxProps;
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
};

const SchoolGallery: FC<SchoolGalleryProps> = ({ gallery }) => {
  const translate = useTranslate();

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
      <Box {...styles.container} data-test-selector="SchoolGallery">
        <Box {...styles.imageContainer}>
          {/* Left main */}
          {main && (
            <Box {...styles.imageBox} onClick={() => openImage(0)}>
              <Box component="img" src={urlImageFor(main)} {...styles.img} />
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
                <Box component="img" src={urlImageFor(img)} {...styles.img} />
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
