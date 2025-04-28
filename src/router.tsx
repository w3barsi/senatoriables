import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import * as TanstackQuery from "~/lib/tanstack-query/root-provider";

import { DefaultCatchBoundary } from "~/lib/components/DefaultCatchBoundary";
import { NotFound } from "~/lib/components/NotFound";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: {
        user: null,
        queryClient: TanstackQuery.getContext().queryClient,
        trpc: TanstackQuery.getContext().trpc,
      },
      scrollRestoration: true,
      defaultPreloadStaleTime: 0,
      defaultPreload: "intent",
      // react-query will handle data fetching & caching
      // https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      defaultStructuralSharing: true,

      Wrap: (props: { children: React.ReactNode }) => {
        // eslint-disable-next-line @eslint-react/no-context-provider
        return <TanstackQuery.Provider>{props.children}</TanstackQuery.Provider>;
      },
    }),
    TanstackQuery.getContext().queryClient,
  );

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
