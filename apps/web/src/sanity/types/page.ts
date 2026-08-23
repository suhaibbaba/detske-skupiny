type AnySection = { _key: string; _type: string; [k: string]: any };

export interface PageSections {
  title?: string;
  sections?: AnySection[];
}
