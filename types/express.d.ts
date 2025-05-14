import { usersTable } from "../src/db/schema";

declare global {
    namespace Express {
        interface Request {
            user: typeof usersTable.$inferSelect
        }
    }
}