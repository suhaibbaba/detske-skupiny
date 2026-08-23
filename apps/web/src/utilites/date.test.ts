import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

const ISO = "2025-08-22T22:39:00.000Z";

describe("formatDate", () => {
  it("formats with cs-CZ for the Czech locale", () => {
    const formatted = formatDate(ISO, "cs-CZ");
    // Czech short months are lowercase and abbreviated with a dot ("srp"),
    // and the day precedes the month - both differ from en-US.
    expect(formatted).toMatch(/2025/);
    expect(formatted).toMatch(/23|22/);
    expect(formatted).not.toBe(formatDate(ISO, "en-US"));
  });

  it("produces the exact cs-CZ string Intl gives for this date", () => {
    const expected = new Intl.DateTimeFormat("cs-CZ", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(ISO));
    expect(formatDate(ISO, "cs-CZ")).toBe(expected);
  });

  it("defaults to en-US when no locale is given", () => {
    expect(formatDate(ISO)).toBe(formatDate(ISO, "en-US"));
    expect(formatDate(ISO)).toMatch(/Aug/);
  });

  it("accepts a Date instance", () => {
    expect(formatDate(new Date(ISO), "cs-CZ")).toBe(formatDate(ISO, "cs-CZ"));
  });

  it("returns an empty string for undefined", () => {
    expect(formatDate(undefined)).toBe("");
  });

  it("returns an empty string for an empty string", () => {
    expect(formatDate("")).toBe("");
  });
});
