import { fetchPageByType } from "@/sanity/queries";
import { Box, BoxProps } from "@mui/material";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";

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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const translate = await getTranslateServer();
  return {
    title: translate("cooperation"),
  };
}

const Page = async ({ params }: PageProps) => {
  const queryParams = await params;
  const data = await fetchPageByType("preschool");

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
