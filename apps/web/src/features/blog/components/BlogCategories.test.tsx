import { describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/utils";
import BlogCategories from "@/features/blog/components/BlogCategories";
import type { BlogCategory } from "@/types";

vi.mock("next/navigation", () => ({
  usePathname: () => "/clanky",
  useRouter: () => ({ replace: () => {} }),
  useSearchParams: () => new URLSearchParams(),
}));

const categories = [
  { id: "1", name: "Tipy", slug: "tipy" },
  { id: "2", name: "Novinky", slug: "novinky" },
] as BlogCategory[];

/**
 * These pills spent a release rendering unstyled.
 *
 * The styles were spread onto `<Button>` as props - `{...styles.button}` -
 * which worked under MUI's old system props and does nothing in v9: every
 * declaration landed on the `<button>` as a bare HTML attribute
 * (`padding="10px 20px"`, `bgcolor="var(--mui-palette-common-white)"`) and
 * Emotion never saw any of it. It typechecked the whole time, because a JSX
 * spread is not excess-property checked.
 *
 * So these assert the two halves of that failure: that the declarations reach
 * CSS, and that nothing leaks onto the DOM node.
 */
describe("BlogCategories", () => {
  const pills = () => {
    const { container } = renderWithIntl(
      <BlogCategories categories={categories} categorySelected="tipy" />,
    );
    return [...container.querySelectorAll("button")];
  };

  it("styles the pills through sx rather than through DOM attributes", () => {
    for (const pill of pills()) {
      const style = getComputedStyle(pill);
      expect(style.maxWidth).toBe("230px");
      expect(style.padding).toBe("10px 20px");
      expect(style.borderRadius).toBe("24px");
    }
  });

  it("leaves no style declarations behind as HTML attributes", () => {
    const leaked = ["padding", "bgcolor", "maxwidth", "borderradius", "flex"];
    for (const pill of pills()) {
      for (const attribute of leaked) {
        expect(pill.hasAttribute(attribute)).toBe(false);
      }
    }
  });

  it("gives the selected pill and the rest different backgrounds", () => {
    const [all, tipy] = pills();
    // "tipy" is the selected one, so it keeps the theme's contained colours;
    // every other pill is the white variant.
    expect(getComputedStyle(all).backgroundColor).not.toBe(
      getComputedStyle(tipy).backgroundColor,
    );
  });
});
