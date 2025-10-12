import { Box, BoxProps, Typography, TypographyProps } from "@mui/material";
import { School } from "@/sanity/types";
import useTranslate from "@/hooks/useTranslate";
import Map from "@/components/ui/map/Map";

interface Props {
  address?: School["address"];
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

const SchoolMap = ({ address }: Props) => {
  const translate = useTranslate();
  if (!address || !address.mapLocation) {
    return null;
  }

  return (
    <Box component="section">
      <Typography {...styles.title}>{translate("Map")}</Typography>
      <Box {...styles.mapWrapper}>
        <Map
          defaultLocation={address.mapLocation}
          coordinates={[
            {
              coordinate: address.mapLocation,
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default SchoolMap;
