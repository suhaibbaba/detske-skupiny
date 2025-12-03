import { fetchSchoolBreadcrumb } from "@/sanity/queries/breadcrumb";
import { BreadcrumbItem } from "@/components/ui/breadcrumb/types";
import { BASE_EXCLUDED_FOLDERS } from "@/components/ui/breadcrumb/constants";
import { pathnames } from "@/i18n/routing";
import { getFolderLabel } from "@/components/ui/breadcrumb/utils";
import { getLocalizedRoutes } from "@/routes";

/**
 * Complete list of navigation segments to exclude, including:
 * - Base excluded folders
 * - All localized slug variations of those folders
 */
const EXCLUDED_NAVIGATION_SEGMENTS = [
  ...BASE_EXCLUDED_FOLDERS,
  // Extract localized path segments from pathnames that correspond to excluded folders
  ...Object.values(pathnames)
    .filter((value) => typeof value === "object")
    .flatMap((locales) =>
      Object.values(locales)
        // Extract the first non-parameter segment from each localized path
        .map((path) =>
          path
            .split("/")
            .find((segment) => segment && !segment.startsWith("[")),
        )
        .filter(
          (segment): segment is string =>
            segment !== undefined &&
            // Only include segments that belong to paths containing excluded folders
            BASE_EXCLUDED_FOLDERS.some((excludedFolder) =>
              Object.values(locales).some(
                (path) =>
                  path.includes(`/${excludedFolder}/`) ||
                  path.includes(`/${excludedFolder}`),
              ),
            ),
        ),
    ),
];

/**
 * Deduplicated array of all navigation segments to exclude
 */
export const EXCLUDED_SEGMENTS = [...new Set(EXCLUDED_NAVIGATION_SEGMENTS)];

export const buildSchoolBreadcrumbs = async (
  pathSegments: string[],
  pageMap: Map<string, any>,
  locale: string,
): Promise<BreadcrumbItem[]> => {
  const lastSegment = pathSegments[pathSegments.length - 1];
  const lastPageData = pageMap.get(lastSegment);

  const schoolBreadcrumbs = await fetchSchoolBreadcrumb({
    slug: lastPageData?.slug,
  });

  const firstSegment = pathSegments[0];
  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: getFolderLabel(firstSegment, locale),
      href: `/${firstSegment}`,
    },
  ];

  schoolBreadcrumbs.forEach((item) => {
    breadcrumbs.push({
      label: item.name,
      href: getLocalizedRoutes(locale).catalogs(item.slug),
    });
  });

  return breadcrumbs;
};

export const buildStandardBreadcrumbs = (
  pathSegments: string[],
  pageMap: Map<string, any>,
  locale: string,
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [];

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];

    if (EXCLUDED_SEGMENTS.includes(segment)) continue;

    const href = "/" + pathSegments.slice(0, i + 1).join("/");
    const pageData = pageMap.get(segment);

    breadcrumbs.push({
      label: pageData?.name || getFolderLabel(segment, locale),
      href,
    });
  }

  return breadcrumbs;
};
