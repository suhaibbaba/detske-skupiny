/**
 * Design tokens that are not colours.
 *
 * These used to sit on `palette.gradients` and `palette.shadows`. The palette
 * is where MUI mints a CSS variable per leaf, so every call site reached for
 * one by string - `var(--mui-palette-shadows-ui1)` - which no compiler checks
 * and no rename can follow. As ordinary values they are read by name, so a
 * typo is a build error.
 *
 * The values are byte-identical to what `palette` held; only the names and the
 * way call sites reach them changed.
 *
 * **Import this module directly from a Server Component; do not reach them
 * through `sx={(theme) => ...}` there.** `createTheme` merges this object onto
 * the theme, so `theme.custom` is the same data - but every MUI component is a
 * Client Component, and a function anywhere in `sx` is a value React cannot
 * serialise across that boundary ("Functions cannot be passed directly to
 * Client Components"). These are plain constants precisely so a server module
 * can read them without a callback. `theme.custom` stays the right way in for
 * client modules and `styled()`.
 */
export const custom = {
  /** Full-bleed page washes, named for the direction and the two stops. */
  gradients: {
    /** Vertical, lilac holding for half the page then falling to cream. */
    pageLilacToCream:
      "linear-gradient(180deg, #F8F2FE 0%,  #F8F2FE 45%, #FCF8E5 100%)",
    /** Horizontal, blush to cream. */
    pageBlushToCream: "linear-gradient(90deg, #F9F4F6 0%, #FCF7E8 100%)",
    /** Horizontal, cream to lilac. */
    pageCreamToLilac: "linear-gradient(90deg, #FCF8E5 0%, #F8F2FE 100%)",
  },
  shadows: {
    /** The one elevation this design uses: cards, maps, the category bar. */
    card: "0px 4px 6px 0px #0000000D, 0px 10px 15px -3px  #0000001A",
  },
  zIndex: {
    /**
     * The skip link, one step above MUI's topmost layer.
     *
     * A literal rather than `theme.zIndex.tooltip + 1` because the only
     * element that uses it renders on the server, where a `(theme) => ...`
     * callback cannot cross into `Box`. MUI does not export its zIndex scale
     * as a value - only the `ZIndex` type - so the arithmetic is written out
     * here and `custom.test.ts` fails the build if the scale ever moves under
     * it.
     */
    skipLink: 1501,
  },
} as const;

export type CustomTokens = typeof custom;
