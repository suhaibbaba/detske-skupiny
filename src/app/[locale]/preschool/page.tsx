import { getPreschoolPage } from "@/sanity/queries";
import { Box, Container } from "@mui/material";
import Zone from "@/sanity/components/Zone";

const Page = async () => {
  const widgets = await getPreschoolPage();
  return (
    <Box data-test-selector="preschool-page">
      <Zone sections={widgets?.sections} types="all" />
    </Box>
  );
};

export default Page;
