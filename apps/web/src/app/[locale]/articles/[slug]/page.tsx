import { fetchBlogBySlug } from "@/sanity/queries";
import type { Blog } from "@/types/blog";
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
import BlogCategories from "@/app/[locale]/articles/components/BlogCategories";
import { formatMessage } from "@/utilites/strings";
import React from "react";
import { formatDate } from "@/utilites/date";
import RichText from "@/sanity/components/RichText";
import { getTranslateServer } from "@/hooks/useTranslate";
import Image from "@/components/ui/image/Image";
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
    sx: {
      "&.pt-20": {
        pt: "20px",
      },
    },
  },
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui2)",
        pb: "100px",
        mb: "100px",
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
    textTransform: "capitalize",
  },
  paragraph: {
    variant: "body1",
  },
};

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
    <Box {...styles.container} className={clsx(!blog?.title && "pt-20")}>
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
          extendedStyles={styles.pageLayout}
          pathname={getLocalizedRoutes(locale).article(slug)}
        >
          <PageHeadingTypography title={blog?.title} />
        </PageLayout>
      )}
      <Container>
        <Box {...styles.detailsHintBox} data-test-selector="details-hint">
          <Box>
            <Image src={blog.image} {...styles.image} alt={blog.title} />
            {/*<Box component="img" src={blog.image} {...styles.image} />*/}
            <Box {...styles.authorMeta}>
              {formatMessage(
                `{0}{1}${articleMeta}`,
                authorName ? (
                  <Typography {...styles.authorText}>{authorName}</Typography>
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
