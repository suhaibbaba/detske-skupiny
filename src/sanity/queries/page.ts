import { groq } from "next-sanity";
import { client } from "../client";
import { sectionsProjection } from "./sections.groq";

export async function getPageByType(type: string) {
  const query = groq`*[_type == $type][0]{ title, ${sectionsProjection} }`;
  return client.fetch<{ title?: string; sections: any[] }>(query, { type });
}
