import { Box } from "@mui/material";
import { getHomePage } from "@/sanity/queries/pages";
import Zone from "@/sanity/components/Zone";

const Page = async () => {
  const widgets = await getHomePage();

  return (
    <Box data-test-selector="home-page">
      <Zone sections={widgets?.sections} types="all" />
    </Box>
  );
};

export default Page;
