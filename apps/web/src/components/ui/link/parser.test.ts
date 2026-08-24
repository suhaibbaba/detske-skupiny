import { describe, expect, it } from "vitest";
import {
  cleanUrl,
  parseLinkField,
  parseMultipleLinkFields,
  type SanityInternalLink,
} from "./parser";

/**
 * A dereferenced internal link, with only the fields a case cares about set.
 *
 * The generated union requires `_id`, `title` and `name` on every member and
 * closes `_type` to the document types the Studio actually has. The parser
 * reads none of the first three unless a case says so, and one case
 * deliberately passes an unknown `_type` to exercise the fallback branch - so
 * the widening lives here, in one helper, rather than at every call site.
 */
const internalLink = (fields: {
  _type: string;
  slug?: string;
  title?: string;
}): SanityInternalLink =>
  ({ _id: "doc-id", title: null, name: null, ...fields }) as SanityInternalLink;

describe("parseLinkField - external", () => {
  it("keeps an absolute https url", () => {
    const link = parseLinkField({ type: "external", url: "https://a.test/x" });
    expect(link.type).toBe("external");
    expect(link.url).toBe("https://a.test/x");
    expect(link.valid).toBe(true);
  });

  it("adds a protocol when one is missing", () => {
    expect(parseLinkField({ type: "external", url: "a.test" }).url).toBe(
      "https://a.test",
    );
  });

  it("falls back to href when url is absent", () => {
    expect(
      parseLinkField({ type: "external", href: "https://b.test" }).url,
    ).toBe("https://b.test");
  });

  it("opens in a new tab when blank is set", () => {
    expect(
      parseLinkField({ type: "external", url: "https://a.test", blank: true })
        .target,
    ).toBe("_blank");
  });

  it("defaults the target to _self", () => {
    expect(
      parseLinkField({ type: "external", url: "https://a.test" }).target,
    ).toBe("_self");
  });

  it("does not mark a malformed url valid", () => {
    // "https://" alone cannot be parsed by URL(), so the parse throws and the
    // url is left at its placeholder rather than being reported as valid.
    const link = parseLinkField({ type: "external", url: "https://" });
    expect(link.valid).toBe(false);
  });
});

describe("parseLinkField - internal", () => {
  it("routes a blog reference to the localized article path", () => {
    const link = parseLinkField(
      {
        type: "internal",
        internalLink: internalLink({ _type: "blogs", slug: "muj-clanek" }),
      },
      { locale: "cs" },
    );
    expect(link.type).toBe("internal");
    expect(link.url).toBe("/clanky/muj-clanek");
    expect(link.valid).toBe(true);
  });

  it("routes geography references into the catalog", () => {
    for (const type of ["countries", "regions", "areas", "subareas"]) {
      const link = parseLinkField(
        {
          type: "internal",
          internalLink: internalLink({ _type: type, slug: "praha" }),
        },
        { locale: "cs" },
      );
      expect(link.url).toBe("/katalog/praha");
    }
  });

  it("routes a school reference to the group detail path", () => {
    expect(
      parseLinkField(
        {
          type: "internal",
          internalLink: internalLink({ _type: "schools", slug: "skolka" }),
        },
        { locale: "cs" },
      ).url,
    ).toBe("/skupiny/skolka");
  });

  it("routes singleton references to their pages", () => {
    const at = (type: string) =>
      parseLinkField(
        {
          type: "internal",
          internalLink: internalLink({ _type: type, slug: "" }),
        },
        { locale: "cs" },
      ).url;

    expect(at("contactUs")).toBe("/kontakt");
    expect(at("group")).toBe("/skupiny");
    expect(at("home")).toBe("/");
    expect(at("preschool")).toBe("/spoluprace");
  });

  it("honours the locale option", () => {
    expect(
      parseLinkField(
        {
          type: "internal",
          internalLink: internalLink({ _type: "blogs", slug: "p" }),
        },
        { locale: "en" },
      ).url,
    ).toBe("/articles/p");
  });

  it("falls back to home for an unknown document type", () => {
    expect(
      parseLinkField(
        {
          type: "internal",
          internalLink: internalLink({ _type: "mystery", slug: "x" }),
        },
        { locale: "cs" },
      ).url,
    ).toBe("/");
  });

  it("still produces a path when the slug is missing", () => {
    const link = parseLinkField(
      { type: "internal", internalLink: internalLink({ _type: "blogs" }) },
      { locale: "cs" },
    );
    expect(link.url).toBe("/clanky");
  });

  it("is not valid when internal links are disallowed", () => {
    const link = parseLinkField(
      {
        type: "internal",
        internalLink: internalLink({ _type: "blogs", slug: "x" }),
      },
      { allowInternal: false },
    );
    expect(link.valid).toBe(false);
  });
});

describe("parseLinkField - mailto and tel", () => {
  it("builds a mailto url", () => {
    const link = parseLinkField({ type: "email", email: "a@b.cz" });
    expect(link.type).toBe("email");
    expect(link.url).toBe("mailto:a@b.cz");
    expect(link.valid).toBe(true);
  });

  it("reads the address out of an existing mailto href", () => {
    expect(parseLinkField({ type: "email", href: "mailto:a@b.cz" }).url).toBe(
      "mailto:a@b.cz",
    );
  });

  it("rejects a malformed address", () => {
    expect(parseLinkField({ type: "email", email: "not-an-email" }).valid).toBe(
      false,
    );
  });

  it("builds a tel url", () => {
    const link = parseLinkField({ type: "phone", phone: "+420 123 456 789" });
    expect(link.type).toBe("phone");
    expect(link.url).toBe("tel:+420 123 456 789");
    expect(link.valid).toBe(true);
  });

  it("strips characters that are not valid in a phone number", () => {
    expect(parseLinkField({ type: "phone", phone: "+420abc123" }).url).toBe(
      "tel:+420123",
    );
  });

  it("is not valid when the phone number is empty after cleaning", () => {
    expect(parseLinkField({ type: "phone", phone: "abc" }).valid).toBe(false);
  });
});

describe("parseLinkField - empty and malformed input", () => {
  it("returns an empty link for null", () => {
    const link = parseLinkField(null);
    expect(link.type).toBe("empty");
    expect(link.valid).toBe(false);
    expect(link.errors).toContain("No link data provided");
  });

  it("returns an empty link for undefined", () => {
    expect(parseLinkField(undefined).type).toBe("empty");
  });

  it("returns an empty link for a non-object", () => {
    expect(parseLinkField("nope" as never).type).toBe("empty");
  });

  it("reports an unknown type for an object with no type", () => {
    const link = parseLinkField({ text: "just text" });
    expect(link.type).toBe("unknown");
  });

  it("KNOWN ODDITY: an unknown type is still reported valid", () => {
    // No branch runs for "unknown", so `url` keeps its placeholder - a single
    // space - which is truthy, so validateLink() sees a url and passes. The
    // caller therefore gets valid:true with href=" ".
    // Pinned as-is so a deliberate fix shows up here as a failing test.
    const link = parseLinkField({ text: "just text" });
    expect(link.url).toBe(" ");
    expect(link.valid).toBe(true);
  });

  it("carries text and title through", () => {
    const link = parseLinkField({
      type: "external",
      url: "https://a.test",
      text: "Click me",
    });
    expect(link.text).toBe("Click me");
    expect(link.title).toBe("Click me");
  });

  it("falls back to the referenced document title for text", () => {
    const link = parseLinkField({
      type: "internal",
      internalLink: internalLink({
        _type: "blogs",
        slug: "x",
        title: "Doc title",
      }),
    });
    expect(link.text).toBe("Doc title");
  });

  it("is invalid when text is required but absent", () => {
    const link = parseLinkField(
      { type: "external", url: "https://a.test" },
      { requireText: true },
    );
    expect(link.valid).toBe(false);
    expect(link.errors).toContain("Link text is required");
  });
});

describe("parseMultipleLinkFields", () => {
  it("parses each entry", () => {
    const links = parseMultipleLinkFields([
      { type: "external", url: "https://a.test" },
      { type: "email", email: "a@b.cz" },
    ]);
    expect(links).toHaveLength(2);
    expect(links[0].type).toBe("external");
    expect(links[1].type).toBe("email");
  });

  it("returns an empty array for a non-array", () => {
    expect(parseMultipleLinkFields(null as never)).toEqual([]);
  });

  it("keeps empty links in place rather than dropping them", () => {
    const links = parseMultipleLinkFields([
      null,
      { type: "email", email: "a@b.cz" },
    ]);
    expect(links).toHaveLength(2);
    expect(links[0].type).toBe("empty");
  });
});

describe("cleanUrl", () => {
  it("strips protocol, www and a trailing slash", () => {
    expect(cleanUrl("https://www.example.com/")).toBe("example.com");
  });

  it("keeps the path", () => {
    expect(cleanUrl("http://example.com/a/b")).toBe("example.com/a/b");
  });

  it("returns an empty string for empty or non-string input", () => {
    expect(cleanUrl("")).toBe("");
    expect(cleanUrl(undefined as never)).toBe("");
  });
});
