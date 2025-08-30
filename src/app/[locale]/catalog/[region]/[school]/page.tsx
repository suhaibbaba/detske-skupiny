import { fetchSchoolBySlug } from "@/sanity/queries";
import { redirect } from "next/navigation";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import {
  Box,
  BoxProps,
  Button,
  Container,
  ContainerProps,
  ListItemProps,
  ListProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TypographyProps,
} from "@mui/material";
import SchoolGallery, {
  SchoolGridImagesStyles,
} from "@/app/[locale]/catalog/[region]/[school]/components/SchoolGallery";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import FilterSidebar from "@/app/[locale]/catalog/[region]/components/FilterSidebar";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";
import InfoCardGrid from "@/app/[locale]/catalog/[region]/[school]/components/InfoCardGrid";
import Location from "@/components/icons/Location";
import { formatMessage } from "@/utilites/strings";
import Link from "@/components/ui/link";
import AboutSchool from "@/app/[locale]/catalog/[region]/[school]/components/AboutSchool";
import RichText from "@/sanity/components/RichText";
import SchoolHighlights from "@/app/[locale]/catalog/[region]/[school]/components/SchoolHighlights";
import SchoolTimetable from "@/app/[locale]/catalog/[region]/[school]/components/SchoolTimetable";
import SchoolHeader from "@/app/[locale]/catalog/[region]/[school]/components/SchoolHeader";

interface PageStyles {
  pageLayout?: PageLayoutStyles;
  pageContainer?: BoxProps;
  container?: ContainerProps;
  contentWrapper?: BoxProps;
  name?: TypographyProps;
  logo?: BoxProps;
  schoolGridImagesStyles?: SchoolGridImagesStyles;
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
  schoolGridImagesStyles: {
    container: {
      sx: {
        mt: "24px",
      },
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
  const { school: schoolSlug, locale } = await params;
  if (!schoolSlug) {
    return redirect("/");
  }

  const { pageHero, school } = await fetchSchoolBySlug({
    slug: schoolSlug,
    locale,
  });

  console.log({
    primaryImage: school.primaryImage,
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
          {/*<InfoCardGrid*/}
          {/*  items={[*/}
          {/*    {*/}
          {/*      title: "Location",*/}
          {/*      icon: <Location />,*/}
          {/*      content: (*/}
          {/*        <Box>*/}
          {/*          <Typography>*/}
          {/*            {formatMessage(*/}
          {/*              "{0}, {1}",*/}
          {/*              school.address?.street,*/}
          {/*              school.address?.city,*/}
          {/*            )}*/}
          {/*          </Typography>*/}
          {/*          <Typography>{school.address?.postalCode}</Typography>*/}
          {/*        </Box>*/}
          {/*      ),*/}
          {/*    },*/}
          {/*    {*/}
          {/*      title: "Transportation Nearby",*/}
          {/*      icon: <Location />,*/}
          {/*      content: (*/}
          {/*        <Box>*/}
          {/*          {school.transportation?.map((item) => (*/}
          {/*            <Typography key={item.name}>*/}
          {/*              {item.name} ({item.distance})*/}
          {/*            </Typography>*/}
          {/*          ))}*/}
          {/*        </Box>*/}
          {/*      ),*/}
          {/*    },*/}
          {/*    {*/}
          {/*      title: "Contacts",*/}
          {/*      icon: <Location />,*/}
          {/*      content: (*/}
          {/*        <Box>*/}
          {/*          {school.contacts?.map((item) => (*/}
          {/*            <Typography*/}
          {/*              key={item.name}*/}
          {/*              sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}*/}
          {/*            >*/}
          {/*              {formatMessage(*/}
          {/*                `{0}  - {1} - {2}`,*/}
          {/*                <Link href={`tel:${item.phone}`}>{item.phone}</Link>,*/}
          {/*                item.name,*/}
          {/*                item.role,*/}
          {/*              )}*/}
          {/*            </Typography>*/}
          {/*          ))}*/}
          {/*        </Box>*/}
          {/*      ),*/}
          {/*    },*/}
          {/*    {*/}
          {/*      title: "Website & Social Media",*/}
          {/*      icon: <Location />,*/}
          {/*      content: (*/}
          {/*        <Box>*/}
          {/*          {school.links?.map((item) => (*/}
          {/*            <Link*/}
          {/*              href={item.url}*/}
          {/*              key={item._key}*/}
          {/*              target={item.blank ? "_blank" : "_self"}*/}
          {/*            >*/}
          {/*              {item.url}*/}
          {/*            </Link>*/}
          {/*          ))}*/}
          {/*        </Box>*/}
          {/*      ),*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
          <AboutSchool about={school.about} />
          <SchoolHighlights highlights={school.highlights} />
          <SchoolTimetable timetable={school.timetable} />
          <SchoolGallery gallery={school.gallery} />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
