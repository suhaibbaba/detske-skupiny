"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type Filters = {
  types: string[];
  tags: string[];
};

interface UseFiltersOptions {
  onChange?: (filters: Filters) => void; // callback to trigger fetching
}

export function useSchoolFilters({ onChange }: UseFiltersOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const types = useMemo(() => searchParams.getAll("types"), [searchParams]);
  const tags = useMemo(() => searchParams.getAll("tags"), [searchParams]);

  const filters: Filters = useMemo(() => ({ types, tags }), [types, tags]);

  // Update query params in the URL
  const updateQuery = useCallback(
    (next: Partial<Filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.types !== undefined) {
        params.delete("types");
        next.types.forEach((t) => params.append("types", t));
      }

      if (next.tags !== undefined) {
        params.delete("tags");
        next.tags.forEach((t) => params.append("tags", t));
      }

      router.replace(`?${params.toString()}`);

      if (onChange) {
        onChange({
          types: next.types ?? types,
          tags: next.tags ?? tags,
        });
      }
    },
    [router, searchParams, types, tags, onChange],
  );

  // Helpers
  const toggle = useCallback(
    (key: keyof Filters, value: string) => {
      const list = new Set(filters[key]);
      list.has(value) ? list.delete(value) : list.add(value);
      updateQuery({ [key]: [...list] });
    },
    [filters, updateQuery],
  );

  const clear = useCallback(
    (key?: keyof Filters) => {
      if (!key) {
        updateQuery({ types: [], tags: [] });
      } else {
        updateQuery({ [key]: [] });
      }
    },
    [updateQuery],
  );

  const hasActiveFilters = useMemo(
    () => filters.types.length > 0 || filters.tags.length > 0,
    [filters],
  );

  return {
    filters,
    toggleType: (slug: string) => toggle("types", slug),
    toggleTag: (slug: string) => toggle("tags", slug),
    clear,
    hasActiveFilters,
  };
}
