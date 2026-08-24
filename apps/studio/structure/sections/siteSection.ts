import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { PanelLeftIcon } from "@sanity/icons/PanelLeft";
import { StackCompactIcon } from "@sanity/icons/StackCompact";
import { ControlsIcon } from "@sanity/icons/Controls";

/**
 * The chrome around every page, and the settings behind it.
 *
 * Last in the sidebar on purpose: these are the documents an editor touches
 * least and the ones where a mistake is most visible, since every route on the
 * site renders them. Keeping them out of Content means a day of ordinary
 * editing never goes past the navigation menu by accident.
 */
export function createSiteSection(S: StructureBuilder): ListItemBuilder {
  return S.listItem()
    .title("Site")
    .id("site")
    .icon(CogIcon)
    .child(
      S.list()
        .title("Site")
        .items([
          S.documentTypeListItem("header").title("Header").icon(PanelLeftIcon),
          S.documentTypeListItem("footer")
            .title("Footer")
            .icon(StackCompactIcon),
          S.divider(),
          S.documentTypeListItem("settings")
            .title("Settings")
            .icon(ControlsIcon),
        ]),
    );
}

export const SITE_TYPES = ["header", "footer", "settings"];
