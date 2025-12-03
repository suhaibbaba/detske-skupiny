import { fetchBlogPage } from "@/sanity/queries";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import BlogCategories from "@/app/[locale]/articles/components/BlogCategories";
import BlogCard from "@/app/[locale]/articles/components/BlogCard";
import WritersSection from "@/app/[locale]/articles/components/WritersSection";
import Alert from "@/components/ui/alert";
import { cx } from "next/dist/client/components/react-dev-overlay/ui/utils/cx";
import { getTranslateServer } from "@/hooks/useTranslate";
import { Metadata } from "next";

interface BlogsStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  blogsList?: BoxProps;
}

const styles: BlogsStyles = {
  container: {
    sx: {
      "&.pt-80": {
        pt: "80px",
      },
    },
  },
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui2)",
        pb: { xs: "80px", md: "100px" },
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

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { category: categorySelected } = (await searchParams) as {
    category?: string;
  };

  const { pageHero } = await fetchBlogPage({
    categorySelected: categorySelected || "",
  });

  const translate = await getTranslateServer();

  return {
    title: pageHero?.title || translate("articles"),
    description: pageHero?.description,
  };
}

const BlogsPage = async ({ params, searchParams }: PageProps) => {
  const translate = await getTranslateServer();
  const { category: categorySelected } = (await searchParams) as {
    category?: string;
  };
  const { blogs, pageHero, categories } = await fetchBlogPage({
    categorySelected: categorySelected || "",
  });

  return (
    <Box {...styles.container} className={cx(!pageHero && "pt-80")}>
      {pageHero && (
        <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
          <Container>
            <PageHeadingTypography
              title={pageHero?.title}
              description={pageHero?.description}
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
              message={translate("No Blogs Found")}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogsPage;
