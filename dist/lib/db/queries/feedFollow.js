import { feedFollows, feeds, users } from "../schema";
import { db } from "..";
import { getUser } from "./users";
import { eq } from "drizzle-orm";
import { getFeed } from "./feeds";
export async function createFeedFollow(feedURL, user) {
    const requestedFeed = await getFeed(feedURL);
    if (!requestedFeed)
        throw new Error(`Feed not found for URL: ${feedURL}`);
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: user.id, feedId: requestedFeed.id }).returning();
    const [result] = await db
        .select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name,
    })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFeedFollow.id));
    return result;
}
export async function getFeedFollowsForUser(userName) {
    const currentUser = await getUser(userName);
    if (!currentUser)
        throw new Error(`User '${userName}' not found.`);
    const result = await db
        .select()
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, currentUser.id));
    return result;
}
