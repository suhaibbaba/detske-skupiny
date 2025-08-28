export type Area = {
  id: string;
  name: string;
  slug: string;
};

export type Region = {
  name: string;
  slug: string;
  backgroundCover: string;
  areas: Area[];
};
