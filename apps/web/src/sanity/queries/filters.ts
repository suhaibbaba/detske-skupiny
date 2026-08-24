/**
 * GROQ filter snippets shared by every query.
 *
 * They live here rather than in the barrel because the query modules build
 * their GROQ at module scope now. Importing them from `queries/index.ts` -
 * which re-exports those same modules - is a cycle, and it fails at import
 * time rather than on first call.
 */
export const languageQuery = `(language == $locale || !defined(language))`;
export const excludeDraft = `!(_id in path("drafts.**"))`;
