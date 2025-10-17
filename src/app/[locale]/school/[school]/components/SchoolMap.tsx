import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { School } from "@/sanity/types";
import useTranslate from "@/hooks/useTranslate";
import MapComponent from "@/components/ui/map/MapComponent";
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
    color: "custom.ui13",
    fontSize: "24px",
    fontWeight: 600,
    mt: "80px",
    mb: "20px",
  },
  mapWrapper: {
    bgcolor: "common.white",
    sx: {
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
  if (!marker) {
    return null;
  }

  return (
    <Box component="section">
      <Typography {...styles.title}>{translate("Map")}</Typography>
      <Box {...styles.mapWrapper}>
        <MapComponent defaultCenter={marker.coordinate} markers={[marker]} />
      </Box>
    </Box>
  );
};

export default SchoolMap;
