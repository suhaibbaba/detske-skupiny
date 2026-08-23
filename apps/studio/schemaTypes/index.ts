import objects from "@/schemaTypes/objects";
import pages from "@/schemaTypes/pages";
import singlePages from "@/schemaTypes/singletons";
import components from "@/schemaTypes/components";

export const schemaTypes = [
  ...objects,
  ...singlePages,
  ...pages,
  ...components,
];
