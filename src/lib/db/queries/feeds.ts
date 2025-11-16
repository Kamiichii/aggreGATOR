import { readConfig } from "src/config";
import { db } from "..";
import { feeds, users } from "../schema";
import { eq } from "drizzle-orm";
import { getUser } from "./users";


export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string,url: string) {
  const currentUserName = readConfig().currentUserName;
  if (!currentUserName) throw new Error("No current user. Register first.");

  const currentUser = await getUser(currentUserName);
  if (!currentUser) throw new Error(`User '${currentUserName}' not found.`);

  const [result] = await db.insert(feeds).values({ name: name , url:url,userId:currentUser.id}).returning();
  return result;
}

