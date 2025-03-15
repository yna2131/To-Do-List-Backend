import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

console.log(process.env.DB_FILE_NAME);
export const db = drizzle(process.env.DB_FILE_NAME!);
