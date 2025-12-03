import { fetchPageByType } from "@/sanity/queries";
import { Box, Container } from "@mui/material";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import Breadcrumbs from "@/components/ui/breadcrumb";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";

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
    <Box data-test-selector="preschool-page">
      <Container sx={{ pt: "40px" }}>
        <Breadcrumbs addSpace={false} />
      </Container>
      <Zone sections={data?.sections} types="all" {...queryParams} />
    </Box>
  );
};

export default Page;
