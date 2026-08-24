import { fetchGroupPage } from "@/features/catalog/queries";
import { PageProps } from "@/types";
import { Box, BoxProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import GroupSection from "@/features/catalog/components/GroupSection";
import React from "react";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { staticRoutePaths } from "@/lib/seo/routes";

interface GroupsStyles {
  container?: BoxProps;
  pageLayout?: PageLayoutStyles;
}

const styles: GroupsStyles = {
  container: {
    sx: {},
  },
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui3)",
      },
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
  const { content } = await fetchGroupPage(locale);

  return buildPageMetadata({
    locale,
    paths: staticRoutePaths("groups"),
    title: content?.title || translate("groups"),
    description: content?.description,
  });
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const { content, groups } = await fetchGroupPage(locale);

  return (
    <Box component="section" {...styles.container}>
      <PageLayout
        contentFullWidth={false}
        extendedStyles={styles.pageLayout}
        pathname={getLocalizedRoutes(locale).group()}
      >
        <PageHeadingTypography
          title={content?.title}
          description={content?.description}
          ctaList={content?.ctas}
        />
      </PageLayout>
      {groups?.map((group) => (
        <GroupSection key={group.id} group={group} />
      ))}
    </Box>
  );
};

export default Page;
