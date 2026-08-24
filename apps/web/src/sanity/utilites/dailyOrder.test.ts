import { describe, expect, it } from "vitest";
import {
  dailySeed,
  orderByDailyShuffle,
  stableHash,
} from "@/sanity/utilites/dailyOrder";

const school = (id: string, isHighPriority = false) => ({ id, isHighPriority });

const ids = (items: { id: string }[]) => items.map((item) => item.id);

/** Enough schools that a shuffle is very unlikely to reproduce input order. */
const many = Array.from({ length: 50 }, (_, i) => school(`school-${i}`));

describe("dailySeed", () => {
  it("is the UTC calendar date", () => {
    expect(dailySeed(new Date("2026-08-24T09:30:00Z"))).toBe("2026-08-24");
  });

  it("is the same for every instant within one UTC day", () => {
    expect(dailySeed(new Date("2026-08-24T00:00:00Z"))).toBe(
      dailySeed(new Date("2026-08-24T23:59:59Z")),
    );
  });

  it("changes at UTC midnight, not local midnight", () => {
    // 23:30 in UTC+02:00 is still the 24th in UTC.
    expect(dailySeed(new Date("2026-08-24T21:30:00Z"))).toBe("2026-08-24");
    expect(dailySeed(new Date("2026-08-25T00:00:00Z"))).toBe("2026-08-25");
  });
});

describe("stableHash", () => {
  it("gives the same answer for the same input", () => {
    expect(stableHash("abc")).toBe(stableHash("abc"));
  });

  it("gives different answers for different inputs", () => {
    expect(stableHash("abc")).not.toBe(stableHash("abd"));
  });

  it("returns an unsigned 32-bit integer", () => {
    for (const input of ["", "a", "school-1:2026-08-24", "ř".repeat(40)]) {
      const hash = stableHash(input);
      expect(Number.isInteger(hash)).toBe(true);
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThanOrEqual(0xffffffff);
    }
  });
});

describe("orderByDailyShuffle", () => {
  it("puts high-priority schools before the rest", () => {
    const ordered = orderByDailyShuffle(
      [
        school("a"),
        school("b", true),
        school("c"),
        school("d", true),
        school("e"),
      ],
      "2026-08-24",
    );

    expect(ordered.slice(0, 2).map((s) => s.isHighPriority)).toEqual([
      true,
      true,
    ]);
    expect(ordered.slice(2).every((s) => !s.isHighPriority)).toBe(true);
  });

  it("treats a missing isHighPriority as not high priority", () => {
    const ordered = orderByDailyShuffle(
      [{ id: "a" }, { id: "b", isHighPriority: true }, { id: "c" }],
      "2026-08-24",
    );

    expect(ordered[0].id).toBe("b");
  });

  it("is stable for the same seed", () => {
    expect(ids(orderByDailyShuffle(many, "2026-08-24"))).toEqual(
      ids(orderByDailyShuffle(many, "2026-08-24")),
    );
  });

  it("does not depend on the order the schools arrived in", () => {
    const reversed = [...many].reverse();

    expect(ids(orderByDailyShuffle(reversed, "2026-08-24"))).toEqual(
      ids(orderByDailyShuffle(many, "2026-08-24")),
    );
  });

  it("produces a different order on a different day", () => {
    expect(ids(orderByDailyShuffle(many, "2026-08-24"))).not.toEqual(
      ids(orderByDailyShuffle(many, "2026-08-25"))
    );
  });

  it("actually shuffles rather than returning input order", () => {
    expect(ids(orderByDailyShuffle(many, "2026-08-24"))).not.toEqual(ids(many));
  });

  it("keeps every school exactly once", () => {
    const ordered = orderByDailyShuffle(many, "2026-08-24");

    expect(ordered).toHaveLength(many.length);
    expect(new Set(ids(ordered))).toEqual(new Set(ids(many)));
  });

  it("does not mutate its input", () => {
    const input = [school("c"), school("a"), school("b")];
    const before = ids(input);

    orderByDailyShuffle(input, "2026-08-24");

    expect(ids(input)).toEqual(before);
  });

  it("slices into pages that neither repeat nor drop a school", () => {
    // This is the property the catalog depends on: paging asks for
    // [0..10), [10..20) of the same ordering, so an unstable sort would show
    // a school twice and hide another.
    const ordered = orderByDailyShuffle(many, "2026-08-24");
    const paged = [
      ...ordered.slice(0, 10),
      ...ordered.slice(10, 20),
      ...ordered.slice(20, 50),
    ];

    expect(ids(paged)).toEqual(ids(ordered));
  });

  it("handles an empty list", () => {
    expect(orderByDailyShuffle([], "2026-08-24")).toEqual([]);
  });
});
