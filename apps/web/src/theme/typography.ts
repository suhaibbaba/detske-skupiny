import type { ThemeOptions } from "@mui/material/styles";
import { nunitoFontFamily } from "@/fonts/nunito";
import { autoClamp } from "@/utils/strings";
import { baseTheme } from "@/theme/palette";

/**
 * The type scale.
 *
 * The colours are palette references, never hex literals, so `textBody` and
 * `textHeading` have one definition each and a colour change reaches the type
 * scale with everything else.
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
