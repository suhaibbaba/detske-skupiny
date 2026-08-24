import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { hasPosition, type School } from "@/sanity/types";
import useTranslate from "@/hooks/useTranslate";
import MapComponent from "@/components/ui/map/LazyMap";
import { parseAddress } from "@/utilites/location";

interface Props {
  school?: School;
}

interface SchoolMapStyles {
  title?: TypographyProps;
  mapWrapper?: BoxProps;
}

const styles: SchoolMapStyles = {
  title: {
    sx: {
      mb: "20px",
      mt: "80px",
    },
  },
  mapWrapper: {
    sx: {
      bgcolor: "common.white",
      width: "100%",
      maxHeight: "426px",
      height: "426px",
      borderRadius: "24px",
      boxShadow: "var(--mui-palette-shadows-ui1)",
      p: "20px",
    },
  },
};

const SchoolMap = ({ school }: Props) => {
  const translate = useTranslate();
  const marker = parseAddress(school);
  // No address, or an address with no map location: there is nothing to draw.
  if (!marker || !hasPosition(marker)) {
    return null;
  }

  return (
    <Box component="section" id="map">
      <Typography variant="h2" {...styles.title}>
        {translate("map")}
      </Typography>
      <Box {...styles.mapWrapper}>
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
