import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
// Read as plain constants rather than through an `sx={(theme) => ...}`
// callback: this file is a Server Component and `Box` is a Client Component,
// so a function anywhere in `sx` - including as one key's value - is a value
// React cannot serialise across the boundary.
import { custom } from "@/theme/custom";
import { getTranslateServer } from "@/hooks/useTranslate";

/** The id on the `<main>` in app/[locale]/layout.tsx that this jumps to. */
export const MAIN_CONTENT_ID = "main-content";

/**
 * Visible only when focused, which is the whole trick.
 *
 * Not `display: none` and not `visibility: hidden` - either would take the
 * link out of the tab order, which is the one thing it must stay in. It is
 * positioned off the top of the viewport instead, and slides back into the
 * corner the moment it takes focus.
 *
 * `clip` and the 1px box are the belt-and-braces half of the same idea: some
 * screen readers announce an off-screen element's position oddly, and a
 * clipped 1px box is the shape every "visually hidden" recipe converged on.
 */
const styles = {
  link: {
    position: "absolute",
    left: "-9999px",
    top: 0,
    zIndex: custom.zIndex.skipLink,
    padding: "12px 20px",
    margin: "8px",
    borderRadius: "24px",
    backgroundColor: "common.white",
    color: "custom.textHeading",
    fontWeight: 600,
    fontSize: 16,
    textDecoration: "none",
    boxShadow: custom.shadows.card,
    "&:focus": {
      left: 0,
    },
  },
} satisfies Record<string, SxProps<Theme>>;

/**
 * The first thing in the tab order on every page.
 *
 * Every route opens with the same header - logo, five nav items, a language
 * switcher and a CTA - so without a bypass, reaching the content with a
 * keyboard costs eight or nine tab presses on every page. That is what
 * WCAG 2.4.1 asks for.
 *
 * It renders on the server and reads its label from the Sanity dictionary. If
 * the `skipToContent` key is missing, next-intl's fallback returns the key
 * itself, so the link reads "skipToContent" rather than disappearing - ugly,
 * but still functional and visible enough to be noticed.
 */
export default async function SkipLink() {
  const translate = await getTranslateServer();

  return (
    <Box component="a" href={`#${MAIN_CONTENT_ID}`} sx={styles.link}>
      {translate("skipToContent")}
    </Box>
  );
}
