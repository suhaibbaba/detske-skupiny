/**
 * Deliberately not a Client Component - see the note in ui/button/Button.tsx.
 *
 * This renders the heading block of almost every route, so the directive was
 * pulling it (and everything it imports) into the client bundle of pages that
 * have nothing interactive in their hero at all.
 */
import React, { FC } from "react";
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
    sx: { mb: 0 },
  },
  description: {
    align: "center",
    sx: { maxWidth: "854px" },
  },
  ctaWrapper: {
    sx: {
      mt: "20px",
      gap: "12px",
      flexWrap: "wrap",
      display: "flex",
    },
  },
  cta: {
    variant: "contained",
    sx: {
      padding: "14px 10px",
      letterSpacing: 0,
      minWidth: { xs: "100px", sm: "172px" },
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
  // Was a `useState` lazy initialiser, which computes once and then ignores
  // any later `extendedStyles` - the same latent bug as in Link.tsx.
  const styles = mergeMuiProps(pageHeadingTypographyStyles, extendedStyles);

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
          {ctaList.map((cta, idx) => {
            const link = parseLinkField(cta.link, { locale });
            return (
              <Button
                key={`${cta._key}_${idx}`}
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
