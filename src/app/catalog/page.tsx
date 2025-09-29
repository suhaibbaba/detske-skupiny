import { redirect } from "next/navigation";
import { routes } from "@/routes";

const Page = () => {
  redirect(routes.home);
};

export default Page;
