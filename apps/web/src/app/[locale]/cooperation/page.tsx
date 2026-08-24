import { fetchPageByType } from "@/lib/sanity/page";
import { Box, BoxProps } from "@mui/material";
import Zone from "@/sections/Zone";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { staticRoutePaths } from "@/lib/seo/routes";

interface CooperationStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
}

const styles: CooperationStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui1)",
        pb: {
          xs: "64px",
          sm: "130px",
        },
      },
    },
  },
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
    },
  },
};

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
  const translate = await getTranslateServer();

  return buildPageMetadata({
    locale,
    paths: staticRoutePaths("cooperation"),
    title: translate("cooperation"),
    // The preschool document has no hero copy of its own, so this falls back
    // to the site description rather than to a dictionary key that does not
    // exist - a missing key renders its own name, which would end up as the
    // page's meta description.
    description: translate("metaDescription"),
  });
}

const Page = async ({ params }: PageProps) => {
  const queryParams = await params;
  setRequestLocale(queryParams.locale);
  const data = await fetchPageByType("preschool", queryParams.locale);

  return (
    <PageLayout
      extendedStyles={styles.pageLayout}
      contentFullWidth
      pathname={getLocalizedRoutes(queryParams.locale).cooperation}
    >
      <Box {...styles.container}>
        <Zone sections={data?.sections} types="all" {...queryParams} />
      </Box>
    </PageLayout>
  );
};

export default Page;
