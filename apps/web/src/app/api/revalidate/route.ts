import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Drops cached Sanity responses by tag.
 *
 * Content is cached with `cacheLife("max")`, so nothing expires on a timer -
 * this endpoint is how a publish becomes visible. Until the Sanity webhook PR
 * lands it is driven by hand; the shape below is what that webhook will post,
 * so it does not have to change.
 *
 * Known tags: "schools", "geo", "blogs", "settings", "dictionary", and
 * "page:<type>" for a single page document.
 */
const revalidateSchema = z.object({
  tags: z.array(z.string().trim().min(1).max(100)).min(1).max(50),
});

const SECRET_HEADER = "x-revalidate-secret";

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  // Fail closed. An unset secret must not mean "open to everyone".
  if (!secret) {
    console.error("REVALIDATE_SECRET is not set - refusing to revalidate");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  if (request.headers.get(SECRET_HEADER) !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = revalidateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  for (const tag of parsed.data.tags) {
    // The profile has to match the one the entries were written with, which is
    // `cacheLife("max")` in lib/sanity/fetch.ts.
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: parsed.data.tags });
}
