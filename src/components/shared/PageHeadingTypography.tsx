"use client";

import React, { FC, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { SanityCtaField, SanityRichTextField } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

interface Props {
  title?: string | SanityRichTextField;
  description?: string | SanityRichTextField;
  ctaList?: SanityCtaField[];
  extendedStyles?: PageHeadingTypographyStyles;
}

export interface PageHeadingTypographyStyles {
  container?: BoxProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  ctaWrapper?: BoxProps;
  cta?: ButtonProps;
}

const pageHeadingTypographyStyles: PageHeadingTypographyStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
    },
  },
  title: {
    variant: "h1",
    align: "center",
    mb: 0,
  },
  description: {
    align: "center",
    maxWidth: "854px",
  },
  ctaWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    mt: "20px",
  },
  cta: {
    variant: "contained",
    sx: {
      padding: "14px 10px",
      letterSpacing: 0,
    },
  },
};

const PageHeadingTypography: FC<Props> = ({
  title,
  description,
  ctaList,
  extendedStyles,
}) => {
  const [styles] = useState(() =>
    mergeMuiProps(pageHeadingTypographyStyles, extendedStyles),
  );

  return (
    <Box {...styles.container}>
      {typeof title === "string" ? (
        <Typography {...styles.title}>{title}</Typography>
      ) : (
        <RichText {...styles.description}>{title}</RichText>
      )}
      {typeof description === "string" ? (
        <Typography {...styles.description}>{description}</Typography>
      ) : (
        <RichText {...styles.description}>{description}</RichText>
      )}
      {ctaList && ctaList.length > 0 && (
        <Box {...styles.ctaWrapper}>
          {ctaList.map((cta, idx) => (
            <Button
              key={`${cta.text}_${idx}`}
              {...styles.cta}
              variant={cta.variant || "contained"}
              href={cta.url}
            >
              {cta.text}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageHeadingTypography;
