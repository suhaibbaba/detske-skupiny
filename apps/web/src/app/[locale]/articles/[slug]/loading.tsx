import { ArticleSkeleton } from "@/components/ui/skeleton";

/**
 * Sits below `app/[locale]/loading.tsx` in the tree, so the article shape wins
 * over the generic page shape on this route.
 */
export default function Loading() {
  return <ArticleSkeleton />;
}
