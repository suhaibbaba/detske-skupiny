import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { BookIcon, DocumentTextIcon } from "@sanity/icons";

export function createBlogSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Blog")
    .id("blog")
    .icon(BookIcon)
    .child(
      S.list()
        .title("Blog")
        .items([
          S.listItem()
            .id("blogPageInSection")
            .title("Blog Page")
            .icon(DocumentTextIcon)
            .child(S.document().schemaType("blogPage").documentId("blogPage")),
          S.documentTypeListItem("blogs").title("Blogs"),
          S.documentTypeListItem("blogCategories").title("Blog Categories"),
          S.documentTypeListItem("authors").title("Authors"),
        ]),
    );
}

export const BLOG_TYPES = ["blogPage", "blogs", "blogCategories", "authors"];
