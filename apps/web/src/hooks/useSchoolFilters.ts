"use client";

import { useCallback, useMemo } from "react";
import { useQueryStates } from "nuqs";
import { catalogParsers } from "@/app/[locale]/catalog/[...slug]/searchParams";
import { useCatalogTransition } from "@/app/[locale]/catalog/[...slug]/components/CatalogTransition";

export type Filters = {
  categories: string[];
  tags: string[];
  name: string;
};

/**
 * Reads and writes the catalog filters, which live in the URL and nowhere else.
 *
 * Every setter navigates (`shallow: false`), so the server re-renders the page
 * with the new filters and returns the new list. There is no client-side
 * refetch to keep in step with it - this hook used to call `router.replace`
 * *and* hand the same filters to a fetch in SchoolListClient, which meant two
 * requests for one click.
 *
 * Any filter change also clears `page`: the reset is part of the same URL
 * update, so paging state cannot survive into a different result set.
 */
export function useSchoolFilters() {
  const { startTransition } = useCatalogTransition();

  const [state, setState] = useQueryStates(catalogParsers, {
    shallow: false,
    history: "push",
    scroll: false,
    startTransition,
  });

  const filters: Filters = useMemo(
    () => ({ categories: state.categories, tags: state.tags, name: state.name }),
    [state.categories, state.tags, state.name],
  );

  const toggle = useCallback(
    (key: "categories" | "tags", value: string) => {
      const next = new Set(filters[key]);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }

      void setState({ [key]: [...next], page: null });
    },
    [filters, setState],
  );

  const setName = useCallback(
    (name: string) => {
      void setState({ name: name || null, page: null });
    },
    [setState],
  );

  const clear = useCallback(
    (key?: keyof Filters) => {
      if (!key) {
        void setState({ categories: null, tags: null, name: null, page: null });
        return;
      }

      void setState(
        key === "name" ? { name: null, page: null } : { [key]: null, page: null },
      );
    },
    [setState],
  );

  const hasActiveFilters =
    filters.categories.length > 0 || filters.tags.length > 0 || !!filters.name;

  return {
    filters,
    setName,
    toggleType: (slug: string) => toggle("categories", slug),
    toggleTag: (slug: string) => toggle("tags", slug),
    clear,
    hasActiveFilters,
  };
}
