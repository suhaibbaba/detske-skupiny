import { Box, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ReactNode } from "react";

export interface InfoCardItemProps {
  icon: ReactNode;
  title: string;
  content: ReactNode;
  show?: boolean;
}

/*
 * Static objects rather than `(theme) => ...` callbacks: this component is
 * rendered from a Server Component, and a function prop cannot cross that
 * boundary. Palette tokens are reachable as `sx` paths without one.
 */
const styles = {
  title: {
    fontSize: "16px",
    fontWeight: 600,
    color: "custom.textHeading",
    mb: "8px",
  },
} satisfies Record<string, SxProps<Theme>>;

const InfoCardItem = ({ icon, title, content, show }: InfoCardItemProps) => {
  return (
    <Box
      // Static rather than a `(theme) => ...` callback, for the same reason as
      // `styles.title` above: this renders inside a Server Component now, and
      // the theme's CSS variables reach the same values without a function.
      sx={{
        bgcolor: "primary.light",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "custom.borderLilac",
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
      <Box>{icon}</Box>
      <Box data-test-selector={"info-card"}>
        <Typography sx={styles.title}>{title}</Typography>
        <Box>{content}</Box>
      </Box>
    </Box>
  );
};

export default InfoCardItem;
