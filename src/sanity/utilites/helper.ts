export function normalizeSlug(slug?: string): string {
  if (!slug) {
    return "";
  }
  // remove leading/trailing slashes
  return slug.replace(/^\/+|\/+$/g, "");
}

export const toArray = (v?: string | string[]) =>
  !v || (Array.isArray(v) && v.length === 0)
    ? []
    : Array.isArray(v)
      ? v.filter(Boolean) // removes empty strings
      : v
        ? [v]
        : [];
