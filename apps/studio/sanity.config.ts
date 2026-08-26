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
import {
  MULTIPLE_PAGES_TYPES,
  PAGE_CONFIG_TYPES,
  SINGLETON_TYPES,
  structure,
} from "@/structure";
import { computedFieldsPlugin } from "@/plugins/computedFields";
import {
  initialValueTemplates,
  REPLACED_DEFAULT_TEMPLATES,
} from "@/structure/templates";
import BrandMark from "@/icons/BrandMark";

/**
 * Vision is a query console with the editor's own credentials. It is a
 * development tool - useful while writing the GROQ behind a structure list,
 * noise (and a wider surface) in the studio the content team logs into. The
 * bundler statically replaces `process.env.NODE_ENV`, so in a production build
 * this is `false` and the plugin is dropped from the bundle rather than merely
 * hidden.
 */
const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  name: "default",
  /**
   * Hard-coded, not read from the environment.
   *
   * One studio serves one project, so the name is not configuration; it is a
   * constant. Reading it from the environment also means trusting Vite to
   * inline a name it was given verbatim, and a mismatch falls through to a
   * `"My Project"` placeholder rather than failing.
   */
  title: "Dětské skupinky",
  /**
   * The navbar mark. `icon` rather than `studio.components.logo`: the logo slot
   * is deprecated in v5 ("Custom logo components are no longer supported. Users
   * are encouraged to provide custom components for individual workspace icons
   * instead") and `StudioLogo` is not rendered by the navbar at all. The
   * navbar's `HomeButton` reads `activeWorkspace.icon`, which is this - so the
   * mark appears in the top-left corner off a supported API. See
   * icons/BrandMark.tsx.
   */
  icon: BrandMark,
  /**
   * No `theme`. The brand purple would have to arrive through `buildLegacyTheme`
   * into `theme?: StudioTheme`, and in 5.31 both the builder and the whole
   * `StudioTheme` interface carry "@deprecated - Will be removed in upcoming
   * major version"; the config field itself is `@beta @hidden`. A legacy theme
   * also replaces the palette wholesale rather than tinting it, so every future
   * Sanity UI colour lands unstyled. The default theme is maintained and
   * accessible in both colour schemes; the brand lives in the title and the
   * mark, which are supported surfaces.
   */
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "",
  dataset: process.env.SANITY_STUDIO_DATASET || "",
  plugins: [
    structureTool({ structure }),
    ...(isDev ? [visionTool()] : []),
    colorInput(),
    linkField({
      linkableSchemaTypes: [...SINGLETON_TYPES, ...MULTIPLE_PAGES_TYPES],
      /**
       * A link picker only offers documents in the language of the document
       * being edited, plus the ones that have no language at all (objects and
       * the untranslated singletons).
       *
       * `$language` is the only param, deliberately: GROQ rejects nothing for
       * an unused param, so a second one the filter never references would read
       * as a language this honours and does not.
       */
      referenceFilterOptions: {
        filter: ({ document }) => {
          const currentLanguage = document?.language || document?.lang;

          if (currentLanguage) {
            return {
              filter: "language == $language || !defined(language)",
              params: { language: currentLanguage },
            };
          }

          // If no language is set, show all documents
          return {};
        },
      },
    }),
    googleMapsInput({
      defaultLocale: "cs",
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
    // The only plugin that writes computed fields, and only on `schools`.
    // Everything else geography-related is derived by GROQ in the web app.
    computedFieldsPlugin(),
  ],

  schema: {
    types: schemaTypes,
    /**
     * Sanity generates one template per document type automatically. These are
     * the extra ones - what a new school or post starts out as, and the
     * geography documents that need to know their parent. See
     * structure/templates.ts.
     */
    templates: (prev) => [...prev, ...initialValueTemplates],
  },
  document: {
    /**
     * There is exactly one of each of these per language, and the site reads
     * each with `*[_type == "..."][0]`. A duplicate therefore does not add a
     * page - it makes which page the site serves arbitrary - and a delete
     * takes a route down. Both actions are removed; every other type keeps
     * them.
     */
    actions: (prev, { schemaType }) =>
      [...SINGLETON_TYPES, ...PAGE_CONFIG_TYPES].includes(schemaType)
        ? prev.filter(
            (a) =>
              !["delete", "duplicate" /*, 'unpublish'*/].includes(
                a.action as string,
              ),
          )
        : prev,

    /**
     * What the global "New document" button offers.
     *
     * Two removals. The one-per-language pages are reached from the sidebar,
     * so a second copy made from this menu would be a document the site never
     * reads. And the stock `schools` / `blogs` templates are dropped in favour
     * of the base-language ones beside them, which set `language` (and a
     * post's date) on creation - keeping both would offer two identically
     * named "School" entries, one of which quietly produces a school in no
     * language at all.
     *
     * The parameterised geography templates never reach this list: Sanity
     * excludes any template declaring `parameters` from menus that cannot
     * supply them, which is exactly what "a region, but in which country?"
     * needs.
     */
    newDocumentOptions: (prev) =>
      prev.filter(
        (template) =>
          ![
            ...SINGLETON_TYPES,
            ...PAGE_CONFIG_TYPES,
            ...REPLACED_DEFAULT_TEMPLATES,
          ].includes(template.templateId || ""),
      ),
  },
});
