"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type Filters = {
  types: string[];
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
  const types = useMemo(() => searchParams.getAll("types"), [searchParams]);
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
    () => ({ types, tags, name: nameFromUrl }),
    [types, tags, nameFromUrl],
  );

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

      if (next.name !== undefined) {
        params.delete("name");
        if (next.name) params.set("name", next.name);
      }

      router.replace(`?${params.toString()}`);

      if (onChange) {
        onChange({
          types: next.types ?? types,
          tags: next.tags ?? tags,
          name: next.name ?? nameFromUrl,
        });
      }
    },
    [router, searchParams, types, tags, nameFromUrl, onChange],
  );

  // Helpers for types/tags
  const toggle = useCallback(
    (key: "types" | "tags", value: string) => {
      const list = new Set(filters[key]);
      list.has(value) ? list.delete(value) : list.add(value);
      updateQuery({ [key]: [...list] });
    },
    [filters, updateQuery],
  );

  // Commit localName → URL
  const commitName = useCallback(() => {
    updateQuery({ name: localName });
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
        updateQuery({ types: [], tags: [], name: "" });
      } else if (key === "name") {
        updateQuery({ name: "" });
      } else {
        updateQuery({ [key]: [] });
      }
    },
    [updateQuery],
  );

  const hasActiveFilters = useMemo(
    () => filters.types.length > 0 || filters.tags.length > 0 || !!filters.name,
    [filters],
  );

  return {
    filters,
    localName,
    setLocalName,
    commitName, // call on Enter or Blur
    toggleType: (slug: string) => toggle("types", slug),
    toggleTag: (slug: string) => toggle("tags", slug),
    clear,
    hasActiveFilters,
  };
}
