import * as React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import ChevronRight from "@/components/icons/ChevronRight";
import { getLocale } from "next-intl/server";
import { fetchBreadcrumbList } from "@/sanity/queries/breadcrumb";
import { cookies } from "next/headers";
import Link from "@/components/ui/link";
import { getTranslateServer } from "@/hooks/useTranslate";
import {
  BreadcrumbItem,
  BreadcrumbsStyles,
} from "@/components/ui/breadcrumb/types";
import {
  buildSchoolBreadcrumbs,
  buildStandardBreadcrumbs,
  EXCLUDED_SEGMENTS,
} from "@/components/ui/breadcrumb/builders";

interface Props {
  addSpace?: boolean;
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

const Breadcrumbs = async ({ addSpace = true }: Props) => {
  const locale = await getLocale();
  const translate = await getTranslateServer();

  // Get pathname from cookie
  const cookieStore = await cookies();
  const pathname = cookieStore.get("x-current-pathname")?.value || "/";

  const pathSegments = decodeURIComponent(pathname)
    .split("/")
    .filter((segment) => segment && segment !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: translate("home"), href: "/" },
  ];

  const slugs = pathSegments.filter((s) => !EXCLUDED_SEGMENTS.includes(s));

  if (slugs.length > 0) {
    try {
      const pages = await fetchBreadcrumbList({ slugs });
      const pageMap = new Map(pages.map((page) => [page.slug, page]));

      const lastSegment = pathSegments[pathSegments.length - 1];
      const isSchoolType = pageMap.get(lastSegment)?._type === "schools";

      const newBreadcrumbs = isSchoolType
        ? await buildSchoolBreadcrumbs(pathSegments, pageMap, locale)
        : buildStandardBreadcrumbs(pathSegments, pageMap, locale);

      breadcrumbs.push(...newBreadcrumbs);
    } catch (error) {
      console.error("Error fetching breadcrumb data:", error);
      breadcrumbs.push(
        ...buildStandardBreadcrumbs(pathSegments, new Map(), locale),
      );
    }
  }

  if (breadcrumbs.length === 0) return null;

  const last = breadcrumbs[breadcrumbs.length - 1];

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ fontSize: "10px" }} />}
      aria-label="breadcrumb"
      sx={{ mb: addSpace ? "40px" : 0, ol: { rowGap: "8px" } }}
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
