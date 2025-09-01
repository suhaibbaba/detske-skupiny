import { fetchGroupPage } from "@/sanity/queries";
import { PageProps } from "@/types";
import { Box, BoxProps } from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import GroupSection from "@/app/[locale]/groups/components/groupSection";
import React from "react";

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

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const { content, groups } = await fetchGroupPage({ locale });

  return (
    <Box component="section" {...styles.container}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={content?.title}
          description={content?.description}
          ctaList={content?.ctas}
        />
      </PageLayout>
      {groups?.map((group) => (
        <GroupSection key={group.id} group={group} locale={locale} />
      ))}
    </Box>
  );
};

export default Page;
