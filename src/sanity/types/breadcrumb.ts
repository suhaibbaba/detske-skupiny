export interface BreadcrumbParams {
  slugs: string[];
}

export interface SchoolBreadcrumbParams {
  slug?: string;
}

export interface BreadcrumbItem {
  _type: string;
  name: string;
  slug: string;
  language: string;
}
