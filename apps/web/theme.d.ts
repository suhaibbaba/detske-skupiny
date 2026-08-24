import "@mui/material/styles";
import type { CustomTokens } from "@/theme/custom";
import type { CustomPalette } from "@/theme/palette";

declare module "@mui/material/styles" {
  /**
   * The extra colours, typed from the palette itself rather than as
   * `Record<string, string>`.
   *
   * That widening is what let `custom.ui21` typecheck for a token that does
   * not exist. Deriving the type from theme/palette.ts means the names in
   * there are the only ones a call site can use.
   */
  interface Palette {
    custom: CustomPalette;
  }

  interface PaletteOptions {
    custom: CustomPalette;
  }

  /**
   * Gradients and the card shadow, off the palette.
   *
   * See theme/custom.ts for why they moved: they are not colours, and living
   * under `palette` meant every call site reached for a CSS variable by string.
   */
  interface Theme {
    custom: CustomTokens;
  }

  interface ThemeOptions {
    custom?: CustomTokens;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    ghost: true;
  }
}
