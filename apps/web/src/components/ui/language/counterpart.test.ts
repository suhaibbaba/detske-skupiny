import { describe, expect, it } from "vitest";
import {
  counterpartUrl,
  isFullyTranslatable,
  translateSegments,
} from "@/components/ui/language/counterpart";

const CS = "https://cs.school.local";
const EN = "https://en.school.local";

describe("translateSegments", () => {
  it("translates a known segment in either direction", () => {
    expect(translateSegments("/clanky", "cs", "en")).toBe("/articles");
    expect(translateSegments("/articles", "en", "cs")).toBe("/clanky");
    expect(translateSegments("/kontakt", "cs", "en")).toBe("/contact-us");
    expect(translateSegments("/cooperation", "en", "cs")).toBe("/spoluprace");
  });

  it("leaves the root alone", () => {
    expect(translateSegments("/", "cs", "en")).toBe("/");
  });

  it("leaves a segment it does not know", () => {
    expect(translateSegments("/skupiny/lesni-klub", "cs", "en")).toBe(
      "/groups/lesni-klub",
    );
  });
});

describe("isFullyTranslatable", () => {
  it("is true for a route made only of known segments", () => {
    expect(isFullyTranslatable("/clanky", "cs")).toBe(true);
    expect(isFullyTranslatable("/kontakt", "cs")).toBe(true);
    expect(isFullyTranslatable("/", "cs")).toBe(true);
  });

  /**
   * The case the whole guard exists for: `/skupiny/<slug>` would translate to
   * `/groups/<czech-slug>`, which looks right and 404s, because the English
   * document has its own slug.
   */
  it("is false as soon as one segment is a content slug", () => {
    expect(isFullyTranslatable("/skupiny/lesni-klub", "cs")).toBe(false);
    expect(isFullyTranslatable("/clanky/muj-clanek", "cs")).toBe(false);
    expect(isFullyTranslatable("/katalog/praha/praha-6", "cs")).toBe(false);
  });
});

describe("counterpartUrl", () => {
  const base = {
    pathname: "/",
    search: "",
    hash: "",
    fromLocale: "cs",
    toLocale: "en",
    targetOrigin: EN,
  };

  it("prefers the page's declared alternate over anything it could compute", () => {
    expect(
      counterpartUrl({
        ...base,
        pathname: "/skupiny/lesni-klub-sluncem",
        declaredAlternate: `${EN}/groups/forest-club-sunbeam`,
      }),
    ).toBe(`${EN}/groups/forest-club-sunbeam`);
  });

  it("does not carry this page's query string onto a declared alternate", () => {
    expect(
      counterpartUrl({
        ...base,
        pathname: "/katalog/praha",
        search: "?page=3&tags=bilingual",
        declaredAlternate: `${EN}/catalog/prague`,
      }),
    ).toBe(`${EN}/catalog/prague`);
  });

  it("translates a static route when the page declares no alternate", () => {
    expect(counterpartUrl({ ...base, pathname: "/kontakt" })).toBe(
      `${EN}/contact-us`,
    );
  });

  it("keeps the query string and hash on a translated static route", () => {
    expect(
      counterpartUrl({
        ...base,
        pathname: "/clanky",
        search: "?category=news",
        hash: "#latest",
      }),
    ).toBe(`${EN}/articles?category=news#latest`);
  });

  it("falls back to home for a content route with no alternate", () => {
    expect(
      counterpartUrl({ ...base, pathname: "/skupiny/lesni-klub-sluncem" }),
    ).toBe(`${EN}/`);
  });

  it("works the other way round too", () => {
    expect(
      counterpartUrl({
        ...base,
        pathname: "/cooperation",
        fromLocale: "en",
        toLocale: "cs",
        targetOrigin: CS,
      }),
    ).toBe(`${CS}/spoluprace`);
  });

  /**
   * The bug this replaced: `buildUrl` returned the target origin plus a bare
   * "/" for every page, so the switcher always landed on the home page while
   * its own comment claimed it preserved "path, search params, and hash".
   */
  it("no longer sends every page to the home page", () => {
    expect(counterpartUrl({ ...base, pathname: "/kontakt" })).not.toBe(
      `${EN}/`,
    );
  });
});
