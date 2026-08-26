/**
 * A template rather than nothing.
 *
 * It renders its children unchanged, which looks like a no-op and is not: a
 * `template.tsx` remounts on every navigation where a `layout.tsx` would
 * persist, and that is what resets per-page component state between routes.
 *
 * Route-level fallbacks live in `loading.tsx` - the generic one beside this
 * file, and an article-shaped one on the article route.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}
