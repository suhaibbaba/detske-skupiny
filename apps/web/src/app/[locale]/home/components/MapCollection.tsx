"use client";

import {
  Box,
  BoxProps,
  ButtonProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { MapCoordinate, MarkerData, Region } from "@/sanity/types";
import Button from "@/components/ui/button";
import MapComponent from "@/components/ui/map/LazyMap";
import useTranslate from "@/hooks/useTranslate";
import { useState } from "react";

interface Props {
  fields: {
    title: string;
    description: string;
    regions: Region[];
    markers?: MarkerData[];
    defaultCenter: MapCoordinate;
  };
}

interface MapCollectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  filterWrapper?: BoxProps;
  filterButton?: ButtonProps;
  mapWrapper?: BoxProps;
}

const styles: MapCollectionStyles = {
  section: {
    sx: {
      bgcolor: "var(--mui-palette-secondary-main)",
      pt: { xs: "100px", md: "100px" },
      pb: { xs: "100px", md: "120px" },
      textAlign: "center",
    },
  },
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  title: {
    variant: "h1",
    sx: {
      mb: "12px",
    },
  },
  description: {
    sx: {
      mb: "46px",
    },
  },
  filterWrapper: {
    sx: {
      display: "flex",
      gap: "24px",
      justifyContent: "center",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      width: "100%",
    },
  },
  filterButton: {
    sx: {
      width: "100%",
      "&.selected": {
        borderColor: "custom.ui11",
      },
    },
  },
  mapWrapper: {
    bgcolor: "common.white",
    sx: {
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
      boxShadow: "var(--mui-palette-shadows-ui1)",
      p: "20px",
    },
  },
};

const MapCollection = ({ fields }: Props) => {
  const [selectedRegionId, setSelectedRegionId] = useState("");
  const translate = useTranslate();

  const onSelectedRegionIdClick = (id: string) => {
    setSelectedRegionId(id);
  };

  return (
    <Box {...styles.section} data-test-selection="MapCollection">
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        <Box {...styles.filterWrapper}>
          <Button
            variant="ghost"
            {...styles.filterButton}
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
                {...styles.filterButton}
                className={region.id === selectedRegionId ? "selected" : ""}
                onClick={() => onSelectedRegionIdClick(region.id)}
              >
                {region.name}
              </Button>
            );
          })}
        </Box>
        <Box {...styles.mapWrapper}>
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
