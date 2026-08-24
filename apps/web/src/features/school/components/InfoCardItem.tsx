import { Box, Typography, BoxProps, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

export interface InfoCardItemProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
  show?: boolean;
}

interface InfoCardItemStyles {
  container?: BoxProps;
  iconWrapper?: BoxProps;
  title?: TypographyProps;
  content?: BoxProps;
}

const styles: InfoCardItemStyles = {
  title: {
    /*
     * A static object rather than a `(theme) => ...` callback: this component
     * is rendered from a Server Component now, and a function prop cannot
     * cross the boundary. The theme is configured with `cssVariables: true`,
     * so every palette entry is reachable as a CSS variable without the
     * callback.
     */
    sx: {
      fontSize: "16px",
      fontWeight: 600,
      color: "var(--mui-palette-custom-ui13)",
      mb: "8px",
    },
  },
};

const InfoCardItem = ({ icon, title, content, show }: InfoCardItemProps) => {
  return (
    <Box
      // Static rather than a `(theme) => ...` callback, for the same reason as
      // `styles.title` above: this renders inside a Server Component now, and
      // the theme's CSS variables reach the same values without a function.
      sx={{
        bgcolor: "primary.light",
        border: `1px solid var(--mui-palette-custom-ui14)`,
        borderRadius: "12px",
        p: "24px 12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
        mt: "2px",
        ".MuiSvgIcon-root": {
          width: "20px",
          height: "20px",
          color: "var(--mui-palette-secondary-dark)",
        },
        opacity: !show ? 0.5 : 1,
      }}
    >
      <Box {...styles.iconWrapper}>{icon}</Box>
      <Box data-test-selector={"info-card"}>
        <Typography {...styles.title}>{title}</Typography>
        <Box {...styles.content}>{content}</Box>
      </Box>
    </Box>
  );
};

export default InfoCardItem;
