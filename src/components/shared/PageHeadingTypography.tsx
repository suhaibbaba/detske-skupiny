"use client";

import React, { FC, useState } from "react";
import {
  Box,
  BoxProps,
  ButtonProps,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { SanityCtaField, SanityRichTextField } from "@/sanity/types";
import RichText from "@/sanity/components/RichText";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { useLocale } from "next-intl";

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
      minWidth: "172px",
    },
  },
};

const PageHeadingTypography: FC<Props> = ({
  title,
  description,
  ctaList,
  extendedStyles,
}) => {
  const locale = useLocale();
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
          {ctaList.map((cta) => {
            const link = parseLinkField(cta.link, { locale });
            return (
              <Button
                key={cta._key}
                {...styles.cta}
                variant={cta.variant || "contained"}
                href={link.url}
              >
                {link.text}
              </Button>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default PageHeadingTypography;
