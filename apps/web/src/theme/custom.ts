/**
 * Design tokens that are not colours.
 *
 * These used to sit on `palette.gradients` and `palette.shadows`. The palette
 * is where MUI mints a CSS variable per leaf, so every call site reached for
 * one by string - `var(--mui-palette-shadows-ui1)` - which no compiler checks
 * and no rename can follow. On `theme.custom` they are ordinary values that
 * `sx={(theme) => ...}` and `styled` read directly, so a typo is a build error.
 *
 * The values are byte-identical to what `palette` held; only the names and the
 * way call sites reach them changed.
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
} as const;

export type CustomTokens = typeof custom;
