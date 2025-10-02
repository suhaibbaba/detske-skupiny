import {
  Box,
  BoxProps,
  ButtonProps,
  Container,
  Grid,
  Stack,
  StackProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import { GroupPage } from "@/sanity/types";
import { FC } from "react";
import GroupItem from "@/app/[locale]/groups/components/groupItem";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import { routes } from "@/routes";
import Button from "@/components/ui/button";
import { getTranslateServer } from "@/hooks/useTranslate";

interface Props {
  group?: GroupPage;
}

interface GroupSectionStyles {
  container?: (backgroundCover?: string) => BoxProps;
  stack?: StackProps;
  sectionTitle?: TypographyProps;
  viewAllContainer?: BoxProps;
  viewAllButton?: ButtonProps;
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
  sectionTitle: {
    variant: "h3",
    sx: {
      my: "38px",
      textTransform: "uppercase",
    },
  },
  viewAllContainer: {
    sx: {
      mt: "38px",
      display: "flex",
      justifyContent: "center",
    },
  },
  viewAllButton: {
    variant: "ghost",
  },
};

const GroupSection: FC<Props> = async ({ group }) => {
  if (!group) {
    return null;
  }

  const translate = await getTranslateServer();

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
            <Typography variant="h2" textAlign="left">
              {translate("kindergartenSchoolsInRegion", {
                region: name,
              })}
            </Typography>
            <Typography>
              {translate("totalOfSchoolByRegion", {
                totalSchools,
                region: name,
              })}
            </Typography>
          </Box>
        </Stack>
        <Typography {...styles.sectionTitle}>
          {translate("byRegion")}
        </Typography>
        <Grid container spacing="24px">
          {areas.map((area) => (
            <Grid size={4} key={area.id}>
              <GroupItem item={area} slug={slug} />
            </Grid>
          ))}
        </Grid>
        <Typography {...styles.sectionTitle}>
          {translate("byCategory")}
        </Typography>
        <Grid container spacing="24px">
          {schoolCategories.map((category) => (
            <Grid size={4} key={category.id}>
              <GroupItem item={category} hideNextArrow={true} />
            </Grid>
          ))}
        </Grid>
        <Box {...styles.viewAllContainer}>
          <Button {...styles.viewAllButton} href={routes.catalogs(slug)}>
            {translate("viewAllSchoolsInRegion", { region: name })}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GroupSection;
