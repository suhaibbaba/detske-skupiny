import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@/test/utils";
import Button from "./Button";

vi.mock("@/providers", () => ({ useDefaultImage: () => "" }));

describe("Button", () => {
  it("renders its children", () => {
    renderWithIntl(<Button>Zobrazit školku</Button>);
    expect(
      screen.getByRole("button", { name: "Zobrazit školku" }),
    ).toBeInTheDocument();
  });

  it("renders as a link with a localized href", () => {
    renderWithIntl(<Button href="/contact-us">Kontakt</Button>);
    const link = screen.getByRole("link", { name: "Kontakt" });
    expect(link).toHaveAttribute("href", "/kontakt");
  });

  it("keeps English segments for the en locale", () => {
    renderWithIntl(<Button href="/contact-us">Contact</Button>, {
      locale: "en",
    });
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact-us",
    );
  });

  it("renders a Sanity link field as a link", () => {
    renderWithIntl(
      <Button
        link={
          {
            type: "external",
            url: "https://example.test",
            text: "Web",
          } as never
        }
      />,
    );
    const link = screen.getByRole("link", { name: "Web" });
    expect(link).toHaveAttribute("href", "https://example.test");
  });

  it("falls back to the cleaned url when a link has no text", () => {
    renderWithIntl(
      <Button
        link={{ type: "external", url: "https://example.test" } as never}
      />,
    );
    expect(
      screen.getByRole("link", { name: "example.test" }),
    ).toBeInTheDocument();
  });

  it("is clickable", async () => {
    const onClick = vi.fn();
    renderWithIntl(<Button onClick={onClick}>Klikni</Button>);
    screen.getByRole("button", { name: "Klikni" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
