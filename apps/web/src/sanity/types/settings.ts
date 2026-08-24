import type { SettingsQueryResult } from "@detske-skupiny/types";

/**
 * The single `settings` document, exactly as `settingsQuery` projects it.
 *
 * Nullable: the query is `*[_type == "settings"][0]`, and a dataset without a
 * settings document returns null. The hand-written type this replaces was not
 * only non-nullable but wrong about `socialLinks`, which it declared as an
 * array of link fields while the schema has it as one object of named URLs.
 */
export type Settings = SettingsQueryResult;
