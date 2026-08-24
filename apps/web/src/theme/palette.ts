import { createTheme } from "@mui/material/styles";
import { BREAKPOINTS } from "@/constants";

/**
 * The palette, the breakpoints and the CSS-variable switch.
 *
 * Built as its own theme rather than as a plain options object because the
 * component overrides in theme/components.ts read colours back off it -
 * `baseTheme.palette.primary.main` and friends - which needs a finished theme,
 * not the options that describe one.
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
    gradients: {
      ui1: "linear-gradient(180deg, #F8F2FE 0%,  #F8F2FE 45%, #FCF8E5 100%)",
      ui2: "linear-gradient(90deg, #F9F4F6 0%, #FCF7E8 100%)",
      ui3: "linear-gradient(90deg, #FCF8E5 0%, #F8F2FE 100%)",
    },
    custom: {
      ui1: "#1E232B",
      ui2: "#848C99",
      ui3: "#6C7685",
      ui4: "#9980B0",
      ui5: "#F3E8FD",
      ui6: "#FACA15",
      ui7: "#FCF7D5",
      ui8: "#2B3746",
      ui9: "#FFFEF9",
      ui10: "#C5A4E2",
      ui11: "#776388",
      ui12: "#C6CAD0",
      ui13: "#272E39",
      ui14: "#E5CDFA",
      ui15: "#FDF9E2",
      ui16: "#0F1724",
      ui17: "#EDDDFC",
      ui18: "#AAB0B9",
      ui19: "#8A866A",
      ui20: "#475467",
    },
    shadows: {
      ui1: "0px 4px 6px 0px #0000000D, 0px 10px 15px -3px  #0000001A",
    },
    common: {
      black: "#000000",
      white: "#FFFFFF",
    },
  },
});
