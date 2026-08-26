/**
 * The fixed dimensions a school card and its grid are built from.
 *
 * One module, imported by both `SchoolGridCard` and `CardGridSkeleton`, because
 * a skeleton that is a hand-copy of the real component's numbers is a skeleton
 * that drifts from it on the next padding change - and the whole point of the
 * skeleton is that swapping it for the real thing moves nothing on screen.
 *
 * Only the *fixed* parts are here. A card's total height is not fixed: the
 * bottom block is pushed down with `mt: auto` and grid rows stretch to the
 * tallest card in the row. What is fixed is every piece above that - the image
 * box, the two-line name, the tag row, the four-line summary - and those are
 * what the skeleton reproduces.
 */
export const SCHOOL_CARD = {
  /** Card frame. */
  padding: "20px",
  radius: "24px",
  gap: "13px",
  maxWidth: 280,

  /** The cover image, or the placeholder box in its place. */
  imageHeight: "158px",
  imageRadius: "12px",

  /** The provider logo beside the name. */
  logoSize: "30px",

  /** Two lines of an 18px bold name, clamped. */
  nameMinHeight: "54px",

  /**
   * One row of tags.
   *
   * A `minHeight` rather than a natural height: without it a school with no
   * tags collapses this row to nothing while a school with tags does not, so
   * two cards side by side disagree about where everything below starts.
   * Reserving the row is what makes a card's fixed section a known height,
   * which is what the skeleton needs. The value is one outlined `DataChip`:
   * 12px text on a 1.43 line-height, 2px of padding either side, 1px of
   * border.
   */
  tagRowMinHeight: "24px",
  tagGap: "5px",

  /** The location line: a 20px icon and one line of text. */
  locationHeight: "20px",
  locationMarginBottom: "13px",

  /** Four lines of the summary, clamped. */
  descriptionMinHeight: "100px",

  /** The full-width call to action. */
  ctaMarginTop: "13px",
  ctaHeight: "34px",
} as const;

/**
 * The catalog grid. Shared with `SchoolList` so the skeleton lays its cards out
 * in exactly the columns the real list will.
 */
export const SCHOOL_GRID = {
  templateColumns: {
    xs: "repeat(auto-fit, minmax(232px, 1fr))",
    md: "repeat(auto-fit, minmax(232px, 280px))",
  },
  gap: {
    xs: "20px",
    md: "24px",
  },
} as const;

/** How many placeholder cards a grid skeleton draws when nobody says. */
export const DEFAULT_SKELETON_CARDS = 9;
