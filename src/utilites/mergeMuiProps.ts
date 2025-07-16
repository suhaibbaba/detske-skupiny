import mergeWith from "lodash.mergewith";

export const mergeMuiProps = <TObject1, TObject2>(
  object1: TObject1,
  object2: TObject2,
): TObject1 & TObject2 => {
  return mergeWith({}, object1, object2, (destObj, srcObj) => {
    if (Array.isArray(destObj)) {
      return destObj.concat(srcObj);
    }
  });
};
