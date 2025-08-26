import {
  getDirectPageByType,
  getFilterQuery,
  getGroups,
  getPageByType,
} from "./page";

export const getHomePage = () => getPageByType("home");
export const getPreschoolPage = () => getPageByType("preschool");
export const getAboutPage = () => getPageByType("about");
export const getContactPage = () => getDirectPageByType("contactUsPage");
export * from "@/sanity/queries/page";
