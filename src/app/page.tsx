import { Box } from "@mui/material";
import { fetchPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const queryParams = await params;
  const data = await fetchPageByType("home");

  return (
    <Box data-test-selector="home-page">
      <Zone sections={data?.sections} types="all" {...queryParams} />
    </Box>
  );
};

export default Page;
