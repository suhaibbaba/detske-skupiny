import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { EarthGlobeIcon } from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { StructureResolverContext } from "sanity/structure";

export function createGeographicCoverageSection(
  S: StructureBuilder,
  context: StructureResolverContext,
): ListItemBuilder {
  return S.listItem()
    .title("Geographic Coverage")
    .id("geographicCoverage")
    .icon(EarthGlobeIcon)
    .child(
      S.list()
        .title("Geographic Coverage")
        .items([
          orderableDocumentListDeskItem({
            type: "countries",
            title: "Countries",
            S,
            context,
          }),
          orderableDocumentListDeskItem({
            type: "regions",
            title: "Regions",
            S,
            context,
          }),
          orderableDocumentListDeskItem({
            type: "areas",
            title: "Areas",
            S,
            context,
          }),
          orderableDocumentListDeskItem({
            type: "subareas",
            title: "Subareas",
            S,
            context,
          }),
        ]),
    );
}

export const LOCATION_TYPES = ["countries", "regions", "areas", "subareas"];
