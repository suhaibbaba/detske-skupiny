import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { formatMessage } from "./strings";

describe("formatMessage", () => {
  it("returns an empty string for empty text", () => {
    expect(formatMessage("")).toBe("");
  });

  it("renders plain text with no placeholders", () => {
    render(<div data-testid="out">{formatMessage("Ahoj světe")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("Ahoj světe");
  });

  it("substitutes a single placeholder", () => {
    render(<div data-testid="out">{formatMessage("Máme {0} škol", 12)}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("Máme 12 škol");
  });

  it("substitutes multiple placeholders in order", () => {
    render(
      <div data-testid="out">{formatMessage("{0} z {1}", "Praha", "ČR")}</div>,
    );
    expect(screen.getByTestId("out")).toHaveTextContent("Praha z ČR");
  });

  it("handles adjacent placeholders with no text between them", () => {
    // The {0}{1} case: splitting yields empty strings between the markers, so
    // both values must still land, in order and with nothing dropped.
    render(<div data-testid="out">{formatMessage("{0}{1}", "a", "b")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("ab");
  });

  it("handles a placeholder at the very start and end", () => {
    render(<div data-testid="out">{formatMessage("{0} - {1}", "x", "y")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("x - y");
  });

  it("renders React nodes as values", () => {
    render(
      <div data-testid="out">
        {formatMessage("Klikni {0}", <strong key="s">sem</strong>)}
      </div>,
    );
    expect(screen.getByTestId("out")).toHaveTextContent("Klikni sem");
    expect(screen.getByText("sem").tagName).toBe("STRONG");
  });

  it("leaves a placeholder unfilled when no value is supplied", () => {
    // The marker is dropped and nothing replaces it, leaving the surrounding
    // text intact. toHaveTextContent collapses the resulting double space.
    render(<div data-testid="out">{formatMessage("Máme {0} škol")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("Máme škol");
    expect(screen.getByTestId("out").textContent).toBe("Máme  škol");
  });

  it("ignores extra values beyond the placeholders", () => {
    render(<div data-testid="out">{formatMessage("{0}", "a", "b")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("a");
  });

  it("preserves Czech diacritics", () => {
    render(<div data-testid="out">{formatMessage("Příště {0}", "ř")}</div>);
    expect(screen.getByTestId("out")).toHaveTextContent("Příště ř");
  });
});
