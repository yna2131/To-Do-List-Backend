import express from "express";
import { db } from "./db/db";
import { todosTable } from "./db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/todos", async (req, res) => {
  const todos = await db.select().from(todosTable);
  res.json(
    todos.map((todo) => {
      return { ...todo, status: Boolean(todo.status) };
    })
  );
});

app.post("/todos", async (req, res) => {
  const data = z.object({ text: z.string().min(2) }).parse(req.body);
  await db.insert(todosTable).values(data);
  res.sendStatus(200);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
  await db.delete(todosTable).where(eq(todosTable.id, id));
  res.sendStatus(200);
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = z.object({ id: z.coerce.number() }).parse(req.params);
  const data = z.object({ status: z.coerce.number() }).parse(req.body);
  await db.update(todosTable).set(data).where(eq(todosTable.id, id));
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Listeining on port 3000..."));
