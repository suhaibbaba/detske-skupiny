import type { ComponentType } from "react";
import type {
  ListItemBuilder,
  StructureBuilder,
  StructureResolverContext,
} from "sanity/structure";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { MarkerIcon } from "@sanity/icons/Marker";
import { PinIcon } from "@sanity/icons/Pin";
import { SortIcon } from "@sanity/icons/Sort";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import WorldLocation from "@/icons/WorldLocation";
import { BY_RANK } from "@/structure/lists";
import { BASE_LANGUAGE_PARAMS, IN_BASE_LANGUAGE } from "@/structure/language";
import { GEOGRAPHY_TEMPLATES } from "@/structure/templates";

/**
 * Geography, browsed the way it is shaped.
 *
 * The dataset is a four-level tree - a country has regions, a region has
 * areas, an area has subareas - and it used to be presented as four flat lists
 * side by side. That reads fine until there is more than one country: "Areas"
 * is then every area everywhere in one alphabetical run, and finding the areas
 * of Středočeský kraj means knowing their names already. Worse, flat lists say
 * nothing about the tree, so nothing shows that a region has no areas in it
 * yet - which is exactly the state that leaves a catalog page empty.
 *
 * So the browse path is a drill-down: countries, then that country's regions,
 * then that region's areas, then its subareas. Each level opens on the
 * document itself plus the level below it, so editing is one click and not a
 * detour.
 *
 * `Reorder` is a separate folder because drag-to-sort and drill-down cannot be
 * the same pane. The orderable list is a custom component that owns its own
 * rows - it has to, to write `orderRank` as you drag - and a component pane
 * cannot host a child. The browse lists sort by `orderRank` as well, so both
 * show the same order; only one of them can change it.
 */

/**
 * One level of the tree: the documents of `type` whose `referenceField` points
 * at `parentId`.
 *
 * Three things are worth naming here.
 *
 * `.canHandleIntent(() => false)` keeps this pane out of the way of edit
 * intents. A reference to a region elsewhere in the studio should open that
 * region; if this list claimed the intent it would answer with a drill-down
 * list instead of the editor.
 *
 * The initial value template carries `parentId` down, so "new" from inside a
 * country creates a region *in that country*. Without it the new document
 * would not match the filter of the list it was created from, and would
 * vanish the moment it was saved.
 *
 * The base-language filter matches the rest of the studio: translations are
 * reached from the document's language menu, not by browsing to them.
 */
function childLevel(
  S: StructureBuilder,
  options: {
    id: string;
    title: string;
    icon: ComponentType;
    type: string;
    referenceField: string;
    parentId: string;
    templateId: string;
  },
) {
  const { id, title, icon, type, referenceField, parentId, templateId } =
    options;

  const list = S.documentList()
    .id(id)
    .title(title)
    .schemaType(type)
    .filter(
      `_type == $type && ${referenceField}._ref == $parentId && ${IN_BASE_LANGUAGE}`,
    )
    .params({ type, parentId, ...BASE_LANGUAGE_PARAMS })
    .defaultOrdering(BY_RANK)
    .canHandleIntent(() => false)
    .initialValueTemplates([
      S.initialValueTemplateItem(templateId, { parentId }),
    ]);

  return { list, item: S.listItem().id(id).title(title).icon(icon) };
}

/**
 * A document, then the level beneath it.
 *
 * The first row is the document's own preview - name, media and all - rather
 * than a generic "Edit this" label, so the pane repeats what was just clicked
 * and it stays obvious which country you are inside.
 */
function documentThen(
  S: StructureBuilder,
  documentId: string,
  schemaType: string,
  title: string,
  child: ListItemBuilder,
) {
  return S.list()
    .id(`${schemaType}-detail`)
    .title(title)
    .items([
      S.documentListItem().id(documentId).schemaType(schemaType),
      S.divider(),
      child,
    ]);
}

/** An area's subareas. The bottom of the tree, so no further drill-down. */
function subareasIn(S: StructureBuilder, areaId: string): ListItemBuilder {
  const { list, item } = childLevel(S, {
    id: "subareasInArea",
    title: "Subareas",
    icon: PinIcon,
    type: "subareas",
    referenceField: "area",
    parentId: areaId,
    templateId: GEOGRAPHY_TEMPLATES.subareas,
  });

  return item.child(list);
}

/** A region's areas, each of which opens on its own subareas. */
function areasIn(S: StructureBuilder, regionId: string): ListItemBuilder {
  const { list, item } = childLevel(S, {
    id: "areasInRegion",
    title: "Areas",
    icon: MarkerIcon,
    type: "areas",
    referenceField: "region",
    parentId: regionId,
    templateId: GEOGRAPHY_TEMPLATES.areas,
  });

  return item.child(
    list.child((areaId) =>
      documentThen(S, areaId, "areas", "Area", subareasIn(S, areaId)),
    ),
  );
}

/** A country's regions, each of which opens on its own areas. */
function regionsIn(S: StructureBuilder, countryId: string): ListItemBuilder {
  const { list, item } = childLevel(S, {
    id: "regionsInCountry",
    title: "Regions",
    icon: WorldLocation,
    type: "regions",
    referenceField: "country",
    parentId: countryId,
    templateId: GEOGRAPHY_TEMPLATES.regions,
  });

  return item.child(
    list.child((regionId) =>
      documentThen(S, regionId, "regions", "Region", areasIn(S, regionId)),
    ),
  );
}

/** The root of the drill-down. */
function browseCountries(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .id("countriesBrowse")
    .title("Countries")
    .icon(EarthGlobeIcon)
    .child(
      S.documentList()
        .id("countriesBrowse")
        .title("Countries")
        .schemaType("countries")
        .filter(`_type == "countries" && ${IN_BASE_LANGUAGE}`)
        .params(BASE_LANGUAGE_PARAMS)
        .defaultOrdering(BY_RANK)
        .canHandleIntent(() => false)
        .child((countryId) =>
          documentThen(
            S,
            countryId,
            "countries",
            "Country",
            regionsIn(S, countryId),
          ),
        ),
    );
}

/**
 * The four drag-to-sort lists.
 *
 * Unfiltered by language on purpose: `orderRank` is per document, so a Czech
 * region and its English translation each carry their own, and the web app
 * orders whichever set matches the locale it is rendering. Hiding the
 * translations here would leave half the ranks unreachable.
 */
function reorder(
  S: StructureBuilder,
  context: StructureResolverContext,
): ListItemBuilder {
  const levels: { type: string; title: string; icon: ComponentType }[] = [
    { type: "countries", title: "Countries", icon: EarthGlobeIcon },
    { type: "regions", title: "Regions", icon: WorldLocation },
    { type: "areas", title: "Areas", icon: MarkerIcon },
    { type: "subareas", title: "Subareas", icon: PinIcon },
  ];

  return S.listItem()
    .id("geographyReorder")
    .title("Reorder")
    .icon(SortIcon)
    .child(
      S.list()
        .id("geographyReorder")
        .title("Reorder")
        .items(
          levels.map(({ type, title, icon }) =>
            orderableDocumentListDeskItem({ type, title, icon, S, context }),
          ),
        ),
    );
}

export function createGeographySection(
  S: StructureBuilder,
  context: StructureResolverContext,
): ListItemBuilder {
  return S.listItem()
    .title("Geography")
    .id("geography")
    .icon(EarthGlobeIcon)
    .child(
      S.list()
        .title("Geography")
        .items([browseCountries(S), S.divider(), reorder(S, context)]),
    );
}

export const GEOGRAPHY_TYPES = ["countries", "regions", "areas", "subareas"];
