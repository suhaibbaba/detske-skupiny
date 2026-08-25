"use client";

import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

/**
 * The heading above a filter group.
 *
 * Three components rendered this: the catalog's tag list, its category list,
 * and the generic filter list. All three repeated the same five declarations
 * and differed only in the space below, which is what `dense` is for.
 *
 * A `styled` component rather than a shared `sx` object because that is what a
 * repeated *look* is - one element with a name - and a call site's own `sx`
 * still wins over it if a fourth heading ever needs to differ.
 *
 * `"use client"` because `styled()` is Emotion, and Emotion's `styled` is a
 * client module - a server module that calls it throws. MUI's `Typography`
 * already carries the directive, so the boundary is where it was; a server
 * component renders this freely and its children stay server-rendered. See
 * docs/client-surface.md.
 */
const SectionHeading = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "dense",
})<{ dense?: boolean }>(({ theme, dense }) => ({
  color: theme.palette.custom.textHeading,
  fontWeight: 900,
  fontSize: "18px",
  marginBottom: dense ? "8px" : "16px",
}));

export default SectionHeading;
