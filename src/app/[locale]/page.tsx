import { Box } from "@mui/material";
import { fetchPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const pageParams = await params;
  const data = await fetchPageByType("home", { locale: pageParams.locale });

  return (
    <Box data-test-selector="home-page">
      <Zone sections={data?.sections} types="all" {...pageParams} />
    </Box>
  );
};

export default Page;
