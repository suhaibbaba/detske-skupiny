import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { HomeIcon } from "@sanity/icons/Home";
import { UsersIcon } from "@sanity/icons/Users";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { BY_TITLE } from "@/structure/lists";

/**
 * The pages a visitor actually lands on, in the order the site presents them.
 *
 * These are one-document-per-language types rather than true singletons - the
 * Czech home page and the English home page are two `home` documents, paired
 * by `translation.metadata` like everything else - so each entry is a short
 * list, not a fixed document id. Two rows is not the duplication problem the
 * base-language filter exists to solve (that one is four hundred schools
 * becoming eight hundred rows), and collapsing them would hide the fact that
 * an English page exists at all. Each row carries its own language badge.
 *
 * The names here are the routes, not the schema types: `preschool` is what the
 * site calls Cooperation (`/spoluprace`), `group` is the heading above the
 * school catalog. An editor asked to "fix the cooperation page" should not
 * have to know that.
 */
export function createContentSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Content")
    .id("content")
    .icon(DocumentsIcon)
    .child(
      S.list()
        .title("Content")
        .items([
          S.documentTypeListItem("home").title("Home").icon(HomeIcon),
          S.documentTypeListItem("preschool")
            .title("Cooperation")
            .icon(UsersIcon),
          S.documentTypeListItem("group")
            .title("Catalog intro")
            .icon(ThLargeIcon),
          S.documentTypeListItem("contactUs")
            .title("Contact")
            .icon(EnvelopeIcon),
          S.divider(),
          /**
           * `page` is the generic type: anything that needs a URL and a title
           * and is not one of the above. It is last because it is the least
           * used, and it keeps its own list rather than sharing one.
           */
          S.documentTypeListItem("page")
            .title("Standalone pages")
            .icon(DocumentTextIcon)
            .child(
              S.documentTypeList("page")
                .title("Standalone pages")
                .defaultOrdering(BY_TITLE),
            ),
        ]),
    );
}

export const CONTENT_TYPES = [
  "home",
  "preschool",
  "group",
  "contactUs",
  "page",
];
