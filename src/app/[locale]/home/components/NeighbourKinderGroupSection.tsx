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
} from "@mui/material";
import IllustrationChildrenGroup from "@/components/icons/IllustrationChildrenGroup";
import {
  SanityCtaField,
  SanityImageField,
  SanityRichTextField,
} from "@/sanity/types";
import RichText from "@/sanity/components/RichText";

interface Props {
  fields: {
    image: SanityImageField;
    title?: SanityRichTextField;
    description: SanityRichTextField;
    cta: SanityCtaField;
  };
}

interface NeighbourKinderGroupSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  contentWrapper?: BoxProps;
  textBlock?: BoxProps;
  heading?: TypographyProps;
  description?: TypographyProps;
  ctaButton?: ButtonProps;
  imageWrapper?: BoxProps;
  image?: BoxProps;
}

const styles: NeighbourKinderGroupSectionStyles = {
  section: {
    sx: {
      bgcolor: "common.white",
      py: {
        xs: "100px",
        md: "120px",
      },
    },
  },
  container: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        md: "row",
      },
      alignItems: "center",
      justifyContent: "space-between",
      gap: "80px",
    },
  },
  textBlock: {
    sx: {
      flex: 1,
      maxWidth: "467px",
    },
  },
  heading: {
    component: "h1",
    variant: "h1",
    sx: {
      mb: "12px",
    },
  },
  description: {
    sx: {
      mb: "24px",
      textAlign: {
        xs: "center",
        md: "left",
      },
    },
  },
  ctaButton: {
    variant: "primary",
  },
  imageWrapper: {
    sx: (theme) => ({
      flex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: theme.palette.shadows.ui1,
      bgcolor: theme.palette.common.white,
      p: "20px 24px",
    }),
  },
};

const NeighbourKinderGroupSection = ({ fields }: Props) => {
  return (
    <Box {...styles.section}>
      <Container {...styles.container}>
        <Box {...styles.textBlock}>
          <RichText {...styles.heading}>{fields.title}</RichText>
          <Typography {...styles.description}>
            Neighbour Kinder Groups are trusted, independent kindergartens and
            childcare providers located right in your area — offering
            personalized care, community-based learning, and flexible programs.
            Whether its a Montessori preschool, language-focused group, or
            nature-based nursery, each listing is verified and created to help
            you find the perfect fit for your child.
          </Typography>
          <Button {...styles.ctaButton}>View all Neighbour Schools</Button>
        </Box>

        <Box {...styles.imageWrapper}>
          <IllustrationChildrenGroup sx={{ width: "100%", height: "auto" }} />
        </Box>
      </Container>
    </Box>
  );
};

export default NeighbourKinderGroupSection;
