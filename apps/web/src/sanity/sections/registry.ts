import type { PageSection } from "@/sanity/types";
import HeroSection from "@/app/[locale]/home/components/HeroSection";
import LatestSchoolCollection from "@/app/[locale]/home/components/LatestSchoolCollection";
import FaqSection from "@/app/[locale]/home/components/FaqSection";
import InfoBlock from "@/app/[locale]/home/components/InfoBlock";
import FeaturesGrid from "@/app/[locale]/home/components/FeaturesGrid";
import HomeBanner from "@/app/[locale]/home/components/HomeBanner";
import SectionWorthIt from "@/app/[locale]/cooperation/components/SectionWorthIt";
import PortalsOffered from "@/app/[locale]/cooperation/components/PortalsOffered";
import OurPricing from "@/app/[locale]/cooperation/components/OurPricing";
import ListOfSchools from "@/app/[locale]/cooperation/components/ListOfSchools";
import MapCollection from "@/app/[locale]/home/components/MapCollection";
import BlogSection from "@/app/[locale]/home/components/BlogSection";

/**
 * What `Zone` hands a section component: the section document itself, plus the
 * route params the page forwarded.
 *
 * `fields` is the whole `sections[]` union rather than the one member matching
 * the key. Narrowing per key would be the stronger contract, but it requires
 * every component's own `fields` prop to be the generated member for its type,
 * and these components declare their own field shapes today. Widening here is
 * what lets the registry drop `React.FC<any>` without rewriting twelve
 * components in the same change - `Zone` looks the key up at runtime from
 * `_type`, so the mapping is checked by the key set below either way.
 */
type SectionComponentProps = {
  fields: PageSection;
  [param: string]: unknown;
};

/**
 * The `_type` of every section this app renders.
 *
 * Typed as a partial record over the generated union, so a section type
 * removed from the Studio - or a key misspelled here - is a compile error
 * rather than a section that silently never renders.
 */
type SectionRegistry = Partial<
  Record<PageSection["_type"], React.ComponentType<SectionComponentProps>>
>;

/**
 * `satisfies` rather than an annotation, and `React.ComponentType<never>`
 * rather than the real props: this checks the KEYS against the generated union
 * while accepting whatever props each component declares.
 */
const SECTIONS = {
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
} satisfies Partial<
  Record<PageSection["_type"], React.ComponentType<never>>
>;

/**
 * The one place the runtime guarantee is asserted.
 *
 * Each component's `fields` is the section type it renders, which is narrower
 * than the union `Zone` iterates. TypeScript checks function parameters
 * contravariantly, so the narrow type is not assignable to the wide one - even
 * though `Zone` looks a component up BY `_type` and can only ever hand it a
 * matching section. That is a runtime invariant the type system cannot see,
 * and this single cast is what admits it. It replaces `React.FC<any>`, which
 * admitted it - and everything else - on every entry.
 *
 * Through `unknown` because contravariance makes the two genuinely
 * non-overlapping, which is the compiler correctly describing the situation
 * rather than a sign the cast is wrong. The keys are still checked, above.
 */
export const SECTION_COMPONENTS = SECTIONS as unknown as SectionRegistry;
