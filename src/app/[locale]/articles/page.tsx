import { fetchBlogPage } from "@/sanity/queries";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import BlogCategories from "@/app/[locale]/articles/components/BlogCategories";
import BlogCard from "@/app/[locale]/articles/components/BlogCard";
import WritersSection from "@/app/[locale]/articles/components/WritersSection";
import Alert from "@/components/ui/alert";

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

const BlogsPage = async ({ params, searchParams }: PageProps) => {
  const { category: categorySelected } = (await searchParams) as {
    category?: string;
  };
  const { blogs, writers, content, categories } = await fetchBlogPage({
    categorySelected: categorySelected || "",
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
        <BlogCategories
          categories={categories}
          categorySelected={categorySelected}
        />
        <Box {...styles.blogsList}>
          {blogs?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
          {(!blogs || blogs.length == 0) && (
            <Alert
              severity="info"
              sx={{ maxWidth: 600, gridColumn: "1/3" }}
              message={"No Blogs Found"}
            />
          )}
        </Box>
      </Container>
      <WritersSection writers={writers} />
    </Box>
  );
};

export default BlogsPage;
