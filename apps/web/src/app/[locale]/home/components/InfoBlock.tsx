import {
  Box,
  BoxProps,
  ButtonProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import { sharedClassNames } from "@/app/[locale]/home/utility";
import { getLocale } from "next-intl/server";

interface Props {
  fields: {
    image?: SanityImageField;
    title: string;
    description: string;
    cta?: SanityCtaField;
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
  imageWrapper: {
    sx: {
      flex: 1,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "var(--mui-palette-shadows-ui1)",
      bgcolor: "var(--mui-palette-common-white)",
      p: "20px 24px",
    },
  },
};

const InfoBlock = async ({ fields }: Props) => {
  const locale = await getLocale();
  const link = parseLinkField(fields.cta?.link, { locale });

  return (
    <Box {...styles.section} className={sharedClassNames.infoBlock}>
      <Container {...styles.container}>
        <Box {...styles.textBlock}>
          <Typography {...styles.heading}>{fields.title}</Typography>
          <Typography {...styles.description}>{fields.description}</Typography>
          {fields.cta && (
            <Button
              {...styles.ctaButton}
              variant={fields.cta.variant}
              href={link.url}
            >
              {link.text}
            </Button>
          )}
        </Box>

        <Box {...styles.imageWrapper}>
          <Box src={urlImageFor(fields.image)} component="img" alt={fields.title} />
        </Box>
      </Container>
    </Box>
  );
};

export default InfoBlock;
