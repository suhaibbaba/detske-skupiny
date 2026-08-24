import { NextRequest, NextResponse } from "next/server";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { locales } from "@/i18n/routing";
import { schoolsRequestSchema } from "./schema";

/**
 * Paged school results for the catalog list.
 *
 * This exists to sever the browser's direct connection to Sanity: the infinite
 * scroll and the filter reset in SchoolListClient used to call the Sanity
 * client from the browser, which meant shipping the dataset configuration to
 * every visitor and letting anyone run a GROQ query of their choosing.
 *
 * It is deliberately thin. Turning the catalog's filter state into URL state
 * driven by Server Actions is the next PR; this route only moves the existing
 * call server-side.
 */
export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schoolsRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // The locale selects content, so it has to be one the site actually serves
  // rather than any string that survived the schema.
  if (!locales.includes(parsed.data.locale)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (parsed.data.end < parsed.data.start) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await fetchSchoolByFilter(parsed.data);

  return NextResponse.json(result);
}
