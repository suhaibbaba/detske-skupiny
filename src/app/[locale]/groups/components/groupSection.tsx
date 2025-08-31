import {
  Box,
  BoxProps,
  Container,
  Grid,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { GroupPage } from "@/sanity/types";
import { FC } from "react";
import GroupItem from "@/app/[locale]/groups/components/groupItem";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { routes } from "@/routes";
import Button from "@/components/ui/button";

interface Props {
  group?: GroupPage;
}

interface GroupSectionStyles {
  container?: (backgroundCover?: string) => BoxProps;
  stack?: StackProps;
}

const styles: GroupSectionStyles = {
  container: (backgroundCover?: string) => ({
    sx: {
      background: `linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundCover})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      py: "100px",
    },
  }),
  stack: {
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },
};

const GroupSection: FC<Props> = ({ group }) => {
  if (!group) {
    return null;
  }

  const { backgroundCover, name, schoolCategories, areas, totalSchools, slug } =
    group;
  return (
    <Box
      component="section"
      {...styles.container?.(urlImageFor(backgroundCover))}
    >
      <Container>
        <Stack {...styles.stack}>
          <Box>
            <Typography variant="h2" textAlign="center">
              Kindergarten Schools in {name}
            </Typography>
            <Typography>
              There are a total of <strong>{totalSchools}</strong> schools
              listed in Prague
            </Typography>
          </Box>
          <Button variant="outlined" href={routes.catalogs(slug)}>
            View all schools in {name}
          </Button>
        </Stack>
        <Typography variant="h3" my="38px">
          BY REGION
        </Typography>
        <Grid container spacing="24px">
          {areas.map((area) => (
            <Grid size={4} key={area.id}>
              <GroupItem item={area} slug={slug} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h3" my="38px">
          BY CATEGORY
        </Typography>
        <Grid container spacing="24px">
          {schoolCategories.map((category) => (
            <Grid size={4} key={category.id}>
              <GroupItem item={category} hideNextArrow={true} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default GroupSection;
