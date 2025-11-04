import * as React from "react";
import {
  Breadcrumbs as MuiBreadcrumbs,
  LinkProps,
  TypographyProps,
  Typography,
} from "@mui/material";
import ChevronRight from "@/components/icons/ChevronRight";
import { getLocale, getTranslations } from "next-intl/server";
import { fetchBreadcrumbList } from "@/sanity/queries/breadcrumb";
import { pathnames } from "@/i18n/routing";
import { headers } from "next/headers";
import Link from "@/components/ui/link";

interface Props {
  addSpace?: boolean;
}

const excludeNavigationEN = ["catalog", "school"];

const excludeNavigationMaps = [
  ...excludeNavigationEN,
  ...Object.values(pathnames)
    .filter((value) => typeof value === "object")
    .flatMap((locales) =>
      Object.values(locales)
        .map((path) => path.split("/").find((s) => s && !s.startsWith("[")))
        .filter(
          (segment): segment is string =>
            segment !== undefined &&
            excludeNavigationEN.some((en) =>
              Object.values(locales).some(
                (p) => p.includes(`/${en}/`) || p.includes(`/${en}`),
              ),
            ),
        ),
    ),
];

// Remove duplicates
const excludeNavigation = [...new Set(excludeNavigationMaps)];

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
    sx: {
      textDecoration: "none",
      fontSize: "14px",
      color: "var(--mui-palette-custom-ui2)",
      lineHeight: "14px",
    },
  },
};

const formatSegment = (segment: string): string => {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const Breadcrumbs = async ({ addSpace = true }: Props) => {
  const locale = await getLocale();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "/";

  const decodedPathname = decodeURIComponent(pathname);
  const t = await getTranslations();

  const pathSegments = decodedPathname
    .split("/")
    .filter((segment) => segment !== "" && segment !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: t("home"),
      href: "/",
    },
  ];

  // Fetch all page names in one query for better performance
  const slugs = pathSegments.filter(
    (segment) => !excludeNavigation.includes(segment),
  );

  if (slugs.length > 0) {
    try {
      const pages = await fetchBreadcrumbList({ slugs });

      // Create a map for quick lookup
      const pageMap = new Map(pages.map((page) => [page.slug, page.name]));

      // Build breadcrumbs with proper names
      pathSegments.forEach((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");

        if (!excludeNavigation.includes(segment)) {
          const label = pageMap.get(segment) || formatSegment(segment);
          breadcrumbs.push({ label, href });
        }
      });
    } catch (error) {
      console.error("Error fetching breadcrumb data:", error);

      // Fallback to formatted slugs on error
      pathSegments.forEach((segment, index) => {
        const href = "/" + pathSegments.slice(0, index + 1).join("/");
        if (!excludeNavigation.includes(segment)) {
          breadcrumbs.push({
            label: formatSegment(segment),
            href,
          });
        }
      });
    }
  }

  if (breadcrumbs.length === 0) {
    return null;
  }

  const last = breadcrumbs[breadcrumbs.length - 1];

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ fontSize: "10px" }} />}
      aria-label="breadcrumb"
      sx={{ mb: addSpace ? "40px" : 0 }}
    >
      {breadcrumbs.slice(0, -1).map((item) => (
        <Link key={item.href} href={item.href} {...styles.link}>
          {item.label}
        </Link>
      ))}
      <Typography {...styles.text}>{last.label}</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
