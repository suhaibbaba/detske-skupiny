import { Box } from "@mui/material";
import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestKinderGroupsSection from "@/app/[locale]/home/components/LatestKinderGroupsSection";
import NeighbourKinderGroupSection from "@/app/[locale]/home/components/NeighbourKinderGroupSection";
import PremiumSchoolsFeatureSection from "@/app/[locale]/home/components/PremiumSchoolsFeatureSection";
import AddKinderGroupSection from "@/app/[locale]/home/components/AddKinderGroupSection";
import KindergartenMapSection from "@/app/[locale]/home/components/KindergartenMapSection";
import BlogSection from "@/app/[locale]/home/components/BlogSection";
import { getHomePage } from "@/sanity/queries/pages";
import Zone from "@/sanity/components/Zone";

const Page = async () => {
  const { sections } = await getHomePage();

  console.log({ sections });
  return (
    <Box data-test-selector="home-page">
      <Zone sections={sections} types="all" />
      {/*<LatestKinderGroupsSection />*/}
      {/*<NeighbourKinderGroupSection />*/}
      {/*<PremiumSchoolsFeatureSection />*/}
      {/*<AddKinderGroupSection />*/}
      {/*<KindergartenMapSection />*/}
      {/*<Zone sections={sections} types="faq" />*/}
      {/*<BlogSection />*/}
    </Box>
  );
};

export default Page;
