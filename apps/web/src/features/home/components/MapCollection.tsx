"use client";

import { Box, Container, Typography } from "@mui/material";
import { MapCoordinate, MarkerData, Region } from "@/types";
import Button from "@/components/ui/button";
import MapComponent from "@/components/map/LazyMap";
import useTranslate from "@/hooks/useTranslate";
import { useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import { custom } from "@/theme/custom";

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
    bgcolor: "var(--mui-palette-secondary-main)",
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
  filterWrapper: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexDirection: {
      xs: "column",
      sm: "row",
    },
    width: "100%",
  },
  filterButton: {
    width: "100%",
    "&.selected": {
      borderColor: "custom.textLilac",
    },
  },
  mapWrapper: {
    bgcolor: "common.white",
    position: "relative",
    width: "100%",
    maxHeight: {
      xs: "520px",
      sm: "686px",
    },
    height: {
      xs: "520px",
      sm: "686px",
    },
    mt: "48px",
    borderRadius: "24px",
    boxShadow: custom.shadows.card,
    p: "20px",
  },
} satisfies Record<string, SxProps<Theme>>;

const MapCollection = ({ fields }: Props) => {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const translate = useTranslate();

  const onSelectedRegionIdClick = (id: string) => {
    setSelectedRegionId(id);
  };

  return (
    <Box sx={styles.section} data-test-selection="MapCollection">
      <Container sx={styles.container}>
        <Typography sx={styles.title} variant="h1">
          {fields.title}
        </Typography>
        <Typography sx={styles.description}>{fields.description}</Typography>
        <Box sx={styles.filterWrapper}>
          <Button
            variant="ghost"
            sx={styles.filterButton}
            onClick={() => onSelectedRegionIdClick("")}
            className={!selectedRegionId ? "selected" : ""}
          >
            {translate("viewAll")}
          </Button>

          {fields.regions?.map((region) => {
            return (
              <Button
                key={region.id}
                variant="ghost"
                sx={styles.filterButton}
                className={region.id === selectedRegionId ? "selected" : ""}
                onClick={() => onSelectedRegionIdClick(region.id)}
              >
                {region.name}
              </Button>
            );
          })}
        </Box>
        <Box sx={styles.mapWrapper}>
          <MapComponent
            selectedRegionId={selectedRegionId}
            defaultCenter={fields.defaultCenter}
            markers={fields.markers}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default MapCollection;
