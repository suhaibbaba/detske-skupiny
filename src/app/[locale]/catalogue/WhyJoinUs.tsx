"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  BoxProps,
  TypographyOwnProps,
  PaperProps,
  alpha,
} from "@mui/material";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import data from "@/data/catalogue";

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
    sx: (theme) => ({
      bgcolor: theme.palette.custom.ui5,
      pt: "100px",
      pb: {
        xs: "80px",
        sm: "120px",
      },
    }),
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
    sx: (theme) => ({
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      p: "24px",
      borderRadius: "24px",
      width: "258px",
      boxShadow: "none",
    }),
  },
  iconWrapper: {
    bgcolor: "secondary.main",
    sx: {
      width: "88px",
      height: "88px",
      borderRadius: "50%",
      padding: "25px 30px",
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

const WhyJoinUs = () => {
  const translate = useSafeTranslations("CataloguePage");

  return (
    <Box {...styles.container}>
      <Container>
        <Box {...styles.headingBox}>
          <Typography {...styles.title}>
            {translate("whyJoinUs.heading")}
          </Typography>
          <Typography {...styles.description}>
            {translate("whyJoinUs.description")}
          </Typography>
        </Box>
        <Box {...styles.featuresWrapper}>
          {data.features.map((item) => (
            <Paper key={item.title} {...styles.featureCard}>
              <Box {...styles.iconWrapper}>{item.icon}</Box>
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

export default WhyJoinUs;
