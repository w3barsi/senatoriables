import { reasons } from "~/server/db/schema";

export type ReasonsDBType = typeof reasons.$inferSelect;
