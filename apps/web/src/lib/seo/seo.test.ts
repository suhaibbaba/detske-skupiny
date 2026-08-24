import { describe, expect, it } from "vitest";

import { absoluteUrl, localeForHost, originFor } from "@/lib/seo/site";
import { alternatesFor } from "@/lib/seo/metadata";
import { documentPaths, staticRoutePaths } from "@/lib/seo/routes";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  compact,
  schoolJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/jsonLd";

/**
 * The parts of the SEO layer that are pure functions.
 *
 * Two locales on two hosts is the thing that makes this worth testing: a
 * canonical that names the wrong origin, or an hreflang pair that points both
 * ways at the same domain, is silently wrong - the page renders, the tags are
 * present, and only a search console weeks later says otherwise.
 *
 * The origins come from vitest.config.ts, which sets the same environment
 * variables routing.ts reads in production.
 */

const CS = "https://cs.school.local";
const EN = "https://en.school.local";

describe("origins", () => {
  it("gives each locale its own host", () => {
    expect(originFor("cs")).toBe(CS);
    expect(originFor("en")).toBe(EN);
  });

  it("falls back to the default locale's host for an unknown locale", () => {
    expect(originFor("de")).toBe(CS);
  });

  it("maps a Host header back to its locale, port and case aside", () => {
    expect(localeForHost("cs.school.local")).toBe("cs");
    expect(localeForHost("EN.School.Local:3000")).toBe("en");
    expect(localeForHost("example.com")).toBeUndefined();
    expect(localeForHost(null)).toBeUndefined();
  });

  it("builds absolute URLs, adding the leading slash if a caller forgot", () => {
    expect(absoluteUrl("cs", "/katalog/praha")).toBe(`${CS}/katalog/praha`);
    expect(absoluteUrl("en", "catalog/prague")).toBe(`${EN}/catalog/prague`);
  });

  it("names the home page without a trailing slash, as Next's canonical does", () => {
    expect(absoluteUrl("cs", "/")).toBe(CS);
  });
});

describe("static routes", () => {
  it("translates the path segment per locale", () => {
    expect(staticRoutePaths("articles")).toEqual({
      cs: "/clanky",
      en: "/articles",
    });
    expect(staticRoutePaths("contactUs")).toEqual({
      cs: "/kontakt",
      en: "/contact-us",
    });
  });
});

describe("canonical and hreflang", () => {
  it("points the canonical at this locale's own host", () => {
    const alternates = alternatesFor("en", {
      cs: "/kontakt",
      en: "/contact-us",
    });

    expect(alternates.canonical).toBe(`${EN}/contact-us`);
  });

  it("links both locales and defaults x-default to Czech", () => {
    const { languages } = alternatesFor("cs", {
      cs: "/clanky/a",
      en: "/articles/a",
    });

    expect(languages).toEqual({
      cs: `${CS}/clanky/a`,
      en: `${EN}/articles/a`,
      "x-default": `${CS}/clanky/a`,
    });
  });

  it("emits no alternate for a locale the document is not translated into", () => {
    const { languages } = alternatesFor("cs", { cs: "/clanky/jen-cesky" });

    expect(languages).toEqual({
      cs: `${CS}/clanky/jen-cesky`,
      "x-default": `${CS}/clanky/jen-cesky`,
    });
  });

  it("omits x-default when the Czech version does not exist", () => {
    const { languages } = alternatesFor("en", { en: "/articles/en-only" });

    expect(languages).toEqual({ en: `${EN}/articles/en-only` });
  });
});

describe("documentPaths", () => {
  const toArticle = (locale: string, slug: string) =>
    locale === "cs" ? `/clanky/${slug}` : `/articles/${slug}`;

  it("always includes the document's own path", () => {
    expect(documentPaths("cs", "muj-clanek", null, toArticle)).toEqual({
      cs: "/clanky/muj-clanek",
    });
  });

  it("adds the counterpart from translation.metadata", () => {
    const paths = documentPaths(
      "cs",
      "muj-clanek",
      [
        { locale: "cs", path: "muj-clanek" },
        { locale: "en", path: "my-article" },
      ],
      toArticle,
    );

    expect(paths).toEqual({
      cs: "/clanky/muj-clanek",
      en: "/articles/my-article",
    });
  });

  it("ignores entries with no path and locales the site does not serve", () => {
    const paths = documentPaths(
      "cs",
      "muj-clanek",
      [
        { locale: "en", path: null },
        { locale: "de", path: "mein-artikel" },
      ],
      toArticle,
    );

    expect(paths).toEqual({ cs: "/clanky/muj-clanek" });
  });
});

describe("compact", () => {
  it("drops empty values at every depth and the keys holding them", () => {
    expect(
      compact({
        keep: "yes",
        zero: 0,
        no: "",
        blank: "   ",
        missing: undefined,
        nulled: null,
        emptyList: [],
        nested: { onlyEmpty: "" },
        list: [{ a: "" }, { b: "kept" }],
      }),
    ).toEqual({
      keep: "yes",
      zero: 0,
      list: [{ b: "kept" }],
    });
  });
});

describe("school structured data", () => {
  const base = {
    name: "Skolka Jedna",
    url: `${CS}/skupiny/skolka-jedna`,
  };

  it("is a ChildCare with the address and coordinates it has", () => {
    const data = schoolJsonLd({
      ...base,
      address: {
        street: "Nerudova 1",
        city: "Praha",
        postalCode: "11800",
        mapLocation: { lat: 50.088, lng: 14.4 },
      },
      regionName: "Praha",
      telephone: "+420 123 456 789",
    });

    expect(data).toMatchObject({
      "@context": "https://schema.org",
      "@type": "ChildCare",
      name: "Skolka Jedna",
      url: base.url,
      telephone: "+420 123 456 789",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nerudova 1",
        addressLocality: "Praha",
        postalCode: "11800",
        addressRegion: "Praha",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 50.088,
        longitude: 14.4,
      },
    });
  });

  it("omits geo entirely when the school has no map location", () => {
    const data = schoolJsonLd({
      ...base,
      address: { street: "Nerudova 1", mapLocation: undefined as never },
    });

    expect(data).not.toHaveProperty("geo");
  });

  it("omits address, telephone and email rather than emitting them empty", () => {
    const data = schoolJsonLd({ ...base, telephone: "", email: undefined });

    expect(Object.keys(data).sort()).toEqual([
      "@context",
      "@type",
      "name",
      "url",
    ]);
  });
});

describe("article structured data", () => {
  it("names the site as both author and publisher", () => {
    const data = articleJsonLd({
      headline: "Clanek",
      url: `${CS}/clanky/clanek`,
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: "2024-02-01T00:00:00Z",
      siteName: "Detske skupinky",
      siteUrl: CS,
    });

    expect(data).toMatchObject({
      "@type": "Article",
      headline: "Clanek",
      datePublished: "2024-01-01T00:00:00Z",
      dateModified: "2024-02-01T00:00:00Z",
      author: { "@type": "Organization", name: "Detske skupinky", url: CS },
      publisher: { "@type": "Organization", name: "Detske skupinky", url: CS },
    });
  });
});

describe("breadcrumb structured data", () => {
  it("numbers the trail from one, in order", () => {
    const data = breadcrumbJsonLd([
      { name: "Domu", url: CS },
      { name: "Praha", url: `${CS}/katalog/cesko/praha` },
    ]);

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Domu",
          item: CS,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Praha",
          item: `${CS}/katalog/cesko/praha`,
        },
      ],
    });
  });

  it("emits nothing for a trail with only the current page in it", () => {
    expect(breadcrumbJsonLd([{ name: "Domu", url: CS }])).toBeNull();
  });
});

describe("website structured data", () => {
  it("uses the catalog's real search parameter", () => {
    const data = webSiteJsonLd({
      name: "Detske skupinky",
      url: CS,
      searchUrl: `${CS}/katalog/cesko`,
    }) as { potentialAction: { target: { urlTemplate: string } } };

    expect(data.potentialAction.target.urlTemplate).toBe(
      `${CS}/katalog/cesko?name={search_term_string}`,
    );
  });

  it("publishes no SearchAction when there is no catalog to search", () => {
    expect(
      webSiteJsonLd({ name: "Detske skupinky", url: CS }),
    ).not.toHaveProperty("potentialAction");
  });
});
