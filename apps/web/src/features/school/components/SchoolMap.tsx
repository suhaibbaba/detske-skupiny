import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { hasPosition, type School } from "@/types";
import useTranslate from "@/hooks/useTranslate";
import MapComponent from "@/components/map/LazyMap";
import { parseAddress } from "@/features/school/utils";
import { custom } from "@/theme/custom";

interface Props {
  school?: School;
}

const styles = {
  title: {
    mb: "20px",
    mt: "80px",
  },
  mapWrapper: {
    bgcolor: "common.white",
    width: "100%",
    maxHeight: "426px",
    height: "426px",
    borderRadius: "24px",
    boxShadow: custom.shadows.card,
    p: "20px",
  },
} satisfies Record<string, SxProps<Theme>>;

const SchoolMap = ({ school }: Props) => {
  const translate = useTranslate();
  const marker = parseAddress(school);
  // No address, or an address with no map location: there is nothing to draw.
  if (!marker || !hasPosition(marker)) {
    return null;
  }

  return (
    <Box component="section" id="map">
      <Typography variant="h2" sx={styles.title}>
        {translate("map")}
      </Typography>
      <Box sx={styles.mapWrapper}>
        <MapComponent
          defaultCenter={marker.coordinate}
          markers={[marker]}
          defaultZoom={14}
        />
      </Box>
    </Box>
  );
};

export default SchoolMap;
