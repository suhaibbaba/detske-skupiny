
import mergeWith from "lodash.mergewith";
import { SxProps, Theme } from "@mui/material/styles";

// Deeply merge two objects with special handling for `sx`
export function mergeMuiPropsDeep<T extends Record<string, any>>(
  base: Partial<T>,
  override: Partial<T>,
): T {
  return mergeWith({}, base, override, (destVal, srcVal, key) => {
    if (key === "sx") {
      const toArray = (sx: SxProps<Theme> | undefined) =>
        Array.isArray(sx) ? sx : sx ? [sx] : [];
      return [...toArray(destVal), ...toArray(srcVal)];
    }

    return undefined; // fallback to lodash merge
  }) as T;
}

// Final public utility — renamed to `mergeMuiProps`
export function mergeMuiProps<T extends Record<string, any>>(
  ...objects: Array<Partial<T> | undefined>
): T {
  return objects.reduce<Partial<T>>((acc, obj) => {
    return mergeMuiPropsDeep(acc, obj ?? {});
  }, {}) as T;
}
