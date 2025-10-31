import { groq } from "next-sanity";
import {
  MarkerData,
  MiniSchool,
  PageHero,
  SchoolFilterQueryParams,
  SchoolPageQueryParams,
} from "@/sanity/types";
import { languageQuery } from "@/sanity/queries/index";
import { clientFetch } from "@/sanity/utilites/fetch";

export async function fetchSchoolPage(params: SchoolPageQueryParams) {
  const useCountryCount = params.country && !params.region;
  const useRegionCount = params.country && params.region;

  const query = groq`{
    "pageHero": *[_type == "schoolList" && ${languageQuery}][0].pageHero,
    "totalSchools": select(
      ${useRegionCount} => *[_type == "region" && ${languageQuery} && slug.current == $region][0].schoolCount,
      ${useCountryCount} => *[_type == "country" && ${languageQuery} && slug.current == $country][0].schoolCount,
      0
    ),
  }`;

  return clientFetch<{
    pageHero: PageHero;
    totalSchools: number;
  }>(query, {
    country: params.country ?? null,
    region: params.region ?? null,
  });
}

export async function fetchSchoolByFilter(params: SchoolFilterQueryParams) {
  const baseFilter = `
    _type == "schools" &&
    (language == $locale || !defined(language)) &&
    (!defined($country) || countrySlug == $country) &&
    (!defined($region) || regionSlug == $region) &&
    (!defined($area) || area->slug.current == $area) &&
    (!defined($subarea) || subarea->slug.current == $subarea)`;
  const extendedFilter =
    baseFilter +
    `&& (!defined($categories) || count($categories) == 0 || count(categories[@->slug.current in $categories]) > 0) &&
    (!defined($tags) || count($tags) == 0 || count(tags[@->slug.current in $tags]) > 0) && 
    (!defined($search) || lower(name) match "*" + lower($search) + "*")
  `;

  const query = groq`{
    "totalSelectedSchools": count(*[${extendedFilter}]),
    "markers": *[${baseFilter}]{
      "id": _id,
      "coordinate": address.mapLocation,
      name,
      "fullAddress": 
        select(defined(address.street) => address.street,  "") +
        select(defined(address.extraDistrict) => ", " + address.extraDistrict, "") + 
        select(defined(address.city) => ", " + address.city, "") + 
        select(defined(address.postalCode) => ", " + address.postalCode, "") +
        select(defined(address.country) => ", " + address.country, ""),
        "slug": slug.current,
    },
    "schools": *[${extendedFilter}] | order((defined(types[0]->highPriority) && types[0]->highPriority == true) desc)[${params.start}...${params.end}]  {
      "id": _id,
      name,
      "logo": logo.asset->url,
      "slug": slug.current,
      shortSummary,
      website,
      "primaryImage": select(defined(primaryImages[0]) => primaryImages[0].asset->url, null),
      "region": area->region->{ "id": _id, name, "slug": slug.current },
      area->{ "id": _id, name, "slug": slug.current },
      tags[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      },
      types[]->{
        "id": _id,
        name,
        highPriority,
        "icon": icon.asset->url,
        "backgroundColor": backgroundColor.hex,
      },
      categories[]->{
        "id": _id,
        name,
        "slug": slug.current,
        "borderColor": borderColor.hex,
      },
    },
  }`;

  return clientFetch<{
    totalSelectedSchools: number;
    markers?: MarkerData[];
    schools: MiniSchool[];
  }>(query, {
    country: params.country ?? null,
    region: params.region ?? null,
    area: params.area ?? null,
    subarea: params.subarea ?? null,
    categories: params.categories ?? [],
    tags: params.tags ?? [],
    search: params.search ?? null,
    start: params.start ?? 0,
    end: params.end ?? 10000,
  });
}
