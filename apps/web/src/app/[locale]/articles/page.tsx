import type { SxProps, Theme } from "@mui/material/styles";
import { fetchBlogPage } from "@/features/blog/queries";
import { PageProps } from "@/types";
import PageLayout from "@/components/layout/PageLayout";
import { Box, Container } from "@mui/material";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import BlogCategories from "@/features/blog/components/BlogCategories";
import BlogCard from "@/features/blog/components/BlogCard";
import Alert from "@/components/ui/alert";
import clsx from "clsx";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { staticRoutePaths } from "@/lib/seo/routes";

const styles = {
  container: {
    "&.pt-80": {
      pt: "80px",
    },
  },
  pageLayout: (theme: Theme) => ({
    background: theme.custom.gradients.pageBlushToCream,
    pb: { xs: "80px", md: "100px" },
  }),
  blogsList: {
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
} satisfies Record<string, SxProps<Theme>>;

/**
 * `searchParams` is deliberately not read here.
 *
 * The category filter changes which cards are listed, not what the page is,
 * and every `?category=` variant has to collapse onto one canonical URL or the
 * index competes with itself for the same query. Ignoring the query string is
 * what produces that single canonical - and it keeps this off the request
 * path, since the metadata for the index is the same for every visitor.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { locale } = await params;
  setRequestLocale(locale);

  const { pageHero } = await fetchBlogPage({ categorySelected: "", locale });
  const translate = await getTranslateServer();

  return buildPageMetadata({
    locale,
    paths: staticRoutePaths("articles"),
    title: pageHero?.title || translate("articles"),
    description: pageHero?.description,
  });
}

/**
 * Split from the page so that reading `searchParams` - the one dynamic input
 * on this route - happens inside the Suspense boundary below. Everything
 * above it prerenders.
 */
const BlogsContent = async ({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: PageProps["searchParams"];
}) => {
  const translate = await getTranslateServer();
  const { category: categorySelected } = ((await searchParams) ?? {}) as {
    category?: string;
  };
  const { blogs, pageHero, categories } = await fetchBlogPage({
    categorySelected: categorySelected || "",
    locale,
  });

  return (
    <Box sx={styles.container} className={clsx(!pageHero && "pt-80")}>
      {pageHero && (
        <PageLayout
          contentFullWidth={false}
          sx={styles.pageLayout}
          pathname={getLocalizedRoutes(locale).article()}
        >
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
        <Box sx={styles.blogsList}>
          {blogs?.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
          {(!blogs || blogs.length == 0) && (
            <Alert
              severity="info"
              sx={{ maxWidth: 600, gridColumn: "1/3" }}
              message={translate("noArticlesFound")}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

const BlogsPage = async ({ params, searchParams }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <BlogsContent locale={locale} searchParams={searchParams} />
    </Suspense>
  );
};

export default BlogsPage;
