import type { ThemeOptions } from "@mui/material/styles";
import { nunitoFontFamily } from "@/fonts/nunito";
import { autoClamp } from "@/utils/strings";

/** The type scale. */
export const typography: ThemeOptions["typography"] = {
  fontFamily: nunitoFontFamily,
  body1: {
    color: "#6C7685",
  },
  h1: {
    color: "#272E39",
    fontWeight: 900,
    fontSize: autoClamp({
      desktop: 48,
      tablet: 40,
      mobile: 36,
    }),
    marginBottom: "20px",
  },
  h2: {
    color: "#272E39",
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
    color: "#272E39",
    fontWeight: 600,
    fontSize: 24,
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  h4: {
    color: "#272E39",
    fontWeight: 600,
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: "20px",
  },
};
