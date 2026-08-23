import { describe, expect, it } from "vitest";
import { normalizeSlug, toArray } from "./helper";

describe("normalizeSlug", () => {
  it("strips leading slashes", () => {
    expect(normalizeSlug("/praha")).toBe("praha");
  });

  it("strips trailing slashes", () => {
    expect(normalizeSlug("praha/")).toBe("praha");
  });

  it("strips both, including repeats", () => {
    expect(normalizeSlug("///praha///")).toBe("praha");
  });

  it("leaves inner slashes intact", () => {
    expect(normalizeSlug("/ceska-republika/praha/")).toBe(
      "ceska-republika/praha",
    );
  });

  it("returns an empty string for undefined or empty input", () => {
    expect(normalizeSlug(undefined)).toBe("");
    expect(normalizeSlug("")).toBe("");
  });
});

describe("toArray", () => {
  it("wraps a single string", () => {
    expect(toArray("praha")).toEqual(["praha"]);
  });

  it("passes an array through", () => {
    expect(toArray(["a", "b"])).toEqual(["a", "b"]);
  });

  it("removes empty strings from an array", () => {
    expect(toArray(["a", "", "b"])).toEqual(["a", "b"]);
  });

  it("returns an empty array for undefined, empty string or empty array", () => {
    expect(toArray(undefined)).toEqual([]);
    expect(toArray("")).toEqual([]);
    expect(toArray([])).toEqual([]);
  });
});
