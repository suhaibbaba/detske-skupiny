import { fetchContactUs } from "@/features/contact/queries";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { Box, BoxProps } from "@mui/material";
import PageHeadingTypography from "@/components/ui/PageHeadingTypography";
import ContactInfoCard from "@/features/contact/components/ContactInfoCard";
import ContactForm from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { staticRoutePaths } from "@/lib/seo/routes";

interface ContactUsStyles {
  pageLayout?: PageLayoutStyles;
  container?: BoxProps;
  infoContainer?: BoxProps;
  contactInfoContainer?: BoxProps;
  formContainer?: BoxProps;
}

const styles: ContactUsStyles = {
  pageLayout: {
    section: {
      sx: {
        background: "var(--mui-palette-gradients-ui1)",
        pb: {
          xs: "64px",
          sm: "130px",
        },
      },
    },
  },
  container: {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: { xs: "40px", sm: 15 },
    },
  },
  infoContainer: {
    sx: {
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "1fr 1fr",
      },
      gap: "64px",
    },
  },
  contactInfoContainer: {
    sx: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
    },
  },
  formContainer: {
    sx: {
      bgcolor: "common.white",
      p: "32px",
      borderRadius: "16px",
    },
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Metadata is a pure function of the route and the published content, so it
  // is cached rather than computed per request - without this, Cache
  // Components treats the Sanity reads below as runtime data and refuses to
  // prerender the route's head. Same reason as the layout's.
  "use cache";
  const { locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();
  const { pageHero } = await fetchContactUs(locale);

  return buildPageMetadata({
    locale,
    paths: staticRoutePaths("contactUs"),
    title: pageHero?.title || translate("contact-us"),
    description: pageHero?.description,
  });
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  setRequestLocale(locale);
  const {
    pageHero,
    items: contactUsItem,
    contactForm,
  } = await fetchContactUs(locale);

  return (
    <PageLayout
      extendedStyles={styles.pageLayout}
      pathname={getLocalizedRoutes(locale).contactUs}
    >
      <Box {...styles.container}>
        <PageHeadingTypography
          title={pageHero?.title}
          description={pageHero?.description}
        />
        <Box {...styles.infoContainer}>
          <Box {...styles.contactInfoContainer}>
            {contactUsItem?.map((card) => (
              <ContactInfoCard
                key={card.title}
                image={card.image}
                title={`${card.title}:`}
                description={card.description}
              />
            ))}
          </Box>
          <ContactForm contactUsForm={contactForm} />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default Page;
