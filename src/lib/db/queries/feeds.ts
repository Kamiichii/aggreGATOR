import { readConfig } from "src/config";
import { db } from "..";
import { feeds, users } from "../schema";
import { getUser,User } from "./users";
import { eq } from "drizzle-orm";



export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string,url: string) {
  const currentUserName = readConfig().currentUserName;
  if (!currentUserName) throw new Error("No current user. Register first.");

  const currentUser = await getUser(currentUserName);
  if (!currentUser) throw new Error(`User '${currentUserName}' not found.`);

  const [result] = await db.insert(feeds).values({ name: name , url:url,userId:currentUser.id}).returning();
  return result;
}

export async function getUserOfTheFeed(feed: Feed){
  return await db.select().from(feeds).innerJoin(users,eq(feeds.userId,users.id)).where(eq(feeds.id,feed.id));
}

export async function getFeeds(){
  return await db.select().from(feeds);
}
export async function getFeed(url:string){
  const [result] = await db.select().from(feeds).where(eq(feeds.url,url));
  return result;
}
export function printFeed(feed: Feed, user: User) {
  console.log(`id: ${feed.id}`);
  console.log(`name: ${feed.name}`);
  console.log(`url: ${feed.url}`);
  console.log(`user_id: ${feed.userId} (${user.name})`);
}