import type { StructureResolver } from "sanity/structure";
import { extractSchemas } from "@/structure/helpers";
import {
  CONTENT_TYPES,
  createContentSection,
} from "@/structure/sections/contentSection";
import {
  createSchoolSection,
  SCHOOL_TYPES,
} from "@/structure/sections/schoolSection";
import {
  createGeographySection,
  GEOGRAPHY_TYPES,
} from "@/structure/sections/geographySection";
import {
  BLOG_TYPES,
  createBlogSection,
} from "@/structure/sections/blogSection";
import {
  createTranslationsSection,
  TRANSLATION_TYPES,
} from "@/structure/sections/translationsSection";
import {
  createSiteSection,
  SITE_TYPES,
} from "@/structure/sections/siteSection";

/**
 * Which document types the studio treats as pages rather than as entries.
 *
 * Discovered from the filesystem rather than listed, because the list is used
 * for things that must not be forgotten: singletons lose their Delete and
 * Duplicate actions and their "New …" menu entry, and everything found here
 * gets the language menu wired up by `documentInternationalization`. A schema
 * added to one of these folders is opted into all of that on the next reload,
 * which is the failure mode worth designing against - the alternative is a new
 * page type that is quietly deletable and quietly untranslatable.
 *
 * The sidebar below does not read these arrays. It names every type it shows,
 * in the order it shows them, because the order is the point.
 */
const singletonModules = import.meta.glob<
  true,
  string,
  {
    default:
      { name: string; title?: string } | { name: string; title?: string }[];
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
      { name: string; title?: string } | { name: string; title?: string }[];
  }
>(["../schemaTypes/pages/**/*.ts", "!../schemaTypes/pages/index.ts"], {
  eager: true,
});

export const SINGLETONS = extractSchemas(singletonModules);
export const MULTIPLE_PAGES = extractSchemas(pagesModules);

export const SINGLETON_TYPES = SINGLETONS.map((s) => s.schemaType);
export const MULTIPLE_PAGES_TYPES = MULTIPLE_PAGES.map((s) => s.schemaType);

/** Everything the six sections below account for. */
const PLACED_TYPES = [
  ...CONTENT_TYPES,
  ...SCHOOL_TYPES,
  ...GEOGRAPHY_TYPES,
  ...BLOG_TYPES,
  ...TRANSLATION_TYPES,
  ...SITE_TYPES,
];

/**
 * The sidebar, read top to bottom, is meant to answer "what is this site?" in
 * about three minutes.
 *
 *   Content       the pages a visitor lands on
 *   Schools       the catalog, which is what the site is for
 *   Geography     the tree the catalog is indexed by
 *   Blog          the magazine beside it
 *   Translations  the state of the second language
 *   Site          the chrome, and the settings behind it
 *
 * That is roughly the order someone would explain the project in, and it is
 * deliberately not the order the schemas happen to sit in on disk. The
 * dividers group it into three: what visitors read, how it is organised, and
 * what only editors see.
 *
 * The catch-all at the end is a safety net, not a section. Every type is
 * placed by name above, so in a healthy repo it renders nothing; if it renders
 * something, a schema was added without being given a home, and this is what
 * keeps it reachable until it gets one.
 */
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("Dětské skupinky")
    .items([
      createContentSection(S),
      S.divider(),

      createSchoolSection(S),
      createGeographySection(S, context),
      S.divider(),

      createBlogSection(S),
      S.divider(),

      createTranslationsSection(S),
      createSiteSection(S),

      ...S.documentTypeListItems().filter(
        (item) => !PLACED_TYPES.includes(item.getId() || ""),
      ),
    ]);
