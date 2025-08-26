import { getSchoolBySlug } from "@/sanity/queries";
import SchoolPageClient from "@/app/[locale]/catalog/[region]/[school]/schoolPageClient";

type PageProps = {
  params: Promise<{ locale: string; school: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { school: schoolParams } = await params;
  if (!schoolParams) {
    return null;
  }

  const { school } = await getSchoolBySlug({ slug: schoolParams });

  console.log(school);
  return <SchoolPageClient school={school} />;
};

export default Page;
