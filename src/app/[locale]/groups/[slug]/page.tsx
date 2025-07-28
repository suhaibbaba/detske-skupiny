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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
} from "@mui/material";
import PageLayout from "@/components/layout/PageLayout";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import data from "@/data/blogDetail";
import FilterSidebar from "@/app/[locale]/groups/components/FilterSidebar";
import SchoolGridImages, {
  SchoolGridImagesStyles,
} from "@/app/[locale]/groups/[slug]/components/SchoolGridImages";
import InfoCardGrid from "@/app/[locale]/groups/[slug]/components/InfoCardGrid";
import Location from "@/components/icons/Location";
import AboutSchool from "@/app/[locale]/groups/[slug]/components/AboutSchool";
import CheckIcon from "@mui/icons-material/Check";

interface PageStyles {
  section?: BoxProps;
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
  section: {
    sx: (theme) => ({
      background: theme.palette.gradients.ui3,
    }),
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

const markContent = [
  "Understand your child’s personality and needs",
  "Explore different teaching philosophies",
  "Focus on communication",
  "Look for programs that welcome involvement",
  "Outdoor learning & nature walks",
  "Annual mountain retreat",
  "Location that fits your daily routine",
  "Ask about class size & communication",
  "Visit in person",
  "Clarify what’s included",
  "Daily healthy meals",
  "Trust your gut",
];

const Page = () => {
  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} sectionStyles={styles.section}>
        <PageHeadingTypography
          title={data.heading}
          description={data.description}
          ctaList={[
            {
              label: "Kinder Prague",
              variant: "primary",
            },
            {
              label: "Kindr Brno",
              variant: "secondary",
            },
            {
              label: "All Kinder",
              variant: "ghost",
            },
          ]}
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
                src="/groups/vector.svg"
                alt="Logo"
              />
              All Stars Kindergarten & Primary School
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
                  <Typography>
                    Lstibořská 2396, Praha 21 - Újezd nad Lesy 190 16
                  </Typography>
                ),
              },
              {
                title: "Transportation Nearby",
                icon: <Location />,
                content: (
                  <>
                    <Typography>Strakonická, New Orchards (200m)</Typography>
                    <Typography>Strakonická, New Orchards (200m)</Typography>
                  </>
                ),
              },
              {
                title: "Contacts",
                icon: <Location />,
                content: (
                  <>
                    <Typography>
                      (+420 777 123 456) - Mgr. Lucie Nováková -Director
                    </Typography>
                    <Typography>
                      (+420 604 654 321 )- Petra Malá- Asst. Coordinator
                    </Typography>
                  </>
                ),
              },
              {
                title: "Website & Social Media",
                icon: <Location />,
                content: (
                  <>
                    <Typography>www.allstarskindergarten.cz </Typography>
                    <Typography>
                      www.facebook.com/allstarsindergarten
                    </Typography>
                  </>
                ),
              },
            ]}
          />
          <AboutSchool>
            At All Stars, we create an inspiring environment where education
            meets play, and every child is supported as a unique individual. Our
            bilingual Czech-English program combines a joyful approach to early
            learning with structured development across language, movement,
            creativity, and social interaction. Our experienced teachers focus
            on respectful guidance, recognizing each child’s natural rhythm of
            development. From art workshops and science play to music and
            outdoor discovery, we support the whole child — academically,
            socially, and emotionally. We welcome children from 2.5 years and
            offer both kindergarten and primary-level education, making
            transitions smoother for families who wish to stay long-term.
          </AboutSchool>

          <Box>
            <Typography {...styles.sectionHeading}>
              What Makes Us Special
            </Typography>
            <List {...styles.list}>
              {markContent.map((item) => (
                <ListItem key={item} {...styles.listItem}>
                  <ListItemIcon sx={{ minWidth: "initial" }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>

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
                  <TableRow>
                    <TableCell>06:30 - 06:45</TableCell>
                    <TableCell>Arrival & Free Play</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>06:30 - 06:45</TableCell>
                    <TableCell>Arrival & Free Play</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>06:30 - 06:45</TableCell>
                    <TableCell>Arrival & Free Play</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
