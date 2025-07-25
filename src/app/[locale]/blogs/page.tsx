"use client";

import { Box, Container, BoxProps } from "@mui/material";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import data from "@/data/blog";
import BlogTabs from "@/app/[locale]/blogs/components/BlogTabs";
import BlogCard from "@/app/[locale]/blogs/components/BlogCard";
import WritersSection from "@/app/[locale]/blogs/components/WritersSection";
import { useEffect, useRef, useState } from "react";

interface BlogsStyles {
  section?: BoxProps;
  container?: BoxProps;
  blogsList?: (offsetTop: number) => BoxProps;
}

const styles: BlogsStyles = {
  section: {
    sx: (theme) => ({
      background: theme.palette.gradients.ui2,
      pb: "150px",
    }),
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

const BlogsPage = () => {
  const [tabsOffset, setTabsOffset] = useState(40);
  const translate = useSafeTranslations("BlogsPage");
  const onSelectHandler = () => {};

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
      <PageLayout fullWidth={false} sectionStyles={styles.section}>
        <Container>
          <PageHeadingTypography
            title={translate(data.heading)}
            description={translate(data.description)}
          />
        </Container>
      </PageLayout>
      <Container>
        <BlogTabs
          ref={tabsRef}
          tabs={data.tabs}
          selected={data.tabs[1]}
          onSelect={onSelectHandler}
        />
        {tabsRef.current && (
          <Box {...styles.blogsList?.(tabsOffset)}>
            {data.blogs.map((blog, idx) => (
              <BlogCard
                key={idx}
                title={blog.title}
                image={blog.image}
                tag={blog.tag}
                description={blog.description}
                author={blog.author}
                date={blog.date}
                readTime={blog.readTime}
                authorImage={blog.authorImage}
              />
            ))}
          </Box>
        )}
      </Container>
      {tabsRef.current && <WritersSection writers={data.writers} />}
    </Box>
  );
};

export default BlogsPage;
