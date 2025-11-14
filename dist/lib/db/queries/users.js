import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
export async function createUser(name) {
    const [result] = await db.insert(users).values({ name: name }).returning();
    return result;
}
export async function getUser(name) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}
