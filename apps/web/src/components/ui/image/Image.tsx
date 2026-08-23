"use client";

import { Box, BoxProps } from "@mui/material";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { SanityImageField } from "@/sanity/types";
import { useDefaultImage } from "@/providers";

interface Props extends Omit<BoxProps<"img">, "src"> {
  src?: string | SanityImageField;
}

const Image = ({ src, ...otherProps }: Props) => {
  const defaultImageUrl = useDefaultImage();
  const imagSrc = src || defaultImageUrl;

  return (
    <Box
      component="img"
      alt=""
      src={imagSrc ? urlImageFor(imagSrc) : null}
      {...otherProps}
    />
  );
};

export default Image;
