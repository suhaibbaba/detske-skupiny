/**
 * Deliberately not a Client Component - see the note in ui/button/Button.tsx.
 *
 * This renders the heading block of almost every route, so the directive was
 * pulling it (and everything it imports) into the client bundle of pages that
 * have nothing interactive in their hero at all.
 */
import type { SxProps, Theme } from "@mui/material/styles";
import React, { FC } from "react";
import { Box, Typography } from "@mui/material";
import { SanityCtaField, SanityRichTextField } from "@/types";
import RichText from "@/components/rich-text/RichText";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { useLocale } from "next-intl";

interface Props {
  title?: string | SanityRichTextField | null;
  description?: string | SanityRichTextField | null;
  ctaList?: SanityCtaField[] | null;
  /**
   * Per-slot overrides.
   *
   * Was `extendedStyles?: PageHeadingTypographyStyles` - a bag of whole MUI
   * props objects, deep-merged with lodash so a caller could set `variant` as
   * well as `sx`. No caller ever did: every one of them passed `sx` and
   * nothing else. This is that, typed.
   */
  sx?: {
    container?: SxProps<Theme>;
    title?: SxProps<Theme>;
    description?: SxProps<Theme>;
    ctaWrapper?: SxProps<Theme>;
    cta?: SxProps<Theme>;
  };
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  title: { mb: 0 },
  description: { maxWidth: "854px" },
  ctaWrapper: {
    mt: "20px",
    gap: "12px",
    flexWrap: "wrap",
    display: "flex",
  },
  cta: {
    padding: "14px 10px",
    letterSpacing: 0,
    minWidth: { xs: "100px", sm: "172px" },
  },
} satisfies Record<string, SxProps<Theme>>;

/** `[base, ...caller]` - MUI's own composition, later entries winning. */
const compose = (base: SxProps<Theme>, extra?: SxProps<Theme>) =>
  [base, ...(Array.isArray(extra) ? extra : [extra])] as SxProps<Theme>;

const PageHeadingTypography: FC<Props> = ({
  title,
  description,
  ctaList,
  sx,
}) => {
  const locale = useLocale();

  return (
    <Box sx={compose(styles.container, sx?.container)}>
      {typeof title === "string" ? (
        <Typography
          variant="h1"
          align="center"
          sx={compose(styles.title, sx?.title)}
        >
          {title}
        </Typography>
      ) : (
        <RichText
          align="center"
          sx={compose(styles.description, sx?.description)}
        >
          {title}
        </RichText>
      )}
      {typeof description === "string" ? (
        <Typography
          align="center"
          sx={compose(styles.description, sx?.description)}
        >
          {description}
        </Typography>
      ) : (
        <RichText
          align="center"
          sx={compose(styles.description, sx?.description)}
        >
          {description}
        </RichText>
      )}
      {ctaList && ctaList.length > 0 && (
        <Box sx={compose(styles.ctaWrapper, sx?.ctaWrapper)}>
          {ctaList.map((cta, idx) => {
            const link = parseLinkField(cta.link, { locale });
            return (
              <Button
                key={`${cta._key}_${idx}`}
                sx={compose(styles.cta, sx?.cta)}
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
