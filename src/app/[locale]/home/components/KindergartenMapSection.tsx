"use client";

import {
  Box,
  BoxProps,
  Button,
  ButtonProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
  Stack,
} from "@mui/material";

interface KindergartenMapSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  filterWrapper?: BoxProps;
  filterButton?: ButtonProps;
  mapWrapper?: BoxProps;
  mapImage?: BoxProps;
}

const styles: KindergartenMapSectionStyles = {
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
    variant: "ghost",
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

const filters = ["View All", "View Prague", "View Brno – Střed, Komárov"];

const KindergartenMapSection = () => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.title}>Map of Private Kindergartens</Typography>
        <Typography {...styles.description}>
          Neighbour Kinder Groups are trusted, independent kindergartens and
          childcare providers located right in your area — offering personalized
          care, community-based learning, and flexible programs.
        </Typography>
        <Box {...styles.filterWrapper}>
          {filters.map((label, idx) => (
            <Button key={idx} {...styles.filterButton}>
              {label}
            </Button>
          ))}
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

export default KindergartenMapSection;
