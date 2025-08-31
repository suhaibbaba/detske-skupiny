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
import { SanityCtaField } from "@/sanity/types";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";

interface Props {
  fields: {
    title: string;
    description: string;
    cta?: SanityCtaField[];
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
        sm: "auto",
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
  return (
    <Box {...styles.section} data-test-selection="MapCollection">
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        <Box {...styles.filterWrapper}>
          {fields.cta?.map((cta) => {
            const link = parseLinkField(cta.link);
            return (
              <Button
                key={cta._key}
                variant={cta.variant}
                {...styles.filterButton}
              >
                {link.text}
              </Button>
            );
          })}
        </Box>
        <Box {...styles.mapWrapper}>
          <Box
            component="img"
            {...styles.mapImage}
            src="/home/map.jpg"
            alt="Kindergarten Map"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default MapCollection;
