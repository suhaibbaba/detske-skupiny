import { Box, BoxProps } from "@mui/material";
import MapComponent from "@/components/map/LazyMap";
import { hasPosition, type MarkerData } from "@/types";

interface Props {
  markers?: MarkerData[];
}

interface SchoolsMapStyles {
  mapWrapper?: BoxProps;
}

const styles: SchoolsMapStyles = {
  mapWrapper: {
    sx: {
      bgcolor: "common.white",
      position: "relative",
      width: "100%",
      maxHeight: "400px",
      height: "400px",
      borderRadius: "24px",
      boxShadow: "var(--mui-palette-shadows-ui1)",
      p: "20px",
    },
  },
};

const SchoolsMap = ({ markers }: Props) => {
  // A school whose address carries no map location has nothing to place, and
  // centring on its missing coordinate is what used to throw.
  const placed = markers?.filter(hasPosition) ?? [];

  if (placed.length === 0) {
    return null;
  }

  return (
    <Box {...styles.mapWrapper}>
      <MapComponent
        defaultCenter={placed[0].coordinate}
        markers={placed}
        minHeight={300}
      />
    </Box>
  );
};

export default SchoolsMap;
