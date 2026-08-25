import { createTheme } from "@mui/material/styles";
import { BREAKPOINTS } from "@/constants";

/**
 * The extra colours.
 *
 * `palette.custom` used to be `ui1` through `ui20`: twenty names that said
 * nothing about what a colour was for, so picking one meant grepping for the
 * hex. Every key below is named for the job it does at its call sites - the
 * old-to-new mapping is in the pull request description. `ui9` is gone because
 * nothing referenced it.
 *
 * Four of these were darkened for WCAG AA - `textBody`, `inputBorder`,
 * `accentLilac`, `borderSubtle` - each by the smallest step that clears the
 * threshold for the job it does, with the old value recorded on the line. The
 * pairs and the arithmetic are in theme/contrast.ts, and theme/contrast.test.ts
 * fails the build if any of them drifts back.
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
   * Was #848C99, which cleared 3:1 on white but not on the lilac page wash
   * (2.87). An input's outline is what says there is an input there, so
   * WCAG 1.4.11 applies to it.
   *
   * It used to colour the breadcrumb trail too, which is text and needs 4.5 -
   * a bar this colour cannot meet without becoming much darker than an input
   * outline should be. The breadcrumbs read `textBody` now, which is what they
   * always should have used.
   */
  inputBorder: "#808896",
  /**
   * Body copy, and the placeholder text that matches it.
   *
   * Was #6C7685, which cleared 4.5 on white by a hair (4.60) and missed it on
   * every tinted surface the site actually renders body copy on - 3.89 on the
   * lilac panel behind the blog section, 4.19 on the home page's own wash.
   * The full-bleed gradients mean most body text is not on white at all, so
   * this was the widest failure in the audit.
   */
  textBody: "#626C79",
  /**
   * The focused input outline - still the same purple as `primary.main`, so it
   * moved with it. As a focus indicator it needs 3:1 against what surrounds it
   * (WCAG 1.4.11), which #9980B0 missed on the lilac panel at 2.93.
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
   * Was #C5A4E2 at 2.15:1 on white - under the bar even for large text, and
   * the pricing figure is the largest thing on that card.
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
   * Was #AAB0B9 at 2.18:1. Same 1.4.11 reasoning as `inputBorder`: the search
   * bar is a box drawn entirely by this hairline.
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
 * The gradients and the card shadow are no longer here. They are not palette
 * colours, and living under `palette` meant MUI minted a CSS variable for each
 * and call sites reached for it by string. They sit on `theme.custom` now; see
 * theme/custom.ts.
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
     * `main` was #9980B0, the brand purple, and it failed WCAG AA in both
     * directions at once: white on it is 3.46:1 (every primary CTA on the
     * site), and it on white is the same 3.46:1 (the "show more" filter link,
     * the desktop nav hover). Darkening it 7% in lightness - same hue, same
     * saturation - clears 4.5 for both without the purple reading as a
     * different colour. `dark` and `light` were already fine and are unchanged.
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
