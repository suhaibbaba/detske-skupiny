import { groq } from "next-sanity";
import { GroupPage, PageHero } from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchGroupPage() {
  const query = groq /* GraphQL */ `{
    "content": *[_type == "group" && ${languageQuery}][0].pageHero,
    
    // Fetch all regions with pre-calculated schoolCount
    "regions": *[_type == "regions" && ${languageQuery}]{
      "id": _id,
      "totalSchools": schoolCount,
      name,
      "slug": fullSlug,
      "backgroundCover": backgroundCover.asset->url,
      "regionRef": _id
    },
    
    // Fetch all areas once, grouped by region
    "areasByRegion": *[_type == "areas" && ${languageQuery}]{
      "id": _id,
      name,
      "slug": fullSlug,
      schoolCount,
      "regionRef": region._ref
    },
    
    // Fetch school categories once
    "schoolCategories": *[_type == "schoolCategories" && ${languageQuery}]{
      "id": _id,
      name,
      "slug": slug.current,
      "emoji": emoji.asset->url
    },
    
    // Fetch schools grouped by region and category (if schoolCount is not pre-calculated)
    "schoolsByRegionAndCategory": *[_type == "schools" && ${languageQuery}]{
      "regionRef": area->region._ref,
      "categoryRefs": categories[]._ref
    },
    
    // Fetch country data
    "country": *[_type == "countries" && ${languageQuery}][0]{
      "id": _id,
      "name": name,
      "slug": slug.current,
      "backgroundCover": backgroundCover.asset->url,
      "totalSchools": schoolCount
    }
  }`;

  const data = await clientFetch<{
    regions?: any[];
    areasByRegion?: any[];
    schoolCategories?: any[];
    schoolsByRegionAndCategory?: any[];
    country?: any;
    content?: PageHero;
  }>(query);

  // Transform data on the client side
  if (!data.regions) return { content: data.content };

  // Group areas by region
  const areasByRegionMap = new Map<string, any[]>();
  data.areasByRegion?.forEach((area) => {
    if (!areasByRegionMap.has(area.regionRef)) {
      areasByRegionMap.set(area.regionRef, []);
    }
    areasByRegionMap.get(area.regionRef)!.push(area);
  });

  // Count schools by region and category
  const schoolCountMap = new Map<string, Map<string, number>>();
  data.schoolsByRegionAndCategory?.forEach((school) => {
    if (!school.regionRef) return;

    if (!schoolCountMap.has(school.regionRef)) {
      schoolCountMap.set(school.regionRef, new Map());
    }
    const regionMap = schoolCountMap.get(school.regionRef)!;

    school.categoryRefs?.forEach((catRef: string) => {
      regionMap.set(catRef, (regionMap.get(catRef) || 0) + 1);
    });
  });

  // Build final groups structure
  const groups: GroupPage[] = data.regions.map((region) => ({
    ...region,
    areas: areasByRegionMap.get(region.regionRef) || [],
    schoolCategories:
      data.schoolCategories?.map((cat) => ({
        ...cat,
        schoolCount: schoolCountMap.get(region.regionRef)?.get(cat.id) || 0,
      })) || [],
  }));

  // Add country as last item if it exists
  if (data.country) {
    groups.push({
      ...data.country,
      areas: data.regions.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        schoolCount: r.totalSchools,
      })),
      schoolCategories:
        data.schoolCategories?.map((cat) => {
          // Sum across all regions for country total
          let totalCount = 0;
          schoolCountMap.forEach((regionMap) => {
            totalCount += regionMap.get(cat.id) || 0;
          });
          return {
            ...cat,
            schoolCount: totalCount,
          };
        }) || [],
    });
  }

  return {
    groups,
    content: data.content,
  };
}
