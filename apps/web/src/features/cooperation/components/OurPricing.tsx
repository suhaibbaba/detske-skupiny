import type { SxProps, Theme } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { SanityCtaField, SanityImageField } from "@/types";
import { FC } from "react";

import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { useTranslate } from "@/hooks/useTranslate";
import Image, { type ImageProps } from "@/components/ui/image";

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

const styles = {
  container: {
    pb: {
      xs: "0",
      sm: "120px",
    },
    pt: {
      xs: "100px",
      sm: "80px",
    },
  },
  headingBox: {
    mb: "80px",
    textAlign: "center",
  },
  title: { mb: "24px" },
  subtitle: {
    mx: "auto",
    maxWidth: "852px",
  },
  cardsWrapper: {
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
  card: {
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
  planLabel: {
    color: "custom.textHeadingSoft",
    mb: "12px",
    fontWeight: 900,
    fontSize: "25px",
  },
  planDescription: {
    color: "text.secondary",
    mb: "24px",
    textAlign: "center",
  },
  price: {
    color: "custom.accentLilac",
    lineHeight: 1,
    fontWeight: 900,
    fontSize: "44px",
  },
  featureList: {
    width: "100%",
    mb: "32px",
    p: "8px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  featureIcon: {
    display: "flex",
    color: "success.main",
    minWidth: "auto",
  },
  button: {
    px: "52px",
  },
  mostPopular: {
    position: "absolute",
    top: "-26px",
    right: "16px",
  },
  interval: {
    textAlign: "center",
    fontSize: "14px",
    mb: "24px",
  },
} satisfies Record<string, SxProps<Theme>>;

const OurPricing: FC<Props> = ({ fields, locale }) => {
  const translate = useTranslate();

  return (
    <Box sx={styles.container} data-test-selector="OurPricing">
      <Container>
        <Box sx={styles.headingBox}>
          <Typography sx={styles.title} variant="h1">
            {fields.title}
          </Typography>
          <Typography sx={styles.subtitle}>{fields.subtitle}</Typography>
        </Box>
        <Box sx={styles.cardsWrapper}>
          {fields.plans?.map((plan) => {
            const link = parseLinkField(plan.cta.link, {
              locale: locale,
            });

            return (
              <Paper key={plan.name} sx={styles.card}>
                {plan.isMostPopular && (
                  <Image
                    src={fields.mostPopularImage}
                    alt=""
                    sizes="120px"
                    sx={styles.mostPopular}
                  />
                )}
                <Typography sx={styles.planLabel}>{plan.name}</Typography>
                <Typography sx={styles.planDescription}>
                  {plan.description}
                </Typography>
                <Box>
                  <Typography sx={styles.price}>{plan.price}</Typography>
                  <Typography sx={styles.interval}>
                    {translate("monthly")}
                  </Typography>
                </Box>
                <List sx={styles.featureList}>
                  {plan.features?.map((f) => (
                    <ListItem
                      key={f.label}
                      sx={styles.featureItem}
                      disableGutters
                      disablePadding
                    >
                      <Box
                        sx={{
                          ...styles.featureIcon,
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
                    sx={styles.button}
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
