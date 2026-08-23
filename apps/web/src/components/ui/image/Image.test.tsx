import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Image from "./Image";

// Sanity's image-url builder parses its input as a real asset ref, so these
// have to be well-formed ids rather than arbitrary urls.
const REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";
const DEFAULT_REF = "image-aaaaaaaaaaaaaaaaaaaaaaaa-1200x800-png";

vi.mock("@/providers", () => ({
  useDefaultImage: () => DEFAULT_REF,
}));

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
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("alt");
  });

  it("uses the provided alt text", () => {
    render(<Image src={REF} alt="Dětská skupina Ďáblice" />);
    expect(screen.getByAltText("Dětská skupina Ďáblice")).toBeInTheDocument();
  });

  it("builds a Sanity CDN url from the asset ref", () => {
    const { container } = render(<Image src={REF} alt="x" />);
    expect(container.querySelector("img")?.getAttribute("src")).toContain(
      "cdn.sanity.io",
    );
  });

  it("falls back to the default image when no src is given", () => {
    const { container } = render(<Image alt="fallback" />);
    const src = container.querySelector("img")?.getAttribute("src");
    expect(src).toContain("aaaaaaaaaaaaaaaaaaaaaaaa");
  });
});
