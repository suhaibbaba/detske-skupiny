import { getDirectPageByType, getGroups, getPageByType } from "./page";

export const getHomePage = () => getPageByType("homePage");
export const getAboutPage = () => getPageByType("aboutPage");
export const getContactPage = () => getDirectPageByType("contactUsPage");
export const getGroupsPage = () => getGroups();
