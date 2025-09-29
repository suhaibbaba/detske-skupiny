import { fetchPageByType } from "@/sanity/queries";
import { Box, Container } from "@mui/material";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import Breadcrumbs from "@/components/ui/breadcrumb";

const Page = async ({ params }: PageProps) => {
  const data = await fetchPageByType("preschool");

  return (
    <Box data-test-selector="preschool-page">
      <Container sx={{ pt: "40px" }}>
        <Breadcrumbs addSpace={false} />
      </Container>
      <Zone sections={data?.sections} types="all" {...params} />
    </Box>
  );
};

export default Page;
