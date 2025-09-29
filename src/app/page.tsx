import { Box } from "@mui/material";
import { fetchPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const data = await fetchPageByType("home");

  return (
    <Box data-test-selector="home-page">
      <Zone sections={data?.sections} types="all" {...params} />
    </Box>
  );
};

export default Page;
