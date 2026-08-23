import hero from "@/schemaTypes/components/home/hero";
import faq from "@/schemaTypes/components/home/faq";
import faqItem from "@/schemaTypes/components/home/faqItem";
import featureItem from "@/schemaTypes/components/home/featureItem";
import featuresGrid from "@/schemaTypes/components/home/featuresGrid";
import banner from "@/schemaTypes/components/home/homeBanner";
import infoBlock from "@/schemaTypes/components/home/infoBlock";
import schoolCollection from "@/schemaTypes/components/home/latestSchoolCollection";
import blogCollection from "@/schemaTypes/components/home/blogCollection";
import mapCollection from "@/schemaTypes/components/home/mapCollection";

const widgets = [
  hero,
  infoBlock,
  faqItem,
  faq,
  featureItem,
  featuresGrid,
  banner,
  schoolCollection,
  blogCollection,
  mapCollection,
];

export const widgetsName = widgets
  .filter((widget) => !["faqItem", "featureItem"].includes(widget.name))
  .map((widget) => widget.name);
export default widgets;
