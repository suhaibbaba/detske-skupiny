import * as React from "react";
import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import ChevronRight from "@/components/icons/ChevronRight";
import { getLocale } from "next-intl/server";
import { fetchBreadcrumbList } from "@/lib/sanity/breadcrumb";
import Link from "@/components/ui/link";
import { getTranslateServer } from "@/hooks/useTranslate";
import { BreadcrumbItem } from "@/components/ui/breadcrumb/types";
import {
  buildSchoolBreadcrumbs,
  buildStandardBreadcrumbs,
  EXCLUDED_SEGMENTS,
} from "@/components/ui/breadcrumb/builders";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { absoluteUrl } from "@/lib/seo/site";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  /**
   * The localized pathname of the page rendering the breadcrumbs, e.g.
   * "/katalog/praha". Passed in by the page rather than read from a request
   * cookie: the App Router exposes no pathname to server components, and the
   * `x-current-pathname` cookie that used to carry it was set by the old
   * middleware, which Next 16's `proxy` replaces with next-intl handling only.
   */
  pathname: string;
  addSpace?: boolean;
}

const styles = {
  link: {
    textDecoration: "none",
    fontSize: "14px",
    color: "#323C49",
    lineHeight: "14px",
  },
  text: {
    textDecoration: "none",
    fontSize: "14px",
    color: "custom.inputBorder",
    lineHeight: "14px",
  },
} satisfies Record<string, SxProps<Theme>>;

const Breadcrumbs = async ({ pathname, addSpace = true }: Props) => {
  const locale = await getLocale();
  const translate = await getTranslateServer();

  const pathSegments = pathname
    .split("/")
    .filter((segment) => segment && segment !== locale);

  const breadcrumbs: BreadcrumbItem[] = [
    { label: translate("home"), href: "/" },
  ];

  const slugs = pathSegments.filter((s) => !EXCLUDED_SEGMENTS.includes(s));

  if (slugs.length > 0) {
    try {
      const pages = await fetchBreadcrumbList({ slugs });
      // `slug` is `slug.current` and the query matches on it, so every row has
      // one; the filter is what convinces the compiler of that, and it keeps
      // the map keyed by string rather than by `string | null`.
      const pageMap = new Map(
        pages.flatMap((page) =>
          page.slug ? [[page.slug, page] as const] : [],
        ),
      );

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
    <React.Fragment>
      {/*
       * The BreadcrumbList is emitted from here rather than from each page so
       * that it is built from the very array being rendered below. Google
       * discards a trail that does not match the visible one, and the school
       * trail in particular is assembled from a separate query - keeping the
       * two in one place is the only way they cannot drift apart.
       */}
      <JsonLd
        data={breadcrumbJsonLd(
          breadcrumbs.map((item, index) => ({
            name: item.label,
            // The last crumb is the current page. It is rendered as text
            // rather than a link, so its `href` is never followed and on a
            // school page it is not even a real URL - `buildSchoolBreadcrumbs`
            // runs the school's own slug through the catalog route. Naming the
            // page's own path here keeps the structured data pointing at
            // something that exists.
            url: absoluteUrl(
              locale,
              index === breadcrumbs.length - 1 ? pathname : item.href,
            ),
          })),
        )}
      />
      <MuiBreadcrumbs
        separator={<ChevronRight sx={{ fontSize: "10px" }} />}
        aria-label="breadcrumb"
        sx={{ mb: addSpace ? "40px" : 0, ol: { rowGap: "8px" } }}
      >
        {breadcrumbs.slice(0, -1).map((item) => (
          <Link key={item.href} href={item.href} sx={styles.link}>
            {item.label}
          </Link>
        ))}
        <Typography sx={styles.text}>{last.label}</Typography>
      </MuiBreadcrumbs>
    </React.Fragment>
  );
};

export default Breadcrumbs;
