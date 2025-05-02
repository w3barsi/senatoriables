import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import pc from "picocolors";
import superjson from "superjson";
import { ZodError } from "zod";
import { auth } from "../auth";
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
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  // if (t._config.isDev) {
  //   // artificial delay in dev
  //   const waitMs = Math.floor(Math.random() * 400) + 100;
  //   await new Promise((resolve) => setTimeout(resolve, waitMs));
  // }

  const result = await next();

  const end = Date.now();
  console.log(
    `${pc.bgBlue(` [tRPC] `)}${pc.bgRed(pc.black(` ${path} `))} took ${end - start}ms to execute`,
  );

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (ctx.session === null || ctx.session?.id === undefined) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session },
    },
  });
});
