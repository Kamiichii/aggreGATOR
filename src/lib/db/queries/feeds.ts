import { readConfig } from "src/config";
import { db } from "..";
import { feeds, users } from "../schema";
import { getUser,User } from "./users";
import { eq, sql } from "drizzle-orm";
import { fetchFeed } from "src/rss";
import { createPost } from "./posts";



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

export async function markFeedFetched(feed:Feed){
  await db
  .update(feeds)
  .set({updatedAt:sql`NOW()`,lastFetchedAt:sql`NOW()`})
  .where(eq(feeds.id,feed.id));
}

export async function getNextFeedToFetch():Promise<Feed>{
  const [result] = await db
    .select()
    .from(feeds)
    .orderBy(sql`${feeds.lastFetchedAt} nulls first`)
    .limit(1);
  return result;
 }

 export async function scrapeFeeds(){
     const nextFeed = await getNextFeedToFetch();
     await markFeedFetched(nextFeed);
     const fetchedFeed = await fetchFeed(nextFeed.url);
     for(const item of fetchedFeed.channel.items){
        const publishedAt = parsePublishedAt(item.pubDate);
        await createPost(item.title,item.link,publishedAt,nextFeed,item.description);
     }

 }

 export function handleError(err: unknown) {
  console.error("Error while scraping feeds:", err);
}

function parsePublishedAt(raw: string | undefined): Date {
  if (!raw) {
    return new Date(); 
  }

  const date = new Date(raw);

  if (isNaN(date.getTime())) {
    console.warn("Could not parse pubDate:", raw)
    return new Date();
  }

  return date;
}