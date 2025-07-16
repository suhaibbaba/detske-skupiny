import { Theme } from "@mui/material";

export const formatMessage = (
  text: string,
  ...values: (React.ReactNode | string | number)[]
): React.ReactNode => {
  if (!text) return "";

  // Simple split on {0}, {1}, ...
  const parts = text.split(/\{\d+}/);

  const result: React.ReactNode[] = [];

  parts.forEach((part, i) => {
    result.push(part);
    if (i < values.length) {
      result.push(values[i]);
    }
  });

  return <>{result}</>;
};

export const autoClamp = ({
  mobile,
  tablet,
  desktop,
  theme,
}: {
  mobile: number;
  tablet: number;
  desktop: number;
  theme: Theme;
}) => {
  const vw = ((tablet / theme.breakpoints.values.md) * 100).toFixed(2);
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
