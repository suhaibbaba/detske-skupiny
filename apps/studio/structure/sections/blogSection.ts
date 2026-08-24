import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EditIcon } from "@sanity/icons/Edit";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { ThListIcon } from "@sanity/icons/ThList";
import { UsersIcon } from "@sanity/icons/Users";
import { ComponentIcon } from "@sanity/icons/Component";
import {
  allLanguagesList,
  baseLanguageList,
  BY_NAME,
  BY_PUBLISHED,
} from "@/structure/lists";
import { BASE_LANGUAGE_TEMPLATES } from "@/structure/templates";

/**
 * The magazine.
 *
 * Posts are ordered newest first rather than A-Z: a blog list is read as a
 * timeline, and the post an editor wants is nearly always one of the last few
 * written. Authors and categories keep alphabetical order, where the opposite
 * is true.
 */
export function createBlogSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Blog")
    .id("blog")
    .icon(EditIcon)
    .child(
      S.list()
        .title("Blog")
        .items([
          S.listItem()
            .id("blogPageInSection")
            .title("Blog page")
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList("blogPage")
                .title("Blog page")
                .schemaType("blogPage"),
            ),
          S.divider(),

          baseLanguageList({
            S,
            type: "blogs",
            title: "Posts",
            id: "blogPosts",
            icon: ThListIcon,
            ordering: BY_PUBLISHED,
            templateId: BASE_LANGUAGE_TEMPLATES.blogs,
          }),
          allLanguagesList({
            S,
            type: "blogs",
            title: "Posts",
            id: "blogPosts",
            ordering: BY_PUBLISHED,
          }),
          S.divider(),

          S.documentTypeListItem("authors")
            .title("Authors")
            .icon(UsersIcon)
            .child(
              S.documentTypeList("authors")
                .title("Authors")
                .defaultOrdering(BY_NAME),
            ),
          S.documentTypeListItem("blogCategories")
            .title("Categories")
            .icon(ComponentIcon)
            .child(
              S.documentTypeList("blogCategories")
                .title("Categories")
                .defaultOrdering(BY_NAME),
            ),
        ]),
    );
}

export const BLOG_TYPES = ["blogPage", "blogs", "blogCategories", "authors"];
