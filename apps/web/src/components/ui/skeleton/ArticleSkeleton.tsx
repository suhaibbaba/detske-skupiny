import { Box, Container, Skeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

const styles = {
  container: {
    py: { xs: 5, md: 12.5 },
  },
  /** `typography.h1`: 48/40/36px clamped, 900 weight, 20px below. */
  title: {
    fontSize: { xs: "36px", sm: "40px", md: "48px" },
    mb: "20px",
  },
  /** The author row: a 36px avatar and one line of "date · N min read". */
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    mb: "40px",
  },
  cover: {
    width: "100%",
    height: { xs: "220px", md: "420px" },
    borderRadius: "12px",
    mb: "40px",
  },
  paragraph: {
    fontSize: "16px",
  },
} satisfies Record<string, SxProps<Theme>>;

/** How many body lines to draw. Enough to fill a phone screen, not the article. */
const BODY_LINES = 8;

/**
 * An article, before it arrives: title, author row, cover, body.
 *
 * The proportions come from the article page itself - an `h1` at the theme's
 * clamped size, the 36px avatar its meta row uses, and the same 40px gaps -
 * so the page does not jump when the real thing replaces it.
 */
const ArticleSkeleton = () => (
  <Container
    maxWidth="md"
    sx={styles.container}
    aria-busy
    aria-hidden
    data-test-selector="ArticleSkeleton"
  >
    <Skeleton variant="text" width="80%" sx={styles.title} />
    <Box sx={styles.metaRow}>
      <Skeleton variant="circular" width={36} height={36} />
      <Skeleton variant="text" width={220} />
    </Box>
    <Skeleton variant="rectangular" sx={styles.cover} />
    {Array.from({ length: BODY_LINES }, (_, index) => (
      <Skeleton
        key={index}
        variant="text"
        sx={styles.paragraph}
        // A ragged right edge reads as prose rather than as a block.
        width={index % 4 === 3 ? "62%" : "100%"}
      />
    ))}
  </Container>
);

export default ArticleSkeleton;
