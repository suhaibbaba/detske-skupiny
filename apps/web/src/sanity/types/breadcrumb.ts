import type {
  BreadcrumbListQueryResult,
  SchoolBreadcrumbQueryResult,
} from "@detske-skupiny/types";

export interface BreadcrumbParams {
  slugs: string[];
}

export interface SchoolBreadcrumbParams {
  slug?: string;
}

/**
 * One document matched by slug, as `breadcrumbListQuery` projects it.
 *
 * Not to be confused with `components/ui/breadcrumb/types.ts`'s
 * `BreadcrumbItem`, which is the rendered rung. This is the raw document the
 * builders turn into one.
 */
export type BreadcrumbDocument = BreadcrumbListQueryResult[number];

/** One rung of a school's ancestor trail. */
export type SchoolBreadcrumbRung = NonNullable<
  NonNullable<SchoolBreadcrumbQueryResult>["breadcrumb"]
>[number];
