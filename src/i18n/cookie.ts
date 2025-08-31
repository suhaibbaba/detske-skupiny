"use server";

import { cookies } from "next/headers";

export const getLocale = async () => {
  const store = await cookies();
  return store.get("locale")?.value || "en";
};
