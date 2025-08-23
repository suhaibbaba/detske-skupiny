"use client";

import { Box, BoxProps } from "@mui/material";
import { getGroupsPage } from "@/sanity/queries";
import GroupSection from "@/app/[locale]/groups/components/groupSection";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import React, { useEffect } from "react";
import { Region, SanityCtaField, SanityRichTextField } from "@/sanity/types";

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

const Page = () => {
  const [state, setState] = React.useState<{
    content?: {
      title: string;
      description: SanityRichTextField;
      ctas: SanityCtaField[];
    };
    regions?: Region[];
  }>({});

  useEffect(() => {
    const load = async () => {
      const { regions, content } = await getGroupsPage();
      setState({
        regions,
        content,
      });
    };
    load();
  }, []);

  const { regions, content } = state;
  return (
    <Box component="section" {...styles.container}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={content?.title}
          description={content?.description}
          ctaList={content?.ctas}
        />
      </PageLayout>
      {regions?.map((group) => (
        <GroupSection key={group.name} group={group} />
      ))}
    </Box>
  );
};

export default Page;
