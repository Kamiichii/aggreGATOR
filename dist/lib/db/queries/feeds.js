import { readConfig } from "src/config";
import { db } from "..";
import { feeds } from "../schema";
import { getUser } from "./users";
export async function createFeed(name, url) {
    const currentUserName = readConfig().currentUserName;
    if (!currentUserName)
        throw new Error("No current user. Register first.");
    const currentUser = await getUser(currentUserName);
    if (!currentUser)
        throw new Error(`User '${currentUserName}' not found.`);
    const [result] = await db.insert(feeds).values({ name: name, url: url, userId: currentUser.id }).returning();
    return result;
}
