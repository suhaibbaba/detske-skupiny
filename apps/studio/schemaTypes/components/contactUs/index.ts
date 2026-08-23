import contactUsItem from "@/schemaTypes/components/contactUs/contactUsItem";
import contactUsForm from "@/schemaTypes/components/contactUs/contactUsForm";

const widgets = [contactUsItem, contactUsForm];

export const widgetsName = widgets.map((widget) => widget.name);
export default widgets;
