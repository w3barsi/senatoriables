import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";

import { createTRPCClient, httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { TRPCProvider } from "../trpc/react";
import { TRPCRouter } from "../trpc/router";

function getUrl() {
  const base = (() => {
    if (typeof window !== "undefined") return "";
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

export const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        import.meta.env.MODE === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpBatchStreamLink({
      transformer: superjson,
      url: getUrl(),
    }),
  ],
});

const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: { serializeData: superjson.serialize },
    hydrate: { deserializeData: superjson.deserialize },
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

const serverHelpers = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient: queryClient,
});

export function getContext() {
  return {
    queryClient,
    trpc: serverHelpers,
  };
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      {children}
    </TRPCProvider>
  );
}
