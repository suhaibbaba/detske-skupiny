import areas from "@/schemaTypes/pages/geographicCoverage/areas";
import region from "@/schemaTypes/pages/geographicCoverage/region";
import country from "@/schemaTypes/pages/geographicCoverage/countries";
import author from "@/schemaTypes/pages/blogs/authors";
import blogDetails from "@/schemaTypes/pages/blogs/blogs";
import page from "@/schemaTypes/pages/page";
import schools from "@/schemaTypes/pages/school/schools";
import schoolCategories from "@/schemaTypes/pages/school/schoolCategories";
import blogCategories from "@/schemaTypes/pages/blogs/blogCategories";
import schoolTags from "@/schemaTypes/pages/school/schoolTags";
import subareas from "@/schemaTypes/pages/geographicCoverage/subareas";
import schoolTypes from "@/schemaTypes/pages/school/schoolTypes";
import schoolPage from "@/schemaTypes/pages/school/schoolPage";
import blogPage from "@/schemaTypes/pages/blogs/blogPage";
import dictionary from "@/schemaTypes/pages/translate/dictionary";

export default [
  page,
  // geographicCoverage
  country,
  region,
  areas,
  subareas,
  // School
  schoolPage,
  schools,
  schoolCategories,
  schoolTags,
  schoolTypes,
  // Blog
  blogPage,
  blogCategories,
  blogDetails,
  // other
  author,
  // dictionary
  dictionary,
];
