import {
  getDirectPageByType,
  getFilterQuery,
  getGroups,
  getPageByType,
} from "./page";

export const getHomePage = () => getPageByType("homePage");
export const getAboutPage = () => getPageByType("aboutPage");
export const getContactPage = () => getDirectPageByType("contactUsPage");
export const getGroupsPage = () => getGroups();

export { getFilterQuery } from "@/sanity/queries/page";
