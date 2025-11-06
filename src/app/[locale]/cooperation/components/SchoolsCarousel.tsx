"use client";

import EmblaCarousel from "@/components/shared/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/cooperation/components/PreschoolCard";
import { MiniSchool } from "@/sanity/types";
import { FC } from "react";

interface Props {
  schools: MiniSchool[];
  locale?: string;
}

const SchoolsCarousel = ({ schools, locale }: Props) => {
  return (
    <EmblaCarousel
      gap={24}
      options={{
        align: "center",
      }}
    >
      {schools?.map((school) => (
        <PreschoolCard key={school.id} school={school} locale={locale} />
      ))}
    </EmblaCarousel>
  );
};

export default SchoolsCarousel;
