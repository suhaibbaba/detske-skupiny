"use client";

import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { SanityCtaField } from "@/sanity/types";

interface Props {
  fields: {
    title: string;
    description: string;
    cta?: SanityCtaField;
  };
}

interface LatestKinderGroupsSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
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
  title: {
    component: "h1",
    variant: "h1",
    sx: {
      mb: "12px",
    },
  },
  description: {
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

const LatestSchoolCollection = ({ fields }: Props) => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        <Box {...styles.grid}>
          {/*<KinderGroupCard />*/}
          {/*<KinderGroupCard />*/}
          {/*<KinderGroupCard />*/}
          {/*<KinderGroupCard />*/}
        </Box>
      </Container>
    </Box>
  );
};

export default LatestSchoolCollection;
