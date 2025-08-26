export type Area = {
  id: string;
  name: string;
  slug: string;
  schoolCount: number;
};

export type Region = {
  name: string;
  slug: string;
  backgroundCover: string;
  totalSchools: number;
  areas: Area[];
};
