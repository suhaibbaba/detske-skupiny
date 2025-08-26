import GroupsPageClient from "@/app/[locale]/groups/groupsPageClient";
import { getGroups } from "@/sanity/queries";

const Page = async () => {
  const { content, regions } = await getGroups();

  return <GroupsPageClient content={content} regions={regions} />;
};

export default Page;
