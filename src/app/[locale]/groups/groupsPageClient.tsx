"use client";

import { Box, BoxProps } from "@mui/material";
import GroupSection from "@/app/[locale]/groups/components/groupSection";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import React, { FC } from "react";
import { Region, SanityCtaField, SanityRichTextField } from "@/sanity/types";

export interface GroupsProps {
  content?: {
    title: string;
    description: SanityRichTextField;
    ctas: SanityCtaField[];
  };
  regions?: Region[];
}

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

const GroupsPageClient: FC<GroupsProps> = ({ content, regions }) => {
  if (!regions) {
    return null;
  }

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

export default GroupsPageClient;
