import { describe, expect, it } from "vitest";
import {
  AA,
  contrastRatio,
  CONTRAST_PAIRS,
  relativeLuminance,
} from "@/theme/contrast";
import { baseTheme } from "@/theme/palette";

/**
 * The contrast gate.
 *
 * `a11y.spec.ts` is the real gate for everything else axe checks, but it needs
 * a running site and therefore Sanity credentials. Contrast does not: it is
 * arithmetic on two hex values. So this runs in the unit suite, on every
 * commit, with no infrastructure - and it is the check most likely to catch a
 * regression, because lightening a colour is the sort of change that looks
 * harmless in review.
 */
describe("relativeLuminance", () => {
  it("matches the WCAG reference values at both ends", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });
});

describe("contrastRatio", () => {
  it("is 21:1 for black on white and symmetric", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
    expect(contrastRatio("#FFFFFF", "#000000")).toBeCloseTo(21, 5);
  });

  it("is 1:1 for a colour against itself", () => {
    expect(contrastRatio("#9980B0", "#9980B0")).toBeCloseTo(1, 5);
  });
});

describe("WCAG AA across the palette", () => {
  it.each(CONTRAST_PAIRS)(
    "$where meets $minimum:1",
    ({ foreground, background, minimum }) => {
      const ratio = contrastRatio(foreground, background);

      expect(
        Number(ratio.toFixed(2)),
        `${foreground} on ${background} is ${ratio.toFixed(2)}:1, needs ${minimum}:1`,
      ).toBeGreaterThanOrEqual(minimum);
    },
  );
});

/**
 * The pairs above name their colours as literals, so that the file reads as a
 * record of what was checked. This is what keeps those literals honest: if a
 * token moves in palette.ts and nobody updates the audit, the audit is
 * checking a colour the site no longer renders, and that is worse than no
 * audit at all.
 */
describe("the audited colours are the ones the theme ships", () => {
  const { custom, primary, secondary } = baseTheme.palette;

  it.each([
    ["textBody", custom.textBody, "#626C79"],
    ["textHeading", custom.textHeading, "#272E39"],
    ["textSecondary", custom.textSecondary, "#475467"],
    ["textLilac", custom.textLilac, "#776388"],
    ["labelStrong", custom.labelStrong, "#1E232B"],
    ["labelOnSecondary", custom.labelOnSecondary, "#0F1724"],
    ["accentLilac", custom.accentLilac, "#AA7AD5"],
    ["inputBorder", custom.inputBorder, "#808896"],
    ["inputBorderFocused", custom.inputBorderFocused, "#886AA3"],
    ["borderSubtle", custom.borderSubtle, "#868E9B"],
    ["primary.main", primary.main, "#886AA3"],
    ["primary.dark", primary.dark, "#5B4C68"],
    ["secondary.light", secondary.light, "#FAF3C0"],
  ])("%s is still %s", (_token, actual, audited) => {
    expect(actual.toUpperCase()).toBe(audited);
  });
});

describe("the thresholds are the WCAG AA ones", () => {
  it("does not drift from the standard", () => {
    expect(AA).toEqual({ normalText: 4.5, largeText: 3, nonText: 3 });
  });
});
