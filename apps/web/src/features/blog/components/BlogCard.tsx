import {
  Box,
  Card,
  CardContent,
  Typography,
  BoxProps,
  ButtonProps,
  CardProps,
  TypographyOwnProps,
  CardContentProps,
} from "@mui/material";
import React from "react";
import Link from "@/components/ui/link";
import { ellipses } from "@/utils/strings";
import { mergeMuiProps } from "@/utils/mergeMuiProps";
import { getLocalizedRoutes } from "@/routes";
import Button from "@/components/ui/button";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocale } from "next-intl/server";
import Image from "@/components/ui/image";

/**
 * What a card reads off an article.
 *
 * Stated as the fields rather than as one of the generated row types because
 * two different queries feed this: the article index projects a `category`,
 * the home page's carousel does not. Both satisfy this; neither has to grow a
 * field it does not use.
 */
export interface BlogCardFields {
  id: string;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  image: string | null;
  category?: { name: string | null } | null;
}

interface Props {
  blog: BlogCardFields;
  extendedStyles?: BlogsCardStylesType;
}

export interface BlogsCardStylesType {
  card?: CardProps;
  cardContent?: CardContentProps;
  tag?: TypographyOwnProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  footer?: BoxProps;
  readNowButton?: ButtonProps;
}

const blogsCardStylesType: BlogsCardStylesType = {
  card: {
    sx: {
      borderRadius: "20px",
      boxShadow: "var(--mui-palette-shadows-ui1)",
      maxWidth: { xs: "100%", md: "394px" },
      display: "flex",
      flexDirection: "column",
      gap: "24px",
      p: "24px",
    },
  },
  cardContent: {
    sx: {
      display: "flex",
      flexDirection: "column",
      flexGrow: "1",
      gap: "12px",
      p: 0,
      "&:last-child": {
        paddingBottom: 0,
      },
    },
  },
  tag: {
    sx: {
      backgroundColor: "var(--mui-palette-custom-ui5)",
      color: "var(--mui-palette-custom-ui11)",
      borderRadius: "8px",
      px: "10px",
      py: "2px",
      fontWeight: 900,
      fontSize: "14px",
      display: "inline-block",
      alignSelf: "baseline",
    },
  },
  title: {
    sx: {
      color: "var(--mui-palette-custom-ui13)",
      textDecoration: "none",
      fontWeight: 900,
      fontSize: "20px",
      minHeight: "60px",
      textAlign: "left",
      ...ellipses(2),
    },
  },
  description: {
    sx: { textAlign: "left" },
  },
  footer: {
    sx: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      mt: "auto",
      gap: "6px",
    },
  },
  readNowButton: {
    sx: {
      bgcolor: "var(--mui-palette-secondary-light)",
      color: "var(--mui-palette-custom-ui16)",
      boxShadow: "none",
      fontSize: "14px",
      fontWeight: 500,
      p: "10px 20px",
      borderRadius: "24px",
      whiteSpace: "nowrap",
      "&:hover": {
        bgcolor: "var(--mui-palette-secondary-dark)",
      },
    },
  },
};

const BlogCard = async ({ blog, extendedStyles }: Props) => {
  const styles = mergeMuiProps(blogsCardStylesType, extendedStyles);
  const translate = await getTranslateServer();
  const locale = await getLocale();

  const { title, slug, excerpt, image } = blog;
  const url = getLocalizedRoutes(locale).article(slug);

  return (
    <Card {...styles.card}>
      <Link href={url}>
        <Image
          src={image}
          alt={title}
          title={title ?? undefined}
          // The grid is 1 / 2 / 3 columns; the card never exceeds a third of a
          // wide viewport. Height is fixed in CSS, so the box is reserved
          // whether or not the file has arrived.
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
          sx={{
            width: "100%",
            height: "224px",
            objectFit: "cover",
            display: "block",
            borderRadius: "8px",
          }}
        />
      </Link>
      <CardContent {...styles.cardContent}>
        {blog.category && (
          <Typography {...styles.tag}>{blog.category.name}</Typography>
        )}
        <Link href={url} {...styles.title}>
          {title}
        </Link>
        <Typography {...styles.description}>{excerpt}</Typography>
        <Box {...styles.footer}>
          <Button {...styles.readNowButton} href={url} fullWidth>
            {translate("readNow")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
