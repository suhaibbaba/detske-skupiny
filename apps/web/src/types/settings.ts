import type { SettingsQueryResult } from "@detske-skupiny/types";

/**
 * The single `settings` document, exactly as `settingsQuery` projects it.
 *
 * Nullable: the query is `*[_type == "settings"][0]`, and a dataset without a
 * settings document returns null. Taken from the generated query result rather
 * than written by hand, so `socialLinks` is the object of named URLs the schema
 * actually defines.
 */
export type Settings = SettingsQueryResult;
