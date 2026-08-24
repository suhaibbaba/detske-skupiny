import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const valid = {
  name: "Jana Nováková",
  email: "jana@example.cz",
  message: "Dobrý den, mám zájem o místo pro dceru.",
  consent: true as const,
};

describe("contactSchema - accepts", () => {
  it("a valid payload", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("a payload with a turnstile token", () => {
    expect(
      contactSchema.safeParse({ ...valid, turnstileToken: "abc" }).success,
    ).toBe(true);
  });

  it("Czech diacritics in the name and message", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        name: "Řehoř Žížala",
        message: "Ďáblice, Přerov, Ústí — vše v pořádku.",
      }).success,
    ).toBe(true);
  });

  it("a name of exactly 100 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, name: "a".repeat(100) }).success,
    ).toBe(true);
  });

  it("a message of exactly 2000 characters", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "a".repeat(2000) }).success,
    ).toBe(true);
  });

  it("and trims surrounding whitespace", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Jana  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Jana");
  });
});

describe("contactSchema - rejects", () => {
  const rejects = (payload: unknown) =>
    expect(contactSchema.safeParse(payload).success).toBe(false);

  it("a name longer than 100 characters", () => {
    rejects({ ...valid, name: "a".repeat(101) });
  });

  it("an empty name", () => {
    rejects({ ...valid, name: "" });
  });

  it("a whitespace-only name", () => {
    rejects({ ...valid, name: "   " });
  });

  it("a malformed email", () => {
    rejects({ ...valid, email: "not-an-email" });
  });

  it("an email with no domain", () => {
    rejects({ ...valid, email: "jana@" });
  });

  it("an email longer than 200 characters", () => {
    rejects({ ...valid, email: `${"a".repeat(200)}@example.cz` });
  });

  it("a message longer than 2000 characters", () => {
    rejects({ ...valid, message: "a".repeat(2001) });
  });

  it("an empty message", () => {
    rejects({ ...valid, message: "" });
  });

  it("consent set to false", () => {
    rejects({ ...valid, consent: false });
  });

  it("a missing consent field", () => {
    const { consent: _consent, ...withoutConsent } = valid;
    rejects(withoutConsent);
  });

  it("consent as a truthy non-literal", () => {
    rejects({ ...valid, consent: "yes" });
  });

  it("a completely empty object", () => {
    rejects({});
  });

  it("a non-object", () => {
    rejects("nope");
    rejects(null);
  });
});

describe("contactSchema - header injection", () => {
  it("rejects CRLF in the name", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        name: "Jana\r\nBcc: attacker@evil.test",
      }).success,
    ).toBe(false);
  });

  it("rejects a bare newline in the name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "Jana\nX" }).success).toBe(
      false,
    );
  });

  it("rejects a bare carriage return in the name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "Jana\rX" }).success).toBe(
      false,
    );
  });

  it("rejects CRLF in the email", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        email: "a@b.cz\r\nBcc: attacker@evil.test",
      }).success,
    ).toBe(false);
  });

  it("allows newlines in the message body, where they are harmless", () => {
    expect(
      contactSchema.safeParse({
        ...valid,
        message: "Line one\nLine two\r\nLine three",
      }).success,
    ).toBe(true);
  });
});
