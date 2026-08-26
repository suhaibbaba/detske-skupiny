import { BASE_LANGUAGE } from "@/utility/language";

/**
 * The GROQ half of the language story.
 *
 * `BASE_LANGUAGE` and the badge live in utility/language.ts because the schema
 * previews need them too; what is here is only what the sidebar asks the
 * dataset. Re-exported so a section imports one module rather than two.
 */
export { BASE_LANGUAGE, TRANSLATION_LANGUAGES } from "@/utility/language";

/**
 * "This document belongs to the base language."
 *
 * The `!defined(language)` half matters. `language` is written by the
 * internationalization plugin when a translation is created and by the initial
 * value templates in structure/templates.ts when a document is created from
 * one of these lists - but a document created before either existed, or
 * imported, or made through the global "New document" menu on an older studio,
 * simply has no `language` at all. Filtering on `language == "cs"` alone would
 * make those documents unreachable from the sidebar: invisible in the base
 * list because the field is missing, and invisible in an `== "en"` list too.
 * Including them here puts every such document in exactly one list - this one,
 * the one an editor looking for it would open.
 *
 * It is also the form the link picker in sanity.config.ts already uses, so the
 * studio answers "which documents are in my language" the same way everywhere.
 */
export const IN_BASE_LANGUAGE = `(language == $baseLanguage || !defined(language))`;

/** Params for any filter built from {@link IN_BASE_LANGUAGE}. */
export const BASE_LANGUAGE_PARAMS = { baseLanguage: BASE_LANGUAGE };

/**
 * The reference from a document to its counterpart in `$language`.
 *
 * @sanity/document-internationalization keeps no pointer on the documents
 * themselves. It writes a separate `translation.metadata` document whose
 * `translations` array holds one entry per language, and the only route from a
 * document to its translation is to find the metadata document that references
 * it and read the array back.
 *
 * Each entry is an `internationalizedArrayReferenceValue`:
 * `{_key, _type, language, value: {_ref}}`. `language` is the field the plugin
 * writes today (`LANGUAGE_FIELD_NAME` in sanity-plugin-internationalized-array);
 * `_key` carries the language id in older plugin versions, and still does for
 * documents written by them. Matching either is what makes these queries work
 * across both shapes.
 *
 * Use inside a filter, where `^` is the document being tested.
 */
const translationRef = (language: string) => `*[
    _type == "translation.metadata" &&
    references(^._id)
  ][0].translations[language == "${language}" || _key == "${language}"][0]`;

/**
 * True when the document being filtered has no live counterpart in `language`.
 *
 * Covers all three ways a pair can be broken: no metadata document at all, a
 * metadata document with no entry for that language, and an entry pointing at
 * a document that has since been deleted.
 *
 * `value->_id` rather than `value._ref` is what catches the third. Deleting a
 * document does not clean the reference out of the metadata array, so the
 * `_ref` outlives its target; the dereference is what tells a dangling
 * reference (resolves to null) from a live one.
 *
 * Read in one direction it means "this base document is still untranslated",
 * in the other "this translation has lost its original" - the translation
 * cockpit uses it for both.
 */
export const withoutTranslationIn = (language: string) =>
  `!defined(${translationRef(language)}.value->_id)`;
