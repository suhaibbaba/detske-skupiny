"use client";

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
import React, { FC, useEffect, useRef, useState } from "react";
import { Blog, BlogPageContent } from "@/types/blog";
import { formatDate } from "@/utilites/date";
import RichText from "@/sanity/components/RichText";

interface Props {
  blog?: Blog;
  content?: BlogPageContent;
  categories: string[];
}

interface BlogDetailStyles {
  pageLayout?: PageLayoutStyles;
  container?: (offsetTop: number) => BoxProps;
  featureItem?: ListItemProps;
  image?: BoxProps;
  detailsHintBox?: (offsetTop: number) => BoxProps;
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
  container: (offsetTop) => ({
    pb: {
      xs: `calc(100px - ${offsetTop / 2}px)`,
      sm: `calc(116px - ${offsetTop / 2}px)`,
    },
  }),
  pageLayout: {
    section: {
      sx: (theme) => ({
        background: theme.palette.gradients.ui2,
        pb: "150px",
      }),
    },
  },
  detailsHintBox: (offsetTop) => ({
    maxWidth: "920px",
    mx: "auto",
    sx: {
      mt: {
        xs: `calc(134px - ${offsetTop / 2}px)`,
        sm: `calc(145px - ${offsetTop / 2}px)`,
      },
      display: "flex",
      flexDirection: "column",
      gap: "80px",
      transform: `translateY(-${offsetTop / 2}px)`,
    },
  }),
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
    sx: (theme) => ({
      display: "flex",
      flexDirection: "column",
      bgcolor: theme.palette.custom.ui15,
      gap: "8px",
      borderRadius: "12px",
      border: `1px solid ${theme.palette.custom.ui14}`,
    }),
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

const BlogDetailPage: FC<Props> = ({ blog, categories, content }) => {
  const [tabsOffset, setTabsOffset] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tabsRef.current) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const height = tabsRef.current!.getBoundingClientRect().height;
      setTabsOffset(height);
    });

    observer.observe(tabsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [tabsRef.current]);

  const onSelectHandler = () => {};

  if (!blog || !content) {
    return null;
  }

  return (
    <Box {...styles.container?.(tabsOffset)}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={content.title}
          description={content.description}
        />
      </PageLayout>
      <Container>
        <BlogCategories ref={tabsRef} categories={categories} />
        {tabsRef.current && (
          <Box
            {...styles.detailsHintBox?.(tabsOffset)}
            data-test-selector="details-hint"
          >
            <Box>
              <Typography variant="h2" mb="24px">
                {blog.title}
              </Typography>
              <Box component="img" src={blog.image} {...styles.image} />
              <Box {...styles.authorMeta}>
                {formatMessage(
                  `{0}{1}{2}${formatDate(blog.publishedAt)} • ${blog.readTime} min read`,
                  "By",
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
        )}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;
