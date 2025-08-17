"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import RichText from "@/sanity/components/RichText";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { SanityImageField } from "@/sanity/types";

interface FeatureItem {
  icon: SanityImageField;
  title: string;
  description: string;
}

interface Props {
  fields: {
    title?: string;
    description?: string;
    items?: FeatureItem[];
  };
}

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
      rowGap: {
        xs: "94px",
        sm: "70px",
      },
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

const PremiumSchoolsFeatureSection = ({ fields }: Props) => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.heading}>{fields.title}</Typography>
        <RichText {...styles.subheading}>{fields.description}</RichText>
        <Box {...styles.grid} className="fuck">
          {fields.items?.map((feature, idx) => {
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
                  src={urlImageFor(feature.icon)}
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
