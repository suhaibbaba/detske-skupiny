"use client";

import { Alert, Box, BoxProps, CircularProgress } from "@mui/material";
import SchoolGridCard from "@/features/catalog/components/SchoolGridCard";
import useTranslate from "@/hooks/useTranslate";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { FC, useCallback, useRef, useState } from "react";
import { useQueryState } from "nuqs";
import SchoolsCount from "@/features/catalog/components/SchoolCount";
import { Props as FilterSidebarProps } from "@/features/catalog/components/filters/FilterSidebar";
import { MarkerData, MiniSchool } from "@/types";
import SchoolsMap from "@/features/catalog/components/SchoolsMap";
import { useCatalogTransition } from "@/features/catalog/components/CatalogTransition";
import { loadMoreSchools } from "@/features/catalog/actions";
import {
  catalogParsers,
  type LoadMoreInput,
} from "@/features/catalog/searchParams";

interface Props {
  /**
   * Pages 1..N rendered by the server, where N is `?page=`. The component
   * never refetches these - a filter change is a navigation, and the server
   * sends a new list with it.
   */
  schools: MiniSchool[];
  markers: MarkerData[];
  totalSelectedSchools: number;
  totalSchools: number;
  /** Everything the load-more action needs to continue this exact query. */
  loadMoreScope: Omit<LoadMoreInput, "page">;
  initialPage: number;
  hasMore: boolean;
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
    },
  },
  listContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "repeat(auto-fit, minmax(232px, 1fr))",
        md: "repeat(auto-fit, minmax(232px, 280px))",
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

const SchoolList: FC<Props> = ({
  schools: serverSchools,
  markers,
  totalSelectedSchools,
  totalSchools,
  loadMoreScope,
  initialPage,
  hasMore: initialHasMore,
  filterProps,
}) => {
  const translate = useTranslate();
  const { isPending } = useCatalogTransition();

  // Pages fetched by the action since this render. The server-rendered pages
  // stay in props; only what paging adds lives here.
  const [appended, setAppended] = useState<MiniSchool[]>([]);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(initialPage);

  // Written shallowly: the action has already returned the data, so telling
  // the server would only make it render a page the browser is holding. On a
  // reload or a shared link the server reads it and renders pages 1..N.
  const [, setPage] = useQueryState(
    "page",
    catalogParsers.page.withOptions({
      shallow: true,
      history: "push",
      scroll: false,
    }),
  );

  const schools = appended.length
    ? [...serverSchools, ...appended]
    : serverSchools;

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return;
    }

    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    try {
      const result = await loadMoreSchools({
        ...loadMoreScope,
        page: nextPage,
      });

      pageRef.current = nextPage;
      setAppended((prev) => {
        const all = [...prev, ...result.schools];
        // The action pages a live dataset; a document moving between pages
        // could otherwise appear twice.
        return Array.from(new Map(all.map((s) => [s.id, s])).values());
      });
      setHasMore(result.hasMore);
      void setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadMoreScope, loadingMore, setPage]);

  const [sentryRef] = useInfiniteScroll({
    loading: loadingMore || isPending,
    hasNextPage: hasMore,
    onLoadMore: loadMore,
    disabled: false,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <Box {...styles.container} data-test-selector="SchoolList">
      <SchoolsMap markers={markers} />
      <SchoolsCount
        filterTotal={totalSelectedSchools}
        total={totalSchools}
        filterProps={filterProps}
      />
      <Box
        {...styles.listContainer}
        aria-busy={isPending}
        data-pending={isPending ? "true" : undefined}
        sx={{
          ...styles.listContainer?.sx,
          opacity: isPending ? 0.5 : 1,
          transition: "opacity 150ms ease-in-out",
        }}
      >
        {schools.length > 0 ? (
          <>
            {schools.map((school) => (
              <SchoolGridCard key={school.id} school={school} />
            ))}
            {hasMore && <div ref={sentryRef} />}
          </>
        ) : (
          !loadingMore &&
          !isPending && (
            <Alert severity="info" sx={{ maxWidth: 600, gridColumn: "1 / -1" }}>
              {translate("noSchoolsFound")}
            </Alert>
          )
        )}
      </Box>
      {loadingMore && (
        <Box {...styles.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default SchoolList;
