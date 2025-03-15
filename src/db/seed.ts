import { db } from "./db";
import { todosTable } from "./schema";

async function seed() {
  await db
    .insert(todosTable)
    .values([{ text: "Kiss Richie" }, { text: "Marry Richie" }])
    .execute();
}

seed();
