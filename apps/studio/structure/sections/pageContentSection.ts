import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { DocumentTextIcon, BlockContentIcon } from "@sanity/icons";
import { SINGLETONS } from "@/structure";

/**
 * To make it singleton-like, we can create list items for each schema type
 *             S.listItem()
 *             .id(s.id)
 *             .title(s.title)
 *             .icon(DocumentTextIcon)
 *             .child(S.document().schemaType(s.schemaType).documentId(s.id)),
 */
export function createPageContentSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Page Content")
    .id("pageContentSection")
    .icon(BlockContentIcon)
    .child(
      S.list()
        .title("Page Content")
        .items([
          ...SINGLETONS.map((s) =>
            S.documentTypeListItem(s.schemaType)
              .title(s.title)
          ),
        ])
    );
}

