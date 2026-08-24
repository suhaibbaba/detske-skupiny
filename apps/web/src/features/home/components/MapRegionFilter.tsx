"use client";

import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useState } from "react";
import Button from "@/components/ui/button";
import MapComponent from "@/components/map/LazyMap";
import useTranslate from "@/hooks/useTranslate";
import { MapCoordinate, MarkerData, Region } from "@/types";
import { custom } from "@/theme/custom";

interface Props {
  regions?: Region[];
  markers?: MarkerData[];
  defaultCenter: MapCoordinate;
}

const styles = {
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

/**
 * The interactive half of the map section: the region pills and the map they
 * filter.
 *
 * These two share one piece of state, so they are one Client Component. The
 * heading and the copy above them do not, and stay on the server in
 * `MapCollection`.
 */
const MapRegionFilter = ({ regions, markers, defaultCenter }: Props) => {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const translate = useTranslate();

  return (
    <>
      <Box sx={styles.filterWrapper}>
        <Button
          variant="ghost"
          sx={styles.filterButton}
          onClick={() => setSelectedRegionId("")}
          className={!selectedRegionId ? "selected" : ""}
        >
          {translate("viewAll")}
        </Button>

        {regions?.map((region) => (
          <Button
            key={region.id}
            variant="ghost"
            sx={styles.filterButton}
            className={region.id === selectedRegionId ? "selected" : ""}
            onClick={() => setSelectedRegionId(region.id)}
          >
            {region.name}
          </Button>
        ))}
      </Box>
      <Box sx={styles.mapWrapper}>
        <MapComponent
          selectedRegionId={selectedRegionId}
          defaultCenter={defaultCenter}
          markers={markers}
        />
      </Box>
    </>
  );
};

export default MapRegionFilter;
