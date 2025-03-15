import { int, sqliteTable, text, } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  status: int().notNull().default(0)
});
