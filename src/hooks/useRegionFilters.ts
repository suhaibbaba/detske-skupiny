"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { getFilterQuery } from "@/sanity/queries/page";

export interface RegionFilterData {
  id: string;
  name?: string; // or `title` if that's your schema
  slug: string;
  totalSchools?: number;
  mainAreas?: Array<{ _id: string; name: string; slug: string; count: number }>;
  otherAreas?: Array<{
    _id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  tags?: Array<{ _id: string; name: string; slug: string; count: number }>;
  types?: Array<{
    _id: string;
    name: string;
    slug: string;
    emoji?: string; // url to emoji asset (optional)
    count: number;
  }>;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function useRegionFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, start] = useTransition();

  // region from URL: /en/prague(/...)
  const regionSlug = useMemo(() => pathname?.split("/")[2] ?? null, [pathname]);

  // fetched data
  const [region, setRegion] = useState<RegionFilterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load region data from Sanity
  useEffect(() => {
    if (!regionSlug) return;
    setIsLoading(true);
    start(async () => {
      try {
        const data: RegionFilterData = await getFilterQuery(regionSlug);
        setRegion(data ?? null);
      } finally {
        setIsLoading(false);
      }
    });
  }, [regionSlug, start]);

  // Selected filter sets from the URL (comma-separated)
  const selectedAreas = useMemo(
    () => new Set((sp.get("area") ?? "").split(",").filter(Boolean)),
    [sp],
  );
  const selectedTypes = useMemo(
    () => new Set((sp.get("type") ?? "").split(",").filter(Boolean)),
    [sp],
  );
  const selectedTags = useMemo(
    () => new Set((sp.get("tag") ?? "").split(",").filter(Boolean)),
    [sp],
  );

  // Replace QS helper (preserve other params)
  const replaceQS = useCallback(
    (mutator: (qs: URLSearchParams) => void) => {
      const qs = new URLSearchParams(sp.toString());
      mutator(qs);
      const next = qs.toString();
      start(() => router.replace(next ? `${pathname}?${next}` : pathname));
    },
    [pathname, router, sp, start],
  );

  // Generic CSV toggler
  const toggleCSVParam = useCallback(
    (key: "area" | "type" | "tag", value: string) => {
      const current = new Set((sp.get(key) ?? "").split(",").filter(Boolean));
      current.has(value) ? current.delete(value) : current.add(value);
      replaceQS((qs) => {
        if (current.size) qs.set(key, [...current].join(","));
        else qs.delete(key);
      });
    },
    [replaceQS, sp],
  );

  const toggleArea = useCallback(
    (slug: string) => toggleCSVParam("area", slug),
    [toggleCSVParam],
  );
  const toggleType = useCallback(
    (slug: string) => toggleCSVParam("type", slug),
    [toggleCSVParam],
  );
  const toggleTag = useCallback(
    (slug: string) => toggleCSVParam("tag", slug),
    [toggleCSVParam],
  );

  const clearAll = useCallback(() => {
    replaceQS((qs) => {
      qs.delete("area");
      qs.delete("type");
      qs.delete("tag");
      qs.delete("sort");
    });
  }, [replaceQS]);

  return {
    regionSlug,
    region, // data from Sanity
    isLoading, // fetching state
    isPending, // transition state
    selectedAreas,
    selectedTypes,
    selectedTags,
    toggleArea,
    toggleType,
    toggleTag,
    clearAll,
    replaceQS, // useful for "View All"
  };
}
