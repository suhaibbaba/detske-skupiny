import { z } from "zod";

/**
 * Contract between the catalog list and the schools route.
 *
 * The browser used to hold a Sanity client and run this query itself. It now
 * posts these parameters instead, and they are validated here before they
 * reach GROQ - the route is the only thing between an anonymous request and
 * the dataset.
 */
export const schoolsRequestSchema = z.object({
  country: z.string().trim().min(1).max(200),
  region: z.string().trim().max(200).optional(),
  area: z.string().trim().max(200).optional(),
  subarea: z.string().trim().max(200).optional(),
  categories: z.array(z.string().trim().max(200)).max(100).optional(),
  tags: z.array(z.string().trim().max(200)).max(100).optional(),
  search: z.string().trim().max(200).optional(),
  start: z.number().int().min(0).max(100_000),
  end: z.number().int().min(0).max(100_000),
  locale: z.string().trim().min(2).max(10),
});

export type SchoolsRequest = z.infer<typeof schoolsRequestSchema>;
