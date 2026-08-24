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
      description: "Street and number, as the post office would write it.",
      validation: (r) =>
        r
          .required()
          .error(
            "The street is half of what the geocoder needs. Without it this school gets no map pin.",
          ),
    }),
    defineField({
      name: "city",
      type: "string",
      description:
        "The town or city. Shown in the address on the school's page.",
    }),
    defineField({
      name: "postalCode",
      type: "string",
      description: "Five digits, e.g. 160 00. The other half of the geocode.",
      validation: (r) =>
        r
          .required()
          .error(
            "Without a postal code the geocoder cannot tell two identically named streets apart, and the pin lands in the wrong town.",
          ),
    }),
    defineField({
      name: "extra",
      title: "Extra / District",
      type: "string",
      description:
        "A district or building detail that the street line does not carry - Praha 6, entrance B.",
    }),
    defineField({
      name: "mapLocation",
      title: "Map Location",
      type: "geopoint",
      description:
        "Filled in on publish by geocoding the address above. Set it by hand only when the geocoder puts the pin in the wrong place.",
    }),
  ],
});
