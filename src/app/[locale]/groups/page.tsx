import GroupsPageClient from "@/app/[locale]/groups/groupsPageClient";
import { fetchGroupPage } from "@/sanity/queries";
import { PageProps } from "@/types";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const { content, regions } = await fetchGroupPage({ locale });

  return <GroupsPageClient content={content} regions={regions} />;
};

export default Page;
