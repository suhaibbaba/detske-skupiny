import { fetchBlogBySlug, fetchBlogPage } from "@/sanity/queries";
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
import { cx } from "next/dist/client/components/react-dev-overlay/ui/utils/cx";

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

export async function generateMetadata({
  params,
}: PageProps<{ slug: string }>): Promise<Metadata> {
  const translate = await getTranslateServer();

  const { slug } = await params;
  const { blog } = await fetchBlogBySlug({ slug });

  return {
    title: blog.title || translate("article"),
    description: blog.excerpt || "",
  };
}

const Page = async ({ params }: PageProps<{ slug: string }>) => {
  const { slug, locale } = await params;
  const { blog } = await fetchBlogBySlug({ slug });

  const translate = await getTranslateServer();

  return (
    <Box {...styles.container} className={cx(!blog?.title && "pt-20")}>
      {blog?.title && (
        <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
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
                `{0}{1}${formatDate(blog.publishedAt, locale === "cz" ? "cs-CZ" : "en-US")} • ${blog.readTime} ${translate("minRead")}`
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

export default Page;
