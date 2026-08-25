import { describe, expect, it } from "vitest";
import theme from "@/theme";
import { custom } from "@/theme/custom";

describe("custom tokens", () => {
  /**
   * `custom.zIndex.skipLink` is a literal because its call site is a Server
   * Component and cannot read the theme through an `sx` callback. That makes
   * it the one token whose relationship to MUI's own scale is written down
   * rather than computed, so it is the one that can silently drift - either
   * because MUI moves `tooltip` or because this app starts overriding
   * `zIndex`. Either would put the skip link back underneath something.
   */
  it("puts the skip link one step above the theme's topmost layer", () => {
    expect(custom.zIndex.skipLink).toBe(theme.zIndex.tooltip + 1);
  });

  /** The theme is what every client module reads these back off. */
  it("is merged onto the theme unchanged", () => {
    expect(theme.custom).toEqual(custom);
  });
});
