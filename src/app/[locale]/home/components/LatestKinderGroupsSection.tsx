"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import KinderGroupCard from "@/app/[locale]/home/components/KinderGroupCard";

interface LatestKinderGroupsSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  heading?: TypographyProps;
  subheading?: TypographyProps;
  grid?: BoxProps;
}

const styles: LatestKinderGroupsSectionStyles = {
  section: {
    component: "section",
    sx: (theme) => ({
      pt: "100px",
      pb: "74px",
      bgcolor: theme.palette.primary.light,
      textAlign: "center",
    }),
  },
  container: {
    component: "section",
    sx: {
      textAlign: "center",
    },
  },
  heading: {
    component: "h1",
    variant: "h1",
    sx: {
      mb: "12px",
    },
  },
  subheading: {
    sx: {
      mb: "80px",
    },
  },
  grid: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      columnGap: "24px",
      rowGap: {
        xs: "32px",
        sm: "80px",
      },
    },
  },
};

const LatestKinderGroupsSection = () => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.heading}>
          Our Latest Added Kinder Groups
        </Typography>
        <Typography {...styles.subheading}>
          Hundreds of childcare groups are already reaching local families
          through our platform. Add your listing today to be seen, contacted,
          and trusted by parents near you.
        </Typography>
        <Box {...styles.grid}>
          <KinderGroupCard />
          <KinderGroupCard />
          <KinderGroupCard />
          <KinderGroupCard />
        </Box>
      </Container>
    </Box>
  );
};

export default LatestKinderGroupsSection;
