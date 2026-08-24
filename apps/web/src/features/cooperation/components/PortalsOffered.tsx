import type { SxProps, Theme } from "@mui/material/styles";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { SanityCtaField, SanityImageField } from "@/types";

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

const styles = {
  container: {
    background: "custom.surfaceCream",
    pt: "100px",
    pb: {
      xs: "80px",
      sm: "120px",
    },
  },
  innerBox: {
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
  textBox: {
    maxWidth: "468px",
  },
  heading: { mb: "12px" },
  description: { mb: "12px" },
  list: {
    mb: "32px",
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  listItemIcon: {
    minWidth: "auto",
    color: "custom.star",
  },
  listItemText: {
    my: 0,
  },
  button: {},
  imageWrapper: {
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
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
} satisfies Record<string, SxProps<Theme>>;

const PortalsOffered = ({ fields, locale }: Props) => {
  const link = parseLinkField(fields.cta?.link, { locale });

  return (
    <Box sx={styles.container}>
      <Container>
        <Box sx={styles.innerBox}>
          <Box sx={styles.textBox}>
            <Typography sx={styles.heading} variant="h1">
              {fields.heading}
            </Typography>
            <Typography sx={styles.description}>
              {fields.description}
            </Typography>
            <List sx={styles.list} disablePadding>
              {fields.portals?.map((item) => (
                <ListItem key={item._key} sx={styles.listItem} disableGutters>
                  <ListItemIcon sx={styles.listItemIcon}>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText sx={styles.listItemText} primary={item.title} />
                </ListItem>
              ))}
            </List>
            {fields.cta && (
              <Button variant={fields.cta.variant} href={link.url}>
                {link.text}
              </Button>
            )}
          </Box>
          <Box sx={styles.imageWrapper}>
            <Image
              sx={styles.image}
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
