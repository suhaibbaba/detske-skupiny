import { fetchBlogPage } from "@/sanity/queries";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import BlogCategories from "@/app/[locale]/blogs/components/BlogCategories";
import BlogCard from "@/app/[locale]/blogs/components/BlogCard";
import WritersSection from "@/app/[locale]/blogs/components/WritersSection";

interface BlogsStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  blogsList?: BoxProps;
}

const styles: BlogsStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui2)",
        pb: "150px",
      },
    },
  },
  blogsList: {
    sx: {
      display: "grid",
      gap: {
        xs: "50px",
        sm: "80px 50px",
      },
      pb: {
        xs: "100px",
        sm: "120px",
      },
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
        md: "1fr 1fr 1fr",
      },
    },
  },
};

const BlogsPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const { blogs, writers, content, categories } = await fetchBlogPage({
    locale,
  });

  return (
    <Box {...styles.container}>
      {content && (
        <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
          <Container>
            <PageHeadingTypography
              title={content.title}
              description={content.description}
            />
          </Container>
        </PageLayout>
      )}
      <Container>
        <BlogCategories categories={categories} />
        <Box {...styles.blogsList}>
          {blogs?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </Box>
      </Container>
      <WritersSection writers={writers} />
    </Box>
  );
};

export default BlogsPage;
