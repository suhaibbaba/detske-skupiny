import React, { FC } from "react";
import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Typography,
  TypographyOwnProps,
} from "@mui/material";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";

interface Props {
  title?: string | React.ReactNode;
  description?: string;
  ctaList?: {
    label: string;
    variant?: ButtonProps["variant"];
    onClick?: (e: React.MouseEvent) => void;
  }[];
  extendedStyles?: PageHeadingTypographyStyles;
}

export interface PageHeadingTypographyStyles {
  container?: BoxProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  ctaWrapper?: BoxProps;
  cta?: ButtonProps;
}

const styles: PageHeadingTypographyStyles = {
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
  },
  description: {
    align: "center",
    maxWidth: "854px",
  },
  ctaWrapper: {
    display: "flex",
    gap: "12px",
  },
  cta: {
    variant: "contained",
    sx: {
      mt: "20px",
    },
  },
};

const PageHeadingTypography: FC<Props> = ({
  title,
  description,
  ctaList,
  extendedStyles,
}) => {
  const mergeStyles = mergeMuiProps(styles, extendedStyles);
  return (
    <Box {...mergeStyles.container}>
      {title && <Typography {...mergeStyles.title}>{title}</Typography>}
      {description && (
        <Typography {...mergeStyles.description}>{description}</Typography>
      )}
      {ctaList && ctaList.length > 0 && (
        <Box {...mergeStyles.ctaWrapper}>
          {ctaList.map((cta, idx) => (
            <Button
              key={`${cta.label}_${idx}`}
              {...mergeStyles.cta}
              variant={cta.variant || "contained"}
              onClick={cta.onClick}
            >
              {cta.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageHeadingTypography;
