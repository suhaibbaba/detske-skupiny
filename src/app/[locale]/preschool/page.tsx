import { fetchPageByType } from "@/sanity/queries";
import { Box, Container } from "@mui/material";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import Breadcrumbs from "@/components/ui/breadcrumb";

const Page = async ({ params }: PageProps) => {
  const pageParams = await params;
  const data = await fetchPageByType("preschool", {
    locale: pageParams.locale,
  });

  return (
    <Box data-test-selector="preschool-page">
      <Container sx={{ pt: "40px" }}>
        <Breadcrumbs addSpace={false} />
      </Container>
      <Zone sections={data?.sections} types="all" {...pageParams} />
    </Box>
  );
};

export default Page;
