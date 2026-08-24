import { Box, Container, Skeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

const styles = {
  /** `PageLayout`'s own section padding, so the hero block lands where it will. */
  hero: {
    pt: { xs: 2, md: 5 },
    pb: { xs: 5, md: 12.5 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  heroTitle: {
    fontSize: { xs: "36px", sm: "40px", md: "48px" },
    width: { xs: "90%", md: "60%" },
  },
  heroDescription: {
    fontSize: "16px",
    maxWidth: "854px",
    width: "100%",
  },
  body: {
    display: "grid",
    gap: "24px",
    gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
    pb: { xs: 5, md: 12.5 },
  },
  block: {
    height: { xs: "180px", md: "240px" },
    borderRadius: "24px",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The route-level fallback: a page heading and a band of content below it.
 *
 * Every route on this site opens the same way - `PageLayout` wrapping a
 * centred `PageHeadingTypography` - so a placeholder for "some page is
 * loading" can be specific about the top of it even when it knows nothing
 * about the rest. Below that it draws three blocks rather than pretending to
 * know the shape; `app/[locale]/loading.tsx` is what renders while Next has
 * not decided which route it is.
 *
 * This replaces a full-screen `Backdrop` with a spinner over four generic
 * grey bars, which told a visitor nothing and covered the header while it did.
 */
const PageSkeleton = () => (
  <Box aria-busy aria-hidden data-test-selector="PageSkeleton">
    <Container sx={styles.hero}>
      <Skeleton variant="text" sx={styles.heroTitle} />
      <Skeleton variant="text" sx={styles.heroDescription} />
      <Skeleton variant="text" sx={styles.heroDescription} width="70%" />
    </Container>
    <Container sx={styles.body}>
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} variant="rectangular" sx={styles.block} />
      ))}
    </Container>
  </Box>
);

export default PageSkeleton;
