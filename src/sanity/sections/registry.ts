import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestKinderGroupsSection from "@/app/[locale]/home/components/LatestKinderGroupsSection";
import React from "react";
import FaqSection from "@/app/[locale]/home/components/FaqSection";
import NeighbourKinderGroupSection from "@/app/[locale]/home/components/NeighbourKinderGroupSection";
import PremiumSchoolsFeatureSection from "@/app/[locale]/home/components/PremiumSchoolsFeatureSection";
import AddKinderGroupSection from "@/app/[locale]/home/components/AddKinderGroupSection";

export const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  hero: HeroSection,
  latestKinderGroups: LatestKinderGroupsSection,
  faq: FaqSection,
  neighbourKinderGroup: NeighbourKinderGroupSection,
  featuresGrid: PremiumSchoolsFeatureSection,
  banner: AddKinderGroupSection,
};
