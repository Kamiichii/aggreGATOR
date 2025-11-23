
import { desc, eq } from "drizzle-orm";
import { db } from "..";
import { feedFollows, posts, users } from "../schema";
import { Feed, getUserOfTheFeed } from "./feeds";
import { User } from "./users";

export async function createPost(title:string,url:string,published_at: Date,feed:Feed,description?:string){

    const [newPost] = await db.insert(posts).values({title:title,url:url,description:description,feedId:feed.id,publishedAt:published_at}).returning();

    return newPost;
}

export async function getPostsForUser(user:User,limit:number) {
   const result = await db
   .select({post: posts})
   .from(posts)
   .innerJoin(feedFollows,eq(posts.feedId,feedFollows.feedId))
   .where(eq(feedFollows.userId,user.id))
   .orderBy(desc(posts.publishedAt))
   .limit(limit);

   return result;
}
