import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { GroupPage } from "@/types";
import { FC } from "react";
import GroupItem from "@/features/catalog/components/GroupItem";
import { urlImageFor } from "@/lib/sanity/imageUrl";
import { getLocalizedRoutes } from "@/routes";
import Button from "@/components/ui/button";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocale } from "next-intl/server";
import type { SxProps, Theme } from "@mui/material/styles";

interface Props {
  group?: GroupPage;
}

/** The background is content, so this one is a function of the row. */
const containerSx = (backgroundCover: string | undefined): SxProps<Theme> => ({
  background: `linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${backgroundCover})`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  py: { xs: "50px", md: "100px" },
});

const styles = {
  stack: {
    gap: "20px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    my: "38px",
    textTransform: "uppercase",
  },
  viewAllContainer: {
    mt: "38px",
    display: "flex",
    justifyContent: "center",
  },
  viewAllButton: {},
} satisfies Record<string, SxProps<Theme>>;

const GroupSection: FC<Props> = async ({ group }) => {
  const locale = await getLocale();

  if (!group) {
    return null;
  }

  const translate = await getTranslateServer();

  const { backgroundCover, name, schoolCategories, areas, totalSchools, slug } =
    group;

  return (
    <Box component="section" sx={containerSx(urlImageFor(backgroundCover))}>
      <Container>
        <Stack sx={styles.stack} direction="row">
          <Box>
            <Typography
              variant="h2"
              sx={{
                textAlign: "left",
              }}
            >
              {name}
            </Typography>
          </Box>
        </Stack>
        <Typography sx={styles.sectionTitle} variant="h3">
          {translate("byRegion")}
        </Typography>
        <Grid container spacing="24px">
          {areas.map((area) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={area.id}>
              <GroupItem item={area} />
            </Grid>
          ))}
        </Grid>
        <Typography sx={styles.sectionTitle} variant="h3">
          {translate("byCategory")}
        </Typography>
        <Grid container spacing="24px">
          {schoolCategories.map((category) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category.id}>
              <GroupItem item={category} baseSlug={slug} hideNextArrow={true} />
            </Grid>
          ))}
        </Grid>
        <Box sx={styles.viewAllContainer}>
          <Button
            variant="ghost"
            href={getLocalizedRoutes(locale).catalogs(slug)}
          >
            {translate("viewAllSchoolsInRegion", { region: name ?? "" })}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default GroupSection;
