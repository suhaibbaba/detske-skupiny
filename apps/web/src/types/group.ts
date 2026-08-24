import type { GroupPageQueryResult } from "@detske-skupiny/types";

/**
 * One row of the groups index: a region, or the country rendered as one more.
 *
 * The two are projected separately and rendered by the same component, so this
 * is the union of both - `fetchGroupPage` appends the country to the regions.
 */
export type GroupPage =
  | NonNullable<GroupPageQueryResult["regions"]>[number]
  | NonNullable<GroupPageQueryResult["country"]>;
