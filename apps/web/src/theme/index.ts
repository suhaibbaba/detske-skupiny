"use client";

import { createTheme } from "@mui/material/styles";
import { baseTheme } from "@/theme/palette";
import { typography } from "@/theme/typography";
import { components } from "@/theme/components";
import { custom } from "@/theme/custom";

/**
 * The theme, composed from three modules.
 *
 * One module per concern: the colour and breakpoint scale, the type scale, and
 * the per-component overrides. `createTheme` runs in two steps because the
 * overrides read colours back off `baseTheme`, so the palette has to be a
 * finished theme before they run.
 */
const theme = createTheme(baseTheme, { typography, components, custom });

export default theme;
