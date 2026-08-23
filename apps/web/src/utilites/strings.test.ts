import { describe, expect, it } from "vitest";
import {
  autoClamp,
  camelToDisplayText,
  ellipses,
  removeDiacritics,
  toOptionalArray,
} from "./strings";

describe("removeDiacritics", () => {
  it("strips Czech diacritics and lowercases", () => {
    expect(removeDiacritics("Dětské Skupinky")).toBe("detske skupinky");
  });

  it("handles ř, ě and ů specifically", () => {
    expect(removeDiacritics("Přerov")).toBe("prerov");
    expect(removeDiacritics("Děti")).toBe("deti");
    expect(removeDiacritics("Dům")).toBe("dum");
  });

  it("handles the full Czech diacritic set", () => {
    expect(removeDiacritics("ěščřžýáíéúůďťňó")).toBe("escrzyaieuudtno");
  });

  it("leaves undiacriticked text alone apart from case", () => {
    expect(removeDiacritics("Praha")).toBe("praha");
  });

  it("returns an empty string for undefined or empty input", () => {
    expect(removeDiacritics(undefined)).toBe("");
    expect(removeDiacritics("")).toBe("");
  });

  it("is idempotent", () => {
    const once = removeDiacritics("Žďár nad Sázavou");
    expect(removeDiacritics(once)).toBe(once);
  });
});

describe("autoClamp", () => {
  it("builds a clamp() from the tablet value against the md breakpoint", () => {
    // 512 / 1024 * 100 = 50.00
    expect(autoClamp({ mobile: 16, tablet: 512, desktop: 32 })).toBe(
      "clamp(16px, 50.00vw, 32px)",
    );
  });

  it("keeps two decimal places", () => {
    expect(autoClamp({ mobile: 1, tablet: 100, desktop: 2 })).toBe(
      "clamp(1px, 9.77vw, 2px)",
    );
  });

  it("handles a zero tablet value", () => {
    expect(autoClamp({ mobile: 0, tablet: 0, desktop: 0 })).toBe(
      "clamp(0px, 0.00vw, 0px)",
    );
  });
});

describe("toOptionalArray", () => {
  it("splits a comma-separated string", () => {
    expect(toOptionalArray("a,b,c")).toEqual(["a", "b", "c"]);
  });

  it("trims whitespace around each item", () => {
    expect(toOptionalArray(" a , b ")).toEqual(["a", "b"]);
  });

  it("drops empty segments", () => {
    expect(toOptionalArray("a,,b,")).toEqual(["a", "b"]);
  });

  it("filters falsy values out of an array", () => {
    expect(toOptionalArray(["a", "", "b"])).toEqual(["a", "b"]);
  });

  it("returns an empty array for undefined or empty input", () => {
    expect(toOptionalArray(undefined)).toEqual([]);
    expect(toOptionalArray("")).toEqual([]);
  });
});

describe("camelToDisplayText", () => {
  it("splits camelCase into words and capitalises them", () => {
    expect(camelToDisplayText("contactUs")).toBe("Contact Us");
  });

  it("handles a single word", () => {
    expect(camelToDisplayText("groups")).toBe("Groups");
  });

  it("returns an empty string for undefined", () => {
    expect(camelToDisplayText(undefined)).toBe("");
  });
});

describe("ellipses", () => {
  it("returns a line-clamp style object", () => {
    expect(ellipses(3)).toEqual({
      overflow: "hidden",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 3,
    });
  });
});
