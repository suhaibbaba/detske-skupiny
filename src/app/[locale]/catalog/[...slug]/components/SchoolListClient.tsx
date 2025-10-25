"use client";

import { Alert, Box, BoxProps, CircularProgress } from "@mui/material";
import SchoolGridCard from "@/app/[locale]/catalog/[...slug]/components/SchoolGridCard";
import useTranslate from "@/hooks/useTranslate";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { FC, useCallback, useEffect, useState, useRef } from "react";
import { CatalogParams } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import SchoolsCount from "@/app/[locale]/catalog/[...slug]/components/SchoolCount";
import { Props as FilterSidebarProps } from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";

interface Props {
  initialSchools: any[];
  initialTotalSelected: number;
  totalSchools: number;
  pageSize: number;
  initialFilters: {
    categories: string[];
    tags: string[];
    searchName?: string;
    catalog: CatalogParams;
  };
  filterProps: FilterSidebarProps;
}

interface SchoolListStyles {
  container?: BoxProps;
  listContainer?: BoxProps;
  loadingContainer?: BoxProps;
}

const styles: SchoolListStyles = {
  container: {
    sx: {
      display: "flex",
      flexDirection: "column",
      gap: "26px",
      mt: {
        xs: "44px",
        sm: "0",
      },
    },
  },
  listContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(auto-fit, minmax(232px, 1fr))",
        md: "repeat(auto-fit, minmax(260px, 278px))",
      },
      gap: {
        xs: "20px",
        md: "24px",
      },
    },
  },
  loadingContainer: {
    sx: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
};

const SchoolListClient: FC<Props> = ({
  initialSchools,
  initialTotalSelected,
  totalSchools,
  pageSize,
  initialFilters,
  filterProps,
}) => {
  const {
    catalog: { country, region, area, subarea },
    categories,
    tags,
    searchName,
  } = initialFilters;
  const translate = useTranslate();

  const [schools, setSchools] = useState<any[]>(initialSchools);
  const [page, setPage] = useState(1); // Start at 1 since we already have page 0
  const [hasMore, setHasMore] = useState(initialSchools.length >= pageSize);
  const [loading, setLoading] = useState(false);
  const [totalSelectedSchools, setTotalSelectedSchools] =
    useState(initialTotalSelected);

  const prevFiltersRef = useRef(initialFilters);

  // Reset when filters change
  useEffect(() => {
    const filtersChanged =
      prevFiltersRef.current.catalog.country !== country ||
      prevFiltersRef.current.catalog.region !== region ||
      prevFiltersRef.current.catalog.area !== area ||
      prevFiltersRef.current.catalog.subarea !== subarea ||
      JSON.stringify(prevFiltersRef.current.categories) !==
        JSON.stringify(categories) ||
      JSON.stringify(prevFiltersRef.current.tags) !== JSON.stringify(tags) ||
      prevFiltersRef.current.searchName !== searchName;

    if (filtersChanged) {
      prevFiltersRef.current = initialFilters;
      resetAndLoadFirstPage();
    }
  }, [country, region, area, subarea, categories, tags, searchName]);

  const resetAndLoadFirstPage = async () => {
    if (!country) {
      return;
    }

    setLoading(true);
    setSchools([]);
    setPage(1);

    try {
      const result = await fetchSchoolByFilter({
        country,
        region,
        area,
        subarea,
        categories,
        tags,
        search: searchName,
        start: 0,
        end: pageSize,
      });

      setSchools(result.schools ?? []);
      setHasMore((result.schools ?? []).length >= pageSize);
      setTotalSelectedSchools(result.totalSelectedSchools);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreSchools = useCallback(async () => {
    if (!country || loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await fetchSchoolByFilter({
        country,
        region,
        area,
        subarea,
        categories,
        tags,
        search: searchName,
        start: page * pageSize,
        end: (page + 1) * pageSize,
      });

      const newSchools = result.schools ?? [];
      setSchools((prev) => {
        const all = [...prev, ...newSchools];
        return Array.from(new Map(all.map((s) => [s.id, s])).values());
      });
      setHasMore(newSchools.length >= pageSize);
      setPage((prev) => prev + 1);
      setTotalSelectedSchools(result.totalSelectedSchools);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    country,
    region,
    area,
    subarea,
    categories,
    tags,
    searchName,
    pageSize,
    loading,
  ]);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: loadMoreSchools,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <Box {...styles.container} data-test-selector="SchoolList">
      <SchoolsCount
        filterTotal={totalSelectedSchools}
        total={totalSchools}
        filterProps={filterProps}
      />
      <Box {...styles.listContainer}>
        {schools.length > 0 ? (
          <>
            {schools.map((school) => (
              <SchoolGridCard key={school.id} school={school} />
            ))}
            {hasMore && <div ref={sentryRef} />}
          </>
        ) : (
          !loading && (
            <Alert severity="info" sx={{ maxWidth: 600, gridColumn: "1 / -1" }}>
              {translate("noSchoolsFound")}
            </Alert>
          )
        )}
      </Box>
      {loading && (
        <Box {...styles.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default SchoolListClient;
