import {
  Box,
  BoxProps,
  Button,
  Container,
  Grid,
  Stack,
  StackProps,
  Typography,
} from "@mui/material";
import { Region } from "@/sanity/types";
import { FC } from "react";
import GroupItem from "@/app/[locale]/groups/components/groupItem";

interface Props {
  group?: Region;
}

interface GroupSectionStyles {
  container?: (backgroundCover: string) => BoxProps;
  stack?: StackProps;
}

const styles: GroupSectionStyles = {
  container: (backgroundCover: string) => ({
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

  return (
    <Box component="section" {...styles.container?.(group.backgroundCover)}>
      <Container>
        <Stack {...styles.stack}>
          <Box>
            <Typography variant="h2" textAlign="center">
              Kindergarten Schools in {group?.name}
            </Typography>
            <Typography>
              There are a total of <strong>{group.totalSchools}</strong> schools
              listed in Prague
            </Typography>
          </Box>
          <Button variant="outlined">View all schools in {group?.name}</Button>
        </Stack>
        <Typography variant="h3" my="38px">
          BY REGION
        </Typography>
        <Grid container spacing="24px">
          {group.areas.map((area) => (
            <Grid size={4} key={area.name}>
              <GroupItem item={area} />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h3" my="38px">
          BY CATEGORY
        </Typography>
        <Grid container spacing="24px">
          {group.schoolTypes.map((schoolType) => (
            <Grid size={4} key={schoolType.name}>
              <GroupItem item={schoolType} hideNextArrow={true} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default GroupSection;
