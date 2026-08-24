import type { ComponentType } from "react";
import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { TranslateIcon } from "@sanity/icons/Translate";
import { BASE_LANGUAGE_PARAMS, IN_BASE_LANGUAGE } from "@/structure/language";

/**
 * The list builders every section is made of.
 *
 * The point of the pair below is that a school translated into English is two
 * documents, and a flat `S.documentTypeListItem("schools")` shows both - so a
 * list of 400 schools reads as 800 rows, half of them near-duplicates of the
 * other half, and finding "the" school means knowing which copy you want
 * before you look.
 *
 * `baseLanguageList` is what an editor opens by default: one row per school,
 * in the language it was written in. Reaching the English copy is the language
 * menu inside the document, which is where @sanity/document-internationalization
 * already puts it and where an editor who has translated anything already
 * looks. `allLanguagesList` is the escape hatch beside it for the times the
 * question really is "what exists in English" - and there the row's own preview
 * carries the language badge, because in a mixed list that is information
 * rather than noise (see utility/string.ts).
 */

/**
 * What `defaultOrdering` takes.
 *
 * Declared here rather than imported: `SortOrderingItem` lives in
 * `@sanity/types`, which the studio only has transitively, and neither
 * `sanity` nor `sanity/structure` re-exports it. Reaching past `sanity` into
 * one of its own dependencies for a two-field object is a worse trade than
 * writing the two fields down. Structural typing does the rest.
 */
type Ordering = { field: string; direction: "asc" | "desc" }[];

/** By display name, A-Z. What a person scanning a list expects. */
export const BY_NAME: Ordering = [{ field: "name", direction: "asc" }];

/** By title, A-Z. Same idea, for the types that call the field `title`. */
export const BY_TITLE: Ordering = [{ field: "title", direction: "asc" }];

/**
 * A-Z across a list that mixes types naming their label differently.
 *
 * Schools have a `name`, posts have a `title`. An ascending sort puts nulls
 * last, so ordering by both fields sorts the schools by name, then the posts -
 * which have no `name` - by title after them. Each group ends up alphabetical
 * within itself, which is what the translation cockpit's cross-type lists
 * need; a single-field ordering would leave half the list in dataset order.
 */
export const BY_NAME_OR_TITLE: Ordering = [
  { field: "name", direction: "asc" },
  { field: "title", direction: "asc" },
];

/** Newest first. For anything with a publication date. */
export const BY_PUBLISHED: Ordering = [
  { field: "publishedAt", direction: "desc" },
];

/**
 * The order the site renders geography in.
 *
 * `orderRank` is a drag-to-sort field, and the web app reads it directly
 * (`| order(orderRank)` in the catalog queries), so a geography list that
 * sorted alphabetically would be showing an order the site does not use. The
 * drag handles themselves live in Geography > Reorder, which is the one kind of
 * pane that can write this field.
 */
export const BY_RANK: Ordering = [{ field: "orderRank", direction: "asc" }];

/** Most recently edited first. */
export const BY_UPDATED: Ordering = [
  { field: "_updatedAt", direction: "desc" },
];

type ListOptions = {
  S: StructureBuilder;
  type: string;
  title: string;
  id: string;
  icon: ComponentType;
  ordering: Ordering;
  /** Initial value template to create from, if the type has one. */
  templateId?: string;
};

/**
 * Every document of `type` in the base language, one row each.
 *
 * `.schemaType()` is what gives the pane its "create new" button and lets it
 * answer an edit intent - a link elsewhere in the studio that opens one of
 * these documents lands in this pane rather than in a stray one.
 */
export function baseLanguageList({
  S,
  type,
  title,
  id,
  icon,
  ordering,
  templateId,
}: ListOptions): ListItemBuilder {
  const list = S.documentList()
    .id(id)
    .title(title)
    .schemaType(type)
    .filter(`_type == $type && ${IN_BASE_LANGUAGE}`)
    .params({ type, ...BASE_LANGUAGE_PARAMS })
    .defaultOrdering(ordering);

  return S.listItem()
    .id(id)
    .title(title)
    .icon(icon)
    .schemaType(type)
    .child(
      templateId
        ? list.initialValueTemplates([S.initialValueTemplateItem(templateId)])
        : list,
    );
}

/**
 * The same documents plus their translations, sorted so the two copies of one
 * entity sit next to each other.
 *
 * No create button and no template: a translation is made from the base
 * document's language menu, which is the only route that also writes the
 * `translation.metadata` document pairing the two. Creating a loose English
 * document here would produce exactly the orphan the translation cockpit
 * exists to find.
 */
export function allLanguagesList({
  S,
  type,
  title,
  id,
  ordering,
}: Omit<ListOptions, "icon" | "templateId">): ListItemBuilder {
  const allLanguagesId = `${id}-all-languages`;
  const allLanguagesTitle = `${title} · all languages`;

  return S.listItem()
    .id(allLanguagesId)
    .title(allLanguagesTitle)
    .icon(TranslateIcon)
    .schemaType(type)
    .child(
      S.documentList()
        .id(allLanguagesId)
        .title(allLanguagesTitle)
        .schemaType(type)
        .filter(`_type == $type`)
        .params({ type })
        .defaultOrdering([
          ...ordering,
          { field: "language", direction: "asc" },
        ]),
    );
}
