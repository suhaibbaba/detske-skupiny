import { groq } from "next-sanity";
import { client } from "../client";
import { School } from "@/sanity/types";
import { Author, Blog, BlogPageContent } from "@/types/blog";
import { GroupsProps } from "@/app/[locale]/groups/groupsPageClient";
import { PerSchool } from "@/app/[locale]/preschool/components/ListOfSchools";

export async function getPageByType(type: string, params: { locale: string }) {
  const query = groq`*[_type == $type && language == $language][0]{ 
    title, 
    sections[]{
      ...,
    }
}`;
  return client.fetch<{ title?: string; sections?: any[] }>(query, {
    type,
    language: params.locale,
  });
}

export async function getDirectPageByType(type: string) {
  const query = groq`*[_type == $type][0]{ 
      title,
      ...,
    }`;
  return client.fetch<{ title?: string }>(query, { type });
}

export async function getGroups() {
  const query = groq`{
  "regions": *[_type == "region"]{
    name,
    "slug": slug.current,
    "backgroundCover": backgroundCover.asset->url,

    "areas": *[_type == "area" && references(^._id)]{
      _id,
      name,
      "slug": slug.current,
      "schoolCount": count(*[_type == "school" && references(^._id)])
    },

    "totalSchools": count(*[
      _type == "school" &&
      area->region._ref == ^._id
    ]),

    "schoolTypes": *[_type == "schoolType"]{
      name,
      "slug": slug.current,
      "emoji": emoji.asset->url,
      "schoolCount": count(*[
        _type == "school" &&
        area->region._ref == ^.^._id &&
        references(^._id)
      ])
    }
  },

  "content": *[_type == "group"][0]{
    title,
    description,
    ctas[]{text, url,variant,openInNewTab},
  }
}`;

  return client.fetch<GroupsProps>(query);
}

export async function getFilterQuery(regionSlug: string) {
  const query = groq`
*[_type == "region" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug.current,

  // Totals for "All"
  "totalSchools": count(*[
    _type == "school" &&
    area->region->slug.current == $slug
  ]),

  // MAIN AREAS (isMain == true)
  "mainAreas": *[
    _type == "area" &&
    region->slug.current == $slug &&
    coalesce(isMain, false) == true
  ]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area._ref == ^._id
    ])
  } | order(name asc),

  // OTHER AREAS (isMain != true)
  "otherAreas": *[
    _type == "area" &&
    region->slug.current == $slug &&
    coalesce(isMain, false) != true
  ]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area._ref == ^._id
    ])
  } | order(name asc),

  // TAGS that actually exist in this region (with counts)
  "tags": *[_type == "tag"]{
    _id,
    name,
    "slug": slug.current,
    "count": count(*[
      _type == "school" &&
      area->region->slug.current == $slug &&
      references(^._id)         // school.tags[] -> tag
    ])
  }[count > 0] | order(name asc),

  // TYPES (kinder types) that exist in this region (with counts)
  "types": *[_type == "schoolType"]{
    _id,
    name,
    "slug": slug.current,
    "emoji": emoji.asset->url,
    "count": count(*[
      _type == "school" &&
      area->region->slug.current == $slug &&
      references(^._id)         // school.types[] -> schoolType
    ])
  }[count > 0] | order(name asc)
}`;
  return client.fetch(query, { slug: regionSlug });
}

export async function getBlogs() {
  const query = groq`{
    "content": *[_type == "blog"][0]{
      title,
      description,
      ctas[]{ text, url, variant, openInNewTab }
    },
    "categories": array::unique(*[_type == "blog"].categories[]),
    "blogs": *[_type == "blogDetails"] | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": image.asset->url,
      readTime,
      publishedAt,
      category,
      author->{
        _id,
        name,
        "image": avatar.asset->url,
        bio
      }
    },
    "writers": *[_type == "author"]{
      name,
      role,
      "image": avatar.asset->url,
    } | order(blogCount desc)[0..7]
  }`;

  return client.fetch<{
    content: BlogPageContent;
    categories: string[];
    blogs: Blog[];
    writers: Author[];
  }>(query);
}

export async function getBlogDetails(params: { slug: string }) {
  const query = groq`{
    "content": *[_type == "blog"][0]{
      title,
      description,
      ctas[]{ text, url, variant, openInNewTab }
    },
    "categories": array::unique(*[_type == "blog"].categories[]),
    "blog":*[_type == "blogDetails" && slug.current == $slug][0]{
      _id,
      title,
      "slug": slug.current,
      "image": image.asset->url,
      readTime,
      publishedAt,
      content,
      author->{
        _id,
        name,
        "image": avatar.asset->url,
        bio
      }
    },
  }`;

  return client.fetch<{
    content: BlogPageContent;
    categories: string[];
    blog: Blog;
  }>(query, params);
}

export async function getSchoolBySlug(params: { slug: string }) {
  const query = groq`
  {
    "school" :*[_type == "school" && slug.current == $slug][0]{
      "id": _id,
      "logo": logo.asset->url,
      name,
      "slug": slug.current,
      website,
      primaryImages[]{
        alt,
        caption,
        "url": select(defined(asset) => asset->url, null)
      },
      "primaryImage": select(defined(primaryImages[0].asset) => primaryImages[0].asset->url, null),
      area->{ _id, name },
      address,
      location,
      contacts[],
      links,
      types[]->{
        _id,
        name,
        "slug": slug.current
      },
      transportation[],
      about,
      highlights,
      timetable[],
      isPrivate,
      gallery[]{
        alt,
        caption,
        "url": select(defined(asset) => asset->url, null)
      }
    }
  }
  `;
  return client.fetch<{ school: School }>(query, params);
}

export async function getPreschool() {
  const query = groq`{
    "preschools": *[_type == "school"][0...20] {
      "id": _id,
      name,
      "slug": slug.current,
      "primaryImage": select(
        defined(primaryImages[0]) => primaryImages[0].asset->url,
        null
      ),
      area->{_id, name}
    }
  }`;

  return client.fetch<{
    preschools: PerSchool[];
  }>(query);
}
