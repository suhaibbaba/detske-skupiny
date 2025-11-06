import {
  Box,
  Container,
  Typography,
  Paper,
  BoxProps,
  TypographyOwnProps,
  PaperProps,
} from "@mui/material";
import { SanityImageField } from "@/sanity/types";
import { FC } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

interface Props {
  fields: {
    heading: string;
    subheading: string;
    features?: {
      _key: string;
      icon: SanityImageField;
      title: string;
      description: string;
    }[];
  };
  locale?: string;
}

interface WhyJoinUsStyles {
  container?: BoxProps;
  headingBox?: BoxProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  featuresWrapper?: BoxProps;
  featureCard?: PaperProps;
  iconWrapper?: BoxProps;
  cardTitle?: TypographyOwnProps;
  cardDescription?: TypographyOwnProps;
}

const styles: WhyJoinUsStyles = {
  container: {
    sx: {
      bgcolor: "var(--mui-palette-custom-ui5)",
      pt: "100px",
      pb: {
        xs: "80px",
        sm: "120px",
      },
    },
  },
  headingBox: {
    textAlign: "center",
    mb: {
      xs: "50px",
      sm: "100px",
    },
  },
  title: {
    variant: "h1",
    mb: "24px",
  },
  description: {
    maxWidth: "852px",
    mx: "auto",
  },
  featuresWrapper: {
    sx: {
      display: "flex",
      justifyContent: "space-around",
      rowGap: "60px",
      columnGap: "200px",
      flexWrap: "wrap",
    },
  },
  featureCard: {
    sx:{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      p: "24px",
      borderRadius: "24px",
      width: "258px",
      boxShadow: "none",
    },
  },
  iconWrapper: {
    bgcolor: "secondary.main",
    sx: {
      width: "88px",
      height: "88px",
      borderRadius: "50%",
      padding: "22px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  cardTitle: {
    variant: "h3",
    fontSize: "20px",
    fontWeight: 600,
    align: "center",
  },
  cardDescription: {
    align: "center",
  },
};

const SectionWorthIt: FC<Props> = ({ fields }) => {
  return (
    <Box {...styles.container}>
      <Container>
        <Box {...styles.headingBox}>
          <Typography {...styles.title}>{fields.heading}</Typography>
          <Typography {...styles.description}>{fields.subheading}</Typography>
        </Box>
        <Box {...styles.featuresWrapper}>
          {fields.features?.map((item) => (
            <Paper key={item._key} {...styles.featureCard}>
              <Box
                component="img"
                src={urlImageFor(item.icon)}
                {...styles.iconWrapper}
              />
              <Typography {...styles.cardTitle}>{item.title}</Typography>
              <Typography {...styles.cardDescription}>
                {item.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SectionWorthIt;
