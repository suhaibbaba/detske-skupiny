import { fetchContactUs } from "@/sanity/queries";
import { PageProps } from "@/types";
import ContactUsPageClient from "@/app/[locale]/contact-us/contactUsPageClient";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const { pageHero, items: contactUsItem } = await fetchContactUs({ locale });

  return (
    <ContactUsPageClient pageHero={pageHero} contactUsItem={contactUsItem} />
  );
};

export default Page;
