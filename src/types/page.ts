type BaseParams = { locale: string };

export type Params<E extends object = {}> = Promise<BaseParams & E>;

export type PageProps<Extra extends object = {}, Search extends object = {}> = {
  params: Params<Extra>;
  /** optional: include if you want typed query string */
  searchParams?: Promise<Search>;
};
