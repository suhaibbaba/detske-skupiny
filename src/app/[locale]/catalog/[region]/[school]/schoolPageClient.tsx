"use client";

import {
  Box,
  Button,
  Typography,
  BoxProps,
  ContainerProps,
  Container,
  TypographyProps,
  ListItemProps,
  ListProps,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import FilterSidebar from "@/app/[locale]/catalog/[region]/components/FilterSidebar";
import SchoolGridImages, {
  SchoolGridImagesStyles,
} from "@/app/[locale]/catalog/[region]/[school]/components/SchoolGridImages";
import InfoCardGrid from "@/app/[locale]/catalog/[region]/[school]/components/InfoCardGrid";
import Location from "@/components/icons/Location";
import AboutSchool from "@/app/[locale]/catalog/[region]/[school]/components/AboutSchool";
import { School } from "@/sanity/types";
import { formatMessage } from "@/utilites/strings";
import Link from "@/components/ui/link";
import RichText from "@/sanity/components/RichText";
import { urlImageFor } from "@/sanity/sections/sanityImageUrl";

interface Props {
  school: School;
}

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
      sx: (theme) => ({
        background: theme.palette.gradients.ui3,
      }),
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
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "300px 1fr",
      },
      columnGap: "60px",
      mt: "80px",
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

const SchoolPageClient = ({ school }: Props) => {
  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography
          title={school.name}
          description={school.name}
          // ctaList={[
          //   {
          //     label: "Kinder Prague",
          //     variant: "primary",
          //   },
          //   {
          //     label: "Kindr Brno",
          //     variant: "secondary",
          //   },
          //   {
          //     label: "All Kinder",
          //     variant: "ghost",
          //   },
          // ]}
        />
      </PageLayout>
      <Container {...styles.container}>
        <FilterSidebar />
        <Box {...styles.contentWrapper}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "20px 12px",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Typography {...styles.name}>
              <Box
                component="img"
                {...styles.logo}
                src={urlImageFor(school.logo)}
                alt={school.name}
              />
              {school.name}
            </Typography>
            <Button variant="secondary">Visit Website</Button>
          </Box>
          <SchoolGridImages
            leftImage="/school1.jpg"
            topRightImage="/school2.jpg"
            bottomRightImage="/school3.jpg"
            extendedStyles={styles.schoolGridImagesStyles}
          />
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
                    {school.links?.map((item) => (
                      <Link
                        href={item.url}
                        key={item._key}
                        target={item.blank ? "_blank" : "_self"}
                      >
                        {item.url}
                      </Link>
                    ))}
                  </Box>
                ),
              },
            ]}
          />
          <AboutSchool about={school.about} />
          {school.highlights && (
            <Box>
              <Typography {...styles.sectionHeading}></Typography>
              <RichText>{school.highlights}</RichText>
            </Box>
          )}
          <Box component="section">
            <Typography {...styles.sectionHeading}>Our time table</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {school.timetable?.map((item) => (
                    <TableRow key={item._key}>
                      <TableCell>
                        ${item.start} - ${item.end}
                      </TableCell>
                      <TableCell>{item.activity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SchoolPageClient;
