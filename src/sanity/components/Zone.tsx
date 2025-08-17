import React from "react";
import { SECTION_COMPONENTS } from "@/sanity/sections/registry";

type AnySection = { _key: string; _type: string; [k: string]: any };

interface ZoneProps {
  sections?: AnySection[];
  types: string | string[] | "all";
}

const Zone: React.FC<ZoneProps> = ({ sections, types }) => {
  let matches: AnySection[];

  if (!sections || sections.length === 0) {
    return;
  }

  if (types === "all") {
    matches = sections;
  } else {
    const allow = new Set(Array.isArray(types) ? types : [types]);
    matches = sections.filter((s) => allow.has(s._type));
  }

  if (!matches.length) return null;

  return (
    <>
      {matches.map((s) => {
        const Cmp = SECTION_COMPONENTS[s._type];
        return Cmp ? <Cmp key={s._key} {...{ fields: s }} /> : null;
      })}
    </>
  );
};

export default Zone;
