"use client";

import { Alert, Box, BoxProps, CircularProgress } from "@mui/material";
import SchoolGridCard from "@/app/[locale]/catalog/[...slug]/components/SchoolGridCard";
import useTranslate from "@/hooks/useTranslate";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { FC, useCallback, useEffect, useState } from "react";
import { CatalogParams } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import SchoolsCount from "@/app/[locale]/catalog/[...slug]/components/SchoolCount";

const PAGE_SIZE = 9;

interface Props {
  totalSchools?: number;
  initialFilters: {
    categories: string[];
    tags: string[];
    searchName?: string;
    catalog: CatalogParams;
  };
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
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 278px))",
      gap: "26px",
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

const SchoolList: FC<Props> = ({ initialFilters, totalSchools = 0 }) => {
  const {
    catalog: { country, region, area, subarea },
    categories,
    tags,
    searchName,
  } = initialFilters;
  const translate = useTranslate();

  const [schools, setSchools] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalSelectedSchools, setTotalSelectedSchools] = useState(0);

  useEffect(() => {
    loadMoreSchools();
  }, []);

  useEffect(() => {
    setSchools([]);
    setPage(0);
    setHasMore(true);
    setIsLoaded(false);
    setTimeout(() => {
      loadMoreSchools();
    }, 500);
  }, [country, region, area, subarea, categories, tags, searchName]);

  const loadMoreSchools = useCallback(async () => {
    if (!country) {
      return;
    }

    setLoading(true);

    const result = await fetchSchoolByFilter({
      country,
      region,
      area,
      subarea,
      categories,
      tags,
      search: searchName,
      start: page * PAGE_SIZE,
      end: (page + 1) * PAGE_SIZE,
    });

    const newSchools = result.schools ?? [];
    setSchools((prev) => [...prev, ...newSchools]);
    setHasMore(newSchools.length < result.totalSelectedSchools); // stop if less than PAGE_SIZE
    setPage((prev) => prev + 1);
    setLoading(false);
    setIsLoaded(true);
    setTotalSelectedSchools(result.totalSelectedSchools);
  }, [page, initialFilters]);

  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage: hasMore,
    onLoadMore: loadMoreSchools,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <Box {...styles.container} data-test-selector="SchoolList">
      <SchoolsCount filterTotal={totalSelectedSchools} total={totalSchools} />
      <Box {...styles.listContainer} data-test-selector="">
        {schools.length > 0 && (
          <>
            {schools.map((school) => (
              <SchoolGridCard key={school.id} school={school} />
            ))}
            <div ref={sentryRef}></div>
          </>
        )}
      </Box>
      {loading && (
        <Box {...styles.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
      {isLoaded && schools.length === 0 && (
        <Alert severity="info" sx={{ maxWidth: 600 }}>
          {translate("noSchoolsFound")}
        </Alert>
      )}
    </Box>
  );
};

export default SchoolList;
