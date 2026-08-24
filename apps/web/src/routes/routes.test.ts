import { describe, expect, it } from "vitest";
import { getLocalizedRoutes } from "./routes";
import { defaultLocale } from "@/i18n/routing";

describe("getLocalizedRoutes", () => {
  it("uses cs as the default locale", () => {
    expect(defaultLocale).toBe("cs");
  });

  describe('locale "cs"', () => {
    const routes = getLocalizedRoutes("cs");

    it("localizes the static routes to Czech segments", () => {
      expect(routes.home).toBe("/");
      expect(routes.contactUs).toBe("/kontakt");
      expect(routes.groups).toBe("/skupiny");
      expect(routes.cooperation).toBe("/spoluprace");
    });

    it("localizes the articles index and detail", () => {
      expect(routes.article()).toBe("/clanky");
      expect(routes.article("muj-clanek")).toBe("/clanky/muj-clanek");
    });

    it("localizes group detail", () => {
      expect(routes.group("skolka-praha")).toBe("/skupiny/skolka-praha");
    });

    it("localizes catalog paths at every depth", () => {
      expect(routes.catalogs("ceska-republika")).toBe(
        "/katalog/ceska-republika",
      );
      expect(routes.catalogs("ceska-republika/praha/praha-4/podoli")).toBe(
        "/katalog/ceska-republika/praha/praha-4/podoli",
      );
    });

    it("returns home for a catalog with no slug", () => {
      expect(routes.catalogs()).toBe("/");
    });

    it("appends a query string when given one", () => {
      expect(routes.catalogs("praha", "page=2")).toBe("/katalog/praha?page=2");
    });

    it("tolerates a leading slash on the slug", () => {
      expect(routes.catalogs("/praha")).toBe("/katalog/praha");
      expect(routes.article("/muj-clanek")).toBe("/clanky/muj-clanek");
    });
  });

  describe('locale "en"', () => {
    const routes = getLocalizedRoutes("en");

    it("keeps the English segments", () => {
      expect(routes.home).toBe("/");
      expect(routes.contactUs).toBe("/contact-us");
      expect(routes.groups).toBe("/groups");
      expect(routes.cooperation).toBe("/cooperation");
      expect(routes.article()).toBe("/articles");
      expect(routes.article("my-post")).toBe("/articles/my-post");
      expect(routes.catalogs("czech-republic")).toBe("/catalog/czech-republic");
    });
  });

  describe("unknown locale", () => {
    const routes = getLocalizedRoutes("de");

    it("falls back to the English segments rather than throwing", () => {
      expect(routes.contactUs).toBe("/contact-us");
      expect(routes.groups).toBe("/groups");
      expect(routes.article("x")).toBe("/articles/x");
      expect(routes.catalogs("x")).toBe("/catalog/x");
    });
  });

  it("defaults to the Czech segments when no locale is passed", () => {
    const routes = getLocalizedRoutes();
    expect(routes.contactUs).toBe("/kontakt");
    expect(routes.article()).toBe("/clanky");
  });
});
