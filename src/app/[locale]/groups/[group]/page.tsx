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
} from "@/app/[locale]/groups/[group]/components/SchoolGallery";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import ContentSchool from "@/app/[locale]/groups/[group]/components/ContentSchool";
import SchoolTimetable from "@/app/[locale]/groups/[group]/components/SchoolTimetable";
import SchoolHeader from "@/app/[locale]/groups/[group]/components/SchoolHeader";
import InfoCardGrid from "@/app/[locale]/groups/[group]/components/InfoCardGrid";
import { formatMessage } from "@/utilites/strings";
import Location from "@/components/icons/Location";
import Link from "@/components/ui/link";
import { getLocalizedRoutes } from "@/routes";
import SchoolMap from "@/app/[locale]/groups/[group]/components/SchoolMap";
import { getLocale } from "next-intl/server";

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
    textTransform: "capitalize",
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

const Page = async ({ params }: PageProps<{ group: string }>) => {
  const { group: groupSlug } = await params;
  const locale = await getLocale();

  if (!groupSlug) {
    return redirect(getLocalizedRoutes(locale).home);
  }

  const { pageHero, school } = await fetchSchoolBySlug({
    slug: groupSlug,
  });

  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={pageHero?.title}
          description={pageHero?.description}
          ctaList={pageHero?.ctas}
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
                show: !!school.address,
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
                show: school.transportation && school.transportation.length > 0,
                content: (
                  <Box>
                    {school.transportation?.map((item) => (
                      <Typography key={item.id}>
                        {item.name} ({item.distance})
                      </Typography>
                    ))}
                  </Box>
                ),
              },
              {
                title: "Contacts",
                icon: <Location />,
                show: school.contacts && school.contacts.length > 0,
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
                show: school.links && school.links.length > 0,
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
          <ContentSchool content={school.content} tags={school.tags} />
          <SchoolMap school={school} />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
