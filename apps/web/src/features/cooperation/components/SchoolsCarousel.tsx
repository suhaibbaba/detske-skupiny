/**
 * Deliberately not a Client Component.
 *
 * The only thing here that needs a browser is `EmblaCarousel`. With the
 * directive on this file, every `PreschoolCard` it renders was client code
 * too; without it, the cards render on the server and are handed to Embla as
 * children, so only the carousel itself hydrates.
 */
import EmblaCarousel from "@/components/ui/EmblaCarousel";
import PreschoolCard from "@/features/cooperation/components/PreschoolCard";
import { MiniSchool } from "@/types";
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
