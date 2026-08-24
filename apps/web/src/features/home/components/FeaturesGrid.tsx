import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import { SanityImageField } from "@/types";
import Image, { type ImageProps } from "@/components/ui/image";

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

const styles = {
  section: {
    bgcolor: "secondary.main",
    py: { xs: "50px", md: "100px" },
    textAlign: "center",
  },
  heading: {
    mb: "12px",
  },
  subheading: {},
  grid: {
    display: {
      xs: "flex",
      md: "grid",
    },
    flexDirection: {
      xs: "column",
      md: "row",
    },
    alignItems: {
      xs: "center",
      md: "unset",
    },
    gridTemplateColumns: {
      md: "repeat(3, 1fr)",
    },
    columnGap: {
      md: "94px",
    },
    rowGap: {
      xs: "60px",
      sm: "70px",
    },
    mt: "80px",
  },
  item: {
    textAlign: "center",
    maxWidth: "250px",
    mx: "auto",
  },
  icon: {
    width: "58px",
    height: "58px",
    mb: "12px",
  },
  itemTitle: {
    color: "custom.textHeading",
    fontSize: "16px",
    fontWeight: 900,
    mb: "12px",
  },
  itemDescription: {
    textAlign: "center",
  },
} satisfies Record<string, SxProps<Theme>>;

const FeaturesGrid = ({ fields }: Props) => {
  return (
    <Box sx={styles.section}>
      <Container>
        <Typography sx={styles.heading} variant="h1">
          {fields.title}
        </Typography>
        <Typography>{fields.description}</Typography>
        <Box sx={styles.grid}>
          {fields.items?.map((feature, idx) => {
            const index = idx + 1; // Start from 1 to simplify logic

            let gridColumn: number;
            let gridRow: number | string;
            let alignSelf: string | undefined = undefined;

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
              gridRow = "3 span";
              alignSelf = "center";
            }

            return (
              <Box
                key={index}
                sx={{
                  ...styles.item,
                  gridColumn,
                  gridRow,
                  alignSelf,
                }}
              >
                <Image
                  sx={styles.icon}
                  src={feature.icon}
                  alt={feature.title}
                  sizes="64px"
                />
                <Typography sx={styles.itemTitle}>{feature.title}</Typography>
                <Typography sx={styles.itemDescription}>
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

export default FeaturesGrid;
