import { db } from "./db";
import { todosTable, usersTable } from "./schema";
import bcrypt from "bcrypt";

async function seed() {
  await db
    .insert(usersTable)
    .values({email: "iloveu@gmail.com", name: "Yuna", password: bcrypt.hashSync("password", 10)})
}

seed();
