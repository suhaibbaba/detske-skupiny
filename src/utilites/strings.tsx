import React from "react";
import { BREAKPOINTS } from "@/theme";

export const formatMessage = (
  text: string,
  ...values: (React.ReactNode | string | number)[]
): React.ReactNode => {
  if (!text) return "";

  // Simple split on {0}, {1}, ...
  const parts = text.split(/\{\d+}/);

  const result: React.ReactNode[] = [];

  parts.forEach((part, idx) => {
    result.push(part);
    if (idx < values.length) {
      result.push(<React.Fragment key={idx}>{values[idx]}</React.Fragment>);
    }
  });

  return <>{result}</>;
};

export const autoClamp = ({
  mobile,
  tablet,
  desktop,
}: {
  mobile: number;
  tablet: number;
  desktop: number;
}) => {
  const vw = ((tablet / BREAKPOINTS.md) * 100).toFixed(2);
  return `clamp(${mobile}px, ${vw}vw, ${desktop}px)`;
};

export const ellipses = (lines: number) => {
  return {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
  };
};

export const toOptionalArray = (
  v: string | string[] | undefined,
): string[] | undefined => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean);
  // handle comma-separated string
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export const camelToDisplayText = (str?: string): string => {
  return (str || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
};

export function removeDiacritics(str?: string): string {
  if (!str) {
    return "";
  }

  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
