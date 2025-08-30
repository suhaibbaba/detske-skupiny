"use client";

import {
  Box,
  BoxProps,
  Dialog,
  Typography,
  TypographyProps,
} from "@mui/material";
import { FC, useState } from "react";
import { School } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

interface SchoolGalleryProps {
  gallery?: School["primaryImages"];
  extendedStyles?: SchoolGalleryStyles;
}

export interface SchoolGalleryStyles {
  container?: BoxProps;
  title?: TypographyProps;
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
  title: {
    color: "custom.ui13",
    fontSize: "24px",
    fontWeight: 600,
    mb: "20px",
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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const openImage = (src: string) => {
    setSelected(src);
    setOpen(true);
  };

  const closeImage = () => setOpen(false);

  // first image is always the big/left
  const main = gallery[0];
  const rights = gallery.slice(1, 5); // max 4 right images

  return (
    <Box {...styles.container} data-test-selector="SchoolGallery">
      <Typography {...styles.title}>Gallery</Typography>
      <Box {...styles.imageContainer}>
        {/* Left main */}
        {main && (
          <Box
            {...styles.imageBox}
            onClick={() => openImage(urlImageFor(main))}
          >
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
          {rights.map((img, i) => (
            <Box
              key={i}
              {...styles.imageBox}
              onClick={() => openImage(urlImageFor(img))}
            >
              <Box component="img" src={urlImageFor(img)} {...styles.img} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* Zoom modal */}
      <Dialog open={open} onClose={closeImage} maxWidth="lg">
        {selected && (
          <Box
            component="img"
            src={selected}
            alt="zoomed"
            sx={{ maxWidth: "90vw", maxHeight: "90vh" }}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default SchoolGallery;
