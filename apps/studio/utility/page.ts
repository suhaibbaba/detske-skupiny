import { defineField } from "sanity";

export const createSections = (widgetsName: string[]) => {
  return defineField({
    name: "sections",
    title: "Sections",
    type: "array",
    of: widgetsName.map((type) => ({ type })),
  });
};

export const injectLanguage = () => {
  return defineField({
    name: "language",
    type: "string",
    readOnly: true,
    hidden: true,
  });
};
