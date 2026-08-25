import type { SxProps, Theme } from "@mui/material/styles";
import { custom } from "@/theme/custom";
import { fetchBlogBySlug } from "@/features/blog/queries";
import type { Blog } from "@/types/blog";
import { PageProps } from "@/types";
import { Box, Container, Typography } from "@mui/material";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import BlogCategories from "@/features/blog/components/BlogCategories";
import { formatMessage } from "@/utils/strings";
import React from "react";
import { formatDate } from "@/utils/date";
import RichText from "@/components/rich-text/RichText";
import { getTranslateServer } from "@/hooks/useTranslate";
import Image, { type ImageProps } from "@/components/ui/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata, siteContext } from "@/lib/seo/metadata";
import { documentPaths } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";
import { resolveOgImage } from "@/lib/seo/images";

const styles = {
  container: {
    pb: "116px",
    "&.pt-20": {
      pt: "20px",
    },
  },
  pageLayout: {
    background: custom.gradients.pageBlushToCream,
    pb: "100px",
    mb: "100px",
  },
  detailsHintBox: {
    mx: "auto",
    maxWidth: "920px",
    display: "flex",
    flexDirection: "column",
    gap: "80px",
  },
  image: {
    width: "100%",
    maxHeight: "450px",
    objectFit: "cover",
  },
  authorMeta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    mt: "24px",
  },
  authorText: {
    color: "custom.textHeading",
    fontWeight: 500,
    fontSize: "18px",
  },
  sectionBox: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  list: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr 1fr",
    },
    gap: "12px",
  },
  bioBox: {
    p: "24px",
    display: "flex",
    flexDirection: "column",
    bgcolor: "custom.surfaceSand",
    gap: "8px",
    borderRadius: "12px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "custom.borderLilac",
  },
  authorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  avatar: {
    width: "36px",
    height: "36px",
  },
  paragraph: {},
} satisfies Record<string, SxProps<Theme>>;

/**
 * The article's own paths, keyed by locale.
 *
 * Only the locales the article has actually been translated into appear, so a
 * Czech-only post links no English alternate.
 */
const articlePaths = (locale: string, blog: Blog) =>
  documentPaths(locale, blog.slug, blog.translations, (target, slug) =>
    getLocalizedRoutes(target).article(slug),
  );

export async function generateMetadata({
  params,
}: PageProps<{ slug: string }>): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const translate = await getTranslateServer();
  const { blog } = await fetchBlogBySlug({ slug, locale });

  // The page itself calls notFound() for this; the metadata just needs a title
  // that is not the slug.
  if (!blog) {
    return { title: translate("article") };
  }

  return buildPageMetadata({
    locale,
    paths: articlePaths(locale, blog),
    title: blog.title || translate("article"),
    description: blog.excerpt,
    images: [blog.image],
    type: "article",
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt ?? blog.publishedAt,
  });
}

/**
 * `params` carries the article slug, which is not known at build time, so
 * awaiting it is a dynamic read. It happens in here, below the Suspense
 * boundary in `Page`, leaving the route shell prerenderable.
 */
const ArticleContent = async ({ params }: PageProps<{ slug: string }>) => {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const { blog } = await fetchBlogBySlug({ slug, locale });

  if (!blog) {
    notFound();
  }

  const translate = await getTranslateServer();

  const authorName = blog.author?.name;
  const publishedAt = formatDate(
    blog.publishedAt,
    locale === "cs" ? "cs-CZ" : "en-US",
  );
  const readTime = blog.readTime
    ? `${blog.readTime} ${translate("minRead")}`
    : "";
  const articleMeta = [publishedAt, readTime].filter(Boolean).join(" • ");

  const { siteName } = await siteContext(locale);
  const paths = articlePaths(locale, blog);

  return (
    <Box sx={styles.container} className={clsx(!blog?.title && "pt-20")}>
      <JsonLd
        data={articleJsonLd({
          headline: blog.title,
          url: absoluteUrl(locale, paths[locale]!),
          description: blog.excerpt,
          image: resolveOgImage(locale, blog.image),
          datePublished: blog.publishedAt,
          dateModified: blog.updatedAt ?? blog.publishedAt,
          siteName,
          siteUrl: absoluteUrl(locale, getLocalizedRoutes(locale).home),
        })}
      />
      {blog?.title && (
        <PageLayout
          contentFullWidth={false}
          sx={styles.pageLayout}
          pathname={getLocalizedRoutes(locale).article(slug)}
        >
          <PageHeadingTypography title={blog?.title} />
        </PageLayout>
      )}
      <Container>
        <Box sx={styles.detailsHintBox} data-test-selector="details-hint">
          <Box>
            {/*
             * The article's cover is the largest thing above the fold on this
             * route, so it is the LCP candidate and is fetched eagerly rather
             * than lazily. The content column is capped at 920px.
             */}
            <Image
              src={blog.image}
              sx={styles.image}
              alt={blog.title}
              priority
              sizes="(max-width: 920px) 100vw, 920px"
              {...(blog.imageLqip
                ? { placeholder: "blur" as const, blurDataURL: blog.imageLqip }
                : {})}
            />
            <Box sx={styles.authorMeta}>
              {formatMessage(
                `{0}{1}${articleMeta}`,
                authorName ? (
                  <Typography sx={styles.authorText} component="span">
                    {authorName}
                  </Typography>
                ) : (
                  ""
                ),
                authorName && articleMeta ? " • " : "",
              )}
            </Box>
          </Box>
          <Box>
            <RichText>{blog.content}</RichText>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

const Page = ({ params }: PageProps<{ slug: string }>) => (
  <Suspense fallback={null}>
    <ArticleContent params={params} />
  </Suspense>
);

export default Page;
