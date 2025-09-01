import { fetchBlogBySlug } from "@/sanity/queries";
import { PageProps } from "@/types";
import {
  Box,
  Container,
  Typography,
  BoxProps,
  Avatar,
  ListItemProps,
  TypographyProps,
  ListProps,
  AvatarProps,
} from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import BlogCategories from "@/app/[locale]/blogs/components/BlogCategories";
import { formatMessage } from "@/utilites/strings";
import React from "react";
import { formatDate } from "@/utilites/date";
import RichText from "@/sanity/components/RichText";
import { getTranslateServer } from "@/hooks/useTranslate";

interface BlogDetailStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  featureItem?: ListItemProps;
  image?: BoxProps;
  detailsHintBox?: BoxProps;
  authorMeta?: BoxProps;
  authorText?: TypographyProps;
  sectionBox?: BoxProps;
  list?: ListProps;
  authorBox?: BoxProps;
  bioBox?: BoxProps;
  avatar?: AvatarProps;
  sectionHeading?: TypographyProps;
  paragraph?: TypographyProps;
}

const styles: BlogDetailStyles = {
  container: {
    pb: "116px",
  },
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui2)",
        pb: "150px",
      },
    },
  },
  detailsHintBox: {
    maxWidth: "920px",
    mx: "auto",
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "80px",
    },
  },
  image: {
    sx: {
      width: "100%",
      maxHeight: "450px",
      objectFit: "cover",
    },
  },
  authorMeta: {
    sx: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "12px",
      mt: "24px",
    },
  },
  authorText: {
    component: "span",
    fontSize: "18px",
    color: "custom.ui13",
    fontWeight: 500,
  },
  sectionBox: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
  },
  list: {
    disablePadding: true,
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "12px",
    },
  },
  bioBox: {
    p: "24px",
    sx: {
      display: "flex",
      flexDirection: "column",
      bgcolor: "custom.ui15",
      gap: "8px",
      borderRadius: "12px",
      border: `1px solid var(--mui-palette-custom-ui14)`,
    },
  },
  authorBox: {
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
  avatar: {
    sx: {
      width: "36px",
      height: "36px",
    },
  },
  sectionHeading: {
    variant: "h3",
  },
  paragraph: {
    variant: "body1",
  },
};

const Page = async ({ params }: PageProps<{ slug: string }>) => {
  const { locale, slug } = await params;
  const { blog, categories, content } = await fetchBlogBySlug({ locale, slug });

  const translate = await getTranslateServer(locale);

  return (
    <Box {...styles.container}>
      {content && (
        <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
          <PageHeadingTypography
            title={content.title}
            description={content.description}
          />
        </PageLayout>
      )}
      <Container>
        <BlogCategories categories={categories} />
        <Box {...styles.detailsHintBox} data-test-selector="details-hint">
          <Box>
            <Typography variant="h2" mb="24px">
              {blog.title}
            </Typography>
            <Box component="img" src={blog.image} {...styles.image} />
            <Box {...styles.authorMeta}>
              {formatMessage(
                `{0}{1}{2}${formatDate(blog.publishedAt)} • ${blog.readTime} ${translate("min read")}`,
                translate("By"),
                <Avatar
                  alt={blog.author?.name}
                  src={blog.author?.image}
                  {...styles.avatar}
                />,
                <Typography {...styles.authorText} key="author">
                  {blog.author?.name}
                </Typography>,
              )}
            </Box>
          </Box>
          <Box>
            <RichText>{blog.content}</RichText>
          </Box>
          <Box {...styles.bioBox}>
            <Box {...styles.authorBox}>
              {formatMessage(
                `{0}{1}`,
                <Avatar
                  alt={blog.author?.name}
                  src={blog.author?.image}
                  {...styles.avatar}
                />,
                <Typography {...styles.authorText} key="author">
                  {blog.author?.name}
                </Typography>,
              )}
            </Box>
            <Typography {...styles.paragraph}>{blog.author?.bio}</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
