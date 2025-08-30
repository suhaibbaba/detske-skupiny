"use client";

import EmblaCarousel from "@/components/shared/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/preschool/components/PreschoolCard";
import { MiniSchool } from "@/sanity/types";
import { FC } from "react";

interface Props {
  schools: MiniSchool[];
}

const SchoolsCarousel: FC<Props> = async ({ schools }) => {
  return (
    <EmblaCarousel
      gap={24}
      options={{
        align: "center",
      }}
    >
      {schools?.map((school) => (
        <PreschoolCard key={school.id} school={school} />
      ))}
    </EmblaCarousel>
  );
};

export default SchoolsCarousel;
