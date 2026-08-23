import { MarkerData, School } from "@/sanity/types";

export const parseAddress = (school?: School): MarkerData | undefined => {
  if (!school || !school.address) {
    return;
  }

  const { name, address } = school;

  const fullAddress = [
    address.street,
    address.extra,
    address.city,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: `marker_${school.id}`,
    name,
    coordinate: address.mapLocation,
    fullAddress,
    slug: school.slug,
  };
};
