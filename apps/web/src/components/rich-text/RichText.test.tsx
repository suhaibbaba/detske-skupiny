import { describe, expect, it } from "vitest";
import type { SxProps, Theme } from "@mui/material/styles";
import { renderWithIntl } from "@/test/utils";
import RichText from "@/components/rich-text/RichText";
import type { SanityRichTextField } from "@/types";

const paragraph = [
  {
    _type: "block",
    _key: "a",
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "a1", text: "line one\nline two" }],
  },
] as unknown as SanityRichTextField;

const body = () => document.querySelector("p") as HTMLElement;

/**
 * `whiteSpace: "pre-line"` is what turns an author's Shift+Enter into a line
 * break, and it has to survive a caller passing its own `sx`.
 *
 * Two ways to lose it, both covered here: object-spreading `typographyProps.sx`
 * into the base, when an `sx` is just as legally an array or a callback; and
 * spreading `{...typographyProps}` onto the element after `sx={textSx}`, which
 * puts the caller's `sx` back and drops the base outright.
 * `PageHeadingTypography` passes an array, which is the shape that exposes
 * both.
 */
describe("RichText sx composition", () => {
  it("keeps pre-line when no sx is passed", () => {
    renderWithIntl(<RichText>{paragraph}</RichText>);
    expect(getComputedStyle(body()).whiteSpace).toBe("pre-line");
  });

  it("keeps pre-line when the caller passes an sx object", () => {
    renderWithIntl(<RichText sx={{ fontSize: "12px" }}>{paragraph}</RichText>);
    const style = getComputedStyle(body());
    expect(style.whiteSpace).toBe("pre-line");
    expect(style.fontSize).toBe("12px");
  });

  it("keeps pre-line when the caller passes an sx array", () => {
    // The shape PageHeadingTypography's `compose` produces.
    const composed: SxProps<Theme> = [{ maxWidth: "854px" }, { mb: 0 }];
    renderWithIntl(<RichText sx={composed}>{paragraph}</RichText>);
    const style = getComputedStyle(body());
    expect(style.whiteSpace).toBe("pre-line");
    expect(style.maxWidth).toBe("854px");
  });
});
