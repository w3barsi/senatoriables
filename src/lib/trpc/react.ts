import { createTRPCContext } from "@trpc/tanstack-react-query";
import { TRPCRouter } from "~/server/trpc/router";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();
