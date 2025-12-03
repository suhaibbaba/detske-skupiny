import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  AvatarProps,
  BoxProps,
  ButtonProps,
  CardProps,
  TypographyOwnProps,
  CardContentProps,
} from "@mui/material";
import React from "react";
import Link from "@/components/ui/link";
import { ellipses } from "@/utilites/strings";
import { mergeMuiProps } from "@/utilites/mergeMuiProps";
import { MiniBlog } from "@/types/blog";
import { formatDate } from "@/utilites/date";
import { getLocalizedRoutes } from "@/routes";
import Button from "@/components/ui/button";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocale } from "next-intl/server";

interface Props {
  blog: MiniBlog;
  extendedStyles?: BlogsCardStylesType;
}

export interface BlogsCardStylesType {
  card?: CardProps;
  cardContent?: CardContentProps;
  tag?: TypographyOwnProps;
  title?: TypographyOwnProps;
  description?: TypographyOwnProps;
  footer?: BoxProps;
  authorBox?: BoxProps;
  avatar?: AvatarProps;
  authorName?: TypographyOwnProps;
  meta?: TypographyOwnProps;
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
      fontWeight: 500,
      fontSize: "14px",
      display: "inline-block",
      alignSelf: "baseline",
    },
  },
  title: {
    sx: {
      color: "var(--mui-palette-custom-ui13)",
      textDecoration: "none",
      fontWeight: 500,
      fontSize: "20px",
      minHeight: "60px",
      textAlign: "left",
      ...ellipses(2),
    },
  },
  description: {
    textAlign: "left",
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
  authorBox: {
    sx: {
      display: "flex",
      alignItems: "center",
    },
  },
  avatar: {
    sx: {
      width: 36,
      height: 36,
      mr: "12px",
    },
  },
  authorName: {
    color: "custom.ui13",
    textAlign: "left",
    sx: {
      textAlign: "left",
      fontWeight: 500,
      fontSize: "16px",
    },
  },
  meta: {
    color: "custom.ui3",
    sx: {
      textAlign: "left",
      fontWeight: 400,
      fontSize: "14px",
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

  const { title, slug, excerpt, image, publishedAt, readTime, author } = blog;
  const url = getLocalizedRoutes(locale).article(slug);

  return (
    <Card {...styles.card}>
      <Link href={url}>
        <CardMedia
          component="img"
          image={image}
          title={title}
          height="224px"
          sx={{
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
          {/* <Box {...styles.authorBox}>
            <Avatar src={author?.image} {...styles.avatar} />
            <Box>
              <Typography {...styles.authorName}>{author?.name}</Typography>
              <Typography {...styles.meta}>
                {formatDate(publishedAt)} · {readTime} {translate("minRead")}
              </Typography>
            </Box>
          </Box> */}
          <Button {...styles.readNowButton} href={url} fullWidth>
            {translate("readNow")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
