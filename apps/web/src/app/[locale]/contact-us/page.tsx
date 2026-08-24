import { fetchContactUs } from "@/sanity/queries";
import { PageProps } from "@/types";
import PageLayout, { PageLayoutStyles } from "@/components/layout/PageLayout";
import { Box, BoxProps } from "@mui/material";
import PageHeadingTypography from "@/components/shared/PageHeadingTypography";
import ContactInfoCard from "@/app/[locale]/contact-us/components/ContactInfoCard";
import ContactForm from "@/components/forms/ContactForm";
import { Metadata } from "next";
import { getTranslateServer } from "@/hooks/useTranslate";
import { getLocalizedRoutes } from "@/routes";
import { setRequestLocale } from "next-intl/server";

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
  const { locale } = await params;
  setRequestLocale(locale);
  const translate = await getTranslateServer();
  const { pageHero } = await fetchContactUs(locale);

  return {
    title: pageHero?.title || translate("contact-us"),
    description: pageHero?.description || "",
  };
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
