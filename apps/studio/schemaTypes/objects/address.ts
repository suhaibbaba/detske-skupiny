import { defineType, defineField } from "sanity";
import { LocationAddressInput } from "@/schemaTypes/components/location/LocationAddressInput";
import { GenerateLocationButton } from "@/schemaTypes/objects/GeopointWithGenerate";

export default defineType({
  name: "postalAddress",
  title: "Address",
  type: "object",
  components: {
    input: LocationAddressInput,
  },
  fields: [
    defineField({
      name: "street",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "city",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "extra", title: "Extra / District", type: "string" }),
    defineField({
      name: "mapLocation",
      title: "Map Location",
      type: "geopoint",
    }),
  ],
});
