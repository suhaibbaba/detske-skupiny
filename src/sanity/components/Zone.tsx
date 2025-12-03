import React from "react";
import { SECTION_COMPONENTS } from "@/sanity/sections/registry";
import { PageSections } from "@/sanity/types";

interface ZoneProps {
  sections?: PageSections["sections"];
  types: string | string[] | "all";
  [key: string]: any;
}

const Zone: React.FC<ZoneProps> = ({ sections, types, ...props }) => {
  let matches: ZoneProps["sections"];

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
        return Cmp ? <Cmp key={s._key} {...{ fields: s }} {...props} /> : null;
      })}
    </>
  );
};

export default Zone;
