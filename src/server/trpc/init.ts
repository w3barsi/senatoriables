import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

export const createTRPCContext = async (opts: { headers: Headers; req: Request }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  });

  return {
    db,
    session,
    opts,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
      cause: "No session",
    });
  }
  return next({
    ctx: {
      session: { ...ctx.session },
    },
  });
});
