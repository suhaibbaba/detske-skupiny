import {
  Box,
  Container,
  Typography,
  Paper,
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
import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { FC } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { useTranslate } from "@/hooks/useTranslate";

interface Props {
  fields: {
    title: string;
    subtitle: string;
    mostPopularImage?: SanityImageField;
    plans: {
      name: string;
      description: string;
      price: string;
      cta: SanityCtaField;
      isMostPopular?: boolean;
      features: {
        label: string;
        included?: boolean;
      }[];
    }[];
  };
  locale?: string;
}

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
  mostPopular?: BoxProps;
  interval?: TypographyOwnProps;
}

const styles: PricingStyles = {
  container: {
    sx: {
      pb: {
        xs: "0",
        sm: "120px",
      },
      pt: {
        xs: "100px",
        sm: "80px",
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
      rowGap: "60px",
    },
  },
  card: {
    sx: {
      borderRadius: "24px",
      px: "28px",
      py: "40px",
      width: "350px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      boxShadow: `
        0 4px 6px rgba(0, 0, 0, 0.06),
        0 2px 4px rgba(0, 0, 0, 0.08)
      `,
    },
  },
  planLabel: {
    color: "custom.ui8",
    fontSize: "25px",
    fontWeight: 900,
    mb: "12px",
  },
  planDescription: {
    color: "text.secondary",
    textAlign: "center",
    mb: "24px",
  },
  price: {
    fontSize: "44px",
    fontWeight: 900,
    color: "custom.ui10",
    lineHeight: 1,
  },
  featureList: {
    sx: {
      width: "100%",
      mb: "32px",
      p: "8px",
    },
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
  mostPopular: {
    sx: {
      position: "absolute",
      top: "-26px",
      right: "16px",
    },
  },
  interval: {
    sx: {
      textAlign: "center",
      fontSize: "14px",
      mb: "24px",
    },
  },
};

const OurPricing: FC<Props> = ({ fields, locale }) => {
  const translate = useTranslate();

  return (
    <Box {...styles.container} data-test-selector="OurPricing">
      <Container>
        <Box {...styles.headingBox}>
          <Typography {...styles.title}>{fields.title}</Typography>
          <Typography {...styles.subtitle}>{fields.subtitle}</Typography>
        </Box>
        <Box {...styles.cardsWrapper}>
          {fields.plans?.map((plan) => {
            const link = parseLinkField(plan.cta.link, {
              locale: locale,
            });

            return (
              <Paper key={plan.name} {...styles.card}>
                {plan.isMostPopular && (
                  <Box
                    src={urlImageFor(fields.mostPopularImage)}
                    component="img"
                    alt=""
                    {...styles.mostPopular}
                  />
                )}
                <Typography {...styles.planLabel}>{plan.name}</Typography>
                <Typography {...styles.planDescription}>
                  {plan.description}
                </Typography>
                <Box>
                  <Typography {...styles.price}>{plan.price}</Typography>
                  <Typography {...styles.interval}>
                    {translate("monthly")}
                  </Typography>
                </Box>
                <List {...styles.featureList}>
                  {plan.features?.map((f) => (
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
                      <ListItemText primary={f.label} />
                    </ListItem>
                  ))}
                </List>
                {link && (
                  <Button
                    {...styles.button}
                    variant={plan.cta.variant}
                    href={link?.url}
                  >
                    {link?.text}
                  </Button>
                )}
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default OurPricing;
