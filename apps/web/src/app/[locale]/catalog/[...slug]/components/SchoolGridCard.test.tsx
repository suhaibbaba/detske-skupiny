import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/utils";
import SchoolGridCard from "./SchoolGridCard";
import type { MiniSchool } from "@/sanity/types";

vi.mock("@/providers", () => ({ useDefaultImage: () => "" }));

const REF = "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";

const school = {
  id: "school-1",
  name: "Dětská skupina Ďáblice",
  slug: "detska-skupina-dablice",
  shortSummary: "Rodinná skupina v Praze 8.",
  primaryImage: REF,
  logo: undefined,
  region: { name: "Praha" },
  area: { name: "Praha 8" },
  tags: [],
  types: [],
} as unknown as MiniSchool;

describe("SchoolGridCard", () => {
  it("renders the school name", () => {
    renderWithIntl(<SchoolGridCard school={school} />);
    expect(screen.getByText("Dětská skupina Ďáblice")).toBeInTheDocument();
  });

  it("renders the short summary", () => {
    renderWithIntl(<SchoolGridCard school={school} />);
    expect(screen.getByText("Rodinná skupina v Praze 8.")).toBeInTheDocument();
  });

  it("shows the area name as the location", () => {
    renderWithIntl(<SchoolGridCard school={school} />);
    expect(screen.getByText("Praha 8")).toBeInTheDocument();
  });

  it("falls back to the region when there is no area", () => {
    renderWithIntl(<SchoolGridCard school={{ ...school, area: null }} />);
    expect(screen.getByText("Praha")).toBeInTheDocument();
  });

  it("gives every image an alt describing the school", () => {
    const { container } = renderWithIntl(<SchoolGridCard school={school} />);
    const images = Array.from(container.querySelectorAll("img"));

    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img).toHaveAttribute("alt", school.name);
    }
  });

  it("links to the localized school detail page", () => {
    renderWithIntl(<SchoolGridCard school={school} />);
    const links = screen.getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/skupiny/detska-skupina-dablice");
    }
  });

  it("uses the English path for the en locale", () => {
    renderWithIntl(<SchoolGridCard school={school} />, { locale: "en" });
    expect(screen.getAllByRole("link")[0]).toHaveAttribute(
      "href",
      "/groups/detska-skupina-dablice",
    );
  });
});
