import type { StructureResolver } from "sanity/structure";
import { extractSchemas } from "@/structure/helpers";
import { createSchoolSection, SCHOOL_TYPES } from "./sections/schoolSection";
import {
  BLOG_TYPES,
  createBlogSection,
} from "@/structure/sections/blogSection";
import {
  createGeographicCoverageSection,
  LOCATION_TYPES,
} from "@/structure/sections/geographicCoverageSection";
import { createPageContentSection } from "@/structure/sections/pageContentSection";
import {
  createTranslateSection,
  TRANSLATE_TYPES,
} from "@/structure/sections/translateSection";

const singletonModules = import.meta.glob<
  true,
  string,
  {
    default:
      | { name: string; title?: string }
      | { name: string; title?: string }[];
  }
>(
  ["../schemaTypes/singletons/**/*.ts", "!../schemaTypes/singletons/index.ts"],
  {
    eager: true,
  },
);

const pagesModules = import.meta.glob<
  true,
  string,
  {
    default:
      | { name: string; title?: string }
      | { name: string; title?: string }[];
  }
>(["../schemaTypes/pages/**/*.ts", "!../schemaTypes/pages/index.ts"], {
  eager: true,
});

export const SINGLETONS = extractSchemas(singletonModules);
export const MULTIPLE_PAGES = extractSchemas(pagesModules);

export const SINGLETON_TYPES = SINGLETONS.map((s) => s.schemaType);
export const MULTIPLE_PAGES_TYPES = MULTIPLE_PAGES.map((s) => s.schemaType);

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Pages")
    .items([
      // Singletons
      createPageContentSection(S),
      S.divider(),

      // School Management
      createSchoolSection(S),
      S.divider(),

      createBlogSection(S),
      S.divider(),

      createGeographicCoverageSection(S, context),
      S.divider(),

      createTranslateSection(S),
      S.divider(),

      // Other document types
      ...S.documentTypeListItems().filter(
        (i) =>
          ![
            ...SINGLETON_TYPES,
            ...SCHOOL_TYPES,
            ...BLOG_TYPES,
            ...LOCATION_TYPES,
            ...TRANSLATE_TYPES,
            "page",
          ].includes(i.getId() || ""),
      ),
    ]);
