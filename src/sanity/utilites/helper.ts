export function normalizeSlug(slug?: string): string {
  if (!slug) {
    return "";
  }
  // remove leading/trailing slashes
  return slug.replace(/^\/+|\/+$/g, "");
}
