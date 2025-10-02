import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestSchoolCollection from "@/app/[locale]/home/components/LatestSchoolCollection";
import React from "react";
import FaqSection from "@/app/[locale]/home/components/FaqSection";
import InfoBlock from "@/app/[locale]/home/components/InfoBlock";
import FeaturesGrid from "@/app/[locale]/home/components/FeaturesGrid";
import HomeBanner from "@/app/[locale]/home/components/HomeBanner";
import SectionWorthIt from "@/app/[locale]/preschool/components/SectionWorthIt";
import PortalsOffered from "@/app/[locale]/preschool/components/PortalsOffered";
import OurPricing from "@/app/[locale]/preschool/components/OurPricing";
import ListOfSchools from "@/app/[locale]/preschool/components/ListOfSchools";
import MapCollection from "@/app/[locale]/home/components/MapCollection";
import BlogSection from "@/app/[locale]/home/components/BlogSection";

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
