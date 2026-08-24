import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test/utils";
import CardGridSkeleton from "@/components/ui/skeleton/CardGridSkeleton";
import {
  DEFAULT_SKELETON_CARDS,
  SCHOOL_CARD,
  SCHOOL_GRID,
} from "@/components/ui/skeleton/geometry";

const grid = () =>
  document.querySelector("[data-test-selector='CardGridSkeleton']");

/**
 * The skeleton's whole job is to be the same size as the thing it stands in
 * for, so what is worth asserting is the coupling: it draws a card per slot,
 * and it takes its geometry from the module `SchoolGridCard` and `SchoolList`
 * read too rather than from numbers of its own.
 */
describe("CardGridSkeleton", () => {
  it("draws one placeholder card per slot", () => {
    renderWithIntl(<CardGridSkeleton />);

    expect(grid()).not.toBeNull();
    expect(grid()!.children).toHaveLength(DEFAULT_SKELETON_CARDS);
  });

  it("honours an explicit count", () => {
    renderWithIntl(<CardGridSkeleton count={3} />);

    expect(grid()!.children).toHaveLength(3);
  });

  it("is hidden from assistive technology while it stands in for content", () => {
    renderWithIntl(<CardGridSkeleton />);

    expect(grid()!.getAttribute("aria-hidden")).toBe("true");
    expect(grid()!.getAttribute("aria-busy")).toBe("true");
  });

  it("reproduces the real card's fixed dimensions", () => {
    renderWithIntl(<CardGridSkeleton count={1} />);

    const card = grid()!.firstElementChild as HTMLElement;
    const image = card.firstElementChild as HTMLElement;

    // Read back off the DOM rather than compared to the constant, so this
    // fails if the card stops applying the shared geometry as well as if the
    // geometry itself changes.
    expect(getComputedStyle(image).height).toBe(SCHOOL_CARD.imageHeight);
    expect(getComputedStyle(card).padding).toBe(SCHOOL_CARD.padding);
    expect(getComputedStyle(card).gap).toBe(SCHOOL_CARD.gap);
    // The grid's own gap and columns are responsive, and jsdom does not apply
    // media queries in `getComputedStyle`, so those are covered by the e2e
    // check on the real page instead - see catalog.spec.ts.
    expect(SCHOOL_GRID.gap.md).toBe("24px");
  });
});
