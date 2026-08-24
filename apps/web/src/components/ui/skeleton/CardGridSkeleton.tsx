import { Box, Skeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  DEFAULT_SKELETON_CARDS,
  SCHOOL_CARD,
  SCHOOL_GRID,
} from "@/components/ui/skeleton/geometry";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: SCHOOL_GRID.templateColumns,
    gap: SCHOOL_GRID.gap,
  },
  card: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.divider",
    borderRadius: SCHOOL_CARD.radius,
    display: "flex",
    flexDirection: "column",
    p: SCHOOL_CARD.padding,
    width: "100%",
    gap: SCHOOL_CARD.gap,
    maxWidth: { md: `${SCHOOL_CARD.maxWidth}px` },
    m: { xs: "0 auto", sm: "0" },
  },
  image: {
    width: "100%",
    height: SCHOOL_CARD.imageHeight,
    borderRadius: SCHOOL_CARD.imageRadius,
  },
  nameRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    minHeight: SCHOOL_CARD.nameMinHeight,
  },
  tagRow: {
    display: "flex",
    gap: SCHOOL_CARD.tagGap,
    minHeight: SCHOOL_CARD.tagRowMinHeight,
  },
  location: {
    height: SCHOOL_CARD.locationHeight,
    mb: SCHOOL_CARD.locationMarginBottom,
  },
  description: {
    minHeight: SCHOOL_CARD.descriptionMinHeight,
  },
  cta: {
    mt: SCHOOL_CARD.ctaMarginTop,
    height: SCHOOL_CARD.ctaHeight,
    borderRadius: "24px",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * One placeholder school card.
 *
 * Built from the same measurements the real card is - see
 * `skeleton/geometry.ts` - rather than from numbers that look about right, so
 * the swap when the list arrives moves nothing.
 */
const CardSkeleton = () => (
  <Box sx={styles.card}>
    <Skeleton variant="rectangular" sx={styles.image} />
    <Box sx={styles.nameRow}>
      <Skeleton
        variant="circular"
        width={SCHOOL_CARD.logoSize}
        height={SCHOOL_CARD.logoSize}
      />
      <Skeleton variant="text" sx={{ flexGrow: 1, fontSize: "18px" }} />
    </Box>
    <Box sx={styles.tagRow}>
      <Skeleton variant="rounded" width={72} height={20} />
      <Skeleton variant="rounded" width={56} height={20} />
    </Box>
    <Box sx={{ mt: "auto", width: "100%" }}>
      <Skeleton variant="text" width="60%" sx={styles.location} />
      <Skeleton variant="rectangular" sx={styles.description} />
      <Skeleton variant="rounded" sx={styles.cta} />
    </Box>
  </Box>
);

/**
 * The catalog list, before it arrives.
 *
 * Replaces a centred `CircularProgress`, which reserved none of the height the
 * grid was about to take and so guaranteed a shift the moment it did.
 *
 * `aria-hidden` and `aria-busy` together: there is nothing here to read out,
 * and the region announces that it is loading rather than announcing nine
 * empty cards.
 */
const CardGridSkeleton = ({
  count = DEFAULT_SKELETON_CARDS,
}: {
  count?: number;
}) => (
  <Box
    sx={styles.grid}
    aria-busy
    aria-hidden
    data-test-selector="CardGridSkeleton"
  >
    {Array.from({ length: count }, (_, index) => (
      <CardSkeleton key={index} />
    ))}
  </Box>
);

export default CardGridSkeleton;
