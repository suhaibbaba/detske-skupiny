"use server";

import { fetchSchoolList } from "@/sanity/queries/school-list";
import { MiniSchool } from "@/sanity/types";
import {
  PAGE_SIZE,
  loadMoreInputSchema,
  type LoadMoreInput,
} from "@/app/[locale]/catalog/[...slug]/searchParams";

export type LoadMoreResult = {
  schools: MiniSchool[];
  totalSelectedSchools: number;
  /** Whether a further page exists, so the client does not have to infer it. */
  hasMore: boolean;
};

/**
 * Returns one more page of schools for the catalog list.
 *
 * This replaces the /api/schools route from the previous PR. It returns plain
 * data, not UI, and it neither revalidates nor redirects - so the response
 * carries the return value alone and Next does not re-render the route
 * alongside it. That is the point: paging must not cost a second render of a
 * page whose filters have not changed.
 *
 * A Server Action is a POST endpoint reachable by anyone who can send the
 * request, so the input is validated here rather than trusted; it is the same
 * schema the page applies to its own query string.
 */
export async function loadMoreSchools(
  input: LoadMoreInput,
): Promise<LoadMoreResult> {
  const parsed = loadMoreInputSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error("Invalid catalog request");
  }

  const { page, categories, tags, name, ...scope } = parsed.data;
  const start = (page - 1) * PAGE_SIZE;

  const { schools, totalSelectedSchools } = await fetchSchoolList({
    ...scope,
    categories,
    tags,
    search: name || undefined,
    start,
    end: start + PAGE_SIZE,
  });

  return {
    schools: schools ?? [],
    totalSelectedSchools,
    // Derived from the range asked for, not from how many cards came back.
    // The list is ordered and sliced before the cards are fetched, so a
    // document deleted between the two reads returns a short page - and
    // inferring "no more" from that would strand the rest of the list.
    hasMore: start + PAGE_SIZE < totalSelectedSchools,
  };
}
