import { feedFollows, feeds, users } from "../schema";
import { db } from "..";
import { readConfig } from "src/config";
import { getUser } from "./users";
import { eq } from "drizzle-orm";
import { getFeed } from "./feeds";
export async function createFeedFollow(feedURL) {
    const currentUserName = readConfig().currentUserName;
    if (!currentUserName)
        throw new Error("No current user. Register first.");
    const currentUser = await getUser(currentUserName);
    if (!currentUser)
        throw new Error(`User '${currentUserName}' not found.`);
    const requestedFeed = await getFeed(feedURL);
    if (!requestedFeed)
        throw new Error(`Feed not found for URL: ${feedURL}`);
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: currentUser.id, feedId: requestedFeed.id }).returning();
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
