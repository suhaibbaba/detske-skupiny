import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { HomeIcon } from "@sanity/icons/Home";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { FolderIcon } from "@sanity/icons/Folder";
import { TagIcon } from "@sanity/icons/Tag";
import { TagsIcon } from "@sanity/icons/Tags";
import { ComponentIcon } from "@sanity/icons/Component";
import { allLanguagesList, baseLanguageList, BY_NAME } from "@/structure/lists";
import { BASE_LANGUAGE_TEMPLATES } from "@/structure/templates";

/**
 * The catalog: the schools themselves, and the three vocabularies that
 * describe them.
 *
 * The vocabularies are one folder down rather than four siblings of Schools.
 * They are set up once and edited rarely, and at the top level they made the
 * section read as five equal things when it is really one thing plus its
 * supporting cast.
 */
export function createSchoolSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Schools")
    .id("schools")
    .icon(HomeIcon)
    .child(
      S.list()
        .title("Schools")
        .items([
          S.listItem()
            .id("schoolPageInSection")
            .title("Catalog page")
            .icon(DocumentTextIcon)
            .child(S.documentTypeList("schoolPage").title("Catalog page")),
          S.divider(),

          baseLanguageList({
            S,
            type: "schools",
            title: "Schools",
            id: "schoolsList",
            icon: HomeIcon,
            ordering: BY_NAME,
            templateId: BASE_LANGUAGE_TEMPLATES.schools,
          }),
          allLanguagesList({
            S,
            type: "schools",
            title: "Schools",
            id: "schoolsList",
            ordering: BY_NAME,
          }),
          S.divider(),

          S.listItem()
            .id("schoolClassification")
            .title("Classification")
            .icon(FolderIcon)
            .child(
              S.list()
                .title("Classification")
                .items([
                  S.documentTypeListItem("schoolCategories")
                    .title("Categories")
                    .icon(ComponentIcon)
                    .child(
                      S.documentTypeList("schoolCategories")
                        .title("Categories")
                        .defaultOrdering(BY_NAME),
                    ),
                  S.documentTypeListItem("schoolTags")
                    .title("Tags")
                    .icon(TagsIcon)
                    .child(
                      S.documentTypeList("schoolTags")
                        .title("Tags")
                        .defaultOrdering(BY_NAME),
                    ),
                  S.documentTypeListItem("schoolTypes")
                    .title("Types")
                    .icon(TagIcon)
                    .child(
                      S.documentTypeList("schoolTypes")
                        .title("Types")
                        .defaultOrdering(BY_NAME),
                    ),
                ]),
            ),
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
