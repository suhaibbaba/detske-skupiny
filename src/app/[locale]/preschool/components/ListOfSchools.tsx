"use client";

import { Box, BoxProps, Container } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import EmblaCarousel from "@/components/shared/EmblaCarousel";
import PreschoolCard from "@/app/[locale]/preschool/components/PreschoolCard";
import { SanityCtaField, SanityImageField } from "@/sanity/types";
import { FC, useEffect, useState } from "react";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { getPreschool } from "@/sanity/queries";

export interface PerSchool {
  id: string;
  name: string;
  primaryImage: SanityImageField;
  area?: { _id: string; name: string };
}

interface Props {
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

const ListOfSchools: FC<Props> = ({ fields }) => {
  const [preschools, setPreschools] = useState<PerSchool[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { preschools } = await getPreschool();
      setPreschools(preschools);
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
        {preschools?.map((item) => (
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
