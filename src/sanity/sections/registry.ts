import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestKinderGroupsSection from "@/app/[locale]/home/components/LatestKinderGroupsSection";
import React from "react";
import FaqSection from "@/app/[locale]/home/components/FaqSection";

export const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  hero: HeroSection,
  latestKinderGroups: LatestKinderGroupsSection,
  faq: FaqSection,
};
