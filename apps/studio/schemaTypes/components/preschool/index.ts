import sectionWorthIt from "@/schemaTypes/components/preschool/sectionWorthIt";
import sectionPortalsOffered from "@/schemaTypes/components/preschool/sectionPortalsOffered";
import pricingSection from "@/schemaTypes/components/preschool/pricingSection";
import listOfSchoolSection from "@/schemaTypes/components/preschool/listOfSchoolSection";

const widgets = [
  sectionWorthIt,
  sectionPortalsOffered,
  pricingSection,
  listOfSchoolSection,
];

export const widgetsName = widgets.map((widget) => widget.name);
export default widgets;
