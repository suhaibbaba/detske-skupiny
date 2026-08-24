import type { ListItemBuilder, StructureBuilder } from "sanity/structure";
import { TranslateIcon } from "@sanity/icons/Translate";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { ClockIcon } from "@sanity/icons/Clock";
import { UnknownIcon } from "@sanity/icons/Unknown";
import { StringIcon } from "@sanity/icons/String";
import { BY_NAME_OR_TITLE, BY_UPDATED } from "@/structure/lists";
import {
  BASE_LANGUAGE,
  TRANSLATION_LANGUAGES,
  withoutTranslationIn,
} from "@/structure/language";

/**
 * Where translation work is looked at, rather than done.
 *
 * The work itself happens in the language menu on each document; nothing here
 * creates or edits a translation. What was missing was any way to see the
 * state of it - which schools still have no English version, what was
 * translated this week, and which English documents are pointing at a Czech
 * original that no longer exists. Those three questions were previously
 * answered by scrolling a mixed list and comparing rows by eye.
 *
 * All three are plain `documentList` filters, and no custom tool was built.
 * That is the whole point: a filter is one query the studio already knows how
 * to run, it re-subscribes live as documents change, and every row gets its
 * type's own preview, its own actions and its own edit route for free. A
 * custom tool pane would have to re-implement each of those to end up saying
 * the same three things.
 *
 * The pairing lives in a separate `translation.metadata` document rather than
 * on the documents themselves - see structure/language.ts for the shape and
 * why the GROQ looks the way it does.
 */

/** The types worth tracking: the ones with many documents and real prose. */
const TRANSLATED_TYPES = ["schools", "blogs"];

const ofTranslatedTypes = `_type in $types`;

export function createTranslationsSection(
  S: StructureBuilder,
): ListItemBuilder {
  /**
   * Only `en` today. Written as a loop over `TRANSLATION_LANGUAGES` so adding
   * a third locale to the shared config adds its two lists here rather than
   * silently leaving it untracked.
   */
  const perLanguage = TRANSLATION_LANGUAGES.flatMap((language) => {
    const upper = language.toUpperCase();

    return [
      S.listItem()
        .id(`missing-${language}`)
        .title(`Missing ${upper}`)
        .icon(WarningOutlineIcon)
        .child(
          S.documentList()
            .id(`missing-${language}`)
            .title(`Missing ${upper} translations`)
            .filter(
              `${ofTranslatedTypes} && language == $baseLanguage && ${withoutTranslationIn(language)}`,
            )
            .params({ types: TRANSLATED_TYPES, baseLanguage: BASE_LANGUAGE })
            .defaultOrdering(BY_NAME_OR_TITLE)
            .canHandleIntent(() => false),
        ),

      S.listItem()
        .id(`recent-${language}`)
        .title(`Recently translated (${upper})`)
        .icon(ClockIcon)
        .child(
          S.documentList()
            .id(`recent-${language}`)
            .title(`Recently translated (${upper})`)
            .filter(`${ofTranslatedTypes} && language == $language`)
            .params({ types: TRANSLATED_TYPES, language })
            .defaultOrdering(BY_UPDATED)
            .canHandleIntent(() => false),
        ),

      /**
       * An English document whose Czech original is gone.
       *
       * Deleting a document does not remove it from the metadata array, so
       * this state is invisible everywhere else: the translation still looks
       * paired, and the site keeps serving an English page whose Czech
       * counterpart 404s. The filter dereferences the stored reference, which
       * is what tells a live pairing from a dangling one.
       */
      S.listItem()
        .id(`orphaned-${language}`)
        .title(`Orphaned ${upper}`)
        .icon(UnknownIcon)
        .child(
          S.documentList()
            .id(`orphaned-${language}`)
            .title(`Orphaned ${upper} documents`)
            .filter(
              `${ofTranslatedTypes} && language == $language && ${withoutTranslationIn(BASE_LANGUAGE)}`,
            )
            .params({ types: TRANSLATED_TYPES, language })
            .defaultOrdering(BY_NAME_OR_TITLE)
            .canHandleIntent(() => false),
        ),
    ];
  });

  return S.listItem()
    .title("Translations")
    .id("translations")
    .icon(TranslateIcon)
    .child(
      S.list()
        .title("Translations")
        .items([
          ...perLanguage,
          S.divider(),
          /**
           * The UI string table. Not a translation of a document - it is the
           * labels the site renders around them, one row per keyword with a
           * column per locale, so it belongs with translation work rather than
           * with Settings.
           */
          S.listItem()
            .id("dictionary")
            .title("Dictionary")
            .icon(StringIcon)
            .child(
              S.document()
                .schemaType("dictionaries")
                .documentId("dictionaries")
                .title("Dictionary"),
            ),
        ]),
    );
}

export const TRANSLATION_TYPES = ["dictionaries"];
