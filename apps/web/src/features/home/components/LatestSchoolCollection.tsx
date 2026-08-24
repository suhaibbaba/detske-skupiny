import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Container, Typography } from "@mui/material";

import { fetchMiniSchools } from "@/features/school/queries";
import SchoolCard from "@/features/home/components/SchoolCard";
import { sharedClassNames } from "@/features/home/utils";

interface Props {
  fields: {
    title: string;
    description: string;
  };
  /** Supplied by Zone, which spreads the page's route params onto sections. */
  locale: string;
}

const styles = {
  section: {
    pt: { xs: "50px", md: "100px" },
    pb: { xs: "50px", md: "74px" },
    bgcolor: "primary.light",
    textAlign: "center",
  },
  container: {
    textAlign: "center",
  },
  title: {
    mb: "12px",
  },
  description: {
    mb: { xs: "40px", md: "80px" },
  },
  grid: {
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
} satisfies Record<string, SxProps<Theme>>;

const LatestSchoolCollection = async ({ fields, locale }: Props) => {
  const { schools } = await fetchMiniSchools({
    numberOfSchools: 4,
    locale,
  });

  return (
    <Box
      sx={styles.section}
      component="section"
      className={sharedClassNames.schools}
    >
      <Container sx={styles.container} component="section">
        <Typography sx={styles.title} component="h1" variant="h1">
          {fields.title}
        </Typography>
        <Typography sx={styles.description}>{fields.description}</Typography>
        <Box sx={styles.grid}>
          {schools.map((school) => (
            <SchoolCard school={school} key={school.id} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LatestSchoolCollection;
