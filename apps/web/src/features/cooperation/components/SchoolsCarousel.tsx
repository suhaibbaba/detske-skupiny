/**
 * Deliberately not a Client Component.
 *
 * The only thing here that needs a browser is `EmblaCarousel`. With the
 * directive on this file, every `PreschoolCard` it renders was client code
 * too; without it, the cards render on the server and are handed to Embla as
 * children, so only the carousel itself hydrates.
 */
import dynamic from "next/dynamic";
import PreschoolCard from "@/features/cooperation/components/PreschoolCard";
import { MiniSchool } from "@/types";

/**
 * Embla loads in its own chunk.
 *
 * This carousel sits well below the fold on both routes that render one - the
 * home page and the cooperation page - and embla-carousel-react was in their
 * first-load JavaScript regardless. No `ssr: false`: the cards must still be
 * server-rendered, and they are, because they arrive here as children.
 */
const EmblaCarousel = dynamic(() => import("@/components/ui/EmblaCarousel"));

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
