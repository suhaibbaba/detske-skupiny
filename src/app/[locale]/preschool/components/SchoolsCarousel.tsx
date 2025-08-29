"use client";

import EmblaCarousel from "@/components/shared/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/preschool/components/PreschoolCard";
import { MiniSchool } from "@/sanity/types";
import { FC } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

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
      {schools?.map((item) => (
        <PreschoolCard
          key={item.id}
          name={item.name}
          primaryImage={urlImageFor(item.primaryImage)}
          area={item.area}
        />
      ))}
    </EmblaCarousel>
  );
};

export default SchoolsCarousel;
