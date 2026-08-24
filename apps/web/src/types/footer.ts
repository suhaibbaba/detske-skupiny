import type { FooterQueryResult } from "@detske-skupiny/types";

/** The footer document, exactly as `footerQuery` projects it. */
export type Footer = NonNullable<FooterQueryResult["footer"]>;

export type FooterColumn = NonNullable<Footer["columns"]>[number];

/** One entry of a footer column: a `textItem` or a resolved `linkItem`. */
export type FooterContent = NonNullable<FooterColumn["content"]>[number];
