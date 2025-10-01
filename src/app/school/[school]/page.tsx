import { fetchSchoolBySlug } from "@/sanity/queries";
import { redirect } from "next/navigation";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import {
  Box,
  BoxProps,
  Container,
  ContainerProps,
  ListItemProps,
  ListProps,
  Typography,
  TypographyProps,
} from "@mui/material";
import SchoolGallery, {
  SchoolGalleryStyles,
} from "@/app/school/[school]/components/SchoolGallery";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import AboutSchool from "@/app/school/[school]/components/AboutSchool";
import SchoolHighlights from "@/app/school/[school]/components/SchoolHighlights";
import SchoolTimetable from "@/app/school/[school]/components/SchoolTimetable";
import SchoolHeader from "@/app/school/[school]/components/SchoolHeader";
import InfoCardGrid from "@/app/school/[school]/components/InfoCardGrid";
import { formatMessage } from "@/utilites/strings";
import Location from "@/components/icons/Location";
import Link from "@/components/ui/link";
import { routes } from "@/routes";

interface PageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
  contentWrapper?: BoxProps;
  name?: TypographyProps;
  logo?: BoxProps;
  schoolGalleryStyles?: SchoolGalleryStyles;
  list?: ListProps;
  listItem?: ListItemProps;
  sectionHeading?: TypographyProps;
}

const styles: PageStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui3)",
      },
    },
  },
  pageContainer: {
    sx: {
      pb: {
        xs: "100px",
        sm: "164px",
      },
    },
  },
  container: {
    sx: {
      mt: "100px",
    },
  },
  name: {
    variant: "h2",
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
  },
  logo: {
    sx: {
      width: "100%",
      height: "100%",
      maxWidth: "35px",
      maxHeight: "35px",
    },
  },
  sectionHeading: {
    color: "custom.ui13",
    fontSize: "24px",
    fontWeight: 600,
    mt: "80px",
    mb: "20px",
  },
  list: {
    disablePadding: true,
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "12px",
    },
  },
  listItem: {
    disableGutters: true,
    disablePadding: true,
    sx: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
  },
};

const Page = async ({ params }: PageProps<{ school: string }>) => {
  const { school: schoolSlug } = await params;
  if (!schoolSlug) {
    return redirect(routes.home);
  }

  const { pageHero, school } = await fetchSchoolBySlug({
    slug: schoolSlug,
  });

  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={pageHero.title}
          description={pageHero.description}
          ctaList={pageHero.ctas}
        />
      </PageLayout>
      <Container {...styles.container}>
        <Box {...styles.contentWrapper}>
          <SchoolHeader school={school} />
          <SchoolGallery gallery={school.primaryImages} />
          <InfoCardGrid
            items={[
              {
                title: "Location",
                icon: <Location />,
                content: (
                  <Box>
                    <Typography>
                      {formatMessage(
                        "{0}, {1}",
                        school.address?.street,
                        school.address?.city,
                      )}
                    </Typography>
                    <Typography>{school.address?.postalCode}</Typography>
                  </Box>
                ),
              },
              {
                title: "Transportation Nearby",
                icon: <Location />,
                content: (
                  <Box>
                    {school.transportation?.map((item) => (
                      <Typography key={item.name}>
                        {item.name} ({item.distance})
                      </Typography>
                    ))}
                  </Box>
                ),
              },
              {
                title: "Contacts",
                icon: <Location />,
                content: (
                  <Box>
                    {school.contacts?.map((item) => (
                      <Typography
                        key={item.name}
                        sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                      >
                        {formatMessage(
                          `{0}  - {1} - {2}`,
                          <Link href={`tel:${item.phone}`}>{item.phone}</Link>,
                          item.name,
                          item.role,
                        )}
                      </Typography>
                    ))}
                  </Box>
                ),
              },
              {
                title: "Website & Social Media",
                icon: <Location />,
                content: (
                  <Box>
                    {school.links?.map((link) => (
                      <Link link={link} key={link.id} />
                    ))}
                  </Box>
                ),
              },
            ]}
          />
          <AboutSchool about={school.about} />
          <SchoolHighlights highlights={school.highlights} />
          <SchoolTimetable timetable={school.timetable} />
          <SchoolGallery gallery={school.gallery} showTitle={true} />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
