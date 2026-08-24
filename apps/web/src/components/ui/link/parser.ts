/**
 * Sanity LinkField Parser - TypeScript Method Functions
 * Collection of functions to parse and validate Sanity CMS link field structures
 */
import type { HeaderQueryResult } from "@detske-skupiny/types";
import { defaultLocale } from "@/i18n/routing";
import { getLocalizedRoutes } from "@/routes";

/**
 * What the parser can be told to do.
 *
 * `allowExternal`, `allowEmail`, `allowPhone`, `allowFile` and `defaultTarget`
 * used to be here too. No caller and no test ever passed one, so every guard
 * they gated was a branch that could not be taken and `defaultTarget` was a
 * constant spelled as a knob. The two that survive are the two something
 * actually sets: `allowInternal` in parser.test.ts and `requireText` in the
 * same file, plus `locale`, which every call site passes.
 */
interface ParserOptions {
  allowInternal?: boolean;
  requireText?: boolean;
  locale?: string;
}

/**
 * A resolved `internalLink` - the union of every document `linkFields` can
 * dereference, generated from the Studio schema.
 *
 * Taken off a query result rather than written out: the projection in
 * lib/sanity/fragments.ts decides this shape, and reading it back from the
 * generated types is what makes a new linkable document type show up here as a
 * compile error in the switch below rather than as a silent fall-through to
 * the home page.
 */
type SanityInternalLink = NonNullable<
  NonNullable<
    NonNullable<NonNullable<HeaderQueryResult["header"]>["cta"]>["link"]
  >["internalLink"]
>;

/**
 * The parts of a link field this parser reads.
 *
 * Deliberately the fields rather than the whole generated `link` object: a
 * generated link satisfies this structurally, and so does the bare
 * `{ type: "external", url }` literal the tests hand it, which the full object
 * type would reject for missing `_type` and `internalLink`.
 */
interface SanityLinkField {
  type?: string;
  href?: string;
  url?: string;
  text?: string;
  title?: string;
  blank?: boolean;
  email?: string;
  phone?: string;
  internalLink?: SanityInternalLink | null;
}

type LinkType =
  "external" | "internal" | "email" | "phone" | "empty" | "unknown";

interface ParsedLink {
  type: LinkType;
  url: string;
  text: string;
  title: string;
  target: string;
  valid: boolean;
  errors: string[];
}

const defaultOptions: Required<ParserOptions> = {
  allowInternal: true,
  requireText: false,
  locale: defaultLocale,
};

/**
 * `internalLink.slug` as a path segment.
 *
 * The projection is `select(defined(slug.current) => slug.current, slug)`, so
 * for every document type that has a slug field - which is every one the
 * studio offers as a link target - this is already a string. The generated
 * union admits Sanity's `{_type: "slug", current}` object for the types where
 * GROQ cannot prove otherwise, and that branch is unwrapped here rather than
 * asserted away.
 */
function slugText(slug: SanityInternalLink["slug"]): string {
  if (typeof slug === "string") return slug;
  return slug?.current ?? "";
}

/**
 * Parse a Sanity link field object
 */
function parseLinkField(
  linkField: SanityLinkField | null | undefined,
  options: ParserOptions = {},
): ParsedLink {
  const config: Required<ParserOptions> = { ...defaultOptions, ...options };

  if (!linkField || typeof linkField !== "object") {
    return createEmptyLink();
  }

  const result = {
    type: detectLinkType(linkField),
    url: " ",
    text:
      linkField.text ||
      internalLinkText(linkField.internalLink) ||
      linkField.internalLink?.title ||
      "",
    title: linkField.text || linkField.internalLink?.title || "",
    target: linkField.blank ? "_blank" : "_self",
    valid: false,
    errors: [],
  };

  try {
    switch (result.type) {
      case "external":
        result.url = parseExternalLink(linkField);
        break;
      case "internal":
        result.url = parseInternalLink(linkField, config);
        break;
      case "email":
        result.url = parseEmailLink(linkField);
        break;
      case "phone":
        result.url = parsePhoneLink(linkField);
        break;
      default:
      // result.errors.push("Unknown link type");
    }

    result.valid = validateLink(result, config);
  } catch (error) {
    // result.errors.push(error.message);
  }

  return result;
}

/**
 * The label a geography document carries.
 *
 * Only `countries`, `regions`, `areas` and `subareas` project a `text` field -
 * see the per-type overrides in `internalLinkFields` - so the union has it on
 * those four members and nowhere else.
 */
function internalLinkText(link: SanityInternalLink | null | undefined): string {
  return link && "text" in link ? (link.text ?? "") : "";
}

/**
 * Detect the type of link based on the field structure
 */
function detectLinkType(linkField: SanityLinkField): LinkType {
  if (linkField.type === "email") {
    return "email";
  }

  if (linkField.type === "phone") {
    return "phone";
  }

  if (linkField.type === "external") return "external";

  if (linkField.type === "internal") {
    return "internal";
  }

  return "unknown";
}

/**
 * Parse external URL links
 */
function parseExternalLink(linkField: SanityLinkField): string {
  let url = linkField.url || linkField.href || "";

  // Add protocol if missing
  if (url && !url.match(/^https?:\/\//i)) {
    url = "https://" + url;
  }

  if (!isValidUrl(url)) {
    throw new Error("Invalid external URL format");
  }

  return url;
}

/**
 * Parse internal reference links
 *
 * Switched on the target document itself rather than on a copied-out `_type`,
 * so each branch below narrows the union and reads only the fields that
 * document actually projects.
 */
function parseInternalLink(
  linkField: SanityLinkField,
  config: Required<ParserOptions>,
): string {
  const target = linkField.internalLink;

  if (!config.allowInternal || !target) {
    throw new Error("Internal links are not allowed");
  }

  const routes = getLocalizedRoutes(config.locale);

  switch (target._type) {
    case "countries":
    case "regions":
    case "areas":
    case "subareas":
      return routes.catalogs(slugText(target.slug));
    case "blogs":
    case "blogPage":
      return routes.article(slugText(target.slug));
    case "contactUs":
      return routes.contactUs;
    case "group":
      return routes.groups;
    case "home":
      return routes.home;
    case "preschool":
      return routes.cooperation;
    case "schools":
      return routes.group(slugText(target.slug));
    default:
      return routes.home;
  }
}

/**
 * Parse email links
 */
function parseEmailLink(linkField: SanityLinkField): string {
  const email = linkField.email || linkField.href?.replace("mailto:", "") || "";

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  return `mailto:${email}`;
}

/**
 * Parse phone links
 */
function parsePhoneLink(linkField: SanityLinkField): string {
  let phone = linkField.phone || linkField.href?.replace("tel:", "") || "";

  // Clean phone number
  phone = phone.replace(/[^\d+\-\s()]/g, "");

  if (!phone) {
    throw new Error("Invalid phone number");
  }

  return `tel:${phone}`;
}

/**
 * Validate the parsed link
 */
function validateLink(
  result: ParsedLink,
  config: Required<ParserOptions>,
): boolean {
  if (config.requireText && !result.text) {
    result.errors.push("Link text is required");
    return false;
  }

  if (!result.url) {
    result.errors.push("No valid URL generated");
    return false;
  }

  return result.errors.length === 0;
}

/**
 * Validate URL format
 */
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Create empty link structure
 */
function createEmptyLink(): ParsedLink {
  return {
    type: "empty",
    url: " ",
    text: "",
    title: "",
    target: "_self",
    valid: false,
    errors: ["No link data provided"],
  };
}

/**
 * Parse multiple link fields
 */
function parseMultipleLinkFields(
  linkFields: (SanityLinkField | null | undefined)[],
  options: ParserOptions = {},
): ParsedLink[] {
  if (!Array.isArray(linkFields)) {
    return [];
  }
  return linkFields.map((field) => parseLinkField(field, options));
}

function cleanUrl(url: string): string {
  if (!url || typeof url !== "string") return "";

  return (
    url
      // Remove http:// or https://
      .replace(/^https?:\/\//, "")
      // Remove www.
      .replace(/^www\./, "")
      // Remove trailing slash
      .replace(/\/$/, "")
  );
}

// Export all functions and types
export type {
  ParserOptions,
  SanityInternalLink,
  SanityLinkField,
  LinkType,
  ParsedLink,
};

export { parseLinkField, parseMultipleLinkFields, cleanUrl };
