"use client";

import React from "react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Box } from "@mui/material";

const Gallery = () => {
  const extendedGallery = true;
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: extendedGallery ? "60% 1fr" : "1fr",
          gridTemplateRows: extendedGallery ? "1fr 1fr" : "1fr",
          gap: "12px",
        }}
        onClick={() => setGalleryOpen(true)}
      >
        <Box
          component="img"
          src="https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp"
          sx={{
            gridRow: "span 2",
            height: 1,
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
        <Box
          component="img"
          sx={{ borderRadius: "12px" }}
          src="https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp"
        />
        <Box
          component="img"
          sx={{ borderRadius: "12px" }}
          src="https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp"
        />
      </Box>
      <Lightbox
        open={galleryOpen}
        close={() => setGalleryOpen(false)}
        slides={[
          {
            src: "https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp",
          },
          {
            src: "https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp",
          },
          {
            src: "https://www.soukromeskolky.cz/uploads/2025/05/florentinum-jesle-01.jpg.webp",
          },
        ]}
      />
    </Box>
  );
};

export default Gallery;
