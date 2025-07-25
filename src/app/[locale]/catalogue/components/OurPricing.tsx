"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  BoxProps,
  TypographyOwnProps,
  PaperProps,
  ButtonProps,
  ListProps,
  ListItemProps,
  alpha,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import data from "@/data/catalogue";

interface PricingStyles {
  container?: BoxProps;
  headingBox?: BoxProps;
  title?: TypographyOwnProps;
  subtitle?: TypographyOwnProps;
  cardsWrapper?: BoxProps;
  card?: PaperProps;
  planLabel?: TypographyOwnProps;
  planDescription?: TypographyOwnProps;
  price?: TypographyOwnProps;
  featureList?: ListProps;
  featureItem?: ListItemProps;
  featureIcon?: BoxProps;
  button?: ButtonProps;
  popularLabel?: TypographyOwnProps;
}

const styles: PricingStyles = {
  container: {
    sx: {
      pb: {
        xs: "0",
        sm: "120px",
      },
    },
  },
  headingBox: {
    textAlign: "center",
    mb: "80px",
  },
  title: {
    variant: "h1",
    mb: "24px",
  },
  subtitle: {
    maxWidth: "852px",
    mx: "auto",
  },
  cardsWrapper: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      justifyContent: "center",
      alignItems: {
        xs: "center",
        sm: "stretch",
      },
      columnGap: "32px",
      rowGap: "42px",
    },
  },
  card: {
    sx: (theme) => ({
      borderRadius: "24px",
      px: "28px",
      py: "40px",
      width: "350px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      boxShadow: `
        0 4px 6px ${alpha(theme.palette.common.black, 0.06)},
        0 2px 4px ${alpha(theme.palette.common.black, 0.08)}
      `,
    }),
  },
  planLabel: {
    color: "custom.ui8",
    fontSize: "25px",
    fontWeight: 600,
    mb: "12px",
  },
  planDescription: {
    color: "text.secondary",
    textAlign: "center",
    mb: "16px",
  },
  price: {
    fontSize: "44px",
    fontWeight: 600,
    color: "custom.ui10",
    mb: "24px",
  },
  featureList: {
    sx: (theme) => ({
      width: "100%",
      mb: "32px",
      bgcolor: theme.palette.custom.ui9,
      p: "8px",
    }),
  },
  featureItem: {
    disableGutters: true,
    disablePadding: true,
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
  featureIcon: {
    sx: {
      display: "flex",
      color: "success.main",
      minWidth: "auto",
    },
  },
  button: {
    variant: "contained",
    sx: {
      px: "52px",
    },
  },
  // TODO: use SVG later
  popularLabel: {
    variant: "caption",
    sx: {
      position: "absolute",
      top: "-20px",
      right: "16px",
      backgroundColor: "#FFEB3B",
      color: "text.primary",
      fontWeight: 700,
      borderRadius: "8px",
      px: "8px",
      py: "2px",
    },
  },
};

const OurPricing = () => {
  const translate = useSafeTranslations("CataloguePage");

  return (
    <Box {...styles.container}>
      <Container>
        <Box {...styles.headingBox}>
          <Typography {...styles.title}>
            {translate("pricing.heading")}
          </Typography>
          <Typography {...styles.subtitle}>
            {translate("pricing.description")}
          </Typography>
        </Box>
        <Box {...styles.cardsWrapper}>
          {data.ourPricing.plans.map((plan) => (
            <Paper key={plan.name} {...styles.card}>
              {plan.popular && (
                <Typography {...styles.popularLabel}>
                  {translate("pricing.popular")}
                </Typography>
              )}
              <Typography {...styles.planLabel}>
                {translate(plan.name)}
              </Typography>
              <Typography {...styles.planDescription}>
                {translate(plan.description)}
              </Typography>
              <Typography {...styles.price}>{translate(plan.price)}</Typography>
              <List {...styles.featureList}>
                {plan.features.map((f) => (
                  <ListItem key={f.label} {...styles.featureItem}>
                    <Box
                      {...styles.featureIcon}
                      sx={{
                        ...styles.featureIcon?.sx,
                        color: f.included ? "success.main" : "error.main",
                      }}
                    >
                      {f.included ? <CheckIcon /> : <CloseIcon />}
                    </Box>
                    <ListItemText
                      primary={translate(`pricing.features.${f.label}`)}
                    />
                  </ListItem>
                ))}
              </List>
              <Button {...styles.button}>{translate("Get this Plan")}</Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default OurPricing;
