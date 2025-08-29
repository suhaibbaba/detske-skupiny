import { fetchPageByType } from "@/sanity/queries";
import { Box } from "@mui/material";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const pageParams = await params;
  const data = await fetchPageByType("preschool", {
    locale: pageParams.locale,
  });

  console.log({ data });
  return (
    <Box data-test-selector="preschool-page">
      <Zone sections={data?.sections} types="all" {...pageParams} />
    </Box>
  );
};

export default Page;
