import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    gradients: Record<string, string>;
    custom: Record<string, string>;
    shadows: Record<string, string>;
  }

  interface PaletteOptions {
    gradients: Record<string, string>;
    custom: Record<string, string>;
    shadows: Record<string, string>;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    primary: true;
    secondary: true;
    ghost: true;
  }
}
