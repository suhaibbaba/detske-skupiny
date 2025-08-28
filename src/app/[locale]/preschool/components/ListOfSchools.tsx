"use client";

import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import EmblaCarousel from "@/components/shared/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/preschool/components/PreschoolCard";
import { MiniSchool, SanityCtaField } from "@/sanity/types";
import { FC, useEffect, useState } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { fetchMiniSchools } from "@/sanity/queries";

interface Props {
  locale: string;
  numberOfSchools: number;
  fields: {
    title: string;
    subtitle: string;
    cta: SanityCtaField;
  };
}

interface ListOfSchoolsStyles {
  container?: BoxProps;
  headingContainer?: BoxProps;
}

const styles: ListOfSchoolsStyles = {
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "54px",
      pt: {
        xs: "120px",
        sm: "80px",
      },
      pb: {
        xs: "100px",
        sm: "120px",
      },
    },
  },
};

const ListOfSchools: FC<Props> = ({ fields, locale, numberOfSchools }) => {
  const [miniSchools, setMiniSchools] = useState<MiniSchool[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { schools } = await fetchMiniSchools({
        locale,
        numberOfSchools,
      });
      setMiniSchools(schools);
    };
    fetchData();
  }, []);

  return (
    <Box {...styles.container} data-test-selector="ListOfSchools">
      <Container>
        <PageHeadingTypography
          title={fields.title}
          description={fields.subtitle}
          ctaList={[fields.cta]}
        />
      </Container>
      <EmblaCarousel
        gap={24}
        options={{
          align: "center",
        }}
      >
        {miniSchools?.map((item) => (
          <PreschoolCard
            key={item.id}
            name={item.name}
            primaryImage={urlImageFor(item.primaryImage)}
            area={item.area}
          />
        ))}
      </EmblaCarousel>
    </Box>
  );
};

export default ListOfSchools;
