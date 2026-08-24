import { createTheme } from "@mui/material/styles";
import { BREAKPOINTS } from "@/constants";

/**
 * The extra colours.
 *
 * `palette.custom` used to be `ui1` through `ui20`: twenty names that said
 * nothing about what a colour was for, so picking one meant grepping for the
 * hex. Every key below is named for the job it does at its call sites - the
 * old-to-new mapping is in the pull request description. No hex changed, and
 * `ui9` is gone because nothing referenced it.
 *
 * Declared out here rather than inline in `createTheme` so the augmentation in
 * theme.d.ts can name its type. Inline, that type would have to be read off
 * the theme these very values build, which is a circularity TypeScript
 * refuses.
 */
const customPalette = {
  /** Near-black label: outlined/ghost button text, catalog and school tags. */
  labelStrong: "#1E232B",
  /** Input outlines, the breadcrumb trail, the search icon. */
  inputBorder: "#848C99",
  /** Body copy, and the placeholder text that matches it. */
  textBody: "#6C7685",
  /** The focused input outline - the same purple as `primary.main`. */
  inputBorderFocused: "#9980B0",
  /** Pale lilac panel: the blog section, category pills. */
  surfaceLilac: "#F3E8FD",
  /** Rating stars. */
  star: "#FACA15",
  /** Pale cream panel: the portals cards, the school offer block. */
  surfaceCream: "#FCF7D5",
  /** The pricing plan heading, a shade softer than `textHeading`. */
  textHeadingSoft: "#2B3746",
  /** Lilac accent for links and notes inside filters and pricing. */
  accentLilac: "#C5A4E2",
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
  /** Quiet outline: the search bar, the filter sidebar, school cards. */
  borderSubtle: "#AAB0B9",
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
    primary: {
      main: "#9980B0",
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
