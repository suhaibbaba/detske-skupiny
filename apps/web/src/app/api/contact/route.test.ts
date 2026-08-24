import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { POST } from "./route";

/**
 * The honeypot has to behave like a success while never reaching Brevo, so
 * every assertion here is a pair: the response the bot sees, and the fetch
 * that must not have happened.
 *
 * `fetch` is mocked globally - the route uses it for both Turnstile and Brevo.
 * Neither key is set in this environment, so Turnstile verification is skipped
 * (its documented dev fallback) and the only fetch a real send would make is
 * the Brevo one.
 */
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const validBody = {
  name: "Jana Nováková",
  email: "jana@example.cz",
  message: "Dobrý den, mám zájem.",
  consent: true,
};

/**
 * The route's parameter is `NextRequest`, which is a `Request` plus Next's own
 * `cookies`/`nextUrl` accessors. The handler reads only `json()` and
 * `headers`, so a plain `Request` is enough - the cast says exactly that
 * rather than erasing the type with `any`.
 */
const request = (body: unknown) =>
  new Request("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }) as unknown as NextRequest;

const brevoCalls = (fetchMock: ReturnType<typeof vi.fn>) =>
  fetchMock.mock.calls.filter(([url]) => String(url).includes("brevo.com"));

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  delete process.env.TURNSTILE_SECRET_KEY;
  process.env.BREVO_API_KEY = "test-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/contact - honeypot", () => {
  it("returns the success shape when the honeypot is filled", async () => {
    const response = await POST(request({ ...validBody, website: "spam" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Email sent successfully",
    });
  });

  it("never calls Brevo when the honeypot is filled", async () => {
    await POST(request({ ...validBody, website: "spam" }));
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });

  it("drops the message even when the rest of the payload is invalid", async () => {
    // A bot that fills the honeypot is answered before validation runs, so it
    // cannot tell the difference between a rejected and an accepted payload.
    const response = await POST(
      request({ website: "spam", name: "", email: "nope", consent: false }),
    );

    expect(response.status).toBe(200);
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });

  it("is indistinguishable from a genuine success", async () => {
    const trapped = await POST(request({ ...validBody, website: "bot" }));
    const genuine = await POST(request(validBody));

    expect(trapped.status).toBe(genuine.status);
    await expect(trapped.json()).resolves.toEqual(await genuine.json());
  });

  it("ignores an empty honeypot and proceeds normally", async () => {
    const response = await POST(request({ ...validBody, website: "" }));

    expect(response.status).toBe(200);
    expect(brevoCalls(fetchMock)).toHaveLength(1);
  });

  it("ignores a whitespace-only honeypot", async () => {
    await POST(request({ ...validBody, website: "   " }));
    expect(brevoCalls(fetchMock)).toHaveLength(1);
  });

  it("ignores a non-string honeypot value", async () => {
    await POST(request({ ...validBody, website: 123 }));
    expect(brevoCalls(fetchMock)).toHaveLength(1);
  });
});

describe("POST /api/contact - validation", () => {
  it("rejects an empty body with 400 and no Brevo call", async () => {
    const response = await POST(request({}));

    expect(response.status).toBe(400);
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });

  it("rejects consent:false with 400", async () => {
    const response = await POST(request({ ...validBody, consent: false }));
    expect(response.status).toBe(400);
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });

  it("rejects a malformed JSON body with 400, not 500", async () => {
    const response = await POST(request("not json"));
    expect(response.status).toBe(400);
  });

  it("never echoes validation details back to the caller", async () => {
    const response = await POST(request({ ...validBody, email: "bad" }));
    const body = await response.json();

    expect(body).toEqual({ error: "Invalid request" });
    expect(JSON.stringify(body)).not.toMatch(/email|zod|issue/i);
  });
});

describe("POST /api/contact - happy path", () => {
  it("sends via Brevo and returns success", async () => {
    const response = await POST(request(validBody));

    expect(response.status).toBe(200);
    expect(brevoCalls(fetchMock)).toHaveLength(1);
    expect(brevoCalls(fetchMock)[0][0]).toBe(BREVO_URL);
  });

  it("sets the reply-to to the sender and escapes the html body", async () => {
    await POST(
      request({ ...validBody, name: "Jana <script>alert(1)</script>" }),
    );

    const [, init] = brevoCalls(fetchMock)[0];
    const payload = JSON.parse(String(init.body));

    expect(payload.replyTo.email).toBe(validBody.email);
    expect(payload.htmlContent).not.toContain("<script>");
    expect(payload.htmlContent).toContain("&lt;script&gt;");
  });

  it("returns 500 when Brevo rejects the send", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("{}", { status: 502 }) as never,
    );

    const response = await POST(request(validBody));
    expect(response.status).toBe(500);
  });

  it("returns 500 when the Brevo key is missing", async () => {
    delete process.env.BREVO_API_KEY;

    const response = await POST(request(validBody));
    expect(response.status).toBe(500);
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });
});

describe("POST /api/contact - turnstile", () => {
  it("skips verification when no secret is configured", async () => {
    await POST(request(validBody));

    const turnstileCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes("challenges.cloudflare.com"),
    );
    expect(turnstileCalls).toHaveLength(0);
  });

  it("verifies the token when a secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: true }), { status: 200 }) as never,
    );

    await POST(request({ ...validBody, turnstileToken: "token" }));

    const turnstileCalls = fetchMock.mock.calls.filter(([url]) =>
      String(url).includes("challenges.cloudflare.com"),
    );
    expect(turnstileCalls).toHaveLength(1);
  });

  it("rejects with 400 when verification fails, without calling Brevo", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret";
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ success: false }), {
        status: 200,
      }) as never,
    );

    const response = await POST(request({ ...validBody, turnstileToken: "t" }));

    expect(response.status).toBe(400);
    expect(brevoCalls(fetchMock)).toHaveLength(0);
  });
});
