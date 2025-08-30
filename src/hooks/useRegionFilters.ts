"use client";

import { SchoolFilterModel } from "@/sanity/types";
import { useEffect, useMemo, useState } from "react";
import { fetchSchoolFilterQuery } from "@/sanity/queries";
import { useQueryStates, parseAsArrayOf, parseAsString } from "nuqs";

export interface SchoolFilterQueryType {
  area: string;
  type: string;
  tag: string;
}

interface Props {
  regionSlug: string;
  locale: string;
}

export function useRegionFilters({ regionSlug, locale }: Props) {
  const [{ area, type, tag }, setQS] = useQueryStates(
    {
      area: parseAsArrayOf(parseAsString).withDefault([]),
      type: parseAsArrayOf(parseAsString).withDefault([]),
      tag: parseAsArrayOf(parseAsString).withDefault([]),
      sort: parseAsString.withDefault(""),
    },
    { history: "replace", shallow: false }, // avoid polluting history stack
  );

  const [filter, setFilter] = useState<SchoolFilterModel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!regionSlug) {
      return;
    }

    let mounted = true;
    setIsLoading(true);
    (async () => {
      try {
        const data = await fetchSchoolFilterQuery({
          locale,
          regionSlug,
        });
        if (mounted) {
          setFilter(data ?? null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [regionSlug]);

  // Sets (handy for quick lookups)
  const selectedAreas = useMemo(() => new Set(area), [area]);
  const selectedTypes = useMemo(() => new Set(type), [type]);
  const selectedTags = useMemo(() => new Set(tag), [tag]);

  const toggleListKey = (key: "area" | "type" | "tag", value: string) =>
    setQS((prev) => {
      const list = new Set(prev[key] ?? []);
      list.has(value) ? list.delete(value) : list.add(value);
      const arr = [...list];
      return { [key]: arr.length ? arr : null }; // null removes the key from URL
    });

  const toggleArea = (slug: string) => toggleListKey("area", slug);
  const toggleType = (slug: string) => toggleListKey("type", slug);
  const toggleTag = (slug: string) => toggleListKey("tag", slug);

  const clearAll = () =>
    setQS({ area: null, type: null, tag: null, sort: null });

  const clearKey = (key: "area" | "type" | "tag") => setQS({ [key]: null });

  const hasActiveFilters = useMemo(
    () =>
      selectedAreas.size > 0 || selectedTypes.size > 0 || selectedTags.size > 0,
    [selectedAreas, selectedTypes, selectedTags],
  );

  return {
    filter,
    totalSchools: filter?.totalSchools ?? 0,
    totalSchoolsFiltered: filter?.totalSchoolsFiltered ?? 0,
    isLoading,
    selectedAreas,
    selectedTypes,
    selectedTags,
    toggleArea,
    toggleType,
    toggleTag,
    clearAll,
    clearKey,
    hasActiveFilters,
  };
}
