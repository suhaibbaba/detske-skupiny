import { fetchHeaderPage } from "@/sanity/queries/header";
import HeaderClientPage from "@/components/layout/HeaderClientPage";

const Header = async () => {
  const { header } = await fetchHeaderPage();

  return <HeaderClientPage header={header} />;
};

export default Header;
