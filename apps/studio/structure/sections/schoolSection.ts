import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { HomeIcon } from "@sanity/icons/Home";

export function createSchoolSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("School Management")
    .id("schoolManagement")
    .icon(HomeIcon)
    .child(
      S.list()
        .title("School Management")
        .items([
          S.listItem()
            .id("schoolPageInSection")
            .title("School Page")
            .icon(DocumentTextIcon)
            .child(
              S.document().schemaType("schoolPage").documentId("schoolPage"),
            ),
          S.documentTypeListItem("schools").title("Schools"),
          S.documentTypeListItem("schoolTypes").title("School Types"),
          S.documentTypeListItem("schoolTags").title("School Tags"),
          S.documentTypeListItem("schoolCategories").title("School Categories"),
        ]),
    );
}

export const SCHOOL_TYPES = [
  "schoolPage",
  "schools",
  "schoolTypes",
  "schoolTags",
  "schoolCategories",
];
