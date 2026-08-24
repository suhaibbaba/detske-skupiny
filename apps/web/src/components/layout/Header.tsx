import { fetchHeaderPage } from "@/lib/sanity/header";
import HeaderClientPage from "@/components/layout/HeaderClientPage";

const Header = async ({ locale }: { locale: string }) => {
  const { header } = await fetchHeaderPage(locale);

  return <HeaderClientPage header={header} />;
};

export default Header;
