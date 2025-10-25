import { Suspense } from "react";
import { fetchSchoolByFilter } from "@/sanity/queries/school-list";
import { CatalogParams } from "@/app/[locale]/catalog/[...slug]/utilites/catalog";
import { Box, BoxProps, CircularProgress } from "@mui/material";
import SchoolListClient from "@/app/[locale]/catalog/[...slug]/components/SchoolListClient";
import { Props as FilterSidebarProps } from "@/app/[locale]/catalog/[...slug]/components/Filters/FilterSidebar";

const PAGE_SIZE = 9;

interface Props {
  totalSchools?: number;
  initialFilters: {
    categories: string[];
    tags: string[];
    searchName?: string;
    catalog: CatalogParams;
  };
  filterProps: FilterSidebarProps;
}

interface SchoolListWrapperStyles {
  loadingBox?: BoxProps;
}

const styles: SchoolListWrapperStyles = {
  loadingBox: {
    sx: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      py: 4,
    },
  },
};

// Server Component - renders on server, great for SEO
const SchoolListWrapper = async ({
  initialFilters,
  totalSchools = 0,
  filterProps,
}: Props) => {
  const {
    catalog: { country, region, area, subarea },
    categories,
    tags,
    searchName,
  } = initialFilters;

  if (!country) {
    return null;
  }

  // Fetch initial data on the server
  const initialData = await fetchSchoolByFilter({
    country,
    region,
    area,
    subarea,
    categories,
    tags,
    search: searchName,
    start: 0,
    end: PAGE_SIZE,
  });

  return (
    <Suspense
      fallback={
        <Box {...styles.loadingBox}>
          <CircularProgress />
        </Box>
      }
    >
      <SchoolListClient
        initialSchools={initialData.schools ?? []}
        initialTotalSelected={initialData.totalSelectedSchools}
        totalSchools={totalSchools}
        initialFilters={initialFilters}
        pageSize={PAGE_SIZE}
        filterProps={filterProps}
      />
    </Suspense>
  );
};

export default SchoolListWrapper;
