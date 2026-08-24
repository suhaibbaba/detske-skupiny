import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Image from "./Image";

// Sanity's image-url builder parses its input as a real asset ref, so these
// have to be well-formed ids rather than arbitrary urls.
const REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";
const DEFAULT_REF = "image-aaaaaaaaaaaaaaaaaaaaaaaa-1200x800-png";
const CDN_URL =
  "https://cdn.sanity.io/images/p/d/Tb9Ew8CXIwaY6R1kjMvI0uRR-800x600.png";

vi.mock("@/providers", () => ({
  useDefaultImage: () => DEFAULT_REF,
}));

const img = (container: HTMLElement) => container.querySelector("img")!;

describe("Image", () => {
  it("renders an img element", () => {
    render(<Image src={REF} alt="Školka Praha" />);
    expect(screen.getByRole("img", { name: "Školka Praha" }).tagName).toBe(
      "IMG",
    );
  });

  it("always has an alt attribute, even when none is passed", () => {
    // The component defaults alt to "" so an undecorated image is treated as
    // decorative rather than shipping an img with no alt at all.
    // eslint-disable-next-line jsx-a11y/alt-text -- the omission is the point
    const { container } = render(<Image src={REF} />);
    expect(img(container)).toHaveAttribute("alt");
  });

  it("uses the provided alt text", () => {
    render(<Image src={REF} alt="Dětská skupina Ďáblice" />);
    expect(screen.getByAltText("Dětská skupina Ďáblice")).toBeInTheDocument();
  });

  it("builds a Sanity CDN url from the asset ref", () => {
    const { container } = render(<Image src={REF} alt="x" />);
    expect(img(container).getAttribute("src")).toContain("cdn.sanity.io");
  });

  it("falls back to the default image when no src is given", () => {
    const { container } = render(<Image alt="fallback" />);
    expect(img(container).getAttribute("src")).toContain(
      "aaaaaaaaaaaaaaaaaaaaaaaa",
    );
  });

  /**
   * The reason this component exists. An `<img>` with no dimensions occupies
   * no space until it loads and then shoves everything below it down; the
   * numbers come out of the asset id, so no call site has to supply them.
   */
  describe("layout stability", () => {
    it("takes width and height from the asset ref", () => {
      const { container } = render(<Image src={REF} alt="x" />);
      expect(img(container)).toHaveAttribute("width", "2000");
      expect(img(container)).toHaveAttribute("height", "3000");
    });

    it("takes them from a CDN url too", () => {
      const { container } = render(<Image src={CDN_URL} alt="x" />);
      expect(img(container)).toHaveAttribute("width", "800");
      expect(img(container)).toHaveAttribute("height", "600");
    });

    it("keeps the aspect ratio when only one dimension is given", () => {
      // 2000x3000 asked to be 200 wide is 300 tall, not 3000.
      const { container } = render(<Image src={REF} alt="x" width={200} />);
      expect(img(container)).toHaveAttribute("width", "200");
      expect(img(container)).toHaveAttribute("height", "300");
    });

    it("honours explicit dimensions over the asset's own", () => {
      const { container } = render(
        <Image src={REF} alt="x" width={64} height={64} />,
      );
      expect(img(container)).toHaveAttribute("width", "64");
      expect(img(container)).toHaveAttribute("height", "64");
    });

    it("renders a filled image with no width or height attribute", () => {
      const { container } = render(<Image src={REF} alt="x" fill />);
      expect(img(container)).not.toHaveAttribute("width");
      expect(img(container)).not.toHaveAttribute("height");
    });

    it("keeps the aspect ratio when CSS sizes only one axis", () => {
      /*
       * The regression this guards: `next/image` writes the intrinsic width
       * and height onto the element, so CSS that sets only `width` leaves the
       * height at the attribute value. A 1600x900 logo styled `width: 120px`
       * rendered 120 wide and 900 tall. The component's base `sx` sets
       * `height: auto` so the browser derives it instead.
       */
      const { container } = render(
        <Image src={REF} alt="x" sx={{ width: "120px" }} />,
      );

      // The attributes still carry the intrinsic size - that is what reserves
      // the space - but the resolved style must not let the height stand.
      expect(img(container)).toHaveAttribute("height", "3000");
      expect(img(container)).toHaveStyle({ height: "auto", width: "120px" });
    });

    it("still renders when the source carries no dimensions", () => {
      // A local file has no size in its name. Rather than throwing - which is
      // what `next/image` does without dimensions - it becomes a responsive
      // image the browser sizes from CSS.
      const { container } = render(<Image src="/og-default.png" alt="x" />);
      expect(img(container)).toBeInTheDocument();
      expect(img(container).getAttribute("src")).toContain("og-default");
    });
  });

  describe("loading", () => {
    it("lazy-loads by default", () => {
      const { container } = render(<Image src={REF} alt="x" />);
      expect(img(container)).toHaveAttribute("loading", "lazy");
    });

    it("drops lazy loading for a priority image", () => {
      const { container } = render(<Image src={REF} alt="x" priority />);
      // `next/image` marks a priority image by removing the lazy hint and
      // emitting a preload link; the fetchpriority attribute is a browser
      // detail it does not always render, so the absence of lazy is the
      // assertion that matters here.
      expect(img(container)).not.toHaveAttribute("loading", "lazy");
    });

    it("emits a srcset so a phone does not download the desktop file", () => {
      const { container } = render(
        <Image src={REF} alt="x" sizes="(max-width: 600px) 100vw, 400px" />,
      );
      const srcset = img(container).getAttribute("srcset") ?? "";
      expect(srcset).toContain("cdn.sanity.io");
      // Sanity's CDN does the resizing, so each candidate carries a width.
      expect(srcset).toMatch(/w=\d+/);
    });
  });
});
