"use client";

import { Box, BoxProps } from "@mui/material";
import { getGroupsPage } from "@/sanity/queries/pages";
import GroupSection from "@/app/[locale]/groups/components/groupSection";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";

interface GroupsStyles {
  container?: BoxProps;
  pageLayout?: PageLayoutStyles;
}

const styles: GroupsStyles = {
  pageLayout: {
    section: {
      sx: (theme) => ({
        background: theme.palette.gradients.ui3,
      }),
    },
  },
};

const Page = async () => {
  const { regions, content } = await getGroupsPage();
  return (
    <Box component="section" {...styles.container}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={content.title}
          description={content.description}
          ctaList={content.ctas}
        />
      </PageLayout>
      {regions.map((group) => (
        <GroupSection key={group.name} group={group} />
      ))}
    </Box>
  );
};

export default Page;
