import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { DefaultCatchBoundary } from "~/lib/components/DefaultCatchBoundary";
import { NotFound } from "~/lib/components/NotFound";
import * as TanstackQuery from "~/lib/trpc/root-provider";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { ...TanstackQuery.getContext(), user: null },
      defaultPreload: "intent",
      // react-query will handle data fetching & caching
      // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      scrollRestoration: true,
      defaultStructuralSharing: true,
      Wrap: (props: { children: React.ReactNode }) => (
        // eslint-disable-next-line @eslint-react/no-context-provider
        <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>
      ),
    }),
    TanstackQuery.getContext().queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
