import { symlinkSync } from "fs";
import { readConfig, setUser } from "./config";
import { createUser, getUser, getUsers, resetUsers, User } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";
import { createFeed, getFeeds, getUserOfTheFeed, handleError, printFeed, scrapeFeeds } from "./lib/db/queries/feeds";
import { createFeedFollow, deleteFeedFollow, getFeedFollowsForUser } from "./lib/db/queries/feedFollow";
import { getPostsForUser } from "./lib/db/queries/posts";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

export type CommandsRegistry =Record<string,CommandHandler>;

export async function handlerLogin(cmdName:string ,...args:string[]){
    if(args.length === 0){
        throw new Error("You need to provide a username");
    }

    const userName = args[0];
     
    if(await getUser(userName) === undefined){
        throw new Error("This user doesn't exist");
    }
    
    setUser(userName);
    console.log(`${userName} has been set as the current user`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){
    registry[cmdName] = handler;
}

export async function handlerRegister(cmdName:string ,...args:string[]){
    if(args.length === 0){
        throw new Error("You need to provide a username");
    }

    const userName = args[0];

    if (await getUser(userName) !== undefined){
        throw new Error("The user already exists")
    }

    await createUser(userName);
    setUser(userName);
    console.log(`${userName} is created`);
    console.log(await getUser(userName));

}
export async function handlerReset() {
    try{
        await resetUsers();
    }catch(err){
        throw new Error("Couldnt reset the database");
    }
}
export async function handlerListUsers() {
    const users = await getUsers();
    const currentUser = readConfig().currentUserName;
    for(const user of users){
        if(user.name ===currentUser){
            console.log(`${user.name} (current)`);
        }
        else{
            console.log(user.name);
        }
    }
}

export async function handlerListFeeds() {
    const feeds = await getFeeds();
    for(const feed of feeds){
        const userName = await getUserOfTheFeed(feed);
        console.log(feed.name);
        console.log(feed.url);
        console.log(userName);
    }
}

export async function handlerAggregate(cmdName:string,time_between_reqs:string){

    const durationInterval = parseDuration(time_between_reqs);
    console.log(`Collecting feeds every ${time_between_reqs}`);

    scrapeFeeds().catch(handleError);
    
    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, durationInterval)

    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
        });
}

export async function handlerBrowse(cmdName:string,user:User,rawLimit?:string){
    const limit = rawLimit ? Number(rawLimit) : 2
    const posts = await getPostsForUser(user,limit);
    for (const post of posts){
        console.log();
        console.log(`Title: ${post.post.title}`);
        console.log(`Description: ${post.post.description}`);
        console.log(`Publish Date: ${post.post.publishedAt}`);
        console.log(`URL: ${post.post.url}`);
       
    }
}

export async function handlerAddFeed(cmdName:string,user:User,name:string,url:string) {
  const feed = await createFeed(name, url)
  await createFeedFollow(url,user);
  printFeed(feed,user);

}

export async function handlerFollowFeed(cmdName:string,user:User,url:string){
    const feedFollow = await createFeedFollow(url,user);
    console.log(`user: ${feedFollow.userName}`);
    console.log(`feed: ${feedFollow.feedName}`);

}

export async function handlerUnfollowFeed(cmdName:string,user:User,url:string){
    await deleteFeedFollow(user,url);
}

export async function handlerFollowing(cmdName:string,user:User) {
    const feedFollows = await getFeedFollowsForUser(user.name);
    for(const feed of feedFollows){
        console.log(feed.feeds.name);
    }
}

export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){
  const handler = registry[cmdName];
  if (!handler) throw new Error(`unknown command: ${cmdName}`);
  await handler(cmdName, ...args);
}

function parseDuration(durationStr: string):number {
    const regex = /^(\d+)(ms|s|m|h)$/;

    const match = durationStr.match(regex);
    if(!match) throw new Error("Invalid duration");

    const value = Number(match[1]);
    const unit = match[2];

    if (unit === "ms") return value;
    if (unit === "s") return value * 1000;
    if (unit === "m") return value * 60 * 1000;
    if (unit === "h") return value * 60 * 60 * 1000;

    throw new Error("invalid unit");
}
