import { z } from "zod";

/**
 * Shared contract between the contact form and the API route.
 *
 * Field names match what the form has always sent (name / email / message);
 * `consent` and `turnstileToken` are new. The `website` honeypot is
 * intentionally NOT part of this schema - it is handled before parsing.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .refine((v) => !/[\r\n]/.test(v), "invalid characters"),
  email: z
    .string()
    .trim()
    .email()
    .max(200)
    .refine((v) => !/[\r\n]/.test(v), "invalid characters"),
  message: z.string().trim().min(1).max(2000),
  consent: z.literal(true),
  turnstileToken: z.string().optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
