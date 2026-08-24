import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { CATCH_ALL_TAG, tagsForType } from "@/app/api/revalidate/tags";

/**
 * `next/cache` is not importable outside a Next request, and the point of the
 * test is which tags the route asks for - not that Next drops them. The mock
 * records the calls.
 */
const revalidateTag = vi.hoisted(() => vi.fn());
vi.mock("next/cache", () => ({ revalidateTag }));

const { POST } = await import("@/app/api/revalidate/route");

const SECRET = "test-webhook-secret";

/** A signed request in exactly the shape Sanity delivers one. */
async function signedRequest(
  payload: unknown,
  { secret = SECRET, timestamp = Date.now() } = {},
) {
  // Sanity signs the bytes it sends, so the same string has to be both signed
  // and posted - re-encoding the parsed object can produce different bytes.
  const body = JSON.stringify(payload);
  const signature = await encodeSignatureHeader(body, timestamp, secret);

  return new Request("https://example.test/api/revalidate", {
    method: "POST",
    headers: { [SIGNATURE_HEADER_NAME]: signature },
    body,
  });
}

function unsignedRequest(payload: unknown, headers: HeadersInit = {}) {
  return new Request("https://example.test/api/revalidate", {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

type RouteRequest = Parameters<typeof POST>[0];

const post = (request: Request) => POST(request as RouteRequest);

const revalidatedTags = () => revalidateTag.mock.calls.map(([tag]) => tag);

beforeEach(() => {
  revalidateTag.mockClear();
  vi.unstubAllEnvs();
  vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
});

describe("POST /api/revalidate - signature verification", () => {
  it("accepts a request signed with the configured secret", async () => {
    const response = await post(
      await signedRequest({ _type: "blogs", _id: "blog-1" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ revalidated: ["blogs"] });
  });

  it("rejects a signature produced with a different secret", async () => {
    const response = await post(
      await signedRequest(
        { _type: "blogs", _id: "blog-1" },
        { secret: "not-the-secret" },
      ),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request with no signature header", async () => {
    const response = await post(
      unsignedRequest({ _type: "blogs", _id: "blog-1" }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a signature header that is not in the expected format", async () => {
    const response = await post(
      unsignedRequest(
        { _type: "blogs", _id: "blog-1" },
        { [SIGNATURE_HEADER_NAME]: "definitely-not-a-signature" },
      ),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a valid signature over a body that was then edited", async () => {
    const body = JSON.stringify({ _type: "blogs", _id: "blog-1" });
    const signature = await encodeSignatureHeader(body, Date.now(), SECRET);

    const response = await post(
      new Request("https://example.test/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: signature },
        // Same secret, same signature - different payload.
        body: JSON.stringify({ _type: "settings", _id: "settings" }),
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a signature whose timestamp was tampered with", async () => {
    // The timestamp is inside the HMAC, so moving it invalidates the payload
    // hash even though the hash itself is untouched.
    const body = JSON.stringify({ _type: "blogs", _id: "blog-1" });
    const now = Date.now();
    const signature = await encodeSignatureHeader(body, now, SECRET);
    const tampered = signature.replace(`t=${now}`, `t=${now - 1000}`);

    const response = await post(
      new Request("https://example.test/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: tampered },
        body,
      }),
    );

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("still accepts a correctly signed but old payload", async () => {
    // `isValidSignature` verifies the HMAC only - it enforces no freshness
    // window - so a captured request stays replayable. That is deliberate
    // here: replaying one only drops a cache entry a second time, which costs
    // a regeneration and changes nothing an attacker can observe.
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

    const response = await post(
      await signedRequest(
        { _type: "blogs", _id: "blog-1" },
        { timestamp: twoHoursAgo },
      ),
    );

    expect(response.status).toBe(200);
  });

  it("refuses everything, signed or not, when no secret is configured", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await post(
      await signedRequest({ _type: "blogs", _id: "blog-1" }),
    );

    expect(response.status).toBe(503);
    expect(revalidateTag).not.toHaveBeenCalled();
    error.mockRestore();
  });

  it("rejects a signed body that is not JSON", async () => {
    const body = "not json at all";
    const signature = await encodeSignatureHeader(body, Date.now(), SECRET);

    const response = await post(
      new Request("https://example.test/api/revalidate", {
        method: "POST",
        headers: { [SIGNATURE_HEADER_NAME]: signature },
        body,
      }),
    );

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe("POST /api/revalidate - revalidation", () => {
  it("drops the tags the document type maps to", async () => {
    const response = await post(
      await signedRequest({ _type: "schools", _id: "school-1" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      revalidated: ["schools", "geo"],
    });
    expect(revalidatedTags()).toEqual(["schools", "geo"]);
  });

  it("drops entries under the profile they were written with", async () => {
    await post(await signedRequest({ _type: "settings", _id: "settings" }));

    // lib/sanity/fetch.ts writes with cacheLife("max"); revalidateTag has to
    // name the same profile or the entry is not dropped.
    expect(revalidateTag).toHaveBeenCalledWith("settings", "max");
  });

  it("falls back to the catch-all tag for an unknown type and logs it", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const response = await post(
      await signedRequest({ _type: "somethingBrandNew", _id: "x" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      revalidated: [CATCH_ALL_TAG],
    });
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain("somethingBrandNew");
    warn.mockRestore();
  });

  it("falls back to the catch-all tag when _type is missing entirely", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const response = await post(await signedRequest({ _id: "x" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      revalidated: [CATCH_ALL_TAG],
    });
    warn.mockRestore();
  });
});

describe("tagsForType", () => {
  it.each([
    ["schools", ["schools", "geo"]],
    ["countries", ["schools", "geo"]],
    ["regions", ["schools", "geo"]],
    ["areas", ["schools", "geo"]],
    ["subareas", ["schools", "geo"]],
    ["blogs", ["blogs"]],
    ["header", ["settings"]],
    ["footer", ["settings"]],
    ["settings", ["settings"]],
    ["dictionary", ["dictionary"]],
    ["dictionaries", ["dictionary"]],
  ])("maps %s to %j", (type, expected) => {
    expect(tagsForType(type)).toEqual({ tags: expected, unmapped: false });
  });

  it.each([
    "page",
    "home",
    "group",
    "preschool",
    "contactUs",
    "blogPage",
    "schoolPage",
  ])("maps the page type %s to page:%s", (type) => {
    expect(tagsForType(type)).toEqual({
      tags: [`page:${type}`],
      unmapped: false,
    });
  });

  it.each([undefined, null, 42, "", "notADocumentType"])(
    "falls back to the catch-all tag for %j",
    (type) => {
      expect(tagsForType(type)).toEqual({
        tags: [CATCH_ALL_TAG],
        unmapped: true,
      });
    },
  );

  it("returns a fresh array the caller cannot mutate into the mapping", () => {
    const first = tagsForType("schools");
    first.tags.push("oops");

    expect(tagsForType("schools").tags).toEqual(["schools", "geo"]);
  });
});
