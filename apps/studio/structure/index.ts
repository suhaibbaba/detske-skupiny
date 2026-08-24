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

/**
 * The page-configuration documents: one per language, like the singletons, but
 * living under schemaTypes/pages because that is where their siblings are.
 *
 * `SINGLETON_TYPES` is discovered from a folder and is also what the
 * internationalization and link plugins are handed, so these cannot simply be
 * added to it - they are already in `MULTIPLE_PAGES_TYPES`, and a type listed
 * twice is registered twice. This list exists for the one thing they do share
 * with the singletons: nobody should be able to make a second one. The site
 * reads each with `*[_type == "blogPage"][0]`, so a duplicate does not add a
 * page, it makes which page you get arbitrary.
 */
export const PAGE_CONFIG_TYPES = ["schoolPage", "blogPage", "dictionaries"];

/**
 * The pairing document `@sanity/document-internationalization` writes.
 *
 * It is a real document type in the schema, so it turns up in
 * `documentTypeListItems()` - and it was appearing at the bottom of the
 * sidebar as "Translation.metadata", a list of machine-written join records
 * that an editor can only damage by opening. What it holds is presented in
 * Translations, in terms of the documents it pairs.
 */
const TRANSLATION_METADATA_TYPE = "translation.metadata";

/** Everything the six sections below account for. */
const PLACED_TYPES = [
  ...CONTENT_TYPES,
  ...SCHOOL_TYPES,
  ...GEOGRAPHY_TYPES,
  ...BLOG_TYPES,
  ...TRANSLATION_TYPES,
  ...SITE_TYPES,
  TRANSLATION_METADATA_TYPE,
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
 *
 * `page` is the one type placed but not visible at this level: it sits inside
 * Content as "Standalone pages", which is the honest description of it.
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
