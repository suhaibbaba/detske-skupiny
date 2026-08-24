import type { SxProps, Theme } from "@mui/material/styles";
import { Box } from "@mui/material";
import MapComponent from "@/components/map/LazyMap";
import { hasPosition, type MarkerData } from "@/types";
import { custom } from "@/theme/custom";

interface Props {
  markers?: MarkerData[];
}

const styles = {
  mapWrapper: {
    bgcolor: "common.white",
    position: "relative",
    width: "100%",
    maxHeight: "400px",
    height: "400px",
    borderRadius: "24px",
    boxShadow: custom.shadows.card,
    p: "20px",
  },
} satisfies Record<string, SxProps<Theme>>;

const SchoolsMap = ({ markers }: Props) => {
  // A school whose address carries no map location has nothing to place, and
  // centring on its missing coordinate is what used to throw.
  const placed = markers?.filter(hasPosition) ?? [];

  if (placed.length === 0) {
    return null;
  }

  return (
    <Box sx={styles.mapWrapper}>
      <MapComponent
        defaultCenter={placed[0].coordinate}
        markers={placed}
        minHeight={300}
      />
    </Box>
  );
};

export default SchoolsMap;
