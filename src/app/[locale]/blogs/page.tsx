"use client";

import { Box, Container, BoxProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import useSafeTranslations from "@/hooks/useSafeTranslations";
import data from "@/data/blog";
import BlogCategories from "@/app/[locale]/blogs/components/BlogCategories";
import BlogCard from "@/app/[locale]/blogs/components/BlogCard";
import WritersSection from "@/app/[locale]/blogs/components/WritersSection";
import { useEffect, useRef, useState } from "react";
import BlogsPageClient from "@/app/[locale]/blogs/BlogsPageClient";
import { getBlogs } from "@/sanity/queries/page";

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

const BlogsPage = async () => {
  const data = await getBlogs();

  return (
    <BlogsPageClient
      blogs={data.blogs}
      categories={data.categories ?? []}
      content={data.content}
      writers={data.writers ?? []}
    />
  );
};

export default BlogsPage;
