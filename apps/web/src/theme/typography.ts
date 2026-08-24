import type { ThemeOptions } from "@mui/material/styles";
import { nunitoFontFamily } from "@/fonts/nunito";
import { autoClamp } from "@/utils/strings";
import { baseTheme } from "@/theme/palette";

/**
 * The type scale.
 *
 * The colours were hex literals - `#6C7685` on body text and `#272E39` on
 * every heading - duplicating two palette entries that already held exactly
 * those values. They are palette references now, so `textBody` and
 * `textHeading` have one definition each and renaming a colour reaches the
 * type scale with everything else. No rendered colour changed.
 */
export const typography: ThemeOptions["typography"] = {
  fontFamily: nunitoFontFamily,
  body1: {
    color: baseTheme.palette.custom.textBody,
  },
  h1: {
    color: baseTheme.palette.custom.textHeading,
    fontWeight: 900,
    fontSize: autoClamp({
      desktop: 48,
      tablet: 40,
      mobile: 36,
    }),
    marginBottom: "20px",
  },
  h2: {
    color: baseTheme.palette.custom.textHeading,
    fontWeight: 600,
    fontSize: autoClamp({
      desktop: 32,
      tablet: 30,
      mobile: 28,
    }),
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  h3: {
    color: baseTheme.palette.custom.textHeading,
    fontWeight: 600,
    fontSize: 24,
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  h4: {
    color: baseTheme.palette.custom.textHeading,
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: "20px",
  },
};
