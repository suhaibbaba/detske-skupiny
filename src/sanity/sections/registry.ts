import HeroSection from "@/app/home/components/HeroSection";
import LatestSchoolCollection from "@/app/home/components/LatestSchoolCollection";
import React from "react";
import FaqSection from "@/app/home/components/FaqSection";
import InfoBlock from "@/app/home/components/InfoBlock";
import FeaturesGrid from "@/app/home/components/FeaturesGrid";
import HomeBanner from "@/app/home/components/HomeBanner";
import SectionWorthIt from "@/app/preschool/components/SectionWorthIt";
import PortalsOffered from "@/app/preschool/components/PortalsOffered";
import OurPricing from "@/app/preschool/components/OurPricing";
import ListOfSchools from "@/app/preschool/components/ListOfSchools";
import MapCollection from "@/app/home/components/MapCollection";
import BlogSection from "@/app/home/components/BlogSection";

export const SECTION_COMPONENTS: Record<string, React.FC<any>> = {
  hero: HeroSection,
  faq: FaqSection,
  infoBlock: InfoBlock,
  blogCollection: BlogSection,
  mapCollection: MapCollection,
  featuresGrid: FeaturesGrid,
  homeBanner: HomeBanner,
  sectionWorthIt: SectionWorthIt,
  sectionPortalsOffered: PortalsOffered,
  pricingSection: OurPricing,
  listOfSchoolSection: ListOfSchools,
  latestSchoolCollection: LatestSchoolCollection,
};
