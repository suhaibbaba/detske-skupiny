import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  BoxProps,
  TypographyOwnProps,
  ButtonProps,
  ListProps,
  ListItemProps,
  ListItemIconProps,
  ListItemTextProps,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { parseLinkField } from "@/components/ui/link/parser";
import Button from "@/components/ui/button";
import Image, { type ImageProps } from "@/components/ui/image";

interface Props {
  fields: {
    image: SanityImageField;
    heading: string;
    description: string;
    cta?: SanityCtaField;
    portals?: {
      _key: string;
      title: string;
    }[];
  };
  locale?: string;
}

interface PortalsOfferedStyles {
  container?: BoxProps;
  innerBox?: BoxProps;
  textBox?: BoxProps;
  heading?: TypographyOwnProps;
  description?: TypographyOwnProps;
  list?: ListProps;
  listItem?: ListItemProps;
  listItemIcon?: ListItemIconProps;
  listItemText?: ListItemTextProps;
  button?: ButtonProps;
  imageWrapper?: BoxProps;
  image?: ImageProps;
}

const styles: PortalsOfferedStyles = {
  container: {
    sx: {
      background: "var(--mui-palette-custom-ui7)",
      pt: "100px",
      pb: {
        xs: "80px",
        sm: "120px",
      },
    },
  },
  innerBox: {
    sx: {
      display: "flex",
      flexDirection: {
        xs: "column",
        sm: "row",
      },
      justifyContent: "space-between",
      alignItems: {
        xs: "flex-start",
        sm: "center",
      },
      gap: "60px",
    },
  },
  textBox: {
    sx: {
      maxWidth: "468px",
    },
  },
  heading: {
    variant: "h1",
    sx: { mb: "12px" },
  },
  description: {
    sx: { mb: "12px" },
  },
  list: {
    disablePadding: true,
    sx: {
      mb: "32px",
    },
  },
  listItem: {
    disableGutters: true,
    sx: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
  },
  listItemIcon: {
    sx: {
      minWidth: "auto",
      color: "var(--mui-palette-custom-ui6)",
    },
  },
  listItemText: {
    sx: {
      my: 0,
    },
  },
  button: {
    variant: "contained",
  },
  imageWrapper: {
    sx: {
      width: {
        xs: "320px",
        sm: "534px",
      },
      height: {
        xs: "320px",
        sm: "534px",
      },
      alignSelf: {
        xs: "center",
        sm: "initial",
      },
      borderRadius: "50%",
      overflow: "hidden",
      flexShrink: 0,
    },
  },
  image: {
    sx: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
};

const PortalsOffered = ({ fields, locale }: Props) => {
  const link = parseLinkField(fields.cta?.link, { locale });

  return (
    <Box {...styles.container}>
      <Container>
        <Box {...styles.innerBox}>
          <Box {...styles.textBox}>
            <Typography {...styles.heading}>{fields.heading}</Typography>
            <Typography {...styles.description}>
              {fields.description}
            </Typography>
            <List {...styles.list}>
              {fields.portals?.map((item) => (
                <ListItem key={item._key} {...styles.listItem}>
                  <ListItemIcon {...styles.listItemIcon}>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText {...styles.listItemText} primary={item.title} />
                </ListItem>
              ))}
            </List>
            {fields.cta && (
              <Button
                {...styles.button}
                variant={fields.cta.variant}
                href={link.url}
              >
                {link.text}
              </Button>
            )}
          </Box>
          <Box {...styles.imageWrapper}>
            <Image
              {...styles.image}
              src={fields.image}
              alt={fields.heading}
              sizes="(max-width: 900px) 100vw, 50vw"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PortalsOffered;
