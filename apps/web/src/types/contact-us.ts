import type { ContactUsQueryResult } from "@detske-skupiny/types";

type ContactUs = NonNullable<ContactUsQueryResult>;

/** One of the cards above the contact form. */
export type ContactUsItem = NonNullable<ContactUs["items"]>[number];

/** The form's copy and its submit CTA. */
export type ContactUsForm = NonNullable<ContactUs["contactForm"]>;
