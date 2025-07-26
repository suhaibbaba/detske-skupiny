"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: "/icons/compass.png",
    title: "Location-Based Filtering",
    description:
      "Whether you're in Prague 3 or Brno-Komárov, find kinder groups in your immediate area with smart nested filters — even down to neighborhood level.",
  },
  {
    icon: "/icons/lock.png",
    title: "Verified Providers",
    description:
      "Peace of mind for parents — each listing goes through a basic verification process before appearing in the catalog.",
  },
  {
    icon: "/icons/wand.png",
    title: "Flexible Programs",
    description:
      "Peace of mind for parents — each listing goes through a basic verification process before appearing in the catalog.",
  },
  {
    icon: "/icons/camera.png",
    title: "Photos & Features",
    description:
      "Get a feel for each group’s environment before visiting — from cozy classrooms to outdoor gardens.",
  },
  {
    icon: "/icons/tag.png",
    title: "Flexible Programs",
    description:
      "Premium groups offer more info, images, and perks. Easily spot them with a “Community Partner” badge in search results.",
  },
];

interface PremiumSchoolsFeatureSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  heading?: TypographyProps;
  subheading?: TypographyProps;
  grid?: BoxProps;
  item?: BoxProps;
  icon?: BoxProps;
  itemTitle?: TypographyProps;
  itemDescription?: TypographyProps;
}

const styles: PremiumSchoolsFeatureSectionStyles = {
  section: {
    sx: {
      bgcolor: "secondary.main",
      py: "100px",
      textAlign: "center",
    },
  },
  heading: {
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
    sx: (theme) => ({
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      columnGap: "94px",
      rowGap: "70px",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
    }),
  },
  item: {
    sx: {
      textAlign: "center",
      maxWidth: "250px",
      mx: "auto",
    },
  },
  icon: {
    component: "img",
    sx: {
      width: "58px",
      height: "58px",
      mb: "12px",
    },
  },
  itemTitle: {
    color: "custom.ui13",
    sx: {
      fontSize: "16px",
      fontWeight: 600,
      mb: "12px",
    },
  },
  itemDescription: {
    sx: {
      textAlign: "center",
    },
  },
};

const PremiumSchoolsFeatureSection = () => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.heading}>
          What Makes Our Premium Schools Stand Out?
        </Typography>
        <Typography {...styles.subheading}>
          Our Community Partners enjoy premium visibility, added features, and
          show their commitment to early education excellence.
        </Typography>

        <Box {...styles.grid} className="fuck">
          {features.map((feature, idx) => {
            const index = idx + 1; // Start from 1 to simplify logic

            let gridColumn: number;
            let gridRow: number;

            if (index % 3 === 1) {
              // First in zigzag pair (1, 4, 7, ...)
              gridColumn = 1;
              gridRow = Math.ceil(index / 3) * 2 - 1;
            } else if (index % 3 === 2) {
              // Second in zigzag pair (2, 5, 8, ...)
              gridColumn = 3;
              gridRow = Math.ceil(index / 3) * 2 - 1;
            } else {
              // Centered item (3, 6, 9, ...)
              gridColumn = 2;
              gridRow = Math.ceil(index / 3) * 2;
            }

            return (
              <Box
                key={index}
                {...styles.item}
                sx={{
                  ...styles.item?.sx,
                  gridColumn,
                  gridRow,
                }}
              >
                <Box
                  component="img"
                  {...styles.icon}
                  src={feature.icon}
                  alt={feature.title}
                />
                <Typography {...styles.itemTitle}>{feature.title}</Typography>
                <Typography {...styles.itemDescription}>
                  {feature.description}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default PremiumSchoolsFeatureSection;
