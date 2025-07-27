import { Box } from "@mui/material";
import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestKinderGroupsSection from "@/app/[locale]/home/components/LatestKinderGroupsSection";
import NeighbourKinderGroupSection from "@/app/[locale]/home/components/NeighbourKinderGroupSection";
import PremiumSchoolsFeatureSection from "@/app/[locale]/home/components/PremiumSchoolsFeatureSection";
import AddKinderGroupSection from "@/app/[locale]/home/components/AddKinderGroupSection";
import KindergartenMapSection from "@/app/[locale]/home/components/KindergartenMapSection";
import FaqSection from "@/app/[locale]/home/components/FaqSection";
import BlogSection from "@/app/[locale]/home/components/BlogSection";

const Page = () => {
  return (
    <Box data-test-selector="home-page">
      <HeroSection />
      <LatestKinderGroupsSection />
      <NeighbourKinderGroupSection />
      <PremiumSchoolsFeatureSection />
      <AddKinderGroupSection />
      <KindergartenMapSection />
      <FaqSection />
      <BlogSection />
    </Box>
  );
};

export default Page;
