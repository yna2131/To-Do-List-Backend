import express from "express";
import { db } from "./db/db";
import { todosTable } from "./db/schema";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/todos", async (req, res) => {
  const todos = await db.select().from(todosTable);
  res.json(todos)
});
app.listen(3000, () => console.log("Listeining on port 3000..."));
