"use client";

import * as React from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  LinkProps,
  TypographyProps,
  Link,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import ChevronRight from "@/components/icons/ChevronRight";
import { useLocale } from "use-intl";

// Segments to exclude from breadcrumb display but keep in URLs
const excludeNavigation = ["catalog"];

interface BreadcrumbsStyles {
  link?: LinkProps;
  text?: TypographyProps;
}

interface BreadcrumbItem {
  label: string;
  href: string;
}

const styles: BreadcrumbsStyles = {
  link: {
    sx: {
      textDecoration: "none",
      fontSize: "14px",
      color: "#323C49",
      lineHeight: "14px",
    },
  },
  text: {
    sx: (theme) => ({
      textDecoration: "none",
      fontSize: "14px",
      color: theme.palette.custom.ui2,
      lineHeight: "14px",
    }),
  },
};

const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  const locale = useLocale();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    // Split the pathname and filter out empty strings
    const pathSegments = pathname
      .split("/")
      .filter((segment) => segment !== "");

    // Create breadcrumb items starting with Home
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: "Home",
        href: "/",
      },
    ];

    // Add breadcrumbs for each path segment
    pathSegments.forEach((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");

      // Skip excluded segments from display but keep them in URLs
      if (!excludeNavigation.includes(segment) && segment !== locale) {
        // Format the segment into readable label
        const label = formatSegment(segment);

        breadcrumbs.push({
          label,
          href,
        });
      }
    });

    return breadcrumbs;
  };

  const formatSegment = (segment: string): string => {
    // Remove hyphens and underscores, capitalize each word
    return segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const items = generateBreadcrumbs();
  const last = items[items.length - 1];

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ fontSize: "10px" }} />}
      aria-label="breadcrumb"
      sx={{ mb: "40px" }}
    >
      {items.slice(0, -1).map((item, index) => (
        <Link key={item.href} href={item.href} {...styles.link}>
          {item.label}
        </Link>
      ))}
      <Typography {...styles.text}>{last.label}</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
