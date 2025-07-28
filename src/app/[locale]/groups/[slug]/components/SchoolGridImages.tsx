"use client";

import { Box, BoxProps } from "@mui/material";
import { FC, useState } from "react";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface SchoolGridImagesProps {
  leftImage: string;
  topRightImage: string;
  bottomRightImage: string;
  altLeft?: string;
  altTopRight?: string;
  altBottomRight?: string;
  extendedStyles?: SchoolGridImagesStyles;
}

export interface SchoolGridImagesStyles {
  container?: BoxProps;
  imageBox?: BoxProps;
  img?: BoxProps;
}

const schoolGridImagesStyles: SchoolGridImagesStyles = {
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      gridTemplateRows: { xs: "auto", md: "1fr 1fr" },
      gap: 2,
      height: { md: 524 },
    },
  },
  imageBox: {
    sx: {
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      height: { xs: 200, md: "100%" },
    },
  },
  img: {
    sx: {
      objectFit: "cover",
      maxHeight: "100%",
      width: "100%",
      borderRadius: "12px",
    },
  },
};

const SchoolGridImages: FC<SchoolGridImagesProps> = ({
  leftImage,
  topRightImage,
  bottomRightImage,
  altLeft = "Left Image",
  altTopRight = "Top Right Image",
  altBottomRight = "Bottom Right Image",
  extendedStyles,
}) => {
  const [styles] = useState(() =>
    mergeMuiProps(schoolGridImagesStyles, extendedStyles),
  );

  return (
    <Box {...styles.container} data-test-selector="SchoolGridImages">
      <Box
        {...styles.imageBox}
        sx={{
          ...styles.imageBox?.sx,
          gridRow: { md: "1 / span 2" },
          gridColumn: "1 / 2",
          height: "100%",
        }}
      >
        <Box component="img" src={leftImage} alt={altLeft} {...styles.img} />
      </Box>
      <Box
        {...styles.imageBox}
        sx={{
          ...styles.imageBox?.sx,
          gridRow: "1",
          gridColumn: "2",
        }}
      >
        <Box
          component="img"
          src={topRightImage}
          alt={altTopRight}
          {...styles.img}
        />
      </Box>
      <Box
        {...styles.imageBox}
        sx={{
          ...styles.imageBox?.sx,
          gridRow: "2",
          gridColumn: "2",
        }}
      >
        <Box
          component="img"
          src={bottomRightImage}
          alt={altBottomRight}
          {...styles.img}
        />
      </Box>
    </Box>
  );
};

export default SchoolGridImages;
