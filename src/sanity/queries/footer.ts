import { groq } from "next-sanity";
import { languageQuery } from "@/sanity/queries/index";
import { Header } from "@/types/header";
import { clientFetch, sanityFetch } from "@/sanity/utilites/fetch";
import { Footer } from "@/types/footer";

export async function fetchFooterPage() {
  const query = groq`
  {
    "footer": *[_type == "footer" && ${languageQuery}][0] {
      _id,
      logo,
      columns[] {
        title,
        content[] {
          _type,
          _type == "textItem" => {
            text
          },
          _type == "linkItem" => {
            link,
          }
        }
      },
      copyright,
    }
  }
`;

  return sanityFetch<{
    footer?: Footer;
  }>(query);
}
