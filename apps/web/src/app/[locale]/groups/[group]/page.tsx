import { fetchSchoolBySlug } from "@/sanity/queries";
import { notFound, redirect } from "next/navigation";
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
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import Globe from "@/components/icons/GlobeIcon";
import Phone from "@/components/icons/PhoneIcon";
import Transportation from "@/components/icons/TransportationIcon";
import ExternalLink from "@/components/icons/ExternalLinkIcon";
import MapIcon from "@mui/icons-material/Map";
import Offer from "./components/Offer";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import JsonLd from "@/components/seo/JsonLd";
import { schoolJsonLd } from "@/lib/seo/jsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { documentPaths } from "@/lib/seo/routes";
import { absoluteUrl } from "@/lib/seo/site";
import { resolveOgImage } from "@/lib/seo/images";
import type { School } from "@/sanity/types";
import { parseLinkField } from "@/components/ui/link/parser";

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
        pb: { xs: 5 },
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
    sx: {
      color: "custom.ui13",
      mb: "20px",
      mt: "80px",
      textTransform: "capitalize",
      fontWeight: 600,
      fontSize: "24px",
    },
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

const schoolPaths = (locale: string, school: School) =>
  documentPaths(locale, school.slug, school.translations, (target, slug) =>
    getLocalizedRoutes(target).group(slug),
  );

/**
 * The description a school page shares, best available first.
 *
 * `metaDescription` is the field the query has always asked for, and is kept
 * first so an editor-written description wins the moment the schema gains one
 * (it does not have one today - see the recommendations in the PR). Otherwise
 * the short summary, which is written for exactly this, and finally the name
 * and the district, which every school has.
 */
function schoolDescription(school: School) {
  const area = school.area?.name ?? school.region?.name;

  return (
    school.metaDescription?.trim() ||
    school.shortSummary?.trim() ||
    // Name and district: the pair reads correctly in both locales without a
    // dictionary key, which matters because a missing key would render its own
    // name into the description.
    (area ? `${school.name}, ${area}` : school.name)
  );
}

export async function generateMetadata({
  params,
}: PageProps<{ group: string }>): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { group: groupSlug, locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();

  const { school } = await fetchSchoolBySlug({
    slug: groupSlug,
    locale,
  });

  if (!school) {
    return { title: translate("groups") };
  }

  return buildPageMetadata({
    locale,
    paths: schoolPaths(locale, school),
    title: school.name,
    description: schoolDescription(school),
    images: [school.primaryImage, school.logo],
  });
}

/**
 * Awaits `params` for the school slug, which is dynamic, so it sits below the
 * Suspense boundary in `Page`.
 */
const SchoolContent = async ({ params }: PageProps<{ group: string }>) => {
  const { group: groupSlug, locale } = await params;
  setRequestLocale(locale);

  if (!groupSlug) {
    return redirect(getLocalizedRoutes(locale).home);
  }

  const { school } = await fetchSchoolBySlug({
    slug: groupSlug,
    locale,
  });

  if (!school) {
    notFound();
  }

  const paths = schoolPaths(locale, school);
  // The first contact that carries each; a school lists people, not one
  // switchboard, so this is the number and address a visitor would actually
  // use. Absent ones are dropped by the builder rather than emitted empty.
  const telephone = school.contacts?.find((contact) => contact.phone)?.phone;
  const email = school.contacts?.find((contact) => contact.email)?.email;
  // `sameAs` is for other pages about the same entity, which is exactly what a
  // school's own website is. Only a link that parsed into a real URL qualifies.
  const website = parseLinkField(school.website, { locale });

  return (
    <Box {...styles.pageContainer}>
      <JsonLd
        data={schoolJsonLd({
          name: school.name,
          url: absoluteUrl(locale, paths[locale]!),
          description: schoolDescription(school),
          image: resolveOgImage(locale, school.primaryImage, school.logo),
          address: school.address,
          regionName: school.region?.name,
          telephone,
          email,
          sameAs: website.valid ? website.url : undefined,
        })}
      />
      <PageLayout
        contentFullWidth={false}
        extendedStyles={styles.pageLayout}
        pathname={getLocalizedRoutes(locale).group(groupSlug)}
      >
        <PageHeadingTypography title={school?.name} />
      </PageLayout>
      <Container {...styles.container}>
        <Box {...styles.contentWrapper}>
          <SchoolGallery
            gallery={school.primaryImages}
            logo={school.logo}
            name={school.name}
            mainImageLqip={school.primaryImageLqip}
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
              sx={{ color: "custom.ui20", borderColor: "#B2AD88" }}
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

const Page = ({ params }: PageProps<{ group: string }>) => (
  <Suspense fallback={null}>
    <SchoolContent params={params} />
  </Suspense>
);

export default Page;
