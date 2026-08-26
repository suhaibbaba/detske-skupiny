"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import Button from "@/components/ui/button";
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
import { useSchoolFilters } from "@/features/catalog/useSchoolFilters";
import { loadMoreSchools } from "@/features/catalog/actions";
import {
  catalogParsers,
  type LoadMoreInput,
} from "@/features/catalog/searchParams";
import type { SxProps, Theme } from "@mui/material/styles";
import { SCHOOL_GRID } from "@/components/ui/skeleton/geometry";

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

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "26px",
  },
  listContainer: {
    display: "grid",
    gridTemplateColumns: SCHOOL_GRID.templateColumns,
    gap: SCHOOL_GRID.gap,
  },
  loadingContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  /**
   * The empty state spans the whole grid rather than sitting in the first
   * column, which is what an `Alert` dropped into a grid child does.
   */
  empty: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center",
    py: "48px",
  },
  emptyTitle: {
    fontWeight: 700,
    fontSize: "20px",
    color: "custom.textHeading",
  },
  emptyBody: {
    maxWidth: 420,
  },
} satisfies Record<string, SxProps<Theme>>;

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
  const { hasActiveFilters, clear } = useSchoolFilters();

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
    <Box sx={styles.container} data-test-selector="SchoolList">
      <SchoolsMap markers={markers} />
      <SchoolsCount
        filterTotal={totalSelectedSchools}
        total={totalSchools}
        filterProps={filterProps}
      />
      <Box
        data-test-selector="SchoolGrid"
        aria-busy={isPending}
        data-pending={isPending ? "true" : undefined}
        sx={{
          ...styles.listContainer,
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
          /*
           * Nothing matched.
           *
           * The message carries its own way out, not just `noSchoolsFound`:
           * someone who has ticked four filters needs the "clear all" the
           * sidebar offers, and on mobile that sidebar is a drawer - so at the
           * moment the grid empties, the control that would fix it is off
           * screen.
           *
           * `role="status"` with `aria-live` because the grid empties in
           * response to a filter change on the same page: there is no
           * navigation for a screen reader to announce, so without this the
           * result of the interaction is silent.
           */
          !loadingMore &&
          !isPending && (
            <Box sx={styles.empty} role="status" aria-live="polite">
              <Typography sx={styles.emptyTitle}>
                {translate("noSchoolsFound")}
              </Typography>
              {hasActiveFilters && (
                <>
                  <Typography sx={styles.emptyBody}>
                    {translate("noSchoolsFoundHint")}
                  </Typography>
                  <Button variant="primary" onClick={() => clear()}>
                    {translate("clearAll")}
                  </Button>
                </>
              )}
            </Box>
          )
        )}
      </Box>
      {loadingMore && (
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default SchoolList;
