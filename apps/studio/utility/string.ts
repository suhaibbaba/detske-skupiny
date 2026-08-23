import { PortableTextBlock } from "@portabletext/types";

export function toPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}

export const startCase = (
  input: string | number | null | undefined,
): string => {
  if (input == null) return "";
  const str = String(input).trim();
  if (!str) return "";

  // 1) Normalize common separators & add spaces at case-change boundaries
  const separated = str
    // fooBar -> foo Bar
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    // HTMLParser -> HTML Parser (split acronym from next capitalized word)
    .replace(/([A-Z]+)([A-Z][a-z0-9])/g, "$1 $2")
    // underscores/dashes -> space
    .replace(/[_\-]+/g, " ")
    // collapse extra whitespace
    .replace(/\s+/g, " ")
    .trim();

  // 2) Extract words (letters with marks, digits). Keep apostrophes inside words.
  const words = separated.match(/\p{L}[\p{L}\p{M}\p{N}']*|\d+/gu) ?? [];

  // 3) Capitalize each word (lower the rest), then join with a single space
  return words
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
};

export const upperCase = (value?: string) => {
  return value ? value.toUpperCase() : value;
};

export const appendLanguageSubtitle = (
  language?: string,
  subtitle?: string,
) => {
  const languagePart = language ? `🌐 ${upperCase(language)}` : "";
  const parts = [languagePart, subtitle].filter(Boolean);
  return parts.join(" - ");
};

export function removeDiacritics(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
