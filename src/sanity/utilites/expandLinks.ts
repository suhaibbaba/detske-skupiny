import { groq } from "next-sanity";
import { client } from "@/sanity/client";

type AnyRecord = Record<string, any>;

const isLink = (v: any) => v && v._type === "link";
const isRef = (v: any) => v && (v._ref || v._id);

function walk(
  obj: any,
  visit: (node: any, path: (string | number)[]) => void,
  path: (string | number)[] = [],
) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => walk(v, visit, path.concat(i)));
  } else if (obj && typeof obj === "object") {
    visit(obj, path);
    for (const k of Object.keys(obj)) walk(obj[k], visit, path.concat(k));
  }
}

// 1) Collect all internalLink refs inside any link object
function collectInternalLinkRefs(data: any): string[] {
  const ids = new Set<string>();
  walk(data, (node) => {
    if (isLink(node) && node.internalLink && isRef(node.internalLink)) {
      ids.add(node.internalLink._ref || node.internalLink._id);
    }
  });
  return Array.from(ids);
}

// 2) Fetch map of refs -> expanded doc (slug/title)
async function fetchRefMap(ids: string[]) {
  if (ids.length === 0) return new Map<string, any>();
  const query = groq`*[_id in $ids]{ 
    _id, 
    _type, 
    "slug": select(defined(slug.current)=>slug.current, slug), 
    title,
    _type == "countries" => {
      "text": name,
      "slug": slug.current,
    },
    _type == "regions" => {
      "text": name,
      "slug": fullSlug,
    },
    _type == "areas" => {
      "text": name,
      "slug": fullSlug,
    },
    _type == "subareas" => {
      "text": name,
      "slug": fullSlug,
    },
  }`;
  const docs = await client.fetch(query, { ids });
  const map = new Map<string, any>();
  for (const d of docs) {
    map.set(d._id, d);
  }
  return map;
}

// 3) Replace refs with expanded docs
function replaceRefs(data: any, refMap: Map<string, any>) {
  walk(data, (node) => {
    if (isLink(node) && node.internalLink && isRef(node.internalLink)) {
      const id = node.internalLink._ref || node.internalLink._id;
      const expanded = refMap.get(id);
      if (expanded) node.internalLink = expanded;
    }
  });
  return data;
}

/** Expand all `link.internalLink` refs within any fetched payload */
export async function expandLinks<T = AnyRecord>(data: T): Promise<T> {
  const ids = collectInternalLinkRefs(data);
  const refMap = await fetchRefMap(ids);
  return replaceRefs(structuredClone(data), refMap) as T;
}
