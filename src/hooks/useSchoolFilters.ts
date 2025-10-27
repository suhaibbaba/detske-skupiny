"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type Filters = {
  categories: string[];
  tags: string[];
  name: string;
};

interface UseFiltersOptions {
  onChange?: (filters: Filters) => void; // callback to trigger fetching
  debounceMs?: number;
}

export function useSchoolFilters({
  onChange,
  debounceMs = 400,
}: UseFiltersOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL
  const categories = useMemo(
    () => searchParams.getAll("categories"),
    [searchParams],
  );
  const tags = useMemo(() => searchParams.getAll("tags"), [searchParams]);
  const nameFromUrl = useMemo(
    () => searchParams.get("name") ?? "",
    [searchParams],
  );

  // Local state for typing
  const [localName, setLocalName] = useState(nameFromUrl);

  // Keep localName in sync if URL changes externally
  useEffect(() => {
    setLocalName(nameFromUrl);
  }, [nameFromUrl]);

  const filters: Filters = useMemo(
    () => ({ categories, tags, name: nameFromUrl }),
    [categories, tags, nameFromUrl],
  );

  // Update query params in the URL
  const updateQuery = useCallback(
    (next: Partial<Filters>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next.categories !== undefined) {
        params.delete("categories");
        next.categories.forEach((t) => params.append("categories", t));
      }

      if (next.tags !== undefined) {
        params.delete("tags");
        next.tags.forEach((t) => params.append("tags", t));
      }

      if (next.name !== undefined) {
        params.delete("name");
        if (next.name) params.set("name", next.name);
      }

      router.replace(`?${params.toString()}`, { scroll: false });

      if (onChange) {
        onChange({
          categories: next.categories ?? categories,
          tags: next.tags ?? tags,
          name: next.name ?? nameFromUrl,
        });
      }
    },
    [router, searchParams, categories, tags, nameFromUrl, onChange],
  );

  // Helpers for categories/tags
  const toggle = useCallback(
    (key: "categories" | "tags", value: string) => {
      const list = new Set(filters[key]);
      list.has(value) ? list.delete(value) : list.add(value);
      updateQuery({ [key]: [...list] });
    },
    [filters, updateQuery],
  );

  // Commit localName → URL
  const commitName = useCallback(() => {
    if (localName !== nameFromUrl) {
      updateQuery({ name: localName });
    }
  }, [localName, updateQuery]);

  // Debounce commit on typing
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localName !== nameFromUrl) {
        commitName();
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localName, commitName, debounceMs, nameFromUrl]);

  const clear = useCallback(
    (key?: keyof Filters) => {
      if (!key) {
        updateQuery({ categories: [], tags: [], name: "" });
      } else if (key === "name") {
        updateQuery({ name: "" });
      } else {
        updateQuery({ [key]: [] });
      }
    },
    [updateQuery],
  );

  const hasActiveFilters = useMemo(
    () =>
      filters.categories.length > 0 ||
      filters.tags.length > 0 ||
      !!filters.name,
    [filters],
  );

  return {
    filters,
    localName,
    setLocalName,
    commitName, // call on Enter or Blur
    toggleType: (slug: string) => toggle("categories", slug),
    toggleTag: (slug: string) => toggle("tags", slug),
    clear,
    hasActiveFilters,
  };
}
