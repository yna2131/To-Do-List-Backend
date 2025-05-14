import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
  id: int().primaryKey({ autoIncrement: true }),
  text: text().notNull(),
  done: int({ mode: "boolean" }).notNull().default(false),
  userId: int().notNull().references(() => usersTable.id),
});

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  name: text().notNull(),
  password: text().notNull(),
});

export const sessionsTable = sqliteTable("sessions", {
  id: text().primaryKey(),
  userId: int().notNull().references(() => usersTable.id),
  expiresAt: int({mode: "timestamp" }).notNull(),
})