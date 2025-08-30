"use client";

import {
  Box,
  Container,
  Typography,
  Button,
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
import { FC } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { parseLinkField } from "@/components/ui/link/parser";

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
  image?: BoxProps;
}

const styles: PortalsOfferedStyles = {
  container: {
    sx: (theme) => ({
      background: theme.palette.custom.ui7,
      pt: "100px",
      pb: {
        xs: "80px",
        sm: "120px",
      },
    }),
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
    mb: "12px",
  },
  description: {
    mb: "12px",
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
    sx: (theme) => ({
      minWidth: "auto",
      color: theme.palette.custom.ui6,
    }),
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

const PortalsOffered: FC<Props> = ({ fields }) => {
  const link = parseLinkField(fields.cta?.link);

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
            <Box
              {...styles.image}
              component="img"
              src={urlImageFor(fields.image)}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default PortalsOffered;
