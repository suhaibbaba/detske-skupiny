import { createTheme } from "@mui/material/styles";
import { BREAKPOINTS } from "@/constants";

/**
 * The extra colours.
 *
 * Every key below is named for the job it does at its call sites, not for a
 * position in a scale, so picking one does not mean grepping for a hex.
 *
 * Several are held to a WCAG AA threshold against the surfaces they actually
 * render on. The pairs and the arithmetic are in theme/contrast.ts, and
 * theme/contrast.test.ts fails the build if any of them drifts under.
 *
 * Declared out here rather than inline in `createTheme` so the augmentation in
 * theme.d.ts can name its type. Inline, that type would have to be read off
 * the theme these very values build, which is a circularity TypeScript
 * refuses.
 */
const customPalette = {
  /** Near-black label: outlined/ghost button text, catalog and school tags. */
  labelStrong: "#1E232B",
  /**
   * Input outlines and the search icon.
   *
   * An input's outline is what says there is an input there, so WCAG 1.4.11
   * applies: it has to clear 3:1 against the lilac page wash, not just against
   * white.
   *
   * Outlines only. Text needs 4.5, which this cannot meet without becoming much
   * darker than an input outline should be - the breadcrumb trail and every
   * other run of text read `textBody`.
   */
  inputBorder: "#808896",
  /**
   * Body copy, and the placeholder text that matches it.
   *
   * Held to 4.5:1 against the tinted surfaces body copy actually renders on -
   * the lilac panel behind the blog section and the home page's own wash - not
   * just against white. The full-bleed gradients mean most body text is not on
   * white at all.
   */
  textBody: "#626C79",
  /**
   * The focused input outline - still the same purple as `primary.main`, so it
   * moved with it. As a focus indicator it needs 3:1 against what surrounds it
   * (WCAG 1.4.11), and the lilac panel is the tightest surface it sits on.
   */
  inputBorderFocused: "#886AA3",
  /** Pale lilac panel: the blog section, category pills. */
  surfaceLilac: "#F3E8FD",
  /** Rating stars. */
  star: "#FACA15",
  /** Pale cream panel: the portals cards, the school offer block. */
  surfaceCream: "#FCF7D5",
  /** The pricing plan heading, a shade softer than `textHeading`. */
  textHeadingSoft: "#2B3746",
  /**
   * Lilac accent: the pricing figure, the selected-filter check.
   *
   * Held to the large-text threshold on white: the pricing figure is the
   * largest thing on that card, and this is the only colour it is drawn in.
   */
  accentLilac: "#AA7AD5",
  /** Muted purple text: filter labels, blog tags, the map card border. */
  textLilac: "#776388",
  /** Hairlines between cards and rows. */
  divider: "#C6CAD0",
  /** Every section and card heading - the same ink as `typography.h1`. */
  textHeading: "#272E39",
  /** Lilac hairline and the tint behind a selected filter. */
  borderLilac: "#E5CDFA",
  /** Sand panel behind the article meta block. */
  surfaceSand: "#FDF9E2",
  /** Label on the secondary (cream) button and the "read now" pill. */
  labelOnSecondary: "#0F1724",
  /** Ghost button hover fill and its border. */
  ghostHover: "#EDDDFC",
  /**
   * Quiet outline: the search bar, the filter sidebar, school cards.
   *
   * Same 1.4.11 reasoning as `inputBorder`: the search bar is a box drawn
   * entirely by this hairline, so it has to clear 3:1.
   */
  borderSubtle: "#868E9B",
  /** Label on a cream badge. */
  labelOnCream: "#8A866A",
  /** Secondary text: filter values, chips, the school page meta row. */
  textSecondary: "#475467",
};

export type CustomPalette = typeof customPalette;

/**
 * The palette, the breakpoints and the CSS-variable switch.
 *
 * Built as its own theme rather than as a plain options object because the
 * component overrides in theme/components.ts read colours back off it -
 * `baseTheme.palette.primary.main` and friends - which needs a finished theme,
 * not the options that describe one.
 *
 * The gradients and the card shadow are deliberately not here. They are not
 * palette colours, and under `palette` MUI would mint a CSS variable for each,
 * leaving call sites to reach for them by string. They sit on `theme.custom`;
 * see theme/custom.ts.
 */
export const baseTheme = createTheme({
  cssVariables: true,
  breakpoints: {
    values: {
      ...BREAKPOINTS,
    },
  },
  palette: {
    /**
     * `main` has to clear WCAG AA in both directions at once: white on it
     * (every primary CTA on the site) and it on white (the "show more" filter
     * link, the desktop nav hover). This is the brand purple darkened enough in
     * lightness - same hue, same saturation - to clear 4.5 both ways without
     * reading as a different colour.
     */
    primary: {
      main: "#886AA3",
      light: "#FBF8FE",
      dark: "#5B4C68",
    },
    secondary: {
      main: "#FDFBEB",
      dark: "#B2AD88",
      light: "#FAF3C0",
    },
    custom: customPalette,
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
  },
});
