/**
 * WCAG contrast maths, and the pairs the design actually puts on screen.
 *
 * Contrast is the one accessibility property that needs no browser to check:
 * it is a pure function of two hex values, so it can be a unit test rather than
 * an axe run that needs a server and Sanity credentials. A one-off audit is
 * true on the day someone runs it; this fails the build the day someone
 * lightens a token.
 *
 * The pairs in `CONTRAST_PAIRS` are not every possible combination. They are
 * the ones traced to a call site - which element renders in this colour, on
 * what background - because a matrix of every token against every other token
 * would be mostly meaningless and would fail on pairs that never meet.
 */

/** Relative luminance, per WCAG 2.1 §relative-luminance. */
export function relativeLuminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => {
    const srgb = parseInt(value.slice(offset, offset + 2), 16) / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  });

  const [r, g, b] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Contrast ratio between two hex colours, 1 to 21. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * The thresholds, named for the WCAG success criterion that sets them.
 *
 * `largeText` is 18.66px bold or 24px plain and up - the sizes axe itself
 * switches on. `nonText` covers 1.4.11: the boundary of a control you have to
 * see to know the control is there, and a focus indicator.
 */
export const AA = {
  normalText: 4.5,
  largeText: 3,
  nonText: 3,
} as const;

export type ContrastPair = {
  /** Where this combination renders, precise enough to go and look at it. */
  where: string;
  foreground: string;
  background: string;
  minimum: number;
};

/**
 * Backgrounds a foreground colour can land on.
 *
 * The three gradient stops are in here because the page washes in
 * theme/custom.ts are full-bleed: body copy on the home, cooperation and
 * catalog pages sits on a tint, not on white, and a colour that clears 4.5
 * against white can be under it against #F3E8FD.
 */
const BG = {
  white: "#FFFFFF",
  surfaceLilac: "#F3E8FD",
  surfaceCream: "#FCF7D5",
  surfaceSand: "#FDF9E2",
  secondaryMain: "#FDFBEB",
  washLilac: "#F8F2FE",
  washCream: "#FCF8E5",
} as const;

/** Every background body copy can sit on. */
const READING_SURFACES = Object.values(BG);

/**
 * The audited pairs.
 *
 * Kept as data rather than written as assertions so the list reads as a record
 * of what is checked - `it.each` in the test file turns each entry into its own
 * named case, so a failure names the element rather than a line number.
 */
export const CONTRAST_PAIRS: ContrastPair[] = [
  ...READING_SURFACES.map((background) => ({
    where: `body copy, placeholders and accordion text (typography.body1) on ${background}`,
    foreground: "#626C79",
    background,
    minimum: AA.normalText,
  })),
  ...READING_SURFACES.map((background) => ({
    where: `every heading (typography.h1-h4) on ${background}`,
    foreground: "#272E39",
    background,
    minimum: AA.normalText,
  })),
  ...READING_SURFACES.map((background) => ({
    where: `secondary text: filter values, chips, school meta row on ${background}`,
    foreground: "#475467",
    background,
    minimum: AA.normalText,
  })),
  {
    where: "breadcrumb trail on the lilac page wash",
    foreground: "#626C79",
    background: BG.washLilac,
    minimum: AA.normalText,
  },
  {
    where: "filter labels and blog tags on the lilac surface",
    foreground: "#776388",
    background: BG.surfaceLilac,
    minimum: AA.normalText,
  },
  {
    where: "outlined/ghost button label and catalog tags on white",
    foreground: "#1E232B",
    background: BG.white,
    minimum: AA.normalText,
  },
  {
    where: "the pricing figure (44px/900, so large text) on white",
    foreground: "#AA7AD5",
    background: BG.white,
    minimum: AA.largeText,
  },
  {
    where: "the pricing figure on the cream wash",
    foreground: "#AA7AD5",
    background: BG.washCream,
    minimum: AA.largeText,
  },
  {
    where: "input outlines (1.4.11: the boundary identifies the control)",
    foreground: "#808896",
    background: BG.white,
    minimum: AA.nonText,
  },
  {
    where: "input outlines on the lilac surface",
    foreground: "#808896",
    background: BG.surfaceLilac,
    minimum: AA.nonText,
  },
  {
    where: "search bar and filter sidebar outline on white",
    foreground: "#868E9B",
    background: BG.white,
    minimum: AA.nonText,
  },
  {
    where: "search bar and filter sidebar outline on the lilac wash",
    foreground: "#868E9B",
    background: BG.washLilac,
    minimum: AA.nonText,
  },
  {
    where: "the focus ring (1.4.11 focus indicator) on white",
    foreground: "#5B4C68",
    background: BG.white,
    minimum: AA.nonText,
  },
  {
    where: "the focus ring on the lilac surface, the darkest thing it lands on",
    foreground: "#5B4C68",
    background: BG.surfaceLilac,
    minimum: AA.nonText,
  },
  {
    where: "primary button label on its own fill",
    foreground: "#FFFFFF",
    background: "#886AA3",
    minimum: AA.normalText,
  },
  {
    where: "primary button label on the darker hover fill",
    foreground: "#FFFFFF",
    background: "#5B4C68",
    minimum: AA.normalText,
  },
  {
    where:
      "the school card's CTA label once the card fills on hover, white on the brand purple",
    foreground: "#FFFFFF",
    background: "#886AA3",
    minimum: AA.normalText,
  },
  {
    where:
      "the brand purple used as text: the filters' show-more link and the desktop nav hover, on white",
    foreground: "#886AA3",
    background: BG.white,
    minimum: AA.normalText,
  },
  {
    where: "the focused input outline (1.4.11) on the lilac panel",
    foreground: "#886AA3",
    background: BG.surfaceLilac,
    minimum: AA.nonText,
  },
  {
    where: "secondary button label on its cream fill",
    foreground: "#0F1724",
    background: "#FAF3C0",
    minimum: AA.normalText,
  },
];

/**
 * Pairs checked and deliberately left alone, with the reason.
 *
 * These are here so that "not checked" and "checked and exempt" are different
 * states, and so a later reader does not have to re-derive the argument. WCAG
 * 1.4.11 exempts decoration and anything whose information is also conveyed in
 * adjacent text; axe has no rule for either, so nothing here would be caught by
 * the gate.
 */
export const AUDITED_EXEMPT = [
  {
    token: "secondary.dark #B2AD88",
    ratioOnWhite: 2.28,
    where:
      "the search magnifier, the location pin beside an area name, the contact card icons, the chip icon",
    why: "Decorative icons, each adjacent to text carrying the same information. Darkening the token would also darken the secondary button's hover fill, which is a bigger visual change than the phase allows for no accessibility gain.",
  },
  {
    token: "divider #C6CAD0",
    ratioOnWhite: 1.65,
    where: "hairlines between cards, filter rows and blog categories",
    why: "Purely decorative separation. Nothing is identified by them and no information is lost without them.",
  },
  {
    token: "labelOnCream #8A866A",
    ratioOnWhite: 3.68,
    where: "the star glyph inside a school type badge",
    why: "A 13px decorative glyph beside the badge's own label; already clears 3:1 on white regardless.",
  },
  {
    token: "borderLilac #E5CDFA / accentLilac as a border",
    ratioOnWhite: 1.45,
    where: "the tint behind a selected filter, and hairline separators",
    why: "The selected state is also carried by a check icon and by the row's text colour, so the tint is reinforcement rather than the only signal.",
  },
] as const;
