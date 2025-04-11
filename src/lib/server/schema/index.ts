export * from "./auth.schema";
// export your other schemas here
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const vote = sqliteTable("vote", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
});
