import { Box, Skeleton } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { CardGridSkeleton, MapSkeleton } from "@/components/ui/skeleton";

const styles = {
  /** `SchoolList`'s own container: a column with 26px between its three parts. */
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "26px",
  },
  /** `SchoolsMap`'s wrapper, to the pixel. */
  mapWrapper: {
    width: "100%",
    height: "400px",
    borderRadius: "24px",
    p: "20px",
  },
  /** `SchoolCount`: the "N results" line on the left, controls on the right. */
  countRow: {
    display: "grid",
    gap: "24px",
    width: "100%",
    gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
    alignItems: "center",
  },
  countText: {
    fontSize: "28px",
    width: { xs: "70%", md: 260 },
  },
  controls: {
    display: "flex",
    gap: "12px",
    justifyContent: { xs: "flex-start", md: "flex-end" },
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * What the catalog's Suspense boundary shows while the list query runs.
 *
 * `CardGridSkeleton` alone would reserve the grid but not the map and the
 * results row above it, so the grid itself would still start ~470px too high
 * and slide down when the real list arrived. This reserves all three parts of
 * `SchoolList`, in its layout, so the swap moves nothing.
 *
 * The map is drawn unconditionally. `SchoolsMap` renders nothing when no
 * school in the scope has coordinates, which is not knowable before the query
 * resolves - and reserving a box that turns out not to be needed shifts the
 * page up by less than not reserving one that is shifts it down.
 */
const CatalogListSkeleton = () => (
  <Box sx={styles.container}>
    <Box sx={styles.mapWrapper}>
      <MapSkeleton minHeight={360} />
    </Box>
    <Box sx={styles.countRow}>
      <Skeleton variant="text" sx={styles.countText} />
      <Box sx={styles.controls}>
        <Skeleton variant="rounded" width={48} height={40} />
        <Skeleton variant="rounded" width={220} height={40} />
      </Box>
    </Box>
    <CardGridSkeleton />
  </Box>
);

export default CatalogListSkeleton;
