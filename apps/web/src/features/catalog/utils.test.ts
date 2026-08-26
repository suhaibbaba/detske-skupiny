import { describe, expect, it } from "vitest";
import { getSelectedSlug, parseCatalogSlug } from "./utils";
import { FilterTypes } from "@/types/school-filter";

/**
 * parseCatalogSlug decides whether a /katalog/... URL exists at all. A truthy
 * object for an out-of-range depth turns a bad URL into a 500 instead of a 404,
 * so the null cases below are the load-bearing ones.
 */
describe("parseCatalogSlug", () => {
  it("parses a country (1 segment)", () => {
    expect(parseCatalogSlug(["ceska-republika"])).toEqual({
      level: FilterTypes.country,
      country: "ceska-republika",
    });
  });

  it("parses a region (2 segments)", () => {
    expect(parseCatalogSlug(["ceska-republika", "praha"])).toEqual({
      level: FilterTypes.region,
      country: "ceska-republika",
      region: "praha",
    });
  });

  it("parses an area (3 segments)", () => {
    expect(parseCatalogSlug(["ceska-republika", "praha", "praha-4"])).toEqual({
      level: FilterTypes.area,
      country: "ceska-republika",
      region: "praha",
      area: "praha-4",
    });
  });

  it("parses a subarea (4 segments)", () => {
    expect(
      parseCatalogSlug(["ceska-republika", "praha", "praha-4", "podoli"]),
    ).toEqual({
      level: FilterTypes.subarea,
      country: "ceska-republika",
      region: "praha",
      area: "praha-4",
      subarea: "podoli",
    });
  });

  it("returns null for an empty slug", () => {
    expect(parseCatalogSlug([])).toBeNull();
  });

  it("returns null when called with no argument", () => {
    expect(parseCatalogSlug()).toBeNull();
  });

  it("returns null for 5 segments", () => {
    expect(parseCatalogSlug(["a", "b", "c", "d", "e"])).toBeNull();
  });

  it("returns null for well beyond 5 segments", () => {
    expect(parseCatalogSlug(["a", "b", "c", "d", "e", "f", "g"])).toBeNull();
  });

  it("assigns levels in ascending depth order", () => {
    const levels = [1, 2, 3, 4].map(
      (depth) => parseCatalogSlug(Array(depth).fill("x"))?.level,
    );
    expect(levels).toEqual([
      FilterTypes.country,
      FilterTypes.region,
      FilterTypes.area,
      FilterTypes.subarea,
    ]);
  });
});

describe("getSelectedSlug", () => {
  it("builds a path from all four levels", () => {
    expect(
      getSelectedSlug({
        level: FilterTypes.subarea,
        country: "ceska-republika",
        region: "praha",
        area: "praha-4",
        subarea: "podoli",
      }),
    ).toBe("/ceska-republika/praha/praha-4/podoli");
  });

  it("skips levels that are not set", () => {
    expect(
      getSelectedSlug({
        level: FilterTypes.region,
        country: "ceska-republika",
        region: "praha",
      }),
    ).toBe("/ceska-republika/praha");
  });

  it("returns a bare slash when nothing is set", () => {
    expect(getSelectedSlug({ level: FilterTypes.country })).toBe("/");
  });

  it("round-trips with parseCatalogSlug", () => {
    const slug = ["ceska-republika", "praha", "praha-4"];
    const parsed = parseCatalogSlug(slug);
    expect(getSelectedSlug(parsed!)).toBe(`/${slug.join("/")}`);
  });
});
