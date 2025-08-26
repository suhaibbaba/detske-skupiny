import { Box } from "@mui/material";
import { getPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";

type PageProps = {
  params: Promise<{ locale: string; school: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const widgets = await getPageByType("home", { locale });

  return (
    <Box data-test-selector="home-page">
      <Zone sections={widgets?.sections} types="all" />
    </Box>
  );
};

export default Page;
