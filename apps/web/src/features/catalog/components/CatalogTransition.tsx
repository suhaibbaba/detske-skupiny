"use client";

import {
  createContext,
  useContext,
  useTransition,
  type ReactNode,
  type TransitionStartFunction,
} from "react";

type CatalogTransition = {
  /** True while a filter navigation is in flight. */
  isPending: boolean;
  startTransition: TransitionStartFunction;
};

const CatalogTransitionContext = createContext<CatalogTransition>({
  isPending: false,
  startTransition: (fn) => fn(),
});

/**
 * Shares one transition between the filter controls and the list.
 *
 * Changing a filter now navigates, so the new list is rendered on the server
 * and arrives with the navigation. Wrapping that in a transition keeps the
 * current list on screen while it happens; the list reads `isPending` from
 * here to dim itself, which is a different subtree from the control that
 * started it - hence a context rather than local state.
 *
 * The children are server-rendered and passed through untouched.
 */
export function CatalogTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <CatalogTransitionContext.Provider value={{ isPending, startTransition }}>
      {children}
    </CatalogTransitionContext.Provider>
  );
}

export function useCatalogTransition() {
  return useContext(CatalogTransitionContext);
}
