/**
 * Format an ISO date string into something like "Aug 22, 2025".
 *
 * @param iso - ISO datetime string from Sanity (e.g. "2025-08-22T22:39:00.000Z")
 * @param locale - Optional locale, defaults to "en-US"
 * @returns formatted date string
 */
export function formatDate(
  iso?: string | Date,
  locale: string = "en-US",
): string {
  if (!iso) {
    return "";
  }

  const date = typeof iso === "string" ? new Date(iso) : iso;

  return new Intl.DateTimeFormat(locale, {
    month: "short", // Aug
    day: "2-digit", // 22
    year: "numeric", // 2025
  }).format(date);
}
