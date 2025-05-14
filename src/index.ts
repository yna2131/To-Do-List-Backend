import express from "express";
import { db } from "./db/db";
import { sessionsTable, todosTable, usersTable } from "./db/schema";
import { z } from "zod";
import { eq, getTableColumns } from "drizzle-orm";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", async (req, res) => {
  const data = z
    .object({ email: z.string().email(), password: z.string() })
    .parse(req.body);
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, data.email));
  if (!user) {
    res.status(404).json({ messages: "Invalid Credentials" });
    return;
  }

  const passwordMatch = await bcrypt.compare(data.password, user.password);

  if (!passwordMatch) {
    res.status(401).json({ messages: "Invalid Credentials" });
    return;
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 5);

  const sessionId = randomUUID();

  await db
    .insert(sessionsTable)
    .values({ expiresAt, id: sessionId, userId: user.id });

  res.cookie("session", sessionId);
  res.sendStatus(200);
});

app.use(async (req, res, next) => {
  const sessionId = req.cookies["session"]

  if (!sessionId){
    res.sendStatus(401)
    return
  }

  const [user] = await db.select({...getTableColumns(usersTable)}).from(sessionsTable).innerJoin(usersTable,eq(usersTable.id, sessionsTable.userId)).where(eq(sessionsTable.id, sessionId))

  req.user = user;
  next()
})

app.get("/todos", async (req, res) => {
  console.log(req.user)
  const todos = await db.select().from(todosTable);
  res.json(todos);
});

// app.post("/todos", async (req, res) => {
//   const parsed = z.object({ text: z.string().min(2) }).safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ messages: parsed.error.flatten().fieldErrors});
//     return;
//   }

//   const [newTodo] = await db.insert(todosTable).values(parsed.data).returning();
//   res.json(newTodo);
// });

app.delete("/todos/:id", async (req, res) => {
  const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
  await db.delete(todosTable).where(eq(todosTable.id, id));
  res.sendStatus(200);
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
  const data = z.object({ done: z.boolean() }).parse(req.body);
  const [updatedTodo] = await db
    .update(todosTable)
    .set(data)
    .where(eq(todosTable.id, id))
    .returning();
  res.json(updatedTodo);
});

app.listen(3000, () => console.log("Listeining on port 3000..."));
