import { LOCALES } from "@detske-skupiny/config/locales";

/**
 * The language every document is authored in first.
 *
 * `LOCALES` is ordered base-first - `cs` then `en` - and the same order feeds
 * `documentInternationalization`'s `supportedLanguages`, where the first entry
 * is the one the plugin treats as the source a translation is made *from*. The
 * web app says the same thing in its own words (`defaultLocale = "cs"` in
 * lib/i18n/routing.ts); this reads it off the shared config rather than
 * repeating the string, so a project that switches base language switches it
 * once.
 */
export const BASE_LANGUAGE = LOCALES[0].id;

/** The languages a base document gets translated *into*. Currently just `en`. */
export const TRANSLATION_LANGUAGES = LOCALES.slice(1).map(
  (locale) => locale.id,
);

/**
 * The badge a row wears when it is not the base language.
 *
 * Base-language documents get nothing, and that is the point. Every list in
 * the studio is overwhelmingly Czech - the base-language lists are *only*
 * Czech - so a "🌐 CS" on every row was a column of identical text that said
 * nothing and pushed the useful half of the subtitle out of view. A badge that
 * appears only on the exceptions is a badge worth reading: in the mixed
 * "all languages" lists and the translation cockpit, the marked rows are
 * exactly the translations.
 */
export const languageBadge = (language?: string): string | undefined =>
  language && language !== BASE_LANGUAGE
    ? `🌐 ${language.toUpperCase()}`
    : undefined;

/**
 * The language spelled out, for the rows where it is the whole story.
 *
 * The site's pages - home, cooperation, header, settings - are one document
 * per language, so a list of them is the *same* page twice and the language is
 * the only thing separating the two rows. {@link languageBadge}'s silence on
 * the base language is exactly wrong there: it would leave the Czech row with
 * no subtitle at all, sitting under an identical title.
 *
 * Falls back to the id for a language not in the shared config, and to a plain
 * label for a document that has no language yet - which is a real state, since
 * the field is only written on create or on translate.
 */
export const languageName = (language?: string): string => {
  if (!language) return "No language set";
  return LOCALES.find((locale) => locale.id === language)?.title ?? language;
};
