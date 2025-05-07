import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "~/lib/trpc/init";
import { trpcRouter } from "~/lib/trpc/router";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: "/api/trpc",
    createContext: (opts) => {
      return createContext({
        ...opts,
        headers: opts.req.headers,
        req: opts.req,
      });
    },
  });
}

export const APIRoute = createAPIFileRoute("/api/trpc/$")({
  GET: handler,
  POST: handler,
});
