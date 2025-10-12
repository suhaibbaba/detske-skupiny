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
import { Coordinate, Coordinates, Region } from "@/sanity/types";
import Button from "@/components/ui/button";
import Map from "@/components/ui/map/Map";
import useTranslate from "@/hooks/useTranslate";
import { useCallback, useState } from "react";

interface Props {
  fields: {
    title: string;
    description: string;
    regions: Region[];
    coordinates?: Coordinates[];
    defaultMapLocation: Coordinate;
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
  mapImage?: BoxProps;
}

const styles: MapCollectionStyles = {
  section: {
    sx: (theme) => ({
      bgcolor: theme.palette.secondary.main,
      pt: { xs: "100px", md: "100px" },
      pb: { xs: "100px", md: "120px" },
      textAlign: "center",
    }),
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
    sx: (theme) => ({
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
      boxShadow: theme.palette.shadows.ui1,
      p: "20px",
    }),
  },
  mapImage: {
    sx: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
};

const MapCollection = ({ fields }: Props) => {
  const [regionId, setRegionId] = useState("");
  const translate = useTranslate();

  const onRegionIdChange = (id: string) => {
    setRegionId(id);
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
            onClick={() => onRegionIdChange("")}
            className={!regionId ? "selected" : ""}
          >
            {translate("viewAll")}
          </Button>

          {fields.regions?.map((region) => {
            return (
              <Button
                key={region.id}
                variant="ghost"
                {...styles.filterButton}
                className={region.id === regionId ? "selected" : ""}
                onClick={() => onRegionIdChange(region.id)}
              >
                {region.name}
              </Button>
            );
          })}
        </Box>
        <Box {...styles.mapWrapper}>
          <Map
            regionId={regionId}
            defaultLocation={fields.defaultMapLocation}
            coordinates={fields.coordinates}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default MapCollection;
