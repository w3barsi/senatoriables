import { createAPIFileRoute } from "@tanstack/react-start/api";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createTRPCContext } from "~/server/trpc/init";
import { trpcRouter } from "~/server/trpc/router";

function handler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: trpcRouter,
    endpoint: "/api/trpc",
    createContext: (opts) => {
      return createTRPCContext({
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
