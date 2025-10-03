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
import useTranslate from "@/hooks/useTranslate";
import { fetchBreadcrumbList } from "@/sanity/queries/breadcrumb";

interface Props {
  addSpace?: boolean;
}

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

const Breadcrumbs: React.FC<Props> = ({ addSpace = true }) => {
  const pathname = usePathname();
  const locale = useLocale();
  const translate = useTranslate();
  const [items, setItems] = React.useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBreadcrumbs = async () => {
      setLoading(true);

      const pathSegments = pathname
        .split("/")
        .filter((segment) => segment !== "" && segment !== locale);

      const breadcrumbs: BreadcrumbItem[] = [
        {
          label: translate("home"),
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

      setItems(breadcrumbs);
      setLoading(false);
    };

    fetchBreadcrumbs();
  }, [pathname, locale, translate]);

  const formatSegment = (segment: string): string => {
    return segment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading || items.length === 0) {
    return null; // or a loading skeleton
  }

  const last = items[items.length - 1];

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ fontSize: "10px" }} />}
      aria-label="breadcrumb"
      sx={{ mb: addSpace ? "40px" : 0 }}
    >
      {items.slice(0, -1).map((item) => (
        <Link key={item.href} href={item.href} {...styles.link}>
          {item.label}
        </Link>
      ))}
      <Typography {...styles.text}>{last.label}</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
