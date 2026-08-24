import { Box, BoxProps } from "@mui/material";
import MapComponent from "@/components/ui/map/LazyMap";
import { MarkerData } from "@/sanity/types";

interface Props {
  markers?: MarkerData[];
}

interface SchoolsMapStyles {
  mapWrapper?: BoxProps;
}

const styles: SchoolsMapStyles = {
  mapWrapper: {
    bgcolor: "common.white",
    sx: {
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
  if (!markers || markers.length === 0) {
    return null;
  }

  return (
    <Box {...styles.mapWrapper}>
      <MapComponent
        defaultCenter={markers[0].coordinate}
        markers={markers}
        minHeight={300}
      />
    </Box>
  );
};

export default SchoolsMap;
