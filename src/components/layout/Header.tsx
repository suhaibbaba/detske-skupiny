import { fetchHeaderPage } from "@/sanity/queries/header";
import HeaderClientPage from "@/components/layout/HeaderClientPage";
import { getSettings } from "@/sanity/queries/settings";

const Header = async () => {
  const { header } = await fetchHeaderPage();
  const settings = await getSettings();

  console.log({ settings });
  return <HeaderClientPage header={header} />;
};

export default Header;
