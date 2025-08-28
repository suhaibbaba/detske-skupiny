"use client";

import * as React from "react";
import {
  Typography,
  Breadcrumbs as MuiBreadcrumbs,
  LinkProps,
  TypographyProps,
} from "@mui/material";
import ChevronRight from "@/components/icons/ChevronRight";
import Link from "@/components/ui/link";
import { usePathname } from "next/navigation";
import HomeIcon from "@/components/icons/Home";

/** If you localize URLs like /en/... /ar/... list them here */
const LOCALES = new Set(["en", "ar"]);

/** Optional label overrides for pretty names */
const LABEL_MAP: Record<string, string> = {
  "": "Home",
  blog: "Blog",
  schools: "Schools",
  category: "Category",
  // add more if you want specific labels
};

/** Convert a URL segment into a neat label: "my-post_title" → "My Post Title" */
function toTitle(seg: string): string {
  try {
    seg = decodeURIComponent(seg);
  } catch {}
  // Split camelCase → "camel Case"
  seg = seg.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  // Replace separators with spaces
  seg = seg.replace(/[-_]+/g, " ").trim();
  // Title-case words
  return seg
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Build cumulative hrefs for each segment */
function buildCrumbs(pathname: string) {
  // normalize (remove trailing slash)
  const clean = pathname.replace(/\/+$/, "");
  const segs = clean.split("/").filter(Boolean);

  // pop locale if present (keep to rebuild hrefs prefixed with locale)
  const maybeLocale =
    segs[0] && LOCALES.has(segs[0]) ? segs.shift() : undefined;

  // Always start with Home
  const crumbs: { href: string; label: string }[] = [];
  const prefix = maybeLocale ? `/${maybeLocale}` : "";
  crumbs.push({ href: `${prefix || "/"}`, label: LABEL_MAP[""] ?? "Home" });

  // Build cumulative paths
  const acc: string[] = [];
  for (const s of segs) {
    acc.push(s);
    const href = `${prefix}/${acc.join("/")}`;
    const label = LABEL_MAP[s] ?? toTitle(s);
    crumbs.push({ href, label });
  }

  return crumbs;
}

interface BreadcrumbsStyles {
  link?: LinkProps;
  text?: TypographyProps;
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
  const pathname = usePathname() || "/";
  const items = React.useMemo(() => buildCrumbs(pathname), [pathname]);

  if (items.length <= 1) return null; // only "Home" -> hide

  const last = items[items.length - 1];

  return (
    <MuiBreadcrumbs
      separator={<ChevronRight sx={{ fontSize: "10px" }} />}
      aria-label="breadcrumb"
      sx={{ mb: "40px" }}
    >
      {items.slice(0, -1).map((item, index) => (
        <Link key={item.href} href={item.href} {...styles.link}>
          {index === 0 && <HomeIcon sx={{ mr: "4px", fontSize: 12 }} />}
          {item.label}
        </Link>
      ))}
      <Typography {...styles.text}>{last.label}</Typography>
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
