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
  },
  description: {
    align: "center",
    maxWidth: "854px",
  },
  ctaWrapper: {
    display: "flex",
    flexWrap: "wrap",
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
  const [styles] = useState(() =>
    mergeMuiProps(pageHeadingTypographyStyles, extendedStyles),
  );

  return (
    <Box {...styles.container}>
      {title && <Typography {...styles.title}>{title}</Typography>}
      {description && (
        <Typography {...styles.description}>{description}</Typography>
      )}
      {ctaList && ctaList.length > 0 && (
        <Box {...styles.ctaWrapper}>
          {ctaList.map((cta, idx) => (
            <Button
              key={`${cta.label}_${idx}`}
              {...styles.cta}
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
