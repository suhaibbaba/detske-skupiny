// sanity.config.ts
import { LOCALES } from "@detske-skupiny/config/locales";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { colorInput } from "@sanity/color-input";
import { linkField } from "sanity-plugin-link-field";
import { documentInternationalization } from "@sanity/document-internationalization";
import { googleMapsInput } from "@sanity/google-maps-input";
import { MULTIPLE_PAGES_TYPES, SINGLETON_TYPES, structure } from "@/structure";
import { autoPopulateSubAreaPlugin } from "@/plugins/autoPopulateSubareaFields";
import { autoPopulateAreaPlugin } from "@/plugins/autoPopulateAreaFields";
import { autoPopulateSchoolCountPlugin } from "@/plugins/autoPopulateSchoolCountFields";
import { autoPopulateSchoolPlugin } from "@/plugins/autoPopulateSchoolFields";
import { autoPopulateFieldsJobPlugin } from "@/plugins/autoPopulateFieldsJob";
import { autoPopulateRegionPlugin } from "@/plugins/autoPopulateRegionFields";
import { autoPopulateSchoolSortOrderPlugin } from "@/plugins/autoPopulateSchoolOrderFields";

export default defineConfig({
  name: "default",
  title: process.env.SANITY_STUDIO_PROJECT_Name || "My Project",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "",
  plugins: [
    structureTool({ structure }),
    visionTool(),
    colorInput(),
    linkField({
      linkableSchemaTypes: [...SINGLETON_TYPES, ...MULTIPLE_PAGES_TYPES],
      referenceFilterOptions: {
        filter: ({ document }) => {
          const currentLanguage = document?.language || document?.lang;
          const defaultLanguage = "en";

          if (currentLanguage) {
            return {
              filter: "language == $language || !defined(language)",
              params: {
                language: currentLanguage,
                defaultLanguage: defaultLanguage,
              },
            };
          }

          // If no language is set, show all documents
          return {};
        },
      },
    }),
    googleMapsInput({
      defaultLocale: "cz",
      defaultLocation: {
        lat: 49.8175, // Latitude of Czech Republic (Celá ČR)
        lng: 15.473, // Longitude of Czech Republic (Celá ČR)
      },
      defaultZoom: 7,
      apiKey: process.env.SANITY_STUDIO_GOOGLE_MAPS_API_KEY || "",
    }),
    documentInternationalization({
      supportedLanguages: [...LOCALES],
      schemaTypes: [...SINGLETON_TYPES, ...MULTIPLE_PAGES_TYPES],
    }),
    autoPopulateSubAreaPlugin(),
    autoPopulateRegionPlugin(),
    autoPopulateAreaPlugin(),
    autoPopulateSchoolPlugin(),
    autoPopulateSchoolCountPlugin(),
    autoPopulateFieldsJobPlugin(),
    autoPopulateSchoolSortOrderPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
  // Restrict actions on singleton documents (home, settings, header, footer, …)
  document: {
    // Remove Delete/Duplicate (and optionally Unpublish) for singletons
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.includes(schemaType)
        ? prev.filter(
            (a) =>
              !["delete", "duplicate" /*, 'unpublish'*/].includes(
                a.action as string,
              ),
          )
        : prev,

    // Remove "New …" menu items for singletons
    newDocumentOptions: (prev) =>
      prev.filter((t) => !SINGLETON_TYPES.includes(t.templateId || "")),
  },
});
