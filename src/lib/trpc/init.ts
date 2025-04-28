import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { auth } from "../server/auth";
import { db } from "../server/db";

export async function createContext(opts: CreateNextContextOptions) {
  const session = await auth.api.getSession({ headers: opts.req.headers });

  return {
    db,
    session: session?.user || null,
    opts,
  };
}

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
