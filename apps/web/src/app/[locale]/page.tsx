import { Box } from "@mui/material";
import { fetchPageByType } from "@/sanity/queries";
import Zone from "@/sanity/components/Zone";
import { PageProps } from "@/types";
import { setRequestLocale } from "next-intl/server";

const Page = async ({ params }: PageProps) => {
  const queryParams = await params;
  setRequestLocale(queryParams.locale);
  const data = await fetchPageByType("home", queryParams.locale);

  return (
    <Box data-test-selector="home-page">
      <Zone sections={data?.sections} types="all" {...queryParams} />
    </Box>
  );
};

export default Page;
