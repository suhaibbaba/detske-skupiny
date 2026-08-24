import React from "react";
import { SECTION_COMPONENTS } from "@/sections/registry";
import type { PageSection } from "@/types";

interface ZoneProps {
  sections?: PageSection[] | null;
  types: string | string[] | "all";
  /**
   * Route params forwarded to every section - `{ locale }`, and whatever else
   * the page's own params carry. Sections that need one declare it; the rest
   * ignore it, which is why this is a bag rather than a named prop.
   */
  [key: string]: unknown;
}

const Zone: React.FC<ZoneProps> = ({ sections, types, ...props }) => {
  if (!sections || sections.length === 0) {
    return;
  }

  const matches =
    types === "all"
      ? sections
      : (() => {
          const allow = new Set(Array.isArray(types) ? types : [types]);
          return sections.filter((section) => allow.has(section._type));
        })();

  if (!matches.length) return null;

  return (
    <>
      {matches.map((section) => {
        const Section = SECTION_COMPONENTS[section._type];
        return Section ? (
          <Section key={section._key} {...{ fields: section }} {...props} />
        ) : null;
      })}
    </>
  );
};

export default Zone;
