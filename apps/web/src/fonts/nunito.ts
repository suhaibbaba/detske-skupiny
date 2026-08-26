import localFont from "next/font/local";

/**
 * Nunito, self-hosted.
 *
 * Self-hosted rather than `next/font/google`, which reaches out to Google on
 * every cold compile: a network dependency in CI for two files that never
 * change. These are the same files Google serves, committed next to the code.
 *
 * # Why two files
 *
 * Google splits the family by script, and the split is not cosmetic for this
 * site: the `latin` subset covers á, í, ú, ý and é but **not** ě, š, č, ř, ž,
 * ů, ď, ť or ň. With `latin` alone, every one of those characters - which is to
 * say most Czech words - falls back to an operating-system font, next to Nunito
 * for the rest of the word. Both subsets are loaded.
 *
 * They stay two files rather than one merged file because the `unicode-range`
 * descriptors below let the browser skip a download it has no characters for.
 *
 * Both are the variable font, so `weight: "400 900"` covers the four weights
 * the theme actually asks for (400, 500, 600 and 900) out of one file each.
 *
 * Everything below is written out literally, including the two `unicode-range`
 * values copied verbatim from Google's own stylesheet. `next/font` is a
 * compile-time macro: it reads these call sites out of the source, so a shared
 * constant or a spread fails the build with "Font loader values must be
 * explicitly written literals".
 */

const nunitoLatin = localFont({
  src: "./nunito-latin.woff2",
  weight: "400 900",
  style: "normal",
  // Text stays visible while the file arrives; the body font blocking first
  // paint is a worse trade than one reflow.
  display: "swap",
  variable: "--font-nunito",
  // Metrics for the fallback face, so that reflow moves as little as possible.
  adjustFontFallback: "Arial",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

const nunitoLatinExt = localFont({
  src: "./nunito-latin-ext.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-nunito-ext",
  adjustFontFallback: "Arial",
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

/**
 * The class that declares both CSS variables. Goes on `<body>`.
 *
 * `className` is not used because each font's own class sets `font-family` to
 * that one family, and the last one applied would win - which is exactly the
 * bug this is fixing. The variables let both families be named in one
 * `font-family` list instead.
 */
export const nunitoClassName = `${nunitoLatin.variable} ${nunitoLatinExt.variable}`;

/**
 * The `font-family` value: both families, then a system fallback.
 *
 * Order does not decide which file a character comes from - the
 * `unicode-range` descriptors do that - but the list has to name both for
 * either to be reachable. Each `var()` carries the generated family name as
 * its own fallback, so a subtree that somehow misses the class above still
 * gets the font rather than an invalid declaration.
 */
export const nunitoFontFamily =
  `var(--font-nunito, ${nunitoLatin.style.fontFamily}), ` +
  `var(--font-nunito-ext, ${nunitoLatinExt.style.fontFamily}), ` +
  `Arial, sans-serif`;
