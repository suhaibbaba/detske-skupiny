import { groq } from "next-sanity";
import { excludeDraft, languageQuery } from "@/sanity/queries/index";
import { PageSections } from "@/sanity/types";
import { sanityFetch } from "@/sanity/utilites/fetch";

export async function fetchPageByType(type: string) {
  const query = groq`*[_type == $type && ${languageQuery}][0]{ 
      title,
      sections[]{
        ...,
        _type == "mapCollection" => {
          ...,
          "markers": *[_type == "schools" && ${excludeDraft} && ${languageQuery}]{
            "id": _id,
            "coordinate": address.mapLocation,
            name,
            "fullAddress": select(
                defined(address.street) => address.street,
                ""
              ) + select(
                defined(address.extraDistrict) => ", " + address.extraDistrict,
                ""
              ) + select(
                defined(address.city) => ", " + address.city,
                ""
              ) + select(
                defined(address.postalCode) => ", " + address.postalCode,
                ""
              ) + select(
                defined(address.country) => ", " + address.country,
                ""
              ),
            "selectedRegionId": area->region->_id,
            "slug": slug.current,
          },
          "regions": regions[]->{
            "id": _id,
            name,
          },
        },
      },
    }
  `;

  return sanityFetch<PageSections>(query, {
    type,
  });
}
