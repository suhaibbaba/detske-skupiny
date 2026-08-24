"use client";

import { useSyncExternalStore } from "react";

/** The year never changes while a tab is open, so there is nothing to subscribe to. */
const subscribe = () => () => {};

const getClientYear = () => new Date().getFullYear();

/** No year on the server - see the note below. */
const getServerYear = () => null;

/**
 * The current year, read from the browser's clock.
 *
 * The Footer is a Server Component and its Sanity read sits behind `use cache`,
 * so what it renders is frozen into a cache entry and into the prerendered
 * HTML. A year read up there ages with the entry rather than with the calendar:
 * on 1 January the footer keeps claiming last year until something evicts the
 * cache, and the stale HTML disagrees with what the client computes - the
 * mismatch React reports as a hydration warning and repairs by rewriting the
 * text.
 *
 * `useSyncExternalStore` is the sanctioned way to say "this value exists only
 * on the client": the server snapshot is `null`, so server and client agree on
 * the first pass and there is nothing to warn about, and the real year lands in
 * the same commit as hydration. That keeps the entire footer - copy, links,
 * logo - cacheable and static, with one number filled in per visitor.
 */
const CopyrightYear = () => {
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);

  return <time dateTime={year ? String(year) : undefined}>{year ?? ""}</time>;
};

export default CopyrightYear;
