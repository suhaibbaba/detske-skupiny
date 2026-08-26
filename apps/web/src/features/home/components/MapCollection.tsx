import { Box, Container, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { MapCoordinate, MarkerData, Region } from "@/types";
import MapRegionFilter from "@/features/home/components/MapRegionFilter";

interface Props {
  fields: {
    title: string;
    description: string;
    regions: Region[];
    markers?: MarkerData[];
    defaultCenter: MapCoordinate;
  };
}

const styles = {
  section: {
    bgcolor: "secondary.main",
    pt: { xs: "100px", md: "100px" },
    pb: { xs: "100px", md: "120px" },
    textAlign: "center",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    mb: "12px",
  },
  description: {
    mb: "46px",
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The map section's shell: a heading, a paragraph, and the interactive part.
 *
 * The selected-region id the region pills and the map share lives in
 * `MapRegionFilter`, which keeps the client boundary at that one leaf -
 * everything above it renders on the server.
 */
const MapCollection = ({ fields }: Props) => {
  return (
    <Box sx={styles.section} data-test-selection="MapCollection">
      <Container sx={styles.container}>
        <Typography sx={styles.title} variant="h1">
          {fields.title}
        </Typography>
        <Typography sx={styles.description}>{fields.description}</Typography>
        <MapRegionFilter
          regions={fields.regions}
          markers={fields.markers}
          defaultCenter={fields.defaultCenter}
        />
      </Container>
    </Box>
  );
};

export default MapCollection;
