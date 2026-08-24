import type { HeaderQueryResult } from "@detske-skupiny/types";

/** The header document, exactly as `headerQuery` projects it. */
export type Header = NonNullable<HeaderQueryResult["header"]>;

export type MenuItem = NonNullable<Header["menuItems"]>[number];
