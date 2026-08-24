/**
 * Sanity LinkField Parser - TypeScript Method Functions
 * Collection of functions to parse and validate Sanity CMS link field structures
 */
import { defaultLocale } from "@/i18n/routing";
import { getLocalizedRoutes } from "@/routes";

// Types and Interfaces
interface ParserOptions {
  allowExternal?: boolean;
  allowInternal?: boolean;
  allowEmail?: boolean;
  allowPhone?: boolean;
  allowFile?: boolean;
  requireText?: boolean;
  defaultTarget?: string;
  locale?: string;
}

interface SanityReference {
  _ref: string;
  _type?: string;
}

interface SanityAsset {
  _ref?: string;
  _id?: string;
  url?: string;
}

interface SanityFile {
  asset: SanityAsset;
}

interface SanityLinkField {
  type?: string;
  href?: string;
  url?: string;
  text?: string;
  title?: string;
  blank?: boolean;
  email?: string;
  phone?: string;
  internalLink?: {
    _type: string;
    slug: string;
    [key: string]: any;
  };
}

type LinkType =
  "external" | "internal" | "email" | "phone" | "file" | "empty" | "unknown";

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
  allowExternal: true,
  allowInternal: true,
  allowEmail: true,
  allowPhone: true,
  allowFile: true,
  requireText: false,
  defaultTarget: "_self",
  locale: defaultLocale,
};

/**
 * Parse a Sanity link field object
 */
function parseLinkField(
  linkField: SanityLinkField | null | undefined,
  options: ParserOptions = {},
): ParsedLink {
  const config: Required<ParserOptions> = { ...defaultOptions, ...options };

  if (!linkField || typeof linkField !== "object") {
    return createEmptyLink(config);
  }

  const result = {
    type: detectLinkType(linkField),
    url: " ",
    text:
      linkField.text ||
      linkField.internalLink?.text ||
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
        result.url = parseExternalLink(linkField, config);
        break;
      case "internal":
        result.url = parseInternalLink(linkField, config);
        break;
      case "email":
        result.url = parseEmailLink(linkField, config);
        break;
      case "phone":
        result.url = parsePhoneLink(linkField, config);
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
function parseExternalLink(
  linkField: SanityLinkField,
  config: Required<ParserOptions>,
): string {
  if (!config.allowExternal) {
    throw new Error("External links are not allowed");
  }

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
 */
function parseInternalLink(
  linkField: SanityLinkField,
  config: Required<ParserOptions>,
): string {
  if (!config.allowInternal || !linkField.internalLink) {
    throw new Error("Internal links are not allowed");
  }

  const type =
    linkField.internalLink?._type === "reference"
      ? linkField.internalLink?._ref
      : linkField.internalLink?._type;

  switch (type) {
    case "countries":
    case "regions":
    case "areas":
    case "subareas":
      return getLocalizedRoutes(config.locale).catalogs(
        linkField.internalLink.slug,
      );
    case "blogs":
      return getLocalizedRoutes(config.locale).article(
        linkField.internalLink.slug,
      );
    case "contactUs":
      return getLocalizedRoutes(config.locale).contactUs;
    case "group":
      return getLocalizedRoutes(config.locale).groups;
    case "home":
      return getLocalizedRoutes(config.locale).home;
    case "preschoolPage":
    case "preschool":
      return getLocalizedRoutes(config.locale).cooperation;
    case "schools":
      return getLocalizedRoutes(config.locale).group(
        linkField.internalLink.slug,
      );
    case "blogPage":
      return getLocalizedRoutes(config.locale).article(
        linkField.internalLink.slug,
      );
    default:
      return getLocalizedRoutes(config.locale).home;
  }
}

/**
 * Parse email links
 */
function parseEmailLink(
  linkField: SanityLinkField,
  config: Required<ParserOptions>,
): string {
  if (!config.allowEmail) {
    throw new Error("Email links are not allowed");
  }

  const email = linkField.email || linkField.href?.replace("mailto:", "") || "";

  if (!isValidEmail(email)) {
    throw new Error("Invalid email format");
  }

  return `mailto:${email}`;
}

/**
 * Parse phone links
 */
function parsePhoneLink(
  linkField: SanityLinkField,
  config: Required<ParserOptions>,
): string {
  if (!config.allowPhone) {
    throw new Error("Phone links are not allowed");
  }

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
function createEmptyLink(config: Required<ParserOptions>): ParsedLink {
  return {
    type: "empty",
    url: " ",
    text: "",
    title: "",
    target: config.defaultTarget,
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
  SanityReference,
  SanityAsset,
  SanityFile,
  SanityLinkField,
  LinkType,
  ParsedLink,
};

export { parseLinkField, parseMultipleLinkFields, cleanUrl };
