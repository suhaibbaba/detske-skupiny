"use client";

import { Box, Container, BoxProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import BlogCategories from "@/app/[locale]/blogs/components/BlogCategories";
import BlogCard from "@/app/[locale]/blogs/components/BlogCard";
import WritersSection from "@/app/[locale]/blogs/components/WritersSection";
import { FC, useEffect, useRef, useState } from "react";
import { Author, Blog, BlogPageContent } from "@/types/blog";

interface Props {
  content: BlogPageContent;
  categories: string[];
  blogs: Blog[];
  writers: Author[];
}

interface BlogsStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  blogsList?: (offsetTop: number) => BoxProps;
}

const styles: BlogsStyles = {
  pageLayout: {
    section: {
      sx: (theme) => ({
        background: theme.palette.gradients.ui2,
        pb: "150px",
      }),
    },
  },
  blogsList: (offsetTop) => ({
    sx: {
      mt: {
        xs: `calc(134px - ${offsetTop / 2}px)`,
        sm: `calc(145px - ${offsetTop / 2}px)`,
      },
      display: "grid",
      gap: {
        xs: "50px",
        sm: "80px 50px",
      },
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
        md: "1fr 1fr 1fr",
      },
      transform: `translateY(-${offsetTop / 2}px)`,
    },
  }),
};

const BlogsPage: FC<Props> = ({ content, categories, blogs, writers }) => {
  const [tabsOffset, setTabsOffset] = useState(40);
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

  return (
    <Box {...styles.container}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <Container>
          <PageHeadingTypography
            title={content.title}
            description={content.description}
          />
        </Container>
      </PageLayout>
      <Container>
        <BlogCategories ref={tabsRef} categories={categories} />
        {tabsRef.current && (
          <Box {...styles.blogsList?.(tabsOffset)}>
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                _id={blog._id}
                title={blog.title}
                image={blog.image}
                excerpt={blog.excerpt}
                author={blog.author}
                readTime={blog.readTime}
                publishedAt={blog.publishedAt}
                slug={blog.slug}
              />
            ))}
          </Box>
        )}
      </Container>
      {tabsRef.current && <WritersSection writers={writers} />}
    </Box>
  );
};

export default BlogsPage;
