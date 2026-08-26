import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { CATCH_ALL_TAG, tagsForType } from "@/lib/sanity/tags";

/**
 * Drops cached Sanity responses when a document is published.
 *
 * Content is cached with `cacheLife("max")`, so nothing expires on a timer -
 * this endpoint is the only thing that makes a publish visible. It is driven
 * by a Sanity webhook configured with the projection `{_type, _id}`.
 *
 * Authentication is the webhook's own HMAC signature rather than a shared
 * header: Sanity signs the raw body with the secret, so a replayed or edited
 * payload fails verification even if the URL leaks. That is why the body is
 * read as text first - re-encoding parsed JSON changes the bytes and would
 * make valid requests fail.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;

  // Fail closed. An unset secret must not mean "open to everyone".
  if (!secret) {
    console.error("SANITY_WEBHOOK_SECRET is not set - refusing to revalidate");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.text();

  // Throws on a malformed signature header rather than returning false, so an
  // unparseable value is treated the same as a wrong one.
  let valid = false;
  try {
    valid = await isValidSignature(body, signature, secret);
  } catch {
    valid = false;
  }

  if (!valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const type =
    payload && typeof payload === "object"
      ? (payload as { _type?: unknown })._type
      : undefined;

  const { tags, unmapped } = tagsForType(type);

  if (unmapped) {
    // Worth a log line: it means a document type exists that this route has no
    // mapping for, and every cached response is being dropped to cover it.
    console.warn(
      `Unmapped Sanity _type ${JSON.stringify(type)} - revalidating "${CATCH_ALL_TAG}"`,
    );
  }

  for (const tag of tags) {
    // The profile has to match the one the entries were written with, which is
    // `cacheLife("max")` in lib/sanity/fetch.ts.
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: tags });
}
