import { LinkProps, TypographyProps } from "@mui/material";

export interface BreadcrumbsStyles {
  link?: LinkProps;
  text?: TypographyProps;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}
