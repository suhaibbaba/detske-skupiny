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
  Chip,
  ChipProps,
  Button,
  IconButton,
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
import Globe from "@/components/icons/GlobeIcon";
import Phone from "@/components/icons/PhoneIcon";
import Transportation from "@/components/icons/TransportationIcon";
import ExternalLink from "@/components/icons/ExternalLinkIcon";
import MapIcon from "@mui/icons-material/Map";
import Offer from "./components/Offer";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";

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
  chip?: ChipProps;
  chipContainer?: BoxProps;
}

const styles: PageStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui3)",
        pb: 7,
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
      mt: "20px",
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
  chipContainer: {
    sx: {
      display: "flex",
      gap: "8px",
      my: "20px",
    },
  },
  chip: {
    sx: {
      borderRadius: "24px",
      px: "6px",
      py: "2px",
      fontSize: 12,
      fontWeight: 400,
      color: "custom.ui20",
      "& .MuiChip-label": {
        padding: 0,
      },
      "& .MuiChip-icon": {
        marginRight: "4px",
        marginLeft: 0,
      },
    },
  },
};

export async function generateMetadata({
  params,
}: PageProps<{ group: string }>): Promise<Metadata> {
  const translate = await getTranslateServer();
  const { group: groupSlug } = await params;
  const locale = await getLocale();

  if (!groupSlug) {
    return {
      title: translate("school"),
    };
  }

  const { school } = await fetchSchoolBySlug({
    slug: groupSlug,
  });

  return {
    title: school.name,
  };
}

const Page = async ({ params }: PageProps<{ group: string }>) => {
  const { group: groupSlug } = await params;
  const locale = await getLocale();

  if (!groupSlug) {
    return redirect(getLocalizedRoutes(locale).home);
  }

  const { school } = await fetchSchoolBySlug({
    slug: groupSlug,
  });

  return (
    <Box {...styles.pageContainer}>
      <PageLayout contentFullWidth={false} extendedStyles={styles.pageLayout}>
        <PageHeadingTypography title={school?.name} />
      </PageLayout>
      <Container {...styles.container}>
        <Box {...styles.contentWrapper}>
          <SchoolGallery
            gallery={school.primaryImages}
            logo={school.logo}
            name={school.name}
            extendedStyles={{ container: { sx: { mt: "40px" } } }}
          />
          {/* <SchoolHeader school={school} /> */}
          <Box {...styles.chipContainer}>
            {school?.categories?.map((category) => (
              <Chip
                component="a"
                clickable
                key={category.id}
                label={category.name}
                href={getLocalizedRoutes(locale).catalogs(
                  school.region.countrySlug,
                  `categories=${category.slug}`,
                )}
                variant="outlined"
                color="primary"
                {...styles.chip}
              />
            ))}
            <Chip
              component="a"
              clickable
              label={school.region.name}
              href={getLocalizedRoutes(locale).catalogs(school.region.fullSlug)}
              variant="outlined"
              {...styles.chip}
            />
            <Chip
              component="a"
              clickable
              label={school.area.name}
              href={getLocalizedRoutes(locale).catalogs(school.area.fullSlug)}
              {...styles.chip}
              variant="outlined"
              sx={{ borderColor: "#B2AD88" }}
            />
          </Box>
          <InfoCardGrid
            items={[
              {
                title: "location",
                icon: <Location />,
                show: !!school.address,
                content: (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                    }}
                  >
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
                    <IconButton color="primary" href="#map">
                      <MapIcon />
                    </IconButton>
                  </Box>
                ),
              },
              {
                title: "transportationNearby",
                icon: <Transportation />,
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
                title: "contacts",
                icon: <Phone />,
                show: school.contacts && school.contacts.length > 0,
                content: (
                  <Box>
                    {school.contacts?.map((item) => {
                      // Determine the link based on priority: phone first, then email
                      const linkHref = item.phone
                        ? `tel:${item.phone}`
                        : item.email
                          ? `mailto:${item.email}`
                          : null;

                      const linkText = item.phone || item.email;

                      return (
                        <Typography
                          key={item.name}
                          sx={{ display: "flex", flexWrap: "wrap", gap: "4px" }}
                        >
                          {formatMessage(
                            `{0}  - {1} ${item.role ? `- {2}` : ""}`,
                            linkHref && linkText ? (
                              <Link
                                sx={{ textTransform: "none" }}
                                href={linkHref}
                              >
                                {linkText}
                              </Link>
                            ) : (
                              linkText
                            ),
                            item.name,
                            item.role,
                          )}
                        </Typography>
                      );
                    })}
                  </Box>
                ),
              },
              {
                title: "socialsAndLinks",
                icon: <Globe />,
                show: school.links && school.links.length > 0,
                content: (
                  <Box>
                    {school.links?.map((link) => (
                      <Box
                        key={link.id}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Link
                          link={link}
                          key={link.id}
                          target="_blank"
                          sx={{ textTransform: "none" }}
                        />
                        <ExternalLink
                          sx={{ "&&": { width: "16px", height: "16px" } }}
                        />
                      </Box>
                    ))}
                  </Box>
                ),
              },
            ]}
          />
          {!school.content && <Offer />}
          <ContentSchool
            content={school.content}
            school={school}
            tags={school.tags}
          />
          <SchoolMap school={school} />
        </Box>
      </Container>
    </Box>
  );
};

export default Page;
