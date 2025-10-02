import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { SanityCtaField } from "@/sanity/types";
import { fetchMiniSchools } from "@/sanity/queries";
import SchoolCard from "@/app/[locale]/home/components/SchoolCard";
import { sharedClassNames } from "@/app/[locale]/home/utility";

interface Props {
  fields: {
    title: string;
    description: string;
  };
}

interface LatestKinderGroupsSectionStyles {
  section?: BoxProps;
  container?: ContainerProps;
  title?: TypographyProps;
  description?: TypographyProps;
  grid?: BoxProps;
}

const styles: LatestKinderGroupsSectionStyles = {
  section: {
    component: "section",
    sx: {
      pt: "100px",
      pb: "74px",
      bgcolor: "primary.light",
      textAlign: "center",
    },
  },
  container: {
    component: "section",
    sx: {
      textAlign: "center",
    },
  },
  title: {
    component: "h1",
    variant: "h1",
    sx: {
      mb: "12px",
    },
  },
  description: {
    sx: {
      mb: "80px",
    },
  },
  grid: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      columnGap: "24px",
      rowGap: {
        xs: "32px",
        sm: "80px",
      },
    },
  },
};

const LatestSchoolCollection = async ({ fields }: Props) => {
  const { schools } = await fetchMiniSchools({
    numberOfSchools: 4,
  });

  return (
    <Box {...styles.section} className={sharedClassNames.schools}>
      <Container {...styles.container}>
        <Typography {...styles.title}>{fields.title}</Typography>
        <Typography {...styles.description}>{fields.description}</Typography>
        <Box {...styles.grid}>
          {schools.map((school) => (
            <SchoolCard school={school} key={school.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LatestSchoolCollection;
