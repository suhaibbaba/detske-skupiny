import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { BookIcon } from "@sanity/icons/Book";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

export function createTranslateSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Translate")
    .id("translate")
    .icon(BookIcon)
    .child(
      S.list()
        .title("Translate")
        .items([
          S.listItem()
            .id("DictionarySection")
            .title("Dictionary")
            .icon(DocumentTextIcon)
            .child(
              S.document()
                .schemaType("dictionaries")
                .documentId("dictionaries"),
            ),
        ]),
    );
}

export const TRANSLATE_TYPES = ["dictionaries"];
