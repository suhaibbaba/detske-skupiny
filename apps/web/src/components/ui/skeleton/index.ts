/**
 * Layout-true placeholders.
 *
 * Each one is built from the dimensions of the component it stands in for, not
 * from numbers that look about right - see `geometry.ts` for the ones the
 * catalog card and its grid share with the real thing. The bar is that
 * swapping a skeleton for the content moves nothing on screen.
 *
 * The wave animation is a theme default (`components.MuiSkeleton`), and it is
 * switched off under `prefers-reduced-motion`, which MUI does not do on its
 * own.
 */
export { default as ArticleSkeleton } from "@/components/ui/skeleton/ArticleSkeleton";
export { default as CardGridSkeleton } from "@/components/ui/skeleton/CardGridSkeleton";
export { default as MapSkeleton } from "@/components/ui/skeleton/MapSkeleton";
export { default as PageSkeleton } from "@/components/ui/skeleton/PageSkeleton";
