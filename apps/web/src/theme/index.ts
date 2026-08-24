"use client";

import { createTheme } from "@mui/material/styles";
import { baseTheme } from "@/theme/palette";
import { typography } from "@/theme/typography";
import { components } from "@/theme/components";

/**
 * The theme, composed from three modules.
 *
 * Split because one 400-line file mixed three unrelated concerns: the colour
 * and breakpoint scale, the type scale, and per-component overrides. The
 * two-step `createTheme` is unchanged - the overrides read colours back off
 * `baseTheme`, so the palette has to be a finished theme before they run.
 */
const theme = createTheme(baseTheme, { typography, components });

export default theme;
