import { groq } from "next-sanity";

// export const sectionsProjection = groq`
//   sections[]{
//     _key,
//     _type,
//
//     // common fields most sections use
//     title,
//     description,
//     ctas[]{ title, href, variant },
//
//     // normalize single 'image' if present
//     "image": select(
//       defined(image) => image{
//         asset->{
//           _id, url,
//           metadata{dimensions{width,height,aspectRatio}}
//         }
//       },
//       null
//     ),
//   }
// `;

export const sectionsProjection = groq`
  title,
  sections[]{
    ...,
  }
`;

export const directFieldsProjection = groq`
  title,
  ...,
`;
